import { useState, memo, useCallback, useRef } from 'react';
import { 
  ExternalLink, 
  Plus, 
  Trash2, 
  GripVertical, 
  ArrowUpDown, 
  Tag, 
  Filter,
  Check,
  X,
  Edit2,
  ChevronDown
} from 'lucide-react';
import { generateId, getFaviconUrl } from '../../utils/helpers';

const SORT_OPTIONS = [
  { value: 'manual', label: 'Manuell' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'date-asc', label: 'Älteste zuerst' },
  { value: 'date-desc', label: 'Neueste zuerst' },
  { value: 'clicks', label: 'Meist besucht' }
];

const PRESET_CATEGORIES = ['Arbeit', 'Privat', 'Social Media', 'News', 'Tools', 'Entertainment', 'Lernen'];

function BookmarkListWidget({ data = {}, onUpdate }) {
  const [bookmarks, setBookmarks] = useState(
    (data?.bookmarks || []).map(b => ({
      ...b,
      createdAt: b.createdAt || Date.now(),
      clicks: b.clicks || 0,
      tags: b.tags || [],
      category: b.category || ''
    }))
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  // Sorting & Filtering
  const [sortBy, setSortBy] = useState(data?.sortBy || 'manual');
  const [filterTag, setFilterTag] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Inline editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const editInputRef = useRef(null);
  
  // Drag & Drop
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Get all unique tags
  const allTags = [...new Set(bookmarks.flatMap(b => b.tags))].filter(Boolean);
  
  // Get all unique categories
  const allCategories = [...new Set(bookmarks.map(b => b.category))].filter(Boolean);

  // Sort bookmarks
  const getSortedBookmarks = useCallback(() => {
    let sorted = [...bookmarks];
    
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date-asc':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'date-desc':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'clicks':
        sorted.sort((a, b) => b.clicks - a.clicks);
        break;
      default:
        // manual - keep original order
        break;
    }
    
    // Apply filters
    if (filterTag) {
      sorted = sorted.filter(b => b.tags.includes(filterTag));
    }
    if (filterCategory) {
      sorted = sorted.filter(b => b.category === filterCategory);
    }
    
    return sorted;
  }, [bookmarks, sortBy, filterTag, filterCategory]);

  // Group by category
  const getGroupedBookmarks = useCallback(() => {
    const sorted = getSortedBookmarks();
    if (!filterCategory && allCategories.length > 0) {
      const grouped = {};
      const uncategorized = [];
      
      sorted.forEach(b => {
        if (b.category) {
          if (!grouped[b.category]) grouped[b.category] = [];
          grouped[b.category].push(b);
        } else {
          uncategorized.push(b);
        }
      });
      
      return { grouped, uncategorized, hasGroups: Object.keys(grouped).length > 0 };
    }
    return { grouped: {}, uncategorized: sorted, hasGroups: false };
  }, [getSortedBookmarks, filterCategory, allCategories]);

  const updateBookmarks = useCallback((updated) => {
    setBookmarks(updated);
    onUpdate({ ...data, bookmarks: updated, sortBy });
  }, [data, onUpdate, sortBy]);

  const addBookmark = () => {
    if (newUrl.trim()) {
      const newBookmark = {
        id: generateId(),
        url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
        title: newTitle.trim() || newUrl,
        icon: getFaviconUrl(newUrl),
        createdAt: Date.now(),
        clicks: 0,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
        category: newCategory
      };
      updateBookmarks([...bookmarks, newBookmark]);
      setNewUrl('');
      setNewTitle('');
      setNewTags('');
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const removeBookmark = (id) => {
    updateBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const handleClick = (id) => {
    const updated = bookmarks.map(b => 
      b.id === id ? { ...b, clicks: (b.clicks || 0) + 1 } : b
    );
    updateBookmarks(updated);
  };

  // Inline editing
  const startEditing = (bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      const updated = bookmarks.map(b => 
        b.id === editingId ? { ...b, title: editTitle.trim() } : b
      );
      updateBookmarks(updated);
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // Drag & Drop handlers
  const handleDragStart = (e, id) => {
    if (sortBy !== 'manual') return;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (sortBy !== 'manual' || draggedId === id) return;
    setDragOverId(id);
  };

  const handleDragEnd = () => {
    if (sortBy !== 'manual' || !draggedId || !dragOverId || draggedId === dragOverId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const draggedIndex = bookmarks.findIndex(b => b.id === draggedId);
    const dropIndex = bookmarks.findIndex(b => b.id === dragOverId);
    
    const newBookmarks = [...bookmarks];
    const [removed] = newBookmarks.splice(draggedIndex, 1);
    newBookmarks.splice(dropIndex, 0, removed);
    
    updateBookmarks(newBookmarks);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onUpdate({ ...data, bookmarks, sortBy: newSort });
  };

  const { grouped, uncategorized, hasGroups } = getGroupedBookmarks();

  const renderBookmarkItem = (bookmark) => (
    <div
      key={bookmark.id}
      draggable={sortBy === 'manual'}
      onDragStart={(e) => handleDragStart(e, bookmark.id)}
      onDragOver={(e) => handleDragOver(e, bookmark.id)}
      onDragEnd={handleDragEnd}
      className={`flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group transition-all ${
        draggedId === bookmark.id ? 'opacity-50' : ''
      } ${dragOverId === bookmark.id ? 'border-t-2 border-primary-500' : ''}`}
    >
      {/* Drag Handle */}
      {sortBy === 'manual' && (
        <div className="cursor-grab opacity-0 group-hover:opacity-100 text-gray-400">
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      
      {/* Favicon */}
      {bookmark.icon && (
        <img 
          src={bookmark.icon} 
          alt="" 
          className="w-5 h-5 flex-shrink-0" 
          onError={(e) => e.target.style.display = 'none'} 
        />
      )}
      
      {/* Title (editable or link) */}
      {editingId === bookmark.id ? (
        <div className="flex-1 flex items-center gap-1">
          <input
            ref={editInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-primary-500 rounded outline-none"
          />
          <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick(bookmark.id)}
          className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 truncate"
        >
          {bookmark.title}
        </a>
      )}
      
      {/* Tags (small badges) */}
      {bookmark.tags?.length > 0 && (
        <div className="hidden sm:flex gap-1">
          {bookmark.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
              {tag}
            </span>
          ))}
          {bookmark.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{bookmark.tags.length - 2}</span>
          )}
        </div>
      )}
      
      {/* Click count */}
      {bookmark.clicks > 0 && (
        <span className="text-xs text-gray-400 hidden sm:inline">{bookmark.clicks}×</span>
      )}
      
      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
      
      {/* Edit button */}
      <button
        onClick={() => startEditing(bookmark)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
      >
        <Edit2 className="w-3 h-3 text-gray-600 dark:text-gray-400" />
      </button>
      
      {/* Delete button */}
      <button
        onClick={() => removeBookmark(bookmark.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
      >
        <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
      </button>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        {/* Sort dropdown */}
        <div className="relative flex-1">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
        
        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-1 rounded ${showFilters ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {/* Category filter */}
          {allCategories.length > 0 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
            >
              <option value="">Alle Kategorien</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
          
          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
            >
              <option value="">Alle Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
          
          {(filterCategory || filterTag) && (
            <button
              onClick={() => { setFilterCategory(''); setFilterTag(''); }}
              className="text-xs px-2 py-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
            >
              Filter löschen
            </button>
          )}
        </div>
      )}

      {/* Grouped bookmarks */}
      {hasGroups && !filterCategory ? (
        <div className="space-y-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <ChevronDown className="w-3 h-3" />
                {category} ({items.length})
              </div>
              <div className="pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                {items.map(renderBookmarkItem)}
              </div>
            </div>
          ))}
          {uncategorized.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                <ChevronDown className="w-3 h-3" />
                Ohne Kategorie ({uncategorized.length})
              </div>
              <div className="pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                {uncategorized.map(renderBookmarkItem)}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flat list */
        uncategorized.map(renderBookmarkItem)
      )}

      {/* Add bookmark form */}
      {isAdding ? (
        <div className="space-y-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titel"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addBookmark()}
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (kommagetrennt)"
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">Kategorie</option>
              {PRESET_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={addBookmark}
              className="flex-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Hinzufügen
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Bookmark hinzufügen</span>
        </button>
      )}
    </div>
  );
}

export default memo(BookmarkListWidget);
