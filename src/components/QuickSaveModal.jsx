import React, { useState, useEffect, useContext, useMemo } from 'react';
import { TaskContext } from '../context/TaskContext';
import { autoDetectSavedType, generateDefaultTitle, parseTags, getTypeMeta } from '../utils/savedUtils';

const PRESET_TAG_SUGGESTIONS = ['DSA', 'NodeJS', 'React', 'SQL', 'Interview', 'Future', 'Python', 'WebDev', 'SystemDesign'];

const QuickSaveModal = ({
  isOpen,
  onClose,
  initialUrl = '',
  initialText = '',
  initialTitle = '',
  initialTags = '',
  initialRelatedTopicId = '',
  initialType = '',
  editItem = null,
  onSuccess
}) => {
  const { userRoadmaps, workspaces, addSavedItem, updateSavedItem } = useContext(TaskContext);

  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [typeOverride, setTypeOverride] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedAnimating, setIsSavedAnimating] = useState(false);

  // Initialize form when modal opens or editItem changes
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setUrl(editItem.url || '');
        setText(editItem.text || '');
        setTitle(editItem.title || '');
        setTagsInput(Array.isArray(editItem.tags) ? editItem.tags.map(t => `#${t}`).join(' ') : (editItem.tags || ''));
        setSelectedTopicId(editItem.relatedTopicId || '');
        setTypeOverride(editItem.type || '');
      } else {
        setUrl(initialUrl || '');
        setText(initialText || '');
        setTitle(initialTitle || '');
        setTagsInput(initialTags || '');
        setSelectedTopicId(initialRelatedTopicId || '');
        setTypeOverride(initialType || '');
      }
      setIsSubmitting(false);
      setIsSavedAnimating(false);
    }
  }, [isOpen, editItem, initialUrl, initialText, initialTitle, initialTags, initialRelatedTopicId, initialType]);

  // Detected type computation
  const detectedType = useMemo(() => {
    if (typeOverride) return typeOverride;
    return autoDetectSavedType(url, text);
  }, [url, text, typeOverride]);

  const typeMeta = getTypeMeta(detectedType);

  // Computed Roadmap & Workspace Topic Options
  const topicOptions = useMemo(() => {
    const options = [];

    // From Roadmaps
    (userRoadmaps || []).forEach(r => {
      const skills = r.skills || [];
      skills.forEach(sk => {
        options.push({
          id: `roadmap-${r.id}-skill-${sk.id}`,
          label: `${r.title} → ${sk.title}`,
          roadmapId: r.id,
          topicId: sk.id,
          topicTitle: sk.title
        });
      });
      if (skills.length === 0) {
        options.push({
          id: `roadmap-${r.id}`,
          label: `Roadmap: ${r.title}`,
          roadmapId: r.id,
          topicId: r.id,
          topicTitle: r.title
        });
      }
    });

    // From Workspaces
    (workspaces || []).forEach(ws => {
      const topics = ws.topics || ws.roadmap?.topics || [];
      topics.forEach(t => {
        options.push({
          id: `ws-${ws.id}-topic-${t.id}`,
          label: `${ws.title} → ${t.title}`,
          workspaceId: ws.id,
          topicId: t.id,
          topicTitle: t.title
        });
      });
      if (topics.length === 0) {
        options.push({
          id: `ws-${ws.id}`,
          label: `Workspace: ${ws.title}`,
          workspaceId: ws.id,
          topicId: ws.id,
          topicTitle: ws.title
        });
      }
    });

    return options;
  }, [userRoadmaps, workspaces]);

  if (!isOpen) return null;

  const canSave = Boolean(url.trim() || text.trim() || title.trim());

  const handleAddTagSuggestion = (tag) => {
    const formattedTag = `#${tag}`;
    if (!tagsInput.includes(formattedTag)) {
      setTagsInput(prev => (prev ? `${prev.trim()} ${formattedTag}` : formattedTag));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!canSave || isSubmitting) return;

    setIsSubmitting(true);

    const finalTitle = title.trim() || generateDefaultTitle(url, text, detectedType);
    const parsedTagsArray = parseTags(tagsInput);

    const selectedTopicOption = topicOptions.find(o => o.id === selectedTopicId);

    const itemPayload = {
      url: url.trim(),
      text: text.trim(),
      title: finalTitle,
      tags: parsedTagsArray,
      type: detectedType,
      relatedTopicId: selectedTopicId || null,
      relatedTopicLabel: selectedTopicOption ? selectedTopicOption.label : null,
      relatedRoadmapId: selectedTopicOption?.roadmapId || null,
      relatedWorkspaceId: selectedTopicOption?.workspaceId || null
    };

    try {
      if (editItem && editItem.id) {
        await updateSavedItem(editItem.id, itemPayload);
      } else {
        await addSavedItem(itemPayload);
      }

      setIsSavedAnimating(true);

      setTimeout(() => {
        if (onSuccess) onSuccess('🔖 Saved to Gurthu');
        onClose();
      }, 350);
    } catch (err) {
      console.error("Save error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal / Mobile Bottom Sheet Container */}
      <div 
        className="relative bg-[#0D0D14] border border-white/10 sm:rounded-3xl rounded-t-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar z-10 shadow-2xl animate-slide-up sm:animate-scale-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#0D0D14]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isSavedAnimating ? 'bg-primary text-black scale-110' : 'bg-primary/10 border-primary/20 text-primary'
            }`}>
              <span className={`material-symbols-outlined text-[20px] transition-transform ${isSavedAnimating ? 'rotate-[360deg]' : ''}`}>
                {isSavedAnimating ? 'check' : 'push_pin'}
              </span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-lg font-bold text-white flex items-center gap-2">
                {editItem ? 'Edit Gurthu Item' : 'Add to Gurthu'}
              </h3>
              <p className="text-[11px] text-zinc-400 font-normal">
                {editItem ? 'Update your saved resource details' : 'Keep useful things here for later reference'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Auto Detect Type Badge */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-xs text-zinc-400 font-semibold">Detected Resource Type:</span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${typeMeta.color}`}>
                <span>{typeMeta.emoji}</span>
                <span>{typeMeta.label}</span>
              </span>
              
              {/* Type selector toggle */}
              <select
                value={typeOverride || detectedType}
                onChange={(e) => setTypeOverride(e.target.value)}
                className="bg-[#14141F] text-zinc-300 text-[11px] font-semibold rounded-lg px-2 py-1 border border-white/10 focus:outline-none cursor-pointer"
              >
                <option value="article">Article / Link 🔗</option>
                <option value="video">Video 🎥</option>
                <option value="github">GitHub 💻</option>
                <option value="pdf">PDF 📄</option>
                <option value="note">Note 📝</option>
                <option value="snippet">Snippet ⚡</option>
              </select>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>URL</span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional if adding text</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-zinc-500 text-[18px]">link</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a link here (YouTube, GitHub, GFG, Article...)"
                className="w-full bg-[#111118] border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3 text-zinc-500 hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] bg-white/5 flex-1" />
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider font-mono">OR</span>
            <div className="h-[1px] bg-white/5 flex-1" />
          </div>

          {/* Note / Text Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Note / Text / Code Snippet</span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Paste anything useful here (copied explanation, interview question, code snippet, notes...)"
              className="w-full bg-[#111118] border border-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl p-3.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Title (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Title</span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional — Auto-detects if empty</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Custom title or description"
              className="w-full bg-[#111118] border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all"
            />
          </div>

          {/* Tags & Preset Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Tags</span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional (e.g. #DSA #React #Interview)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="#DSA #NodeJS #SQL #Interview"
              className="w-full bg-[#111118] border border-white/10 focus:border-primary/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all"
            />

            {/* Suggested Tag Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-zinc-500 font-semibold mr-1">Quick add:</span>
              {PRESET_TAG_SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTagSuggestion(tag)}
                  className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/30 hover:text-primary text-[10px] text-zinc-400 font-medium transition-all cursor-pointer"
                >
                  +#{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Related Topic / Roadmap (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Related Learning Topic / Roadmap</span>
              <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-[#111118] border border-white/10 focus:border-primary/50 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">None (Uncategorized)</option>
              {topicOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-space-grotesk text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                canSave
                  ? 'bg-primary text-black hover:bg-primary-light shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95'
                  : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">push_pin</span>
                  <span>{editItem ? 'Update Gurthu Item' : 'Add to Gurthu'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default QuickSaveModal;
