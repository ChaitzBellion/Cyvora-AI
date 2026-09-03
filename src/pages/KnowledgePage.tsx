import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Code2, 
  Terminal, 
  Cloud, 
  Database,
  Layers,
  FileText
} from 'lucide-react';
import { SavedKnowledgeItem, AppView } from '../types';
import { CodeSnippet } from '../components/ui/CodeSnippet';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface KnowledgePageProps {
  items: SavedKnowledgeItem[];
  onDeleteItem: (id: string) => void;
  onToggleStar: (id: string) => void;
  onAddItem: (item: Omit<SavedKnowledgeItem, 'id' | 'dateSaved'>) => void;
  onNavigate: (view: AppView) => void;
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  items,
  onDeleteItem,
  onToggleStar,
  onAddItem,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItemModal, setSelectedItemModal] = useState<SavedKnowledgeItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'cloud' | 'linux' | 'code' | 'database' | 'devops' | 'architecture'>('cloud');
  const [newDescription, setNewDescription] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCodeLang, setNewCodeLang] = useState('bash');

  const categories = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'cloud', label: 'Google Cloud & VPC' },
    { id: 'linux', label: 'Linux & Systemd' },
    { id: 'database', label: 'SQL & Databases' },
    { id: 'code', label: 'Code & TypeScript' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cloud': return <Cloud className="w-4 h-4 text-cyan-400" />;
      case 'linux': return <Terminal className="w-4 h-4 text-sky-400" />;
      case 'database': return <Database className="w-4 h-4 text-teal-400" />;
      case 'code': return <Code2 className="w-4 h-4 text-indigo-400" />;
      default: return <Layers className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleCreateKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      title: newTitle,
      category: newCategory,
      categoryLabel: newCategory.toUpperCase(),
      tags: [newCategory, 'Cyvora Custom'],
      description: newDescription || 'Manually saved solution snippet.',
      solutionSummary: newSolution || newDescription,
      codeSnippet: newCode.trim() ? {
        language: newCodeLang,
        code: newCode,
        fileName: `snippet.${newCodeLang}`
      } : undefined,
      keyTakeaways: ['Manually captured technical note for Cyvora Studio ecosystem.'],
      starred: true
    });

    setNewTitle('');
    setNewDescription('');
    setNewSolution('');
    setNewCode('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">Saved Knowledge</h1>
              <Badge variant="cyan">{items.length} Snippets</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Curated technical solutions, diagnostic runbooks, and optimized code templates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="add-knowledge-btn"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Solution</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 shadow-xs'
                    : 'text-slate-400 hover:text-white bg-[#0E0E10] border border-[#1E293B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="knowledge-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions & code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#0E0E10] border border-[#1E293B] max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#161618] border border-[#2D2D33] flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">No saved knowledge found</h3>
            <p className="text-xs text-slate-400 mb-4">
              {searchQuery ? 'Try adjusting your search filters or keywords.' : 'Save solutions from your AI chats or add new runbooks here.'}
            </p>
            <button
              onClick={() => onNavigate('workspace')}
              className="px-4 py-2 rounded-lg bg-[#161618] text-cyan-300 border border-cyan-900/50 text-xs font-semibold hover:bg-[#1A1A1D] transition-colors"
            >
              Start in Workspace
            </button>
          </div>
        )}

        {/* Knowledge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`knowledge-card-${item.id}`}
              className="flex flex-col justify-between p-5 rounded-xl bg-[#0E0E10] border border-[#1E293B] hover:border-cyan-500/50 transition-all duration-200 shadow-sm group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#161618] border border-[#2D2D33]">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleStar(item.id)}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                      title={item.starred ? 'Starred' : 'Star item'}
                    >
                      <Star className={`w-4 h-4 ${item.starred ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => setSelectedItemModal(item)}
                  className="text-base font-bold text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer mb-2"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Embedded Code Snippet if present */}
                {item.codeSnippet && (
                  <div className="mb-3">
                    <CodeSnippet
                      code={item.codeSnippet.code}
                      language={item.codeSnippet.language}
                      fileName={item.codeSnippet.fileName}
                    />
                  </div>
                )}

                {/* Key Takeaways */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div className="space-y-1 mb-3 pt-1">
                    {item.keyTakeaways.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 bg-[#161618] border border-[#2D2D33] text-slate-400 rounded text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-slate-500">{item.dateSaved}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Solution Modal */}
        {selectedItemModal && (
          <Modal
            isOpen={!!selectedItemModal}
            onClose={() => setSelectedItemModal(null)}
            title={selectedItemModal.title}
            description={`Saved under ${selectedItemModal.categoryLabel} • ${selectedItemModal.dateSaved}`}
            maxWidth="xl"
            footer={
              <button
                onClick={() => setSelectedItemModal(null)}
                className="px-4 py-2 rounded-lg bg-[#161618] hover:bg-[#1F1F23] border border-[#2D2D33] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            }
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Architecture Summary</h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#161618] p-3 rounded-lg border border-[#2D2D33]">
                  {selectedItemModal.solutionSummary}
                </p>
              </div>

              {selectedItemModal.codeSnippet && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Production Code Blueprint</h4>
                  <CodeSnippet
                    code={selectedItemModal.codeSnippet.code}
                    language={selectedItemModal.codeSnippet.language}
                    fileName={selectedItemModal.codeSnippet.fileName}
                  />
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Add Knowledge Modal */}
        {showAddModal && (
          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Save Solution Blueprint"
            description="Add a reusable architecture, command, or script to Cyvora Knowledge."
            maxWidth="lg"
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateKnowledge}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-black text-xs font-bold cursor-pointer"
                >
                  Save to Knowledge Base
                </button>
              </>
            }
          >
            <form onSubmit={handleCreateKnowledge} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cloud Run VPC Direct Egress Deployment"
                  className="w-full p-2 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="cloud">Google Cloud / GCP</option>
                  <option value="linux">Linux & Systems</option>
                  <option value="database">SQL & Databases</option>
                  <option value="code">TypeScript & Python</option>
                  <option value="devops">Docker & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Solution Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of the bug, diagnosis, and fix..."
                  className="w-full p-2 text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Code or Command Snippet (Optional)</label>
                <textarea
                  rows={4}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Paste bash commands, YAML manifests, or code here..."
                  className="w-full p-2 font-mono text-xs bg-[#161618] border border-[#2D2D33] rounded-lg text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};
