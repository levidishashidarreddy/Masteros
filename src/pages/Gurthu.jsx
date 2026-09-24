import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { TaskContext } from '../context/TaskContext';
import QuickSaveModal from '../components/QuickSaveModal';
import QRModal from '../components/QRModal';
import { getTypeMeta, extractDomain, formatTimeRemaining, isTransferExpired } from '../utils/savedUtils';

const SAVED_FILTER_TABS = [
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

const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: 'keep', label: 'Keep (No expiry)' }
];

const Gurthu = () => {
  const navigate = useNavigate();
  const {
    savedItems,
    deleteSavedItem,
    transferItems,
    addTransferItem,
    deleteTransferItem,
    saveTransferToGurthu
  } = useContext(TaskContext);

  // Top Mode Tab: 'saved' | 'transfer'
  const [activeMode, setActiveMode] = useState('saved');

  // Saved Mode States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSavedTab, setActiveSavedTab] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);

  // Transfer Mode States
  const [transferInput, setTransferInput] = useState('');
  const [transferExpiry, setTransferExpiry] = useState('24h');
  const [isSendingTransfer, setIsSendingTransfer] = useState(false);

  // Modals & Popovers
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [qrModalState, setQrModalState] = useState({ isOpen: false, content: '', title: '' });

  // Toast & Confirmations
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteConfirmConfig, setDeleteConfirmConfig] = useState(null); // { type: 'saved'|'transfer', id: string }
  const [activeMenuId, setActiveMenuId] = useState(null);
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

  const handleCopyText = (text, titleLabel = 'Content') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`✓ Copied ${titleLabel} to clipboard`);
  };

  const handleShareItem = async (item) => {
    const shareText = item.text || item.url || item.title;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || 'Gurthu Item',
          text: shareText,
          url: item.url || undefined
        });
      } catch (_) {}
    } else {
      handleCopyText(shareText, 'Item for sharing');
    }
  };

  // Handle Transfer Send
  const handleSendTransfer = async (e) => {
    e?.preventDefault();
    if (!transferInput.trim() || isSendingTransfer) return;

    setIsSendingTransfer(true);
    try {
      const isUrl = transferInput.trim().startsWith('http://') || transferInput.trim().startsWith('https://');
      await addTransferItem({
        text: isUrl ? '' : transferInput.trim(),
        url: isUrl ? transferInput.trim() : '',
        expiryOption: transferExpiry
      });

      setTransferInput('');
      showToast('✓ Ready on your other device');
    } catch (err) {
      console.error(err);
      showToast('Could not send transfer item', 'error');
    } finally {
      setIsSendingTransfer(false);
    }
  };

  // Convert temporary transfer to permanent saved Gurthu item
  const handleSaveTransferToPermanent = async (transferItem) => {
    try {
      await saveTransferToGurthu(transferItem);
      showToast('🔖 Saved to Gurthu');
    } catch (err) {
      console.error(err);
      showToast('Could not save to Gurthu', 'error');
    }
  };

  // Filter Permanent Saved Items
  const filteredSavedItems = useMemo(() => {
    if (!savedItems) return [];

    return savedItems.filter(item => {
      // 1. Tab filter
      if (activeSavedTab !== 'All') {
        const type = (item.type || '').toLowerCase();
        if (activeSavedTab === 'Videos' && type !== 'video') return false;
        if (activeSavedTab === 'GitHub' && type !== 'github') return false;
        if (activeSavedTab === 'PDFs' && type !== 'pdf') return false;
        if (activeSavedTab === 'Articles' && type !== 'article' && type !== 'link') return false;
        if (activeSavedTab === 'Notes' && type !== 'note') return false;
        if (activeSavedTab === 'Snippets' && type !== 'snippet') return false;
        if (activeSavedTab === 'Links' && !item.url) return false;
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
  }, [savedItems, activeSavedTab, selectedTag, searchQuery]);

  // Compute all unique tags
  const allAvailableTags = useMemo(() => {
    const set = new Set(DEFAULT_TAG_FILTERS.map(t => t.toLowerCase()));
    (savedItems || []).forEach(item => {
      (item.tags || []).forEach(t => set.add(`#${t.toLowerCase().replace(/^#/, '')}`));
    });
    return Array.from(set);
  }, [savedItems]);

  // Filter Active Transfer Items (Remove expired)
  const activeTransferItems = useMemo(() => {
    return (transferItems || []).filter(item => !isTransferExpired(item.expiresAt));
  }, [transferItems]);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmConfig) return;
    try {
      if (deleteConfirmConfig.type === 'saved') {
        await deleteSavedItem(deleteConfirmConfig.id);
        showToast('Item deleted from Gurthu', 'info');
      } else if (deleteConfirmConfig.type === 'transfer') {
        await deleteTransferItem(deleteConfirmConfig.id);
        showToast('Transfer item removed', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not delete item', 'error');
    } finally {
      setDeleteConfirmConfig(null);
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
        <Header hideSearch={true} hideStreak={true} hideLogo={true} workspaceTitle="GURTHU" />

        <div className="px-4 py-6 md:px-10 md:py-8 max-w-6xl w-full mx-auto space-y-7">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <span className="material-symbols-outlined text-xl">push_pin</span>
                </div>
                <h1 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Gurthu
                </h1>
              </div>
              <p className="text-zinc-400 text-xs md:text-sm mt-1.5 font-normal">
                “Keep useful things here — for later or for your next device.”
              </p>
            </div>

            {/* Compact Action Controls */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleOpenCreate}
                className="flex-1 md:flex-none min-h-[42px] py-2 px-4 rounded-xl bg-primary text-black font-space-grotesk text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:bg-primary-light transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>+ Add to Gurthu</span>
              </button>

              <button
                onClick={() => setActiveMode('transfer')}
                className={`flex-1 md:flex-none min-h-[42px] py-2 px-4 rounded-xl border text-xs font-bold font-space-grotesk uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'transfer'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">phonelink</span>
                <span>📋 Transfer</span>
              </button>
            </div>
          </div>

          {/* INTERNAL MODE SWITCH TABS: Saved vs Transfer */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0B0B10] border border-white/10 w-fit">
            <button
              onClick={() => setActiveMode('saved')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'saved'
                  ? 'bg-primary text-black font-space-grotesk uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">bookmark</span>
              <span>🔖 Saved ({savedItems.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('transfer')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'transfer'
                  ? 'bg-cyan-400 text-black font-space-grotesk uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">phonelink</span>
              <span>📋 Transfer ({activeTransferItems.length})</span>
            </button>
          </div>

          {/* MODE 1: PERMANENT SAVED VAULT */}
          {activeMode === 'saved' && (
            <div className="space-y-6 animate-fade-in">
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
                      placeholder="Search saved resources, notes, code, tags, URLs..."
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
                  {(selectedTag || searchQuery || activeSavedTab !== 'All') && (
                    <button
                      onClick={() => {
                        setSelectedTag(null);
                        setSearchQuery('');
                        setActiveSavedTab('All');
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
                  {SAVED_FILTER_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSavedTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                        activeSavedTab === tab.id
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
              {filteredSavedItems.length === 0 ? (
                <div className="bg-[#09090D] border border-white/5 rounded-2xl p-8 md:p-14 text-center space-y-4 max-w-md mx-auto my-10 shadow-2xl animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                    <span className="material-symbols-outlined text-2xl">push_pin</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-space-grotesk text-lg font-bold text-white">
                      {searchQuery || selectedTag || activeSavedTab !== 'All' ? 'No matching items' : 'Nothing here yet.'}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                      {searchQuery || selectedTag || activeSavedTab !== 'All'
                        ? 'Try clearing your search query or filters to view all Gurthu items.'
                        : 'Save useful videos, websites, notes and snippets, or use Gurthu to move something between your devices.'}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col items-center gap-3">
                    <Button
                      variant="primary"
                      className="py-2.5 px-6 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                      onClick={handleOpenCreate}
                    >
                      + Add to Gurthu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredSavedItems.map(item => {
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
                          {/* Top Row: Type Pill, Domain, Card Menu */}
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
                                      Copy Text
                                    </button>
                                  )}

                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setQrModalState({ 
                                        isOpen: true, 
                                        content: item.url || item.text || item.code || item.description || item.note || item.title || '', 
                                        title: item.title || 'QR Code' 
                                      });
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-sm text-purple-400">qr_code_2</span>
                                    Generate QR
                                  </button>

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
                                      setDeleteConfirmConfig({ type: 'saved', id: item.id });
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

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setQrModalState({ 
                                isOpen: true, 
                                content: item.url || item.text || item.code || item.description || item.note || item.title || '', 
                                title: item.title || 'QR Code' 
                              })}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all font-semibold flex items-center gap-1 border border-white/5"
                              title="QR Code"
                            >
                              <span className="material-symbols-outlined text-xs">qr_code_2</span>
                            </button>

                            {item.url && (
                              <a
                                href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/20 text-zinc-300 hover:text-primary transition-all font-semibold flex items-center gap-1 border border-white/5 hover:border-primary/30"
                              >
                                <span>Open</span>
                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: CROSS-DEVICE CLIPBOARD TRANSFER */}
          {activeMode === 'transfer' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Transfer Input Container (Klipit style) */}
              <form onSubmit={handleSendTransfer} className="bg-[#0B0B10] border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-[0_0_30px_rgba(6,182,212,0.08)] relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400 text-lg">phonelink_ring</span>
                    <h3 className="font-space-grotesk text-sm font-bold text-white uppercase tracking-wider">
                      Cross-Device Clipboard Transfer
                    </h3>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono font-semibold">
                    ⚡ Instant Sync
                  </span>
                </div>

                <textarea
                  value={transferInput}
                  onChange={(e) => setTransferInput(e.target.value)}
                  rows={4}
                  placeholder="Paste anything here... (plain text, link, code, copied explanation from phone or laptop)"
                  className="w-full bg-[#07070B] border border-white/10 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl p-4 text-xs text-white placeholder:text-zinc-500 focus:outline-none transition-all font-mono leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-semibold">Expiry:</span>
                    <select
                      value={transferExpiry}
                      onChange={(e) => setTransferExpiry(e.target.value)}
                      className="bg-[#12121B] text-zinc-300 text-xs font-medium rounded-xl px-3 py-1.5 border border-white/10 focus:outline-none cursor-pointer"
                    >
                      {EXPIRY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!transferInput.trim() || isSendingTransfer}
                    className={`py-2.5 px-6 rounded-xl font-space-grotesk text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      transferInput.trim()
                        ? 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95'
                        : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {isSendingTransfer ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        <span>Send to Other Device</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Active Transfer Items List */}
              <div className="space-y-4">
                <h4 className="font-space-grotesk text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <span>ACTIVE TRANSFERRED ITEMS ({activeTransferItems.length})</span>
                  <span className="h-[1px] bg-white/5 flex-1" />
                </h4>

                {activeTransferItems.length === 0 ? (
                  <div className="p-8 bg-[#09090D] border border-white/5 rounded-2xl text-center space-y-2">
                    <span className="material-symbols-outlined text-2xl text-zinc-600 block">phonelink_off</span>
                    <p className="text-xs font-semibold text-white">No active transfer items</p>
                    <p className="text-[11px] text-zinc-500">
                      Paste something above on your phone or laptop to instantly copy it across your devices.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activeTransferItems.map(item => {
                      const textContent = item.text || item.url || '';
                      const isUrl = Boolean(item.url || textContent.startsWith('http://') || textContent.startsWith('https://'));
                      const isCode = !isUrl && (textContent.includes('\n') || textContent.includes('{') || textContent.includes(';'));

                      return (
                        <div
                          key={item.id}
                          className="bg-[#0B0B10] border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 space-y-3 transition-all duration-300 shadow-lg"
                        >
                          <div className="flex items-center justify-between text-[11px] text-zinc-400">
                            <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                              <span className="material-symbols-outlined text-sm">devices</span>
                              Cross-Device Clipboard
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-400">
                              ⏱ {formatTimeRemaining(item.expiresAt)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className={`p-3 rounded-xl border font-mono text-xs leading-relaxed ${
                            isCode
                              ? 'bg-[#06060A] border-purple-500/20 text-purple-200'
                              : 'bg-white/[0.02] border-white/5 text-white'
                          }`}>
                            <pre className="whitespace-pre-wrap break-words max-h-48 overflow-y-auto no-scrollbar font-mono">
                              {textContent}
                            </pre>
                          </div>

                          {/* Actions: Copy, Save to Gurthu, QR, Share, Delete */}
                          <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-white/5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleCopyText(textContent, 'Transferred Content')}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">content_copy</span>
                                <span>Copy</span>
                              </button>

                              <button
                                onClick={() => handleSaveTransferToPermanent(item)}
                                className="px-3 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                title="Convert temporary transfer into permanent Gurthu item"
                              >
                                <span className="material-symbols-outlined text-xs">bookmark_add</span>
                                <span>Save to Gurthu</span>
                              </button>

                              <button
                                onClick={() => setQrModalState({ isOpen: true, content: textContent, title: 'Cross-Device QR' })}
                                className="px-2.5 py-1.5 rounded-xl bg-white/5 text-zinc-300 hover:text-white border border-white/5 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                                title="Show QR Code for phone scan"
                              >
                                <span className="material-symbols-outlined text-xs">qr_code_2</span>
                                <span>QR</span>
                              </button>

                              <button
                                onClick={() => handleShareItem(item)}
                                className="px-2.5 py-1.5 rounded-xl bg-white/5 text-zinc-300 hover:text-white border border-white/5 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-xs">share</span>
                                <span>Share</span>
                              </button>
                            </div>

                            <button
                              onClick={() => setDeleteConfirmConfig({ type: 'transfer', id: item.id })}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                              title="Delete Transfer Item"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmConfig(null)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative bg-[#111118] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center z-10 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-space-grotesk text-lg font-bold text-white">Delete item?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {deleteConfirmConfig.type === 'saved'
                  ? 'This item will be removed permanently from your Gurthu space.'
                  : 'This transfer item will be removed.'}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" className="px-4 py-2 text-xs" onClick={() => setDeleteConfirmConfig(null)}>
                Cancel
              </Button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase hover:bg-red-500/30 transition-all cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Save Modal for Add to Gurthu */}
      <QuickSaveModal
        isOpen={isSaveModalOpen}
        editItem={editingItem}
        onClose={() => {
          setIsSaveModalOpen(false);
          setEditingItem(null);
        }}
        onSuccess={(msg) => showToast(msg || '🔖 Saved to Gurthu')}
      />

      {/* QR Code Sharing Modal */}
      <QRModal
        isOpen={qrModalState.isOpen}
        content={qrModalState.content}
        title={qrModalState.title}
        onClose={() => setQrModalState({ isOpen: false, content: '', title: '' })}
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

export default Gurthu;
