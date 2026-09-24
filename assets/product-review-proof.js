if (!customElements.get('review-wall')) {
  class ReviewWall extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;

      this.cards = Array.from(this.querySelectorAll('[data-review-card]'));
      this.grid = this.querySelector('[data-review-grid]');
      this.button = this.querySelector('[data-review-load-more]');
      this.status = this.querySelector('[data-review-status]');
      this.initialCount = Number.parseInt(this.dataset.initialReviews, 10) || 8;
      this.loadCount = Number.parseInt(this.dataset.loadCount, 10) || 4;
      this.handleResize = this.scheduleMasonry.bind(this);
      this.handleReviewLink = this.scrollToReviews.bind(this);
      this.reviewLinks = Array.from(document.querySelectorAll('a.review-link[href="#ProductReviews"]'));
      this.reviewLinks.forEach((link) => link.addEventListener('click', this.handleReviewLink));

      if (!this.grid || this.cards.length === 0) return;

      this.addEventListener('shopify:block:select', (event) => {
        const selectedCard = event.target instanceof Element
          ? event.target.closest('[data-review-card]')
          : null;
        if (!selectedCard || !selectedCard.hidden) return;

        selectedCard.hidden = false;
        this.updateButton();
        this.buildMasonry(true);
      });

      if (this.button && this.cards.length > this.initialCount) {
        this.classList.add('is-enhanced');
        this.cards.slice(this.initialCount).forEach((card) => {
          card.hidden = true;
        });
        this.button.hidden = false;
        this.button.addEventListener('click', this.showMore.bind(this));
      }

      this.buildMasonry(true);
      window.addEventListener('resize', this.handleResize, { passive: true });
    }

    disconnectedCallback() {
      this.reviewLinks?.forEach((link) => link.removeEventListener('click', this.handleReviewLink));
      window.removeEventListener('resize', this.handleResize);
      window.cancelAnimationFrame(this.resizeFrame);
    }

    scrollToReviews(event) {
      event.preventDefault();
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

      this.scrollIntoView({ behavior, block: 'start' });

      if (window.location.hash !== '#ProductReviews') {
        window.history.pushState(null, '', '#ProductReviews');
      }
    }

    getColumnCount() {
      if (window.matchMedia('(max-width: 560px)').matches) return 1;
      if (window.matchMedia('(max-width: 820px)').matches) return 2;
      if (window.matchMedia('(max-width: 1100px)').matches) return 3;
      return 4;
    }

    scheduleMasonry() {
      window.cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = window.requestAnimationFrame(() => this.buildMasonry());
    }

    buildMasonry(force = false) {
      const columnCount = this.getColumnCount();
      if (!force && columnCount === this.columnCount) return;

      this.columnCount = columnCount;
      const fragment = document.createDocumentFragment();
      const columns = Array.from({ length: columnCount }, () => {
        const column = document.createElement('div');
        column.className = 'nook-review-wall__column';
        column.setAttribute('role', 'presentation');
        fragment.append(column);
        return column;
      });

      this.grid.replaceChildren(fragment);
      this.grid.style.setProperty('--review-columns', columnCount);

      this.cards.forEach((card, index) => {
        if (card.hidden) {
          columns[index % columnCount].append(card);
          return;
        }

        const shortestColumn = columns.reduce((shortest, column) =>
          column.offsetHeight < shortest.offsetHeight ? column : shortest
        );
        shortestColumn.append(card);
      });
    }

    showMore() {
      const hiddenCards = this.cards.filter((card) => card.hidden);
      const nextCards = hiddenCards.slice(0, this.loadCount);

      nextCards.forEach((card) => {
        card.hidden = false;
      });

      const remaining = hiddenCards.length - nextCards.length;
      if (this.status) {
        this.status.textContent = `${nextCards.length} more reviews shown. ${remaining} remaining.`;
      }

      this.updateButton();
      this.buildMasonry(true);
    }

    updateButton() {
      if (!this.button) return;
      this.button.hidden = !this.cards.some((card) => card.hidden);
    }
  }

  customElements.define('review-wall', ReviewWall);
}
