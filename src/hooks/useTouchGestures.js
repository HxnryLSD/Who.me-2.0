import { useState, useCallback, useRef, useEffect } from 'react';

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

export function useTouchGestures({ 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown,
  onPinch,
  enabled = true 
}) {
  const [gesture, setGesture] = useState(null);
  
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const initialDistance = useRef(0);

  const getDistance = (touches) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return;
    
    if (e.touches.length === 2) {
      // Pinch gesture start
      initialDistance.current = getDistance(e.touches);
      setGesture('pinch');
    } else if (e.touches.length === 1) {
      // Swipe gesture start
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      startTime.current = Date.now();
      setGesture('swipe');
    }
  }, [enabled]);

  const handleTouchMove = useCallback((e) => {
    if (!enabled || !gesture) return;
    
    if (gesture === 'pinch' && e.touches.length === 2) {
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance.current;
      onPinch?.(scale);
    }
  }, [enabled, gesture, onPinch]);

  const handleTouchEnd = useCallback((e) => {
    if (!enabled || gesture !== 'swipe') {
      setGesture(null);
      return;
    }
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;
    const deltaTime = endTime - startTime.current;
    
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Determine swipe direction
    if (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD) {
      if (absX > absY) {
        // Horizontal swipe
        if (velocityX > SWIPE_VELOCITY_THRESHOLD) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (velocityY > SWIPE_VELOCITY_THRESHOLD) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
    }
    
    setGesture(null);
    startX.current = 0;
    startY.current = 0;
    startTime.current = 0;
  }, [enabled, gesture, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const bind = useCallback(() => ({
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { bind, gesture };
}

// Hook for swipe navigation between tabs
export function useSwipeNavigation(tabs, activeTabId, onTabChange) {
  const currentIndex = tabs.findIndex(t => t.id === activeTabId);
  
  const goToPrevTab = useCallback(() => {
    if (currentIndex > 0) {
      onTabChange(tabs[currentIndex - 1].id);
    }
  }, [currentIndex, tabs, onTabChange]);
  
  const goToNextTab = useCallback(() => {
    if (currentIndex < tabs.length - 1) {
      onTabChange(tabs[currentIndex + 1].id);
    }
  }, [currentIndex, tabs, onTabChange]);
  
  const { bind } = useTouchGestures({
    onSwipeLeft: goToNextTab,
    onSwipeRight: goToPrevTab,
    enabled: true
  });
  
  return { bind, currentIndex, canGoPrev: currentIndex > 0, canGoNext: currentIndex < tabs.length - 1 };
}

export default useTouchGestures;
