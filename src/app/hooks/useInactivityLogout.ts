import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_THRESHOLD = 9 * 60 * 1000; // 9 minutes - when to show warning

/**
 * Hook to handle inactivity auto-logout
 * Logs out user after 10 minutes of inactivity
 * Tracks clicks, scrolling, keyboard input, and navigation
 */
export function useInactivityLogout() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Don't track inactivity on public pages (landing, auth pages)
    const publicPages = ['/', '/signin', '/signup', '/signin-otp', '/forgot-password', '/privacy-policy', '/terms-of-service'];
    if (publicPages.includes(currentPath)) {
      return;
    }

    // Reset inactivity timer
    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        // Log out user - redirect to landing page
        // Clear any session data
        sessionStorage.clear();
        localStorage.removeItem('pako_bank_dismissed');
        navigate('/');
      }, INACTIVITY_TIMEOUT);
    };

    // Activity event handlers
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Set up event listeners for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [location.pathname, navigate]);

  // Reset function that can be called manually if needed
  const resetInactivity = () => {
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      sessionStorage.clear();
      localStorage.removeItem('pako_bank_dismissed');
      navigate('/');
    }, INACTIVITY_TIMEOUT);
  };

  return { resetInactivity };
}