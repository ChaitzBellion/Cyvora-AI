import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  UserProfile, 
  UserSettings, 
  Conversation, 
  ChatMessage, 
  SavedKnowledgeItem, 
  Workflow 
} from '../types';

/**
 * ============================================================================
 * 1. USER PROFILE & IDENTITY SERVICE
 * Path: users/{uid}
 * ============================================================================
 */
export async function syncUserProfile(user: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}): Promise<void> {
  if (!db || !isFirebaseConfigured || !user.uid) return;

  const userDocRef = doc(db, 'users', user.uid);
  const nowIso = new Date().toISOString();

  try {
    // Attempt merge write directly so Firestore queues and syncs idempotently
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Developer'),
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'Full-Stack & Cloud Systems Engineer',
      organization: 'Engineering Team',
      tier: 'Developer Pro',
      updatedAt: nowIso,
      lastLoginAt: nowIso,
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore user profile sync queued (offline/connecting):', error);
  }
}

/**
 * ============================================================================
 * 2. USER SETTINGS & PREFERENCES SERVICE
 * Path: users/{uid}/settings/preferences
 * ============================================================================
 */
export async function fetchUserSettings(uid: string, defaultSettings: UserSettings): Promise<UserSettings> {
  if (!db || !isFirebaseConfigured || !uid) return defaultSettings;

  try {
    const settingsDocRef = doc(db, 'users', uid, 'settings', 'preferences');
    const snap = await getDoc(settingsDocRef);
    if (snap.exists()) {
      return snap.data() as UserSettings;
    }
  } catch (error: any) {
    // When connecting or offline, silently use fallback settings
    console.warn('Using local default user settings (Firestore connecting):', error?.message || error);
  }
  return defaultSettings;
}

export async function saveUserSettings(uid: string, settings: UserSettings): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  try {
    const settingsDocRef = doc(db, 'users', uid, 'settings', 'preferences');
    await setDoc(settingsDocRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user settings to Firestore:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * 3. CONVERSATIONS & MESSAGES SERVICE
 * Path: users/{uid}/conversations/{conversationId}
 * Subcollection: users/{uid}/conversations/{conversationId}/messages/{messageId}
 * ============================================================================
 */

/**
 * Subscribe to real-time conversation list changes for the user.
 */
export function subscribeToConversations(
  uid: string,
  onUpdate: (conversations: Conversation[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !uid) {
    console.warn('[Cyvora Firestore] Cannot subscribe to conversations: missing db, config, or UID');
    onUpdate([]);
    return () => {};
  }

  const collectionPath = `users/${uid}/conversations`;
  console.log(`[Cyvora Conversation Listener] Subscribing to conversation collection at: ${collectionPath}`);
  
  const convsCollection = collection(db, 'users', uid, 'conversations');
  const convsQuery = query(convsCollection, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    convsQuery,
    (snapshot) => {
      console.log(`[Cyvora Conversation Read] onSnapshot fired for ${collectionPath}. Total docs: ${snapshot.docs.length}. From cache: ${snapshot.metadata.fromCache}. Has pending writes: ${snapshot.metadata.hasPendingWrites}`);
      
      const convList: Conversation[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Untitled Session',
          date: data.date || new Date().toISOString().split('T')[0],
          updatedAt: data.updatedAt || new Date().toISOString(),
          messageCount: typeof data.messageCount === 'number' ? data.messageCount : 0,
          category: data.category || 'cloud',
          snippet: data.snippet || '',
          messages: [], // Populated on active conversation select or listener
          isPinned: Boolean(data.isPinned),
          isArchived: Boolean(data.isArchived),
          createdAt: data.createdAt || data.updatedAt,
        };
      });

      // Defensive sort by updatedAt descending
      convList.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

      console.log(`[Cyvora Conversation Read] Delivering ${convList.length} parsed conversations to state:`, convList.map(c => ({ id: c.id, title: c.title, count: c.messageCount })));
      onUpdate(convList);
    },
    (error) => {
      console.error(`[Cyvora Conversation Listener] Error onSnapshot (${collectionPath}):`, error.code, error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to messages in a specific conversation.
 */
export function subscribeToConversationMessages(
  uid: string,
  conversationId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !uid || !conversationId) {
    onUpdate([]);
    return () => {};
  }

  const subcollectionPath = `users/${uid}/conversations/${conversationId}/messages`;
  console.log(`[Cyvora Conversation Listener] Subscribing to messages subcollection at: ${subcollectionPath}`);

  const messagesCol = collection(db, 'users', uid, 'conversations', conversationId, 'messages');
  const messagesQuery = query(messagesCol, orderBy('createdAt', 'asc'));

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      console.log(`[Cyvora Conversation Read] onSnapshot messages for ${subcollectionPath}. Count: ${snapshot.docs.length}. From cache: ${snapshot.metadata.fromCache}`);
      const messages: ChatMessage[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          role: data.role || 'user',
          content: data.content || '',
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: data.createdAt,
          codeBlocks: data.codeBlocks || [],
          metadata: data.metadata || {},
          isSaved: data.isSaved,
        };
      });
      onUpdate(messages);
    },
    (error) => {
      console.error(`[Cyvora Conversation Listener] Error in messages listener (${subcollectionPath}):`, error.code, error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Create or initialize a conversation document.
 */
export async function createConversationDoc(
  uid: string,
  conversation: Omit<Conversation, 'messages'>
): Promise<string> {
  if (!db || !isFirebaseConfigured || !uid) throw new Error('Firestore not initialized');

  const docPath = `users/${uid}/conversations/${conversation.id}`;
  const convDocRef = doc(db, 'users', uid, 'conversations', conversation.id);
  const nowIso = new Date().toISOString();

  console.log(`[Cyvora Conversation Create] Writing conversation doc to: ${docPath}`);

  await setDoc(convDocRef, {
    id: conversation.id,
    userId: uid,
    title: conversation.title || 'New Technical Chat',
    date: conversation.date || nowIso.split('T')[0],
    updatedAt: nowIso,
    messageCount: conversation.messageCount || 0,
    category: conversation.category || 'cloud',
    snippet: conversation.snippet || '',
    isPinned: Boolean(conversation.isPinned),
    isArchived: Boolean(conversation.isArchived),
    createdAt: conversation.createdAt || nowIso,
  });

  console.log(`[Cyvora Conversation Create] Successfully persisted doc: ${docPath}`);
  return conversation.id;
}

/**
 * Update conversation metadata (e.g. title, snippet, pinned, archived).
 */
export async function updateConversationDoc(
  uid: string,
  conversationId: string,
  updates: Partial<Conversation>
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  const convDocRef = doc(db, 'users', uid, 'conversations', conversationId);
  await updateDoc(convDocRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Add a granular message to a conversation and bump conversation metadata.
 */
export async function addMessageToConversation(
  uid: string,
  conversationId: string,
  message: ChatMessage,
  newTotalCount?: number,
  updatedTitle?: string
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  const nowIso = new Date().toISOString();
  const convDocRef = doc(db, 'users', uid, 'conversations', conversationId);
  const messageDocRef = doc(db, 'users', uid, 'conversations', conversationId, 'messages', message.id);

  console.log(`[Cyvora Firestore] Adding message ${message.id} to users/${uid}/conversations/${conversationId}/messages/${message.id}`);

  const batch = writeBatch(db);

  // 1. Insert message document
  batch.set(messageDocRef, {
    id: message.id,
    conversationId,
    userId: uid,
    role: message.role,
    content: message.content,
    timestamp: message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: message.createdAt || nowIso,
    codeBlocks: message.codeBlocks || [],
    metadata: message.metadata || {},
    isSaved: Boolean(message.isSaved),
  });

  // 2. Update parent conversation metadata
  const convUpdateData: Record<string, any> = {
    updatedAt: nowIso,
    messageCount: newTotalCount !== undefined ? newTotalCount : increment(1),
    snippet: message.content.slice(0, 70),
  };

  if (updatedTitle) {
    convUpdateData.title = updatedTitle;
  }

  batch.set(convDocRef, convUpdateData, { merge: true });

  await batch.commit();
  console.log(`[Cyvora Firestore] Committed batch write for message ${message.id} and updated conversation ${conversationId}`);
}

/**
 * Delete a conversation and all its messages.
 */
export async function deleteConversationDoc(uid: string, conversationId: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  try {
    // 1. Get and delete all messages in subcollection
    const messagesCol = collection(db, 'users', uid, 'conversations', conversationId, 'messages');
    const messagesSnap = await getDocs(messagesCol);

    const batch = writeBatch(db);
    messagesSnap.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });

    // 2. Delete parent conversation document
    const convDocRef = doc(db, 'users', uid, 'conversations', conversationId);
    batch.delete(convDocRef);

    await batch.commit();
  } catch (error) {
    console.error(`Error deleting conversation ${conversationId}:`, error);
    throw error;
  }
}

/**
 * ============================================================================
 * 4. SAVED KNOWLEDGE SERVICE
 * Path: users/{uid}/knowledge/{knowledgeId}
 * ============================================================================
 */

export function subscribeToSavedKnowledge(
  uid: string,
  onUpdate: (items: SavedKnowledgeItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !uid) {
    onUpdate([]);
    return () => {};
  }

  const knowledgeCol = collection(db, 'users', uid, 'knowledge');
  const knowledgeQuery = query(knowledgeCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    knowledgeQuery,
    (snapshot) => {
      const items: SavedKnowledgeItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'code',
          categoryLabel: data.categoryLabel || 'CODE',
          tags: data.tags || [],
          dateSaved: data.dateSaved || new Date().toISOString().split('T')[0],
          description: data.description || '',
          solutionSummary: data.solutionSummary || '',
          codeSnippet: data.codeSnippet,
          keyTakeaways: data.keyTakeaways || [],
          starred: Boolean(data.starred),
          createdAt: data.createdAt,
        };
      });
      onUpdate(items);
    },
    (error) => {
      console.error('Error in saved knowledge real-time listener:', error);
      if (onError) onError(error);
    }
  );
}

export async function createKnowledgeDoc(
  uid: string,
  item: SavedKnowledgeItem
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  const nowIso = new Date().toISOString();
  const knowledgeDocRef = doc(db, 'users', uid, 'knowledge', item.id);

  await setDoc(knowledgeDocRef, {
    ...item,
    userId: uid,
    createdAt: item.createdAt || nowIso,
    updatedAt: nowIso,
  });
}

export async function updateKnowledgeDoc(
  uid: string,
  itemId: string,
  updates: Partial<SavedKnowledgeItem>
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  const knowledgeDocRef = doc(db, 'users', uid, 'knowledge', itemId);
  await updateDoc(knowledgeDocRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteKnowledgeDoc(uid: string, itemId: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid) return;

  const knowledgeDocRef = doc(db, 'users', uid, 'knowledge', itemId);
  await deleteDoc(knowledgeDocRef);
}

/**
 * ============================================================================
 * 5. USER WORKFLOWS SERVICE
 * Path: users/{uid}/workflows/{workflowId}
 * ============================================================================
 */

export function subscribeToUserWorkflows(
  uid: string,
  onUpdate: (workflows: Workflow[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !uid) {
    onUpdate([]);
    return () => {};
  }

  const workflowsCol = collection(db, 'users', uid, 'workflows');

  return onSnapshot(
    workflowsCol,
    (snapshot) => {
      const userWorkflows: Workflow[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const promptValue = data.prompt || data.promptTemplate || '';
        return {
          id: docSnap.id,
          userId: data.userId || uid,
          name: data.name || 'Untitled Workflow',
          category: data.category || 'Custom Workflows',
          iconName: data.iconName || 'Sparkles',
          description: data.description || '',
          prompt: promptValue,
          promptTemplate: data.promptTemplate || promptValue,
          systemInstruction: data.systemInstruction || '',
          model: data.model || 'Cyvora Ultra Copilot',
          temperature: typeof data.temperature === 'number' ? data.temperature : 0.2,
          maxOutputTokens: typeof data.maxOutputTokens === 'number' ? data.maxOutputTokens : 4096,
          enabled: data.enabled !== undefined ? Boolean(data.enabled) : true,
          inputPlaceholder: data.inputPlaceholder || 'Provide specific task context or leave blank to run template...',
          tags: Array.isArray(data.tags) ? data.tags : ['Custom'],
          difficulty: data.difficulty || 'Intermediate',
          estimatedTime: data.estimatedTime || '1 min',
          isCustom: true,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      });
      onUpdate(userWorkflows);
    },
    (error) => {
      console.error('[Cyvora Firestore] Error in workflows real-time listener:', error);
      if (onError) onError(error);
    }
  );
}

export async function createUserWorkflowDoc(
  uid: string,
  workflow: Omit<Workflow, 'userId'> & { userId?: string }
): Promise<string> {
  if (!db || !isFirebaseConfigured || !uid) {
    throw new Error('Firestore is not configured or user is unauthenticated.');
  }

  const nowIso = new Date().toISOString();
  const workflowId = workflow.id || `wf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const workflowDocRef = doc(db, 'users', uid, 'workflows', workflowId);

  const promptContent = workflow.prompt || workflow.promptTemplate || '';

  const payload = {
    id: workflowId,
    userId: uid,
    name: workflow.name.trim(),
    category: workflow.category || 'Custom Workflows',
    iconName: workflow.iconName || 'Sparkles',
    description: workflow.description || '',
    prompt: promptContent,
    promptTemplate: workflow.promptTemplate || promptContent,
    systemInstruction: workflow.systemInstruction || '',
    model: workflow.model || 'Cyvora Ultra Copilot',
    temperature: typeof workflow.temperature === 'number' ? workflow.temperature : 0.2,
    maxOutputTokens: typeof workflow.maxOutputTokens === 'number' ? workflow.maxOutputTokens : 4096,
    enabled: workflow.enabled !== undefined ? Boolean(workflow.enabled) : true,
    inputPlaceholder: workflow.inputPlaceholder || 'Provide specific task context...',
    tags: Array.isArray(workflow.tags) && workflow.tags.length > 0 ? workflow.tags : ['Custom'],
    difficulty: workflow.difficulty || 'Intermediate',
    estimatedTime: workflow.estimatedTime || '1 min',
    isCustom: true,
    createdAt: workflow.createdAt || nowIso,
    updatedAt: nowIso,
  };

  await setDoc(workflowDocRef, payload);
  return workflowId;
}

export async function updateUserWorkflowDoc(
  uid: string,
  workflowId: string,
  updates: Partial<Workflow>
): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid || !workflowId) {
    throw new Error('Firestore is not configured, user is unauthenticated, or workflow ID is missing.');
  }

  const workflowDocRef = doc(db, 'users', uid, 'workflows', workflowId);
  const nowIso = new Date().toISOString();

  const cleanedUpdates: Record<string, any> = {
    updatedAt: nowIso,
  };

  if (updates.name !== undefined) cleanedUpdates.name = updates.name.trim();
  if (updates.category !== undefined) cleanedUpdates.category = updates.category;
  if (updates.iconName !== undefined) cleanedUpdates.iconName = updates.iconName;
  if (updates.description !== undefined) cleanedUpdates.description = updates.description;
  if (updates.prompt !== undefined) {
    cleanedUpdates.prompt = updates.prompt;
    cleanedUpdates.promptTemplate = updates.prompt;
  }
  if (updates.promptTemplate !== undefined && updates.prompt === undefined) {
    cleanedUpdates.prompt = updates.promptTemplate;
    cleanedUpdates.promptTemplate = updates.promptTemplate;
  }
  if (updates.systemInstruction !== undefined) cleanedUpdates.systemInstruction = updates.systemInstruction;
  if (updates.model !== undefined) cleanedUpdates.model = updates.model;
  if (updates.temperature !== undefined) cleanedUpdates.temperature = Number(updates.temperature);
  if (updates.maxOutputTokens !== undefined) cleanedUpdates.maxOutputTokens = Number(updates.maxOutputTokens);
  if (updates.enabled !== undefined) cleanedUpdates.enabled = Boolean(updates.enabled);
  if (updates.tags !== undefined) cleanedUpdates.tags = updates.tags;
  if (updates.difficulty !== undefined) cleanedUpdates.difficulty = updates.difficulty;
  if (updates.estimatedTime !== undefined) cleanedUpdates.estimatedTime = updates.estimatedTime;
  if (updates.inputPlaceholder !== undefined) cleanedUpdates.inputPlaceholder = updates.inputPlaceholder;

  await updateDoc(workflowDocRef, cleanedUpdates);
}

export async function deleteUserWorkflowDoc(uid: string, workflowId: string): Promise<void> {
  if (!db || !isFirebaseConfigured || !uid || !workflowId) {
    throw new Error('Firestore is not configured, user is unauthenticated, or workflow ID is missing.');
  }

  const workflowDocRef = doc(db, 'users', uid, 'workflows', workflowId);
  await deleteDoc(workflowDocRef);
}

export async function getUserWorkflowDoc(uid: string, workflowId: string): Promise<Workflow | null> {
  if (!db || !isFirebaseConfigured || !uid || !workflowId) return null;

  const workflowDocRef = doc(db, 'users', uid, 'workflows', workflowId);
  const docSnap = await getDoc(workflowDocRef);
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  const promptValue = data.prompt || data.promptTemplate || '';
  return {
    id: docSnap.id,
    userId: data.userId || uid,
    name: data.name || 'Untitled Workflow',
    category: data.category || 'Custom Workflows',
    iconName: data.iconName || 'Sparkles',
    description: data.description || '',
    prompt: promptValue,
    promptTemplate: data.promptTemplate || promptValue,
    systemInstruction: data.systemInstruction || '',
    model: data.model || 'Cyvora Ultra Copilot',
    temperature: typeof data.temperature === 'number' ? data.temperature : 0.2,
    maxOutputTokens: typeof data.maxOutputTokens === 'number' ? data.maxOutputTokens : 4096,
    enabled: data.enabled !== undefined ? Boolean(data.enabled) : true,
    inputPlaceholder: data.inputPlaceholder || 'Provide specific task context...',
    tags: Array.isArray(data.tags) ? data.tags : ['Custom'],
    difficulty: data.difficulty || 'Intermediate',
    estimatedTime: data.estimatedTime || '1 min',
    isCustom: true,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

// Aliases for clean standard interface naming
export const subscribeToWorkflows = subscribeToUserWorkflows;
export const createWorkflow = createUserWorkflowDoc;
export const updateWorkflow = updateUserWorkflowDoc;
export const deleteWorkflow = deleteUserWorkflowDoc;
export const getWorkflow = getUserWorkflowDoc;

