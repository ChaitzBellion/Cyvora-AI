import React, { useState, useEffect, useCallback } from 'react';
import { 
  Terminal, 
  Loader2 
} from 'lucide-react';
import { 
  AppView, 
  Conversation, 
  ChatMessage, 
  Workflow, 
  SavedKnowledgeItem, 
  UserSettings,
  UserProfile
} from './types';
import { 
  INITIAL_CONVERSATIONS, 
  INITIAL_WORKFLOWS, 
  INITIAL_SAVED_KNOWLEDGE, 
  INITIAL_SUGGESTED_PROMPTS, 
  DEFAULT_USER_SETTINGS 
} from './data/mockData';
import { 
  syncUserProfile, 
  fetchUserSettings, 
  saveUserSettings, 
  subscribeToConversations, 
  subscribeToConversationMessages, 
  createConversationDoc, 
  updateConversationDoc, 
  addMessageToConversation, 
  deleteConversationDoc, 
  subscribeToSavedKnowledge, 
  createKnowledgeDoc, 
  updateKnowledgeDoc, 
  deleteKnowledgeDoc, 
  subscribeToUserWorkflows, 
  createUserWorkflowDoc, 
  updateUserWorkflowDoc,
  deleteUserWorkflowDoc 
} from './services/firestoreService';
import { 
  LandingPage 
} from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignInPage } from './pages/SignInPage';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { ToastContainer, ToastMessage } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { sendChatMessage, ChatRequestHistoryItem, WorkflowExecutionConfig } from './services/geminiService';

function CyvoraAppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('workspace');
  
  // Firestore-backed state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([]);
  const [savedKnowledge, setSavedKnowledge] = useState<SavedKnowledgeItem[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  
  // UI & auxiliary state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');
  const [activeWorkflowConfig, setActiveWorkflowConfig] = useState<WorkflowExecutionConfig | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Mobile layout state for non-landing views
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync authenticated user info into active profile
  const activeUserProfile: UserProfile = {
    ...settings.profile,
    uid: user?.uid,
    name: user?.displayName || (user?.email ? user.email.split('@')[0] : settings.profile.name),
    email: user?.email || settings.profile.email,
    avatarUrl: user?.photoURL || undefined,
  };

  // Combined workflows: Built-in system templates + user custom workflows
  const allWorkflows: Workflow[] = [...INITIAL_WORKFLOWS, ...userWorkflows];

  const showToast = useCallback((title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /**
   * ========================================================================
   * 1. USER PROFILE & SETTINGS SYNC (ON AUTHENTICATION)
   * ========================================================================
   */
  useEffect(() => {
    if (!user?.uid) {
      setConversations([]);
      setActiveConversationId(null);
      setActiveMessages([]);
      setSavedKnowledge([]);
      setUserWorkflows([]);
      setIsDataLoaded(false);
      return;
    }

    let isMounted = true;

    async function initializeUserData(uid: string) {
      try {
        // Sync root user document
        await syncUserProfile({
          uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });

        // Load custom settings
        const loadedSettings = await fetchUserSettings(uid, DEFAULT_USER_SETTINGS);
        if (isMounted) {
          setSettings(loadedSettings);
        }
      } catch (err) {
        console.error('Failed to sync user profile or settings:', err);
      }
    }

    initializeUserData(user.uid);

    return () => {
      isMounted = false;
    };
  }, [user]);

  /**
   * ========================================================================
   * 2. REAL-TIME CONVERSATIONS LISTENER
   * ========================================================================
   */
  useEffect(() => {
    if (!user?.uid) return;

    console.log(`[Cyvora Conversation Listener] Setting up conversation listener for UID: ${user.uid}`);

    const unsubscribe = subscribeToConversations(
      user.uid,
      (convList) => {
        console.log(`[Cyvora Conversation State] Setting conversations state (${convList.length} items) for UID: ${user.uid}`);
        setConversations(convList);
        setIsDataLoaded(true);

        // Retain currentActive if valid or if a pending new conversation is active;
        // only fallback to convList[0] if activeConversationId is null.
        setActiveConversationId((currentActive) => {
          if (currentActive && convList.some((c) => c.id === currentActive)) {
            return currentActive;
          }
          const selected = convList.length > 0 ? convList[0].id : null;
          console.log(`[Cyvora Conversation State] Selected active conversation: ${selected}`);
          return selected;
        });
      },
      (error) => {
        console.error('[Cyvora Conversation Listener] Error received in App component:', error);
        showToast('Database Sync Error', 'Could not stream conversation updates.', 'error');
      }
    );

    return () => {
      console.log(`[Cyvora Conversation Listener] Cleaning up conversation listener for UID: ${user.uid}`);
      unsubscribe();
    };
  }, [user?.uid, showToast]);

  /**
   * ========================================================================
   * 3. REAL-TIME ACTIVE CONVERSATION MESSAGES LISTENER
   * ========================================================================
   */
  useEffect(() => {
    if (!user?.uid || !activeConversationId) {
      setActiveMessages([]);
      return;
    }

    const unsubscribe = subscribeToConversationMessages(
      user.uid,
      activeConversationId,
      (messages) => {
        setActiveMessages(messages);
      },
      (error) => {
        console.error('Error fetching conversation messages:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, activeConversationId]);

  /**
   * ========================================================================
   * 4. REAL-TIME SAVED KNOWLEDGE LISTENER
   * ========================================================================
   */
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToSavedKnowledge(
      user.uid,
      (items) => {
        setSavedKnowledge(items);
      },
      (error) => {
        showToast('Knowledge Sync Error', 'Could not load knowledge snippets.', 'error');
      }
    );

    return () => unsubscribe();
  }, [user?.uid, showToast]);

  /**
   * ========================================================================
   * 5. REAL-TIME USER WORKFLOWS LISTENER
   * ========================================================================
   */
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserWorkflows(
      user.uid,
      (workflows) => {
        setUserWorkflows(workflows);
      },
      (error) => {
        showToast('Workflows Sync Error', 'Could not load user workflows.', 'error');
      }
    );

    return () => unsubscribe();
  }, [user?.uid, showToast]);

  /**
   * ========================================================================
   * 6. CONVERSATION ACTIONS (CRUD)
   * ========================================================================
   */
  const handleNewChat = async () => {
    if (!user?.uid) return;

    const newConvId = `conv-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const newConv: Omit<Conversation, 'messages'> = {
      id: newConvId,
      title: 'New Technical Chat',
      date: nowIso.split('T')[0],
      updatedAt: nowIso,
      messageCount: 0,
      category: 'cloud',
      snippet: 'Empty session ready for architecture, code, or DevOps query.',
      isPinned: false,
      isArchived: false,
      createdAt: nowIso,
    };

    try {
      console.log(`[Cyvora Conversation Create] Initiating createConversationDoc for ${newConvId}`);
      await createConversationDoc(user.uid, newConv);
      console.log(`[Cyvora Conversation Create] createConversationDoc completed successfully for ${newConvId}`);
      setActiveConversationId(newConvId);
      setPrefilledPrompt('');
      showToast('New Chat Session Created', 'Ready for your engineering query.', 'info');
    } catch (error) {
      console.error(`[Cyvora Conversation Create] Failed to create new conversation ${newConvId}:`, error);
      showToast('Action Failed', 'Could not create new chat session.', 'error');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!user?.uid) return;

    try {
      await deleteConversationDoc(user.uid, id);
      if (activeConversationId === id) {
        const remaining = conversations.filter((c) => c.id !== id);
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
      }
      showToast('Conversation Deleted', 'Session and messages removed permanently.');
    } catch (error) {
      showToast('Delete Failed', 'Could not delete conversation.', 'error');
    }
  };

  const handleTogglePin = async (id: string) => {
    if (!user?.uid) return;
    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    try {
      await updateConversationDoc(user.uid, id, { isPinned: !target.isPinned });
      showToast('Pin Updated');
    } catch (error) {
      showToast('Error', 'Could not update pin state.', 'error');
    }
  };

  const handleToggleArchive = async (id: string) => {
    if (!user?.uid) return;
    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    try {
      await updateConversationDoc(user.uid, id, { isArchived: !target.isArchived });
      showToast('Archive Updated');
    } catch (error) {
      showToast('Error', 'Could not update archive state.', 'error');
    }
  };

  /**
   * ========================================================================
   * 7. COPILOT MESSAGE DISPATCH & REAL GEMINI INTEGRATION
   * ========================================================================
   */
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user?.uid || isLoading) return;

    let targetConvId = activeConversationId;
    let isFirstMessage = false;

    // If no active conversation exists, create one immediately in Firestore
    if (!targetConvId || !conversations.some((c) => c.id === targetConvId)) {
      targetConvId = `conv-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const newConv: Omit<Conversation, 'messages'> = {
        id: targetConvId,
        title: content.slice(0, 36) + (content.length > 36 ? '...' : ''),
        date: nowIso.split('T')[0],
        updatedAt: nowIso,
        messageCount: 0,
        category: 'code',
        snippet: content.slice(0, 60) + '...',
        isPinned: false,
        isArchived: false,
        createdAt: nowIso,
      };

      try {
        await createConversationDoc(user.uid, newConv);
        setActiveConversationId(targetConvId);
        isFirstMessage = true;
      } catch (error) {
        showToast('Error', 'Could not initialize chat session in database.', 'error');
        return;
      }
    } else {
      const currentConv = conversations.find((c) => c.id === targetConvId);
      isFirstMessage = !currentConv || currentConv.messageCount === 0;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
    };

    // Capture current conversation history before adding the new message
    const historyContext: ChatRequestHistoryItem[] = activeMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      // 1. Persist user message to Firestore
      await addMessageToConversation(
        user.uid,
        targetConvId,
        userMessage,
        undefined,
        isFirstMessage ? content.slice(0, 36) + (content.length > 36 ? '...' : '') : undefined
      );

      // 2. Set generating/loading state
      setIsLoading(true);

      // 3. Dispatch to secure server-side Gemini endpoint with optional workflow configuration
      const geminiResult = await sendChatMessage(
        content,
        targetConvId,
        historyContext,
        activeWorkflowConfig || undefined
      );

      // 4. Construct assistant message from real Gemini model response
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: geminiResult.reply,
        metadata: {
          model: geminiResult.model || (activeWorkflowConfig?.modelPreference ? activeWorkflowConfig.modelPreference : 'Cyvora Ultra'),
          latencyMs: geminiResult.latencyMs || 250,
          completedAt: geminiResult.completedAt || new Date().toISOString(),
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
      };

      // 5. Persist assistant response to Firestore
      await addMessageToConversation(
        user.uid,
        targetConvId,
        assistantMessage
      );
    } catch (error: any) {
      console.error('[Cyvora AI] Error during message execution:', error);
      const userFacingError = error?.message || 'Cyvora AI is temporarily unavailable. Please try again.';
      showToast('AI Request Error', userFacingError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ========================================================================
   * 8. WORKFLOW DISPATCH & CRUD HANDLERS
   * ========================================================================
   */
  const handleStartWorkflow = (workflow: Workflow, customInput?: string) => {
    handleNewChat();
    const basePrompt = workflow.prompt || workflow.promptTemplate || '';
    const fullPrompt = customInput && customInput.trim()
      ? `${basePrompt}\n\n[Provided Context / Input Snippet]:\n${customInput.trim()}`
      : basePrompt;

    setPrefilledPrompt(fullPrompt);
    setActiveWorkflowConfig({
      systemInstruction: workflow.systemInstruction,
      temperature: workflow.temperature,
      maxOutputTokens: workflow.maxOutputTokens,
      modelPreference: workflow.model,
      workflowId: workflow.id,
      workflowName: workflow.name,
    });
    setCurrentView('workspace');
    showToast(`Workflow Configured: ${workflow.name}`, 'Blueprint instructions and inference settings ready in workspace.');
  };

  const handleCreateWorkflow = async (workflowData: Omit<Workflow, 'id' | 'userId'>) => {
    if (!user?.uid) return;
    await createUserWorkflowDoc(user.uid, workflowData as any);
  };

  const handleUpdateWorkflow = async (workflowId: string, updates: Partial<Workflow>) => {
    if (!user?.uid) return;
    await updateUserWorkflowDoc(user.uid, workflowId, updates);
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!user?.uid) return;
    await deleteUserWorkflowDoc(user.uid, workflowId);
  };

  const handleToggleWorkflowEnabled = async (workflowId: string, currentEnabled: boolean) => {
    if (!user?.uid) return;
    await updateUserWorkflowDoc(user.uid, workflowId, { enabled: !currentEnabled });
    showToast('Workflow Updated', `Workflow is now ${!currentEnabled ? 'active' : 'disabled'}.`);
  };

  /**
   * ========================================================================
   * 9. SAVED KNOWLEDGE CRUD
   * ========================================================================
   */
  const handleSaveToKnowledge = async (msg: ChatMessage) => {
    if (!user?.uid) return;

    const newItem: SavedKnowledgeItem = {
      id: `knowledge-${Date.now()}`,
      title: msg.content.slice(0, 48).replace(/^[#\s*]+/, '') || 'Technical Architecture Note',
      category: (msg.metadata?.category as any) || 'code',
      categoryLabel: (msg.metadata?.category?.toUpperCase() as any) || 'CODE',
      tags: ['Copilot Output', msg.metadata?.model || 'Cyvora Ultra', 'Architecture'],
      dateSaved: new Date().toISOString().split('T')[0],
      description: msg.content.slice(0, 140) + '...',
      solutionSummary: msg.content.slice(0, 200) + '...',
      codeSnippet: msg.codeBlocks && msg.codeBlocks.length > 0 ? msg.codeBlocks[0] : undefined,
      keyTakeaways: [
        'Extracted directly from interactive Cyvora Copilot session',
        `Generated via ${msg.metadata?.model || 'Cyvora Ultra Engine'}`,
        'Ready for engineering team review and reference'
      ],
      starred: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await createKnowledgeDoc(user.uid, newItem);
      showToast('Saved to Knowledge Base', 'Snippet is now stored securely in Firestore.');
    } catch (error) {
      showToast('Save Failed', 'Could not save knowledge snippet to Firestore.', 'error');
    }
  };

  const handleDeleteKnowledgeItem = async (id: string) => {
    if (!user?.uid) return;

    try {
      await deleteKnowledgeDoc(user.uid, id);
      showToast('Item Removed', 'Knowledge snippet deleted permanently.');
    } catch (error) {
      showToast('Delete Failed', 'Could not delete knowledge snippet.', 'error');
    }
  };

  const handleToggleKnowledgeStar = async (id: string) => {
    if (!user?.uid) return;
    const target = savedKnowledge.find((k) => k.id === id);
    if (!target) return;

    try {
      await updateKnowledgeDoc(user.uid, id, { starred: !target.starred });
    } catch (error) {
      showToast('Error', 'Could not update star status.', 'error');
    }
  };

  const handleAddKnowledgeItem = async (itemData: Omit<SavedKnowledgeItem, 'id' | 'dateSaved'>) => {
    if (!user?.uid) return;

    const newItem: SavedKnowledgeItem = {
      ...itemData,
      id: `knowledge-${Date.now()}`,
      dateSaved: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    try {
      await createKnowledgeDoc(user.uid, newItem);
      showToast('Knowledge Saved', 'Blueprint added to Firestore repository.');
    } catch (error) {
      showToast('Save Failed', 'Could not save custom knowledge item.', 'error');
    }
  };

  /**
   * ========================================================================
   * 10. SETTINGS UPDATE
   * ========================================================================
   */
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    if (user?.uid) {
      try {
        await saveUserSettings(user.uid, newSettings);
        showToast('Settings Saved', 'Your preferences have been persisted to Firestore.');
      } catch (error) {
        showToast('Sync Warning', 'Updated locally, but failed to sync to cloud.', 'error');
      }
    }
  };

  /**
   * Active conversation object with merged active messages for UI compatibility
   */
  const activeConversationForWorkspace: Conversation[] = conversations.map((conv) => {
    if (conv.id === activeConversationId) {
      return {
        ...conv,
        messages: activeMessages,
      };
    }
    return conv;
  });

  // Render non-workspace views with sidebar layout when requested
  const renderSidebarLayout = (content: React.ReactNode) => {
    return (
      <div className="flex h-screen w-full bg-[#0A0A0B] text-slate-100 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          userProfile={activeUserProfile}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <MobileHeader
            title={
              currentView === 'workflows' ? 'AI Workflows' :
              currentView === 'knowledge' ? 'Saved Knowledge' :
              currentView === 'history' ? 'History' :
              currentView === 'settings' ? 'Settings' : 'Cyvora AI'
            }
            onOpenSidebar={() => setIsOpenMobile(true)}
            onNewChat={handleNewChat}
          />
          {content}
        </div>
      </div>
    );
  };

  // Authentication Loading State (Initial Boot Only)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/10">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Verifying Cyvora authentication session...</span>
          </div>
        </div>
      </div>
    );
  }

  // Protected Views List
  const protectedViews: AppView[] = ['workspace', 'workflows', 'knowledge', 'history', 'settings'];

  // Route Guard: If user is not authenticated and attempts to view protected pages, show SignInPage
  const isProtectedView = protectedViews.includes(currentView);
  if (!isAuthenticated && isProtectedView) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-slate-100 font-sans antialiased">
        <SignInPage
          onNavigate={setCurrentView}
          onShowToast={showToast}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 font-sans antialiased">
      {/* View Routing */}
      {currentView === 'landing' && (
        <LandingPage
          onNavigate={setCurrentView}
          onLaunchPrompt={(prompt) => {
            setPrefilledPrompt(prompt);
            setCurrentView(isAuthenticated ? 'workspace' : 'signin');
            if (isAuthenticated) {
              handleNewChat();
            }
          }}
        />
      )}

      {currentView === 'signin' && (
        <SignInPage
          onNavigate={setCurrentView}
          onShowToast={showToast}
        />
      )}

      {currentView === 'workspace' && (
        <WorkspacePage
          conversations={activeConversationForWorkspace}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onSendMessage={handleSendMessage}
          onSaveToKnowledge={handleSaveToKnowledge}
          userProfile={activeUserProfile}
          suggestedPrompts={INITIAL_SUGGESTED_PROMPTS}
          currentView={currentView}
          onNavigate={setCurrentView}
          isLoading={isLoading}
          prefilledPrompt={prefilledPrompt}
          onClearPrefilledPrompt={() => setPrefilledPrompt('')}
        />
      )}

      {currentView === 'workflows' && renderSidebarLayout(
        <WorkflowsPage
          workflows={allWorkflows}
          onStartWorkflow={handleStartWorkflow}
          onCreateWorkflow={handleCreateWorkflow}
          onUpdateWorkflow={handleUpdateWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          onToggleEnabled={handleToggleWorkflowEnabled}
          onNavigate={setCurrentView}
          onShowToast={showToast}
        />
      )}

      {currentView === 'knowledge' && renderSidebarLayout(
        <KnowledgePage
          items={savedKnowledge}
          onDeleteItem={handleDeleteKnowledgeItem}
          onToggleStar={handleToggleKnowledgeStar}
          onAddItem={handleAddKnowledgeItem}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'history' && renderSidebarLayout(
        <HistoryPage
          conversations={conversations}
          onSelectConversation={setActiveConversationId}
          onDeleteConversation={handleDeleteConversation}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
          onNavigate={setCurrentView}
          onNewChat={handleNewChat}
        />
      )}

      {currentView === 'settings' && renderSidebarLayout(
        <SettingsPage
          settings={{ ...settings, profile: activeUserProfile }}
          onUpdateSettings={handleUpdateSettings}
          onNavigate={setCurrentView}
          onShowToast={showToast}
        />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CyvoraAppContent />
    </AuthProvider>
  );
}
