import { useState, memo } from 'react';
import { Rss, ExternalLink } from 'lucide-react';

function RSSWidget({ data = {} }) {
  const feedUrl = data?.feedUrl || '';
  
  // Demo RSS-Feed-Einträge (in Produktion würde hier ein echter RSS-Parser verwendet)
  const [items] = useState([
    {
      id: 1,
      title: 'Beispiel Artikel 1',
      link: 'https://example.com/article1',
      pubDate: 'Heute, 14:30'
    },
    {
      id: 2,
      title: 'Beispiel Artikel 2',
      link: 'https://example.com/article2',
      pubDate: 'Heute, 12:15'
    },
    {
      id: 3,
      title: 'Beispiel Artikel 3',
      link: 'https://example.com/article3',
      pubDate: 'Gestern, 18:45'
    }
  ]);

  if (!feedUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        <Rss className="w-12 h-12 mb-2" />
        <p className="text-sm">Kein RSS-Feed konfiguriert</p>
        <p className="text-xs mt-1">Feed-URL in den Widget-Einstellungen hinzufügen</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        <Rss className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {new URL(feedUrl).hostname}
        </span>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group"
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1 pr-2">
                {item.title}
              </h4>
              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {item.pubDate}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default memo(RSSWidget);
