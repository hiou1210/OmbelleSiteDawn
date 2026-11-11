if (!customElements.get('line-properties')) {
  customElements.define(
    'line-properties',
    class LineProperties extends HTMLElement {
      connectedCallback() {
        this.textGroup = this.querySelector('[data-card-text-group]');
        this.textField = this.querySelector('textarea');
        this.addEventListener('change', (event) => {
          if (event.target.matches('[data-card-choice]')) this.toggleCardText();
        });
        this.toggleCardText();
      }

      toggleCardText() {
        if (!this.textGroup || !this.textField) return;
        const wantsCard = this.querySelector('[data-card-choice]:checked')?.value === 'Oui';
        // Un champ désactivé n'est pas envoyé avec le formulaire : sans carte, aucun texte n'est ajouté au panier.
        this.textGroup.hidden = !wantsCard;
        this.textField.disabled = !wantsCard;
      }
    }
  );
}
