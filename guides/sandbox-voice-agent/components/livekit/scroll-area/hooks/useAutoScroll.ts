import { useEffect } from 'react';

const AUTO_SCROLL_THRESHOLD_PX = 100;

export function useAutoScroll(scrollContentContainer?: Element | null) {
  useEffect(() => {
    function scrollToBottom() {
      if (!scrollContentContainer) return;

      const distanceFromBottom =
        scrollContentContainer.scrollHeight -
        scrollContentContainer.clientHeight -
        scrollContentContainer.scrollTop;

      if (distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX) {
        scrollContentContainer.scrollTop = scrollContentContainer.scrollHeight;
      }
    }

    if (scrollContentContainer && scrollContentContainer.firstElementChild) {
      const resizeObserver = new ResizeObserver(scrollToBottom);

      resizeObserver.observe(scrollContentContainer.firstElementChild);
      scrollToBottom();

      return () => resizeObserver.disconnect();
    }
  }, [scrollContentContainer]);
}
