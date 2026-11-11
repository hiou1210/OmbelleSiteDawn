class BackToTop extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('button');
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.button.addEventListener('click', () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    this.onScroll();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    this.classList.toggle('is-visible', window.scrollY > window.innerHeight);
  }
}

if (!customElements.get('back-to-top')) {
  customElements.define('back-to-top', BackToTop);
}
