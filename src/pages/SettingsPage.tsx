import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Palette, 
  Sliders, 
  Bell, 
  Shield, 
  Cpu, 
  Check, 
  Save,
  Key,
  HardDrive,
  Code
} from 'lucide-react';
import { UserSettings, AppView } from '../types';
import { Badge } from '../components/ui/Badge';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onNavigate: (view: AppView) => void;
  onShowToast: (title: string, desc?: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'ai' | 'notifications' | 'privacy'>('profile');
  const [formData, setFormData] = useState<UserSettings>(settings);

  const handleSave = () => {
    onUpdateSettings(formData);
    onShowToast('Settings Updated', 'Your technical preferences and model defaults have been saved.');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">Copilot Configuration & Settings</h1>
              <Badge variant="cyan">Cyvora AI v1.0</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage developer profile, model inference defaults, syntax preferences, and privacy.
            </p>
          </div>

          <button
            id="save-settings-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1E293B] pb-3">
          {[
            { id: 'profile', label: 'Developer Profile', icon: User },
            { id: 'appearance', label: 'Appearance & Editor', icon: Palette },
            { id: 'ai', label: 'AI & Inference Preferences', icon: Sliders },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Retention', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                    : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Developer Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.profile.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, name: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.profile.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, email: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Role</label>
                <input
                  type="text"
                  value={formData.profile.role}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, role: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Studio</label>
                <input
                  type="text"
                  value={formData.profile.organization}
                  onChange={(e) => setFormData({
                    ...formData,
                    profile: { ...formData.profile, organization: e.target.value }
                  })}
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Ecosystem Tier</p>
                <p className="text-[11px] text-slate-400">Cyvora Studio Developer Pro license active.</p>
              </div>
              <Badge variant="cyan">{formData.profile.tier}</Badge>
            </div>
          </div>
        )}

        {/* Tab 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Theme & Code Editor Styling
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Editor Palette Archetype</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'dark-cyber', label: 'Dark Cyber (Cyan Accent)', desc: 'High contrast deep tech palette' },
                    { id: 'dark-slate', label: 'Slate Developer', desc: 'Muted neutral grey theme' },
                    { id: 'dark-obsidian', label: 'Obsidian Jet', desc: 'Minimalist true-black background' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setFormData({
                        ...formData,
                        appearance: { ...formData.appearance, theme: theme.id as any }
                      })}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        formData.appearance.theme === theme.id
                          ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow-xs'
                          : 'bg-[#161618] border-[#2D2D33] text-slate-400 hover:text-white'
                      }`}
                    >
                      <p className="text-xs font-semibold">{theme.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{theme.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Font Ligatures</p>
                    <p className="text-[11px] text-slate-400">Enable programming ligatures for operators like ==&gt; and !== in code blocks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.appearance.codeFontLigatures}
                    onChange={(e) => setFormData({
                      ...formData,
                      appearance: { ...formData.appearance, codeFontLigatures: e.target.checked }
                    })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Display Line Numbers</p>
                    <p className="text-[11px] text-slate-400">Show line indices on terminal and source outputs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.appearance.showLineNumbers}
                    onChange={(e) => setFormData({
                      ...formData,
                      appearance: { ...formData.appearance, showLineNumbers: e.target.checked }
                    })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Preferences */}
        {activeTab === 'ai' && (
          <div className="space-y-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              AI Model & Inference Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Default Copilot Engine Model</label>
                <select
                  value={formData.aiPreferences.defaultModel}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiPreferences: { ...formData.aiPreferences, defaultModel: e.target.value as any }
                  })}
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cyvora Ultra Copilot">Cyvora Ultra Copilot (Deep Architecture & Systems)</option>
                  <option value="Cyvora Fast Reasoning">Cyvora Fast Reasoning (Quick Terminal Commands)</option>
                  <option value="Cyvora Code Specialist">Cyvora Code Specialist (Python / TypeScript / SQL)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">Inference Temperature (Deterministic &lt;-&gt; Creative)</label>
                  <span className="text-xs font-mono text-cyan-400">{formData.aiPreferences.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.aiPreferences.temperature}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiPreferences: { ...formData.aiPreferences, temperature: parseFloat(e.target.value) }
                  })}
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Lower values (0.1 - 0.3) provide strict, reproducible code syntax and minimal hallucination.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Default System Instructions</label>
                <textarea
                  rows={3}
                  value={formData.aiPreferences.systemPrompt}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiPreferences: { ...formData.aiPreferences, systemPrompt: e.target.value }
                  })}
                  className="w-full p-2.5 font-mono text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Notifications & Alerts
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Workflow Completion Alerts</p>
                  <p className="text-[11px] text-slate-400">Notify when long-running Cloud and Code diagnostic workflows finish.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.workflowCompleteAlert}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, workflowCompleteAlert: e.target.checked }
                  })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Cloud Security Advisories</p>
                  <p className="text-[11px] text-slate-400">Receive alerts when Cyvora detects deprecated IAM roles or insecure ports.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifications.securityAdvisories}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, securityAdvisories: e.target.checked }
                  })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Data Security & Retention Policy
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Local Browser Cache Only</p>
                  <p className="text-[11px] text-slate-400">All prompt logs and code fragments are restricted to this local sandbox.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.privacy.localCacheOnly}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, localCacheOnly: e.target.checked }
                  })}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B]">
                <label className="block text-xs font-medium text-slate-300 mb-1">Log Retention Period</label>
                <select
                  value={formData.privacy.retentionDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, retentionDays: parseInt(e.target.value) }
                  })}
                  className="w-full sm:w-64 p-2 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days (Recommended)</option>
                  <option value={180}>180 Days</option>
                  <option value={365}>1 Year</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
