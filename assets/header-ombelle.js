/*
 * Comportement du menu « Ombelle (pleine largeur) ».
 *
 * L'ouverture au survol est faite en CSS. Ce script ajoute :
 * - l'ouverture / fermeture avec la flèche (clavier et écrans tactiles),
 * - l'état aria-expanded des flèches,
 * - le retournement d'un sous-menu qui dépasserait du bord de l'écran,
 * - la fermeture avec Échap, un clic à l'extérieur ou le défilement.
 *
 * Les écouteurs sont posés une seule fois sur le document, ce qui reste valable
 * quand l'éditeur de thème recharge la section.
 */
(function () {
  if (window.ombelleMenuReady) return;
  window.ombelleMenuReady = true;

  const MENU = '.ombelle-menu';
  const ITEM = '.ombelle-menu__item';
  const PARENT = '.ombelle-menu__item--parent';
  const TOGGLE = '.ombelle-menu__toggle';
  const OPEN = 'is-open';
  const FLIP = 'ombelle-menu__submenu--flip';
  const EDGE_MARGIN = 8;

  function toggleOf(item) {
    return item.querySelector(':scope > .ombelle-menu__row > ' + TOGGLE);
  }

  function setExpanded(item, expanded) {
    const toggle = toggleOf(item);
    if (toggle) toggle.setAttribute('aria-expanded', String(expanded));
  }

  function close(item) {
    item.classList.remove(OPEN);
    setExpanded(item, false);
    item.querySelectorAll('.' + OPEN).forEach((child) => {
      child.classList.remove(OPEN);
      setExpanded(child, false);
    });
  }

  // Ferme tous les éléments ouverts, sauf `keep` et ses parents.
  function closeAll(root, keep) {
    root.querySelectorAll('.' + OPEN).forEach((item) => {
      if (keep && item.contains(keep)) return;
      close(item);
    });
  }

  function fit(item) {
    const submenu = item.querySelector(':scope > .ombelle-menu__submenu');
    if (!submenu) return;
    submenu.classList.remove(FLIP);
    if (submenu.getBoundingClientRect().right > window.innerWidth - EDGE_MARGIN) submenu.classList.add(FLIP);
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest(TOGGLE);
    document.querySelectorAll(MENU).forEach((menu) => {
      if (!toggle || !menu.contains(toggle)) closeAll(menu);
    });
    if (!toggle) return;

    const item = toggle.closest(ITEM);
    const menu = toggle.closest(MENU);
    const willOpen = !item.classList.contains(OPEN);
    closeAll(menu, item);
    if (willOpen) {
      fit(item);
      item.classList.add(OPEN);
      setExpanded(item, true);
    } else {
      close(item);
    }
  });

  // Survol à la souris : retourne le sous-menu si besoin et tient aria-expanded à jour.
  document.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return;
    const item = event.target.closest(PARENT);
    if (!item || !item.closest(MENU)) return;
    fit(item);
    setExpanded(item, true);
  });

  document.addEventListener('pointerout', (event) => {
    if (event.pointerType !== 'mouse') return;
    const item = event.target.closest(PARENT);
    if (!item || !item.closest(MENU)) return;
    if (item.contains(event.relatedTarget) || item.classList.contains(OPEN)) return;
    setExpanded(item, false);
  });

  document.addEventListener('focusin', (event) => {
    const item = event.target.closest(PARENT);
    if (item && item.closest(MENU)) fit(item);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const active = document.activeElement;
    const focusedItem = active ? active.closest(PARENT) : null;
    const toggle = focusedItem ? toggleOf(focusedItem) : null;
    document.querySelectorAll(MENU).forEach((menu) => closeAll(menu));
    if (toggle) toggle.focus();
  });

  window.addEventListener(
    'scroll',
    () => document.querySelectorAll(MENU).forEach((menu) => closeAll(menu)),
    { passive: true }
  );
})();
