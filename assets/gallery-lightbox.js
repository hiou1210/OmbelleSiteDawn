/**
 * Visionneuse d'images (lightbox) basée sur l'élément natif <dialog>.
 * Utilisation : <gallery-lightbox> contenant des boutons [data-lightbox-src]
 * et un <dialog data-lightbox-dialog>.
 */
if (!customElements.get('gallery-lightbox')) {
  customElements.define(
    'gallery-lightbox',
    class GalleryLightbox extends HTMLElement {
      connectedCallback() {
        this.dialog = this.querySelector('[data-lightbox-dialog]');
        if (!this.dialog) return;

        this.image = this.dialog.querySelector('[data-lightbox-image]');
        this.counter = this.dialog.querySelector('[data-lightbox-counter]');
        this.triggers = Array.from(this.querySelectorAll('[data-lightbox-src]'));
        this.current = 0;

        this.triggers.forEach((trigger, index) => {
          trigger.addEventListener('click', () => this.open(index));
        });

        this.dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => this.dialog.close());
        this.dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => this.show(this.current - 1));
        this.dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => this.show(this.current + 1));

        // Un clic sur le fond (hors image et boutons) ferme la visionneuse.
        this.dialog.addEventListener('click', (event) => {
          if (event.target === this.dialog) this.dialog.close();
        });

        this.dialog.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowLeft') this.show(this.current - 1);
          if (event.key === 'ArrowRight') this.show(this.current + 1);
        });

        this.dialog.addEventListener('close', () => {
          document.body.classList.remove('overflow-hidden');
          const trigger = this.triggers[this.current];
          if (trigger) trigger.focus();
        });
      }

      open(index) {
        this.show(index);
        document.body.classList.add('overflow-hidden');
        this.dialog.showModal();
      }

      show(index) {
        const total = this.triggers.length;
        if (total === 0) return;
        this.current = (index + total) % total;

        const trigger = this.triggers[this.current];
        this.image.src = trigger.dataset.lightboxSrc;
        this.image.alt = trigger.dataset.lightboxAlt || '';
        if (this.counter) this.counter.textContent = `${this.current + 1} / ${total}`;
      }
    }
  );
}
