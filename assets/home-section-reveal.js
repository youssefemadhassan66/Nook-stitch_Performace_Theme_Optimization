(() => {
  if (window.nookHomeMotionInitialized) return;
  window.nookHomeMotionInitialized = true;

  const sectionSelector = '#MainContent > .shopify-section';
  const revealClass = 'home-section-reveal';
  const visibleClass = 'is-revealed';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const preparedSections = new WeakSet();
  const pendingSections = new Set();
  let observer;
  let scrollCheckQueued = false;

  const reveal = (section) => {
    section.classList.add(visibleClass);
    pendingSections.delete(section);
    observer?.unobserve(section);

    window.setTimeout(() => {
      section.style.willChange = 'auto';
    }, 800);
  };

  const revealPassedSections = () => {
    scrollCheckQueued = false;
    const revealLine = (window.innerHeight || document.documentElement.clientHeight) * 0.9;

    pendingSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= revealLine) reveal(section);
    });
  };

  const queuePassedSectionCheck = () => {
    if (scrollCheckQueued || pendingSections.size === 0) return;
    scrollCheckQueued = true;
    window.requestAnimationFrame(revealPassedSections);
  };

  const createObserver = () => {
    if (observer || reducedMotion.matches || !('IntersectionObserver' in window)) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasSkippedAboveViewport = entry.boundingClientRect.bottom < 0;
          if (entry.isIntersecting || wasSkippedAboveViewport) reveal(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08,
      }
    );
  };

  const prepareSections = (root = document) => {
    const sections = Array.from(document.querySelectorAll(sectionSelector));
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    sections.forEach((section, index) => {
      if (preparedSections.has(section) || section.offsetHeight === 0) return;
      if (root !== document && root !== section && !root.contains(section)) return;

      preparedSections.add(section);

      // The editorial hero has its own staged load and carousel animation.
      if (index === 0) return;

      section.classList.add(revealClass);
      pendingSections.add(section);

      const isAlreadyVisible = section.getBoundingClientRect().top < viewportHeight * 0.88;
      const isThemeEditor = Boolean(window.Shopify?.designMode);

      if (reducedMotion.matches || isThemeEditor || !observer || isAlreadyVisible) {
        reveal(section);
      } else {
        observer.observe(section);
      }
    });
  };

  const initialize = () => {
    createObserver();
    prepareSections();
    document.documentElement.classList.add('home-motion-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  document.addEventListener('shopify:section:load', (event) => prepareSections(event.target));
  window.addEventListener('scroll', queuePassedSectionCheck, { passive: true });

  reducedMotion.addEventListener?.('change', (event) => {
    if (!event.matches) return;
    document.querySelectorAll(`.${revealClass}`).forEach(reveal);
  });
})();
