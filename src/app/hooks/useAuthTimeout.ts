import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

const AUTH_TIMEOUT_KEY = 'pako_auth_timer_start';
const AUTH_TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Hook to handle authentication page timeout
 * Redirects to landing page after 5 minutes of staying on auth pages
 * Timer resets when switching between login/signup
 * Timer pauses when viewing privacy policy or terms of service
 */
export function useAuthTimeout() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartRef = useRef<number | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const isAuthPage = currentPath === '/signin' || currentPath === '/signup' || currentPath === '/signin-otp' || currentPath === '/forgot-password';
    const isLegalPage = currentPath === '/privacy-policy' || currentPath === '/terms-of-service';

    // If we're on a legal page, pause the timer (don't clear the start time)
    if (isLegalPage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // If we're on an auth page
    if (isAuthPage) {
      // Check if we have an existing timer start time
      const savedStartTime = sessionStorage.getItem(AUTH_TIMEOUT_KEY);
      
      if (savedStartTime) {
        // We're returning from a legal page or navigating between auth pages
        const startTime = parseInt(savedStartTime, 10);
        const elapsed = Date.now() - startTime;
        const remaining = AUTH_TIMEOUT_DURATION - elapsed;

        if (remaining <= 0) {
          // Timer already expired
          sessionStorage.removeItem(AUTH_TIMEOUT_KEY);
          navigate('/');
          return;
        }

        // Resume timer with remaining time
        timeoutRef.current = setTimeout(() => {
          sessionStorage.removeItem(AUTH_TIMEOUT_KEY);
          navigate('/');
        }, remaining);
      } else {
        // Start a new timer
        const startTime = Date.now();
        timerStartRef.current = startTime;
        sessionStorage.setItem(AUTH_TIMEOUT_KEY, startTime.toString());

        timeoutRef.current = setTimeout(() => {
          sessionStorage.removeItem(AUTH_TIMEOUT_KEY);
          navigate('/');
        }, AUTH_TIMEOUT_DURATION);
      }
    } else {
      // Not on auth or legal page, clean up
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sessionStorage.removeItem(AUTH_TIMEOUT_KEY);
    }

    // Cleanup on unmount or path change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [location.pathname, navigate]);

  // Reset timer function (for switching between login/signup)
  const resetTimer = () => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Start new timer
    const startTime = Date.now();
    timerStartRef.current = startTime;
    sessionStorage.setItem(AUTH_TIMEOUT_KEY, startTime.toString());

    timeoutRef.current = setTimeout(() => {
      sessionStorage.removeItem(AUTH_TIMEOUT_KEY);
      navigate('/');
    }, AUTH_TIMEOUT_DURATION);
  };

  return { resetTimer };
}