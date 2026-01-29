import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function MobileScrollHint() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('mobile-scroll-hint-dismissed') === 'true';
  });
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('mobile-scroll-hint-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed || !isMobile) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-bounce">
      <div className="bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Swipe zum Scrollen</span>
        <ChevronRight className="w-5 h-5" />
        <button
          onClick={handleDismiss}
          className="ml-2 text-white/80 hover:text-white"
          aria-label="Hinweis schließen"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default MobileScrollHint;
