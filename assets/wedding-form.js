/**
 * Validation du formulaire de mariage : au moins une case doit être cochée
 * dans le groupe [data-requires-one] ("Vos besoins").
 */
(function () {
  function updateValidity(group) {
    const boxes = Array.from(group.querySelectorAll('input[type="checkbox"]'));
    if (boxes.length === 0) return;
    const anyChecked = boxes.some((box) => box.checked);
    boxes[0].setCustomValidity(anyChecked ? '' : group.dataset.requiredMessage || 'Veuillez cocher au moins un besoin.');
  }

  function init() {
    document.querySelectorAll('[data-requires-one]').forEach((group) => {
      updateValidity(group);
      group.addEventListener('change', () => updateValidity(group));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
})();
