'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

interface UseInViewReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  inView: boolean;
}

/**
 * Hook to detect if an element is visible in the viewport using IntersectionObserver.
 * Accepts individual primitive params to avoid object-reference dependency issues.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  threshold = 0.1,
  triggerOnce = true,
): UseInViewReturn<T> {
  const [inView, setInView] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  return { ref, inView };
}
