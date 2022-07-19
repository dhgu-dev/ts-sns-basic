import { useState, useEffect, useCallback, useRef, RefObject } from 'react';

const useInfiniteScroll = (targetEl: RefObject<HTMLElement>) => {
  const observerRef = useRef<IntersectionObserver>();
  const [intersecting, setIntersecting] = useState<boolean>(false);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) =>
          setIntersecting(entries.some((entry) => entry.isIntersecting)),
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (targetEl.current) getObserver().observe(targetEl.current);

    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
