import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  HiOutlineMicrophone,
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineStop,
  HiOutlineSpeakerWave,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineDocumentText
} from 'react-icons/hi2';
import api from '../api/client';
import AIResponseCard from '../components/AIResponseCard';
import SuggestedQuestions from '../components/SuggestedQuestions';
import { executeOfflineRagQuery } from '../utils/offlineRag';

const CLINICAL_VOICE_PRESETS = [
  {
    label: '🎙️ Rajesh HbA1c & Metformin (EN)',
    lang: 'en',
    text: "What is Rajesh Sharma's latest HbA1c history and verified metformin dose?"
  },
  {
    label: '🎙️ राजेश मेटफॉर्मिन खुराक (हिंदी)',
    lang: 'hi',
    text: 'मरीज राजेश शर्मा का हालिया HbA1c स्तर और सत्यापित मेटफॉर्मिन खुराक क्या है?'
  },
  {
    label: '🎙️ பிரியா ஒவ்வாமை விவரம் (தமிழ்)',
    lang: 'ta',
    text: 'நோயாளி பிரியா வெங்கட்டிற்கு ஏதேனும் மருந்து ஒவ்வாமை உள்ளதா?'
  },
  {
    label: '🎙️ రాజేష్ షుగర్ రిపోర్ట్ (తెలుగు)',
    lang: 'te',
    text: 'రాజేష్ శర్మ తాజా HbA1c మరియు షుగర్ స్థాయిలు ఏమిటి?'
  },
  {
    label: '🎙️ Unverified Query Test (Brain MRI)',
    lang: 'en',
    text: 'Does Rajesh Sharma have a Brain MRI scan or neurological consult on file?'
  }
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिंदी)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'te', label: 'Telugu (తెలుగు)' }
];

const TypingDots = React.memo(function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 p-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
      <span className="ml-2 text-xs text-slate-500 font-medium">Grounding response against patient records & clinical sources...</span>
    </div>
  );
});

const UserMessageItem = React.memo(function UserMessageItem({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] rounded-2xl border border-emerald-300 bg-emerald-100 px-5 py-3 text-sm text-emerald-950 shadow-2xs font-medium">
        {content}
      </div>
    </div>
  );
});

const AIMessageItem = React.memo(function AIMessageItem({ msg }) {
  return (
    <div className="w-full">
      <AIResponseCard
        answer={msg.content}
        sources={msg.sources}
        traceability={msg.traceability}
        extractedFacts={msg.extractedFacts}
        confidence={msg.confidence}
        grounded={msg.grounded}
        dataMode={msg.dataMode}
      />
    </div>
  );
});

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [filterPatientId, setFilterPatientId] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecordingError('Web Speech API is not natively supported in this browser. Use Voice Presets below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang =
      selectedLanguage === 'hi'
        ? 'hi-IN'
        : selectedLanguage === 'ta'
        ? 'ta-IN'
        : selectedLanguage === 'te'
        ? 'te-IN'
        : 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalChunk += event.results[i][0].transcript;
        } else {
          interimChunk += event.results[i][0].transcript;
        }
      }

      if (finalChunk) {
        setInput((prev) => (prev ? `${prev} ${finalChunk}` : finalChunk));
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimChunk);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition warning:', event.error);
      if (event.error !== 'no-speech') {
        setRecordingError(`Voice capture note: ${event.error}. You can also use one-click voice presets.`);
      }
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = useCallback(async (customText = null, customLang = null) => {
    const queryText = (customText !== null ? customText : input).trim();
    const queryLang = customLang || selectedLanguage;
    if (!queryText || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    if (customText === null) setInput('');
    setIsLoading(true);
    setRecordingError('');

    try {
      let resData = null;
      let usedOfflineEngine = false;

      // Try backend /api/chat/query or fallback
      try {
        const chatRes = await api.post(
          '/chat/query',
          {
            question: queryText,
            language: queryLang,
            filter: {
              verifiedOnly,
              patientId: filterPatientId !== 'all' ? filterPatientId : undefined
            }
          },
          { timeout: 5000 }
        );
        if (chatRes && chatRes.data) {
          resData = chatRes.data;
        }
      } catch {
        resData = null;
      }

      // If backend was unreachable, execute client-side sovereign engine
      if (!resData) {
        resData = executeOfflineRagQuery(queryText, {
          language: queryLang,
          patientId: filterPatientId !== 'all' ? filterPatientId : undefined,
          verifiedOnly
        });
        usedOfflineEngine = true;
      }

      const answerText = resData?.answer || 'No verified data found in uploaded medical records.';
      const isUnverified =
        resData?.grounded === false ||
        /no verified data found|not contain verified|unverified|out of scope|no record found/i.test(answerText);

      let conf = '96%';
      if (isUnverified) {
        conf = '0%';
      } else if (resData?.confidenceScore !== undefined && resData?.confidenceScore !== null) {
        conf = `${Math.round(resData.confidenceScore * 100)}%`;
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: answerText,
        sources: isUnverified ? [] : (Array.isArray(resData?.sources) ? resData.sources : []),
        traceability: isUnverified ? [] : (Array.isArray(resData?.traceability) ? resData.traceability : []),
        extractedFacts: isUnverified ? [] : (Array.isArray(resData?.extractedFacts) ? resData.extractedFacts : []),
        confidence: conf,
        grounded: !isUnverified,
        dataMode: resData?.dataMode || (usedOfflineEngine ? 'Sovereign Clinical Engine' : 'Grounded RAG')
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      // Local failsafe
      const fallbackRes = executeOfflineRagQuery(queryText, {
        language: queryLang
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: fallbackRes.answer,
          sources: fallbackRes.sources,
          traceability: fallbackRes.traceability,
          extractedFacts: fallbackRes.extractedFacts,
          confidence: fallbackRes.grounded ? '96%' : '0%',
          grounded: fallbackRes.grounded,
          dataMode: 'Sovereign Clinical Engine'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedLanguage, isLoading, verifiedOnly, filterPatientId]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setRecordingError('Speech recognition is not initialized.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setRecordingError('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setRecordingError('Could not start microphone: ' + err.message);
      }
    }
  };

  const handleSelectSuggested = (text) => {
    handleSend(text, selectedLanguage);
  };

  const handleVoicePresetClick = (preset) => {
    setSelectedLanguage(preset.lang);
    handleSend(preset.text, preset.lang);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-6rem)] max-w-6xl flex-col p-4 sm:p-6">
      {/* Clinical Disclaimer Banner */}
      <div className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HiOutlineShieldCheck className="text-xl text-emerald-700 shrink-0" />
          <p className="text-xs font-semibold text-slate-700">
            <span className="font-bold text-emerald-950 uppercase tracking-wide mr-1.5">Grounded Clinical Intelligence:</span>
            Every answer is cited to source documents and pages. Low-confidence queries are cleanly intercepted.
          </p>
        </div>
        <span className="hidden sm:inline-block rounded-md bg-white border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
          NOT CLINICAL ADVICE
        </span>
      </div>

      {/* Control Bar: Patient Filter & Language Select */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Patient Scope:</label>
          <select
            value={filterPatientId}
            onChange={(e) => setFilterPatientId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-emerald-500"
          >
            <option value="all">All Patients (Cross-Provider)</option>
            <option value="P1001">P1001: Rajesh Sharma (Diabetes, HTN)</option>
            <option value="P1002">P1002: Priya Venkat (Asthma, Thyroid)</option>
            <option value="P1003">P1003: Anita Desai (AFib, Warfarin)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Language:</label>
          <div className="flex items-center gap-1.5">
            {languageOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedLanguage(opt.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                  selectedLanguage === opt.value
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl">
                +
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Ask CareSyncIQ Clinical Copilot
              </h2>
              <p className="text-xs text-slate-500">
                Ask clinical history, medication dosages, drug-drug contraindications, duplicate test intervals, and lab trend queries across all patient records.
              </p>
            </div>

            <SuggestedQuestions onSelect={handleSelectSuggested} />

            {/* Voice Presets */}
            <div className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                One-Click Multilingual Voice Presets (Demo)
              </p>
              <div className="flex flex-wrap gap-2">
                {CLINICAL_VOICE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVoicePresetClick(preset)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-950 transition shadow-xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) =>
            msg.role === 'user' ? (
              <UserMessageItem key={msg.id} content={msg.content} />
            ) : (
              <AIMessageItem key={msg.id} msg={msg} />
            )
          )
        )}

        {isLoading && <TypingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-4 pt-2 border-t border-slate-200">
        {recordingError && (
          <p className="mb-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            {recordingError}
          </p>
        )}

        <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-xs focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
          <button
            onClick={toggleRecording}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title="Toggle Microphone"
          >
            {isRecording ? <HiOutlineStop className="text-xl" /> : <HiOutlineMicrophone className="text-xl" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isRecording
                ? 'Listening to clinical query...'
                : 'Ask a clinical question (e.g. "What is the latest HbA1c and metformin dose?")'
            }
            className="flex-1 bg-transparent px-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-40"
          >
            <HiOutlinePaperAirplane className="text-lg rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
