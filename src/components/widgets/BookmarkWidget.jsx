import { memo, useState, useEffect } from 'react';
import { ExternalLink, QrCode, Image as ImageIcon, RefreshCw, CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { validateUrl, updateFavicon, getScreenshotUrl } from '../../services/linkPreview';

function BookmarkWidget({ data = {} }) {
  const { url, title, icon } = data || {};
  const [showQR, setShowQR] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [currentIcon, setCurrentIcon] = useState(icon);
  const [metadata, setMetadata] = useState({
    description: '',
    siteName: ''
  });

  // Auto-update favicon on mount
  useEffect(() => {
    if (url) {
      updateFavicon(url).then(result => {
        if (result.success && result.favicon) {
          setCurrentIcon(result.favicon);
        }
      });
    }
  }, [url]);

  // Validate link on mount
  useEffect(() => {
    if (url) {
      validateUrl(url).then(result => {
        setValidation(result);
      });
    }
  }, [url]);

  // Extract basic metadata from URL
  useEffect(() => {
    if (url) {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        setMetadata({
          siteName: urlObj.hostname,
          description: `Gespeichert von ${urlObj.hostname}`
        });
      } catch (e) {
        // Invalid URL
      }
    }
  }, [url]);

  const handleValidateLink = async () => {
    setIsValidating(true);
    const result = await validateUrl(url);
    setValidation(result);
    setIsValidating(false);
  };

  const handleRefreshFavicon = async () => {
    const result = await updateFavicon(url);
    if (result.success && result.favicon) {
      setCurrentIcon(result.favicon);
    }
  };

  const screenshotUrl = getScreenshotUrl(url, { width: 400, height: 300 });

  return (
    <div className="space-y-3">
      {/* Main Bookmark Link */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
      >
        {currentIcon ? (
          <img 
            src={currentIcon} 
            alt="" 
            className="w-10 h-10 rounded" 
            onError={(e) => {
              e.target.style.display = 'none';
              setCurrentIcon(null);
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {metadata.siteName}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      {/* Validation Status */}
      {validation && (
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs ${
          validation.isValid 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {validation.isValid ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>{validation.isValid ? 'Link erreichbar' : 'Link ungültig'}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="QR-Code anzeigen"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR-Code</span>
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Vorschau anzeigen"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Vorschau</span>
        </button>

        <button
          onClick={handleValidateLink}
          disabled={isValidating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
          title="Link validieren"
        >
          <LinkIcon className={`w-3.5 h-3.5 ${isValidating ? 'animate-pulse' : ''}`} />
          <span>Prüfen</span>
        </button>

        <button
          onClick={handleRefreshFavicon}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Favicon aktualisieren"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Icon</span>
        </button>
      </div>

      {/* QR Code Display */}
      {showQR && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center space-y-2">
          <QRCodeSVG 
            value={url} 
            size={150}
            level="H"
            includeMargin={true}
            className="rounded"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Scannen zum Öffnen
          </p>
        </div>
      )}

      {/* Screenshot Preview */}
      {showPreview && screenshotUrl && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img 
            src={screenshotUrl} 
            alt={`Vorschau von ${title}`}
            className="w-full h-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">Vorschau konnte nicht geladen werden</div>';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-xs font-medium truncate">{title}</p>
            <p className="text-white/80 text-xs truncate">{metadata.siteName}</p>
          </div>
        </div>
      )}

      {/* Open Graph Metadata */}
      {metadata.description && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {metadata.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(BookmarkWidget);
