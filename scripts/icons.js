// icons.js
// Mapa de ícones (Font Awesome) e utilitários para inserir por ID.
// Uso:
// - Em um card/elemento, adicione: <span class="category-icon" data-icon="coins"></span>
// - O script automaticamente substituirá esse elemento pelo <i> correspondente.
// - Também é possível usar: getIconHTML('coins') ou insertIcon(el, 'coins')

window.ICON_SET = {
  // Financeiros / loja
  "coins": {prefix: "fa-solid", cls: "fa-coins"},
  "dollar-sign": {prefix: "fa-solid", cls: "fa-dollar-sign"},
  "wallet": {prefix: "fa-solid", cls: "fa-wallet"},
  "credit-card": {prefix: "fa-solid", cls: "fa-credit-card"},
  "money-bill-wave": {prefix: "fa-solid", cls: "fa-money-bill-wave"},
  "piggy-bank": {prefix: "fa-solid", cls: "fa-piggy-bank"},
  "shopping-cart": {prefix: "fa-solid", cls: "fa-shopping-cart"},

  // Comunicação / pessoas
  "users": {prefix: "fa-solid", cls: "fa-users"},
  "user": {prefix: "fa-solid", cls: "fa-user"},
  "comments": {prefix: "fa-solid", cls: "fa-comments"},

  // Ferramentas / utilitários
  "globe": {prefix: "fa-solid", cls: "fa-globe"},
  "screwdriver-wrench": {prefix: "fa-solid", cls: "fa-screwdriver-wrench"},
  "wrench": {prefix: "fa-solid", cls: "fa-wrench"},
  "gear": {prefix: "fa-solid", cls: "fa-gear"},
  "magnifying-glass": {prefix: "fa-solid", cls: "fa-magnifying-glass"},

  // IA / Tech
  "brain": {prefix: "fa-solid", cls: "fa-brain"},
  "robot": {prefix: "fa-solid", cls: "fa-robot"},
  "cpu": {prefix: "fa-solid", cls: "fa-microchip"},
  "rocket": {prefix: "fa-solid", cls: "fa-rocket"},

  // Mídia / entretenimento
  "gamepad": {prefix: "fa-solid", cls: "fa-gamepad"},
  "music": {prefix: "fa-solid", cls: "fa-music"},
  "camera": {prefix: "fa-solid", cls: "fa-camera"},
  "film": {prefix: "fa-solid", cls: "fa-film"},

  // Tempo / utilidades do relógio
  "bolt": {prefix: "fa-solid", cls: "fa-bolt"},
  "clock": {prefix: "fa-solid", cls: "fa-clock"},
  "calendar": {prefix: "fa-solid", cls: "fa-calendar-days"},

  // Navegação / interface
  "layer-group": {prefix: "fa-solid", cls: "fa-layer-group"},
  "crosshairs": {prefix: "fa-solid", cls: "fa-crosshairs"},
  "eye": {prefix: "fa-regular", cls: "fa-eye"},
  "star": {prefix: "fa-solid", cls: "fa-star"},
  "heart": {prefix: "fa-solid", cls: "fa-heart"},
  "gift": {prefix: "fa-solid", cls: "fa-gift"},

  // Segurança / local
  "shield": {prefix: "fa-solid", cls: "fa-shield"},
  "map": {prefix: "fa-solid", cls: "fa-map"},
  "flag": {prefix: "fa-solid", cls: "fa-flag"},

  // Social / marca
  "twitter": {prefix: "fa-brands", cls: "fa-twitter"},
  "github": {prefix: "fa-brands", cls: "fa-github"},
  "facebook": {prefix: "fa-brands", cls: "fa-facebook"},

  // Misc
  "info": {prefix: "fa-solid", cls: "fa-circle-info"},
  "check": {prefix: "fa-solid", cls: "fa-check"},
  "exclamation": {prefix: "fa-solid", cls: "fa-triangle-exclamation"}
};

/** Retorna o HTML do ícone dado o id definido em ICON_SET. */
window.getIconHTML = function(id, opts) {
  opts = opts || {};
  var sizeClass = opts.size ? (' fa-' + opts.size) : '';
  var icon = window.ICON_SET[id];
  if (!icon) return '';
  return '<i class="' + icon.prefix + ' ' + icon.cls + sizeClass + '"></i>';
};

/** Insere o ícone dentro de um elemento (substitui o conteúdo). */
window.insertIcon = function(el, id, opts) {
  if (!el) return;
  var html = window.getIconHTML(id, opts);
  if (!html) return;
  el.innerHTML = html;
};

/** Ajuste automático: ao carregar o DOM, substitui elementos com data-icon pelo ícone correspondente. */
document.addEventListener('DOMContentLoaded', function() {
  var nodes = document.querySelectorAll('[data-icon]');
  nodes.forEach(function(node) {
    var id = node.getAttribute('data-icon');
    var size = node.getAttribute('data-icon-size');
    var opts = {};
    if (size) opts.size = size; // ex: 'lg', '2x'
    insertIcon(node, id, opts);
  });
});
