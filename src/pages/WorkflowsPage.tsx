import React, { useState } from 'react';
import { 
  CloudRain, 
  Code, 
  Database, 
  Terminal, 
  Cpu, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter, 
  Play,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Sliders,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Copy,
  Info
} from 'lucide-react';
import { Workflow, AppView } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface WorkflowsPageProps {
  workflows: Workflow[];
  onStartWorkflow: (workflow: Workflow, customInput?: string) => void;
  onCreateWorkflow?: (workflow: Omit<Workflow, 'id' | 'userId'>) => Promise<void>;
  onUpdateWorkflow?: (id: string, updates: Partial<Workflow>) => Promise<void>;
  onDeleteWorkflow?: (id: string) => Promise<void>;
  onToggleEnabled?: (id: string, currentEnabled: boolean) => Promise<void>;
  onNavigate: (view: AppView) => void;
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'error' | 'info') => void;
}

export const WorkflowsPage: React.FC<WorkflowsPageProps> = ({
  workflows,
  onStartWorkflow,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onToggleEnabled,
  onNavigate,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeWorkflowModal, setActiveWorkflowModal] = useState<Workflow | null>(null);
  const [customWorkflowInput, setCustomWorkflowInput] = useState('');

  // Workflow Editor State (Create / Edit)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Workflow Delete Confirmation State
  const [deletingWorkflow, setDeletingWorkflow] = useState<Workflow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Software Engineering',
    prompt: '',
    systemInstruction: '',
    model: 'Cyvora Ultra Copilot',
    temperature: 0.2,
    maxOutputTokens: 4096,
    iconName: 'Sparkles',
    tags: 'Custom, Automation',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    estimatedTime: '2 min',
    enabled: true,
  });

  const getWorkflowIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-sky-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-teal-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Workflows' },
    { id: 'Infrastructure', label: 'Cloud & Infrastructure' },
    { id: 'Software', label: 'Code & Refactoring' },
    { id: 'Data', label: 'Data & SQL' },
    { id: 'Systems', label: 'Linux & Systems' },
    { id: 'Custom', label: 'Custom User Workflows' },
  ];

  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch = 
      wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wf.tags && wf.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    let matchesCategory = true;
    if (selectedCategory === 'Custom') {
      matchesCategory = Boolean(wf.isCustom);
    } else if (selectedCategory !== 'all') {
      matchesCategory = wf.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }

    return matchesSearch && matchesCategory;
  });

  const handleLaunchModal = (wf: Workflow) => {
    setActiveWorkflowModal(wf);
    setCustomWorkflowInput('');
  };

  const handleConfirmLaunch = () => {
    if (!activeWorkflowModal) return;
    onStartWorkflow(activeWorkflowModal, customWorkflowInput);
    setActiveWorkflowModal(null);
  };

  const handleOpenCreateModal = () => {
    setEditingWorkflowId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Software Engineering',
      prompt: '',
      systemInstruction: '',
      model: 'Cyvora Ultra Copilot',
      temperature: 0.2,
      maxOutputTokens: 4096,
      iconName: 'Sparkles',
      tags: 'Custom, Automation',
      difficulty: 'Intermediate',
      estimatedTime: '2 min',
      enabled: true,
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (wf: Workflow) => {
    setEditingWorkflowId(wf.id);
    setFormData({
      name: wf.name || '',
      description: wf.description || '',
      category: wf.category || 'Software Engineering',
      prompt: wf.prompt || wf.promptTemplate || '',
      systemInstruction: wf.systemInstruction || '',
      model: wf.model || 'Cyvora Ultra Copilot',
      temperature: typeof wf.temperature === 'number' ? wf.temperature : 0.2,
      maxOutputTokens: typeof wf.maxOutputTokens === 'number' ? wf.maxOutputTokens : 4096,
      iconName: wf.iconName || 'Sparkles',
      tags: Array.isArray(wf.tags) ? wf.tags.join(', ') : 'Custom',
      difficulty: wf.difficulty || 'Intermediate',
      estimatedTime: wf.estimatedTime || '2 min',
      enabled: wf.enabled !== undefined ? wf.enabled : true,
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleSaveWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const trimmedName = formData.name.trim();
    const trimmedPrompt = formData.prompt.trim();

    if (!trimmedName) {
      setFormError('Workflow name is required.');
      return;
    }
    if (trimmedName.length > 100) {
      setFormError('Workflow name must be under 100 characters.');
      return;
    }
    if (!trimmedPrompt) {
      setFormError('Prompt or template instructions are required.');
      return;
    }
    if (trimmedPrompt.length > 4000) {
      setFormError('Prompt exceeds 4,000 characters maximum.');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const workflowPayload: Omit<Workflow, 'id' | 'userId'> = {
      name: trimmedName,
      description: formData.description.trim(),
      category: formData.category,
      prompt: trimmedPrompt,
      promptTemplate: trimmedPrompt,
      systemInstruction: formData.systemInstruction.trim(),
      model: formData.model,
      temperature: Number(formData.temperature),
      maxOutputTokens: Number(formData.maxOutputTokens),
      iconName: formData.iconName,
      tags: tagsArray.length > 0 ? tagsArray : ['Custom'],
      difficulty: formData.difficulty,
      estimatedTime: formData.estimatedTime,
      enabled: formData.enabled,
      isCustom: true,
    };

    setIsSaving(true);
    try {
      if (editingWorkflowId && onUpdateWorkflow) {
        await onUpdateWorkflow(editingWorkflowId, workflowPayload);
        if (onShowToast) onShowToast('Workflow Updated', `"${trimmedName}" saved successfully.`);
      } else if (onCreateWorkflow) {
        await onCreateWorkflow(workflowPayload);
        if (onShowToast) onShowToast('Workflow Created', `"${trimmedName}" is ready to execute in your workspace.`);
      }
      setIsEditorOpen(false);
    } catch (err: any) {
      console.error('[Cyvora Workflows] Save failed:', err);
      setFormError(err.message || 'Failed to save workflow. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingWorkflow || !onDeleteWorkflow) return;
    setIsDeleting(true);
    try {
      await onDeleteWorkflow(deletingWorkflow.id);
      if (onShowToast) onShowToast('Workflow Deleted', `"${deletingWorkflow.name}" has been removed.`);
      setDeletingWorkflow(null);
    } catch (err: any) {
      console.error('[Cyvora Workflows] Delete failed:', err);
      if (onShowToast) onShowToast('Delete Failed', err.message || 'Could not delete workflow.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Workflows</h1>
              <Badge variant="cyan">Cyvora Automation</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Pre-configured engineering pipelines and user-authored custom workflows designed for high-rigor output.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              id="create-new-workflow-btn"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Workflow</span>
            </button>

            <button
              onClick={() => onNavigate('workspace')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161618] hover:bg-[#202024] text-slate-200 border border-[#2D2D33] text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                    : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows & tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              id={`workflow-card-${workflow.id}`}
              className={`flex flex-col justify-between p-5 rounded-xl bg-[#0E0E10] border transition-all duration-200 shadow-sm group relative ${
                workflow.enabled !== false 
                  ? 'border-[#1E293B] hover:border-cyan-500/50' 
                  : 'border-[#1E293B]/50 opacity-60 bg-[#0E0E10]/60'
              }`}
            >
              <div>
                {/* Card Header: Icon & Category & Badge */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#161618] border border-[#2D2D33] group-hover:border-cyan-700/50 flex items-center justify-center transition-colors shrink-0">
                    {getWorkflowIcon(workflow.iconName)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      {workflow.isCustom ? (
                        <span className="text-[9px] font-mono font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                          CUSTOM
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-semibold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                          BLUEPRINT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{workflow.estimatedTime || '1-2 min'}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-1.5 flex items-center justify-between">
                  <span className="truncate">{workflow.name}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {workflow.description || 'Configured AI workflow with parameterized instructions.'}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {workflow.tags && workflow.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161618] border border-[#2D2D33] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons & Custom Controls */}
                <div className="space-y-2 pt-3 border-t border-[#1E293B]">
                  {workflow.isCustom && (
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                      <button
                        onClick={() => onToggleEnabled && onToggleEnabled(workflow.id, workflow.enabled !== false)}
                        className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
                        title={workflow.enabled !== false ? 'Disable workflow' : 'Enable workflow'}
                      >
                        {workflow.enabled !== false ? (
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-600" />
                        )}
                        <span className="text-[11px] font-mono">
                          {workflow.enabled !== false ? 'Active' : 'Disabled'}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(workflow)}
                          className="p-1.5 hover:text-cyan-300 hover:bg-[#161618] rounded-md transition-colors"
                          title="Edit workflow"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingWorkflow(workflow)}
                          className="p-1.5 hover:text-red-400 hover:bg-[#161618] rounded-md transition-colors"
                          title="Delete workflow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary Start Workflow Button */}
                  <button
                    id={`start-workflow-btn-${workflow.id}`}
                    onClick={() => handleLaunchModal(workflow)}
                    disabled={workflow.enabled === false}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-bold text-xs transition-all shadow-xs ${
                      workflow.enabled !== false
                        ? 'bg-cyan-950/40 hover:bg-white hover:text-black text-cyan-300 border border-cyan-900/50 cursor-pointer'
                        : 'bg-[#161618] text-slate-500 border border-[#2D2D33] cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start workflow</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="p-12 text-center bg-[#0E0E10] border border-[#1E293B] rounded-2xl">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Workflows Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              No matching workflows found for "{searchQuery}". Create a custom workflow or adjust search filters.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors"
            >
              Create New Workflow
            </button>
          </div>
        )}

        {/* Workflow Setup / Launch Modal */}
        {activeWorkflowModal && (
          <Modal
            isOpen={!!activeWorkflowModal}
            onClose={() => setActiveWorkflowModal(null)}
            title={`Configure ${activeWorkflowModal.name}`}
            description={activeWorkflowModal.description}
            footer={
              <>
                <button
                  onClick={() => setActiveWorkflowModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  id="confirm-launch-workflow-btn"
                  onClick={handleConfirmLaunch}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold shadow-sm cursor-pointer"
                >
                  <span>Launch in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Workflow Prompt Instructions
                </label>
                <div className="p-3 bg-[#161618] border border-[#2D2D33] rounded-lg text-xs font-mono text-cyan-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {activeWorkflowModal.prompt || activeWorkflowModal.promptTemplate}
                </div>
              </div>

              {activeWorkflowModal.systemInstruction && (
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    System Directive
                  </label>
                  <div className="p-2.5 bg-[#161618] border border-[#2D2D33] rounded-lg text-xs text-slate-300 font-mono">
                    {activeWorkflowModal.systemInstruction}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 p-2.5 bg-[#161618]/60 border border-[#2D2D33] rounded-lg font-mono">
                <div>
                  <span className="text-slate-500">Model: </span>
                  <span className="text-slate-200">{activeWorkflowModal.model || 'Cyvora Ultra Copilot'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Temperature: </span>
                  <span className="text-cyan-400">{activeWorkflowModal.temperature ?? 0.2}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Problem Context or Code (Optional)
                </label>
                <textarea
                  rows={4}
                  value={customWorkflowInput}
                  onChange={(e) => setCustomWorkflowInput(e.target.value)}
                  placeholder={activeWorkflowModal.inputPlaceholder || 'Provide additional logs, code snippets, or parameters...'}
                  className="w-full p-3 rounded-lg bg-[#161618] border border-[#2D2D33] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </Modal>
        )}

        {/* Workflow Editor Modal (Create / Edit) */}
        {isEditorOpen && (
          <Modal
            isOpen={isEditorOpen}
            onClose={() => !isSaving && setIsEditorOpen(false)}
            title={editingWorkflowId ? 'Edit Custom Workflow' : 'Create Custom Workflow'}
            description="Configure custom prompts, system instructions, and inference parameters."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWorkflow}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingWorkflowId ? 'Save Changes' : 'Create Workflow'}</span>
                  )}
                </button>
              </>
            }
          >
            <form onSubmit={handleSaveWorkflow} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-lg flex items-center gap-2 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Workflow Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Terraform GCP Hardener"
                    className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Infrastructure & GCP">Infrastructure & GCP</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Systems & DevOps">Systems & DevOps</option>
                    <option value="Security & IAM">Security & IAM</option>
                    <option value="Custom Workflows">Custom Workflows</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what this workflow accomplishes..."
                  className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Workflow Prompt / Instructions <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Analyze the provided code or cloud architecture and return..."
                  className="w-full p-2.5 text-xs font-mono bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom System Directive (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.systemInstruction}
                  onChange={(e) => setFormData({ ...formData, systemInstruction: e.target.value })}
                  placeholder="Strict architectural rules or output format constraints..."
                  className="w-full p-2.5 text-xs font-mono bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Temperature</label>
                    <span className="text-xs font-mono text-cyan-400">{formData.temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="GCP, Terraform, Security"
                    className="w-full p-2.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {deletingWorkflow && (
          <Modal
            isOpen={!!deletingWorkflow}
            onClose={() => !isDeleting && setDeletingWorkflow(null)}
            title="Delete Custom Workflow"
            description="Are you sure you want to delete this workflow? This action cannot be undone."
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setDeletingWorkflow(null)}
                  disabled={isDeleting}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Workflow</span>
                  )}
                </button>
              </>
            }
          >
            <div className="p-3 bg-[#161618] border border-[#2D2D33] rounded-lg text-xs text-slate-300">
              <p className="font-semibold text-white mb-1">{deletingWorkflow.name}</p>
              <p className="text-slate-400">{deletingWorkflow.description || 'Custom user-authored workflow'}</p>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};
