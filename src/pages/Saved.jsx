import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { TaskContext } from '../context/TaskContext';
import QuickSaveModal from '../components/QuickSaveModal';
import { getTypeMeta, extractDomain } from '../utils/savedUtils';

const FILTER_TABS = [
  { id: 'All', label: 'All' },
  { id: 'Links', label: 'Links' },
  { id: 'Videos', label: 'Videos' },
  { id: 'Articles', label: 'Articles' },
  { id: 'GitHub', label: 'GitHub' },
  { id: 'PDFs', label: 'PDFs' },
  { id: 'Notes', label: 'Notes' },
  { id: 'Snippets', label: 'Snippets' }
];

const DEFAULT_TAG_FILTERS = ['#DSA', '#NodeJS', '#React', '#SQL', '#Interview', '#Future'];

const Saved = () => {
  const navigate = useNavigate();
  const { savedItems, deleteSavedItem } = useContext(TaskContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);

  // Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Toast State
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Card Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Card Expanded State for notes / code
  const [expandedCardIds, setExpandedCardIds] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleCardExpand = (id) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyText = (text, itemTitle) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`✓ Copied "${itemTitle || 'Content'}" to clipboard`);
  };

  // Compute all unique tags from items + default tags
  const allAvailableTags = useMemo(() => {
    const set = new Set(DEFAULT_TAG_FILTERS.map(t => t.toLowerCase()));
    (savedItems || []).forEach(item => {
      (item.tags || []).forEach(t => set.add(`#${t.toLowerCase().replace(/^#/, '')}`));
    });
    return Array.from(set);
  }, [savedItems]);

  // Filter Saved Items
  const filteredItems = useMemo(() => {
    if (!savedItems) return [];

    return savedItems.filter(item => {
      // 1. Tab filter
      if (activeTab !== 'All') {
        const type = (item.type || '').toLowerCase();
        if (activeTab === 'Videos' && type !== 'video') return false;
        if (activeTab === 'GitHub' && type !== 'github') return false;
        if (activeTab === 'PDFs' && type !== 'pdf') return false;
        if (activeTab === 'Articles' && type !== 'article' && type !== 'link') return false;
        if (activeTab === 'Notes' && type !== 'note') return false;
        if (activeTab === 'Snippets' && type !== 'snippet') return false;
        if (activeTab === 'Links' && !item.url) return false;
      }

      // 2. Tag filter
      if (selectedTag) {
        const tagClean = selectedTag.toLowerCase().replace(/^#/, '');
        const itemTags = (item.tags || []).map(t => t.toLowerCase().replace(/^#/, ''));
        if (!itemTags.includes(tagClean)) return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const urlMatch = item.url?.toLowerCase().includes(q);
        const domainMatch = item.domain?.toLowerCase().includes(q);
        const textMatch = item.text?.toLowerCase().includes(q);
        const topicMatch = item.relatedTopicLabel?.toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some(t => t.toLowerCase().includes(q));

        if (!titleMatch && !urlMatch && !domainMatch && !textMatch && !topicMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [savedItems, activeTab, selectedTag, searchQuery]);

  const handleDelete = async (id) => {
    try {
      await deleteSavedItem(id);
      showToast('Item removed from Vault', 'info');
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      showToast('Could not delete item', 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsSaveModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsSaveModalOpen(true);
  };

  return (
    <div 
      className="flex min-h-screen bg-[#050507] text-on-surface select-none font-dm-sans"
      onClick={() => setActiveMenuId(null)}
    >
      <Sidebar />

      <main className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar relative z-10 animate-page-transition">
        <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle="SAVED VAULT" />

        <div className="px-4 py-6 md:px-10 md:py-8 max-w-7xl w-full mx-auto space-y-7">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(139,92,246,0.15)]">
                  <span className="material-symbols-outlined text-lg">bookmark</span>
                </div>
                <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Saved
                </h1>
              </div>
              <p className="text-zinc-400 text-xs md:text-sm mt-1.5 font-normal">
                Your personal space for things worth coming back to.
              </p>
            </div>

            <Button
              variant="primary"
              icon="add"
              className="w-full md:w-auto min-h-[44px] sm:min-h-0 py-2.5 px-5 font-space-grotesk text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center cursor-pointer"
              onClick={handleOpenCreate}
            >
              + Save Something
            </Button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved resources, notes, tags, URLs..."
                  className="w-full bg-[#0B0B10] border border-white/10 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>

              {/* Reset filter button if active tag or search */}
              {(selectedTag || searchQuery || activeTab !== 'All') && (
                <button
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchQuery('');
                    setActiveTab('All');
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 justify-center"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Reset Filters
                </button>
              )}
            </div>

            {/* Type Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                    activeTab === tab.id
                      ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_rgba(139,92,246,0.15)] font-bold'
                      : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tags Cloud / Chips Filter */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-zinc-500 font-semibold mr-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">label</span>
                Tags:
              </span>
              {allAvailableTags.map(tag => {
                const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-black border-primary font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Items Grid / Empty State */}
          {filteredItems.length === 0 ? (
            <div className="bg-[#09090D] border border-white/5 rounded-2xl p-8 md:p-14 text-center space-y-4 max-w-md mx-auto my-10 shadow-2xl animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <span className="material-symbols-outlined text-2xl">bookmark_border</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-space-grotesk text-lg font-bold text-white">
                  {searchQuery || selectedTag || activeTab !== 'All' ? 'No matching saved items' : 'Nothing saved yet'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  {searchQuery || selectedTag || activeTab !== 'All'
                    ? 'Try clearing your search query or filters to view all saved items.'
                    : 'Save useful videos, articles, websites, notes and snippets here so you can easily find them when you need them later.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <Button
                  variant="primary"
                  className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                  onClick={handleOpenCreate}
                >
                  + Save Something
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => {
                const typeMeta = getTypeMeta(item.type);
                const isExpanded = Boolean(expandedCardIds[item.id]);
                const domain = item.domain || extractDomain(item.url);
                const dateStr = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recently';

                const isSnippet = item.type === 'snippet';
                const hasLongText = (item.text || '').length > 180 || ((item.text || '').match(/\n/g) || []).length > 3;

                return (
                  <div
                    key={item.id}
                    className="bg-[#0B0B10] border border-white/10 hover:border-primary/40 rounded-2xl p-5 space-y-4 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(139,92,246,0.1)] relative flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      {/* Top Row: Type Pill, Domain, Date, Card Menu */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 shrink-0 ${typeMeta.color}`}>
                            <span>{typeMeta.emoji}</span>
                            <span>{typeMeta.label}</span>
                          </span>

                          {domain && (
                            <span className="text-[11px] text-zinc-400 font-medium truncate font-mono">
                              {domain}
                            </span>
                          )}
                        </div>

                        {/* Actions Menu */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">more_vert</span>
                          </button>

                          {activeMenuId === item.id && (
                            <div className="absolute right-0 top-7 z-30 bg-[#12121A] border border-white/10 rounded-xl shadow-2xl py-1.5 w-44 space-y-0.5 animate-fadeIn">
                              {item.url && (
                                <a
                                  href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setActiveMenuId(null)}
                                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm text-primary">open_in_new</span>
                                  Open Link
                                </a>
                              )}

                              {item.text && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleCopyText(item.text, item.title);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm text-cyan-400">content_copy</span>
                                  Copy Text / Code
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm text-amber-400">edit</span>
                                Edit Details
                              </button>

                              <div className="border-t border-white/5 my-1" />

                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setDeleteConfirmId(item.id);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="font-space-grotesk text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.url && (
                          <a
                            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-primary/80 hover:text-primary transition-colors mt-1 font-mono hover:underline"
                          >
                            <span className="truncate max-w-[220px]">{item.url}</span>
                            <span className="material-symbols-outlined text-[12px]">call_made</span>
                          </a>
                        )}
                      </div>

                      {/* Text / Code Snippet Content Preview */}
                      {item.text && (
                        <div className="space-y-1.5">
                          <div className={`p-3 rounded-xl border transition-all ${
                            isSnippet 
                              ? 'bg-[#08080E] border-purple-500/20 text-purple-200 font-mono text-[11px] leading-relaxed' 
                              : 'bg-white/[0.02] border-white/5 text-zinc-300 text-xs leading-relaxed'
                          }`}>
                            <pre className={`whitespace-pre-wrap break-words font-mono ${!isExpanded && hasLongText ? 'line-clamp-4' : ''}`}>
                              {item.text}
                            </pre>
                          </div>

                          {/* Expand / Collapse & Copy Controls */}
                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            {hasLongText ? (
                              <button
                                onClick={() => toggleCardExpand(item.id)}
                                className="text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                                <span className="material-symbols-outlined text-xs">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>
                            ) : <span />}

                            <button
                              onClick={() => handleCopyText(item.text, item.title)}
                              className="text-zinc-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy text"
                            >
                              <span className="material-symbols-outlined text-xs">content_copy</span>
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Related Topic Badge */}
                      {item.relatedTopicLabel && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">alt_route</span>
                          <span className="truncate">{item.relatedTopicLabel}</span>
                        </div>
                      )}

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((t, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedTag(`#${t}`)}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer: Date & Quick Actions */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                      <span>Saved {dateStr}</span>

                      {item.url && (
                        <a
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/20 text-zinc-300 hover:text-primary transition-all font-semibold flex items-center gap-1 border border-white/5 hover:border-primary/30"
                        >
                          <span>Visit</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmId(null)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative bg-[#111118] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center z-10 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-space-grotesk text-lg font-bold text-white">Remove saved item?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                This item will be permanently deleted from your Learning Vault.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" className="px-4 py-2 text-xs" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase hover:bg-red-500/30 transition-all cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Save / Edit Modal */}
      <QuickSaveModal
        isOpen={isSaveModalOpen}
        editItem={editingItem}
        onClose={() => {
          setIsSaveModalOpen(false);
          setEditingItem(null);
        }}
        onSuccess={(msg) => showToast(msg || '✓ Saved to Vault')}
      />

      {/* Toast notifications */}
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default Saved;
