export type AppView = 
  | 'landing' 
  | 'signin' 
  | 'workspace' 
  | 'workflows' 
  | 'history' 
  | 'knowledge' 
  | 'settings';

export type TechCategory = 
  | 'all'
  | 'cloud' 
  | 'linux' 
  | 'code' 
  | 'database' 
  | 'devops' 
  | 'genai'
  | 'interview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  createdAt?: string; // ISO date string for Firestore
  codeBlocks?: {
    language: string;
    code: string;
    filename?: string;
  }[];
  metadata?: {
    model?: string;
    latencyMs?: number;
    tokens?: number;
    category?: string;
    toolCalls?: any[];
    executionStatus?: 'success' | 'failed' | 'pending';
    workflowId?: string;
    agentId?: string;
    completedAt?: string;
  };
  isSaved?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  updatedAt: string;
  messageCount: number;
  category: TechCategory;
  snippet: string;
  messages: ChatMessage[];
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
}

export interface Workflow {
  id: string;
  userId?: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  prompt: string;
  promptTemplate?: string;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  enabled: boolean;
  inputPlaceholder?: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedKnowledgeItem {
  id: string;
  title: string;
  category: 'cloud' | 'linux' | 'code' | 'database' | 'devops' | 'architecture';
  categoryLabel: string;
  tags: string[];
  dateSaved: string;
  description: string;
  solutionSummary: string;
  codeSnippet?: {
    language: string;
    code: string;
    fileName?: string;
  };
  keyTakeaways: string[];
  starred?: boolean;
  createdAt?: string;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: TechCategory;
  icon: string;
  badge?: string;
}

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  tier: 'Free Community' | 'Developer Pro' | 'Enterprise Team';
  apiKeyStatus: 'Configured' | 'Default Test Pool';
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface UserSettings {
  profile: UserProfile;
  appearance: {
    theme: 'dark-obsidian' | 'dark-slate' | 'dark-cyber';
    fontSize: 'compact' | 'normal' | 'comfortable';
    codeFontLigatures: boolean;
    showLineNumbers: boolean;
  };
  aiPreferences: {
    defaultModel: 'Cyvora Ultra Copilot' | 'Cyvora Fast Reasoning' | 'Cyvora Code Specialist';
    temperature: number;
    maxOutputTokens: number;
    systemPrompt: string;
    streamResponses: boolean;
    autoCodeExplain: boolean;
  };
  notifications: {
    workflowCompleteAlert: boolean;
    weeklyKnowledgeDigest: boolean;
    securityAdvisories: boolean;
    soundEffects: boolean;
  };
  privacy: {
    storeConversationHistory: boolean;
    telemetryOptIn: boolean;
    localCacheOnly: boolean;
    retentionDays: number;
  };
}
