import React, { useState } from 'react';
import LongitudinalHealthTimeline from '../components/LongitudinalHealthTimeline';

export default function TimelinePage() {
  const [patientId, setPatientId] = useState('P1001');

  return (
    <div className="space-y-6">
      <LongitudinalHealthTimeline
        selectedPatientId={patientId}
        onSelectPatient={id => setPatientId(id)}
      />
    </div>
  );
}
