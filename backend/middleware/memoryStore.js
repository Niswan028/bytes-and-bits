// Shared in-memory vector & knowledge graph cache for high availability and offline execution
const inMemoryChunks = [];
const inMemoryDocuments = [];
const inMemoryEntities = [];
const inMemoryRelationships = [];

function registerInMemoryChunk(chunk) {
  inMemoryChunks.push({
    ...chunk,
    _id: chunk._id || 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
  });
}

function clearInMemoryStore() {
  inMemoryChunks.length = 0;
  inMemoryDocuments.length = 0;
  inMemoryEntities.length = 0;
  inMemoryRelationships.length = 0;
}

function getInMemoryChunks() {
  return inMemoryChunks;
}

function registerInMemoryDocument(doc) {
  // Replace if existing document with same ID or originalName
  const idx = inMemoryDocuments.findIndex(d => d._id === doc._id || d.originalName === doc.originalName);
  if (idx >= 0) {
    inMemoryDocuments[idx] = { ...inMemoryDocuments[idx], ...doc };
  } else {
    inMemoryDocuments.push(doc);
  }
}

function getInMemoryDocuments() {
  return inMemoryDocuments;
}

function removeInMemoryChunksForDocument(documentId) {
  for (let i = inMemoryChunks.length - 1; i >= 0; i--) {
    if (inMemoryChunks[i].documentId === documentId) {
      inMemoryChunks.splice(i, 1);
    }
  }
}

function registerInMemoryEntity(entity) {
  if (!entity || !entity.name) return null;
  const normName = entity.name.trim().toLowerCase();
  const existing = inMemoryEntities.find(e => e.name && e.name.trim().toLowerCase() === normName);

  if (existing) {
    existing.occurrences = (existing.occurrences || 1) + 1;
    if (entity.properties) {
      existing.properties = { ...(existing.properties || {}), ...entity.properties };
    }
    if (entity.description && (!existing.description || existing.description.length < entity.description.length)) {
      existing.description = entity.description;
    }
    if (entity.type && !existing.type) {
      existing.type = entity.type;
    }
    if (entity.documentId && (!existing.connectedDocuments || !existing.connectedDocuments.includes(entity.documentId))) {
      existing.connectedDocuments = existing.connectedDocuments || [];
      existing.connectedDocuments.push(entity.documentId);
    }
    return existing;
  } else {
    const newEnt = {
      _id: entity._id || 'ent_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      name: entity.name.trim(),
      type: entity.type || 'Mining Asset',
      description: entity.description || `${entity.name} identified in document records.`,
      properties: entity.properties || { status: 'Verified [✔]', riskLevel: 'Low Risk' },
      documentId: entity.documentId,
      sourceDocumentName: entity.sourceDocumentName || '',
      connectedDocuments: entity.documentId ? [entity.documentId] : [],
      occurrences: 1,
      createdAt: new Date()
    };
    inMemoryEntities.push(newEnt);
    return newEnt;
  }
}

function getInMemoryEntities() {
  return inMemoryEntities;
}

function registerInMemoryRelationship(rel) {
  if (!rel || !rel.fromEntity || !rel.toEntity) return null;
  const fromId = typeof rel.fromEntity === 'object' ? (rel.fromEntity._id || rel.fromEntity.name) : rel.fromEntity;
  const toId = typeof rel.toEntity === 'object' ? (rel.toEntity._id || rel.toEntity.name) : rel.toEntity;

  const existing = inMemoryRelationships.find(r => {
    const rFrom = typeof r.fromEntity === 'object' ? (r.fromEntity._id || r.fromEntity.name) : r.fromEntity;
    const rTo = typeof r.toEntity === 'object' ? (r.toEntity._id || r.toEntity.name) : r.toEntity;
    return rFrom === fromId && rTo === toId && r.relationshipType === rel.relationshipType;
  });

  if (existing) {
    return existing;
  }

  const newRel = {
    _id: rel._id || 'rel_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    fromEntity: rel.fromEntity,
    toEntity: rel.toEntity,
    relationshipType: rel.relationshipType || 'RELATED_TO',
    description: rel.description || `${fromId} ${rel.relationshipType || 'related to'} ${toId}`,
    documentId: rel.documentId,
    createdAt: new Date()
  };
  inMemoryRelationships.push(newRel);
  return newRel;
}

function getInMemoryRelationships() {
  return inMemoryRelationships;
}

function removeInMemoryEntitiesForDocument(documentId) {
  for (let i = inMemoryEntities.length - 1; i >= 0; i--) {
    if (inMemoryEntities[i].documentId === documentId) {
      inMemoryEntities.splice(i, 1);
    }
  }
}

function removeInMemoryRelationshipsForDocument(documentId) {
  for (let i = inMemoryRelationships.length - 1; i >= 0; i--) {
    if (inMemoryRelationships[i].documentId === documentId) {
      inMemoryRelationships.splice(i, 1);
    }
  }
}

module.exports = {
  registerInMemoryChunk,
  removeInMemoryChunksForDocument,
  clearInMemoryStore,
  getInMemoryChunks,
  registerInMemoryDocument,
  getInMemoryDocuments,
  registerInMemoryEntity,
  getInMemoryEntities,
  registerInMemoryRelationship,
  getInMemoryRelationships,
  removeInMemoryEntitiesForDocument,
  removeInMemoryRelationshipsForDocument
};
