(() => {
  const sectionSelector = '#MainContent > .shopify-section';
  const revealClass = 'product-section-reveal';
  const visibleClass = 'is-revealed';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observedSections = new WeakSet();
  let observer;

  const reveal = (section) => {
    section.classList.add(visibleClass);
    observer?.unobserve(section);

    window.setTimeout(() => {
      section.style.willChange = 'auto';
    }, 760);
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
      if (observedSections.has(section) || section.offsetHeight === 0) return;
      if (root !== document && root !== section && !root.contains(section)) return;

      observedSections.add(section);

      // The product form is already visible on page load; reveal the story sections below it.
      if (index === 0) return;

      section.classList.add(revealClass);

      const isAlreadyVisible = section.getBoundingClientRect().top < viewportHeight * 0.88;
      if (reducedMotion.matches || Shopify.designMode || !observer || isAlreadyVisible) {
        reveal(section);
      } else {
        observer.observe(section);
      }
    });
  };

  const initialize = () => {
    createObserver();
    prepareSections();
    document.documentElement.classList.add('product-motion-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  document.addEventListener('shopify:section:load', (event) => prepareSections(event.target));

  reducedMotion.addEventListener?.('change', (event) => {
    if (!event.matches) return;
    document.querySelectorAll(`.${revealClass}`).forEach(reveal);
  });
})();
