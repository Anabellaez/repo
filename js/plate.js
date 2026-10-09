/* Dibuja el plato en SVG: un sector por grupo, subdividido en partes iguales por alimento. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var C = 160;      // centro
  var R = 132;      // radio de la comida
  var RIM = 154;    // radio del borde del plato

  function punto(r, ang) {
    var a = (ang - 90) * Math.PI / 180;
    return [C + r * Math.cos(a), C + r * Math.sin(a)];
  }

  function sector(a0, a1) {
    if (a1 - a0 >= 359.99) {
      return 'M' + (C - R) + ' ' + C + 'a' + R + ' ' + R + ' 0 1 0 ' + (2 * R) + ' 0a' + R + ' ' + R + ' 0 1 0 ' + (-2 * R) + ' 0Z';
    }
    var p0 = punto(R, a0), p1 = punto(R, a1);
    var grande = a1 - a0 > 180 ? 1 : 0;
    return 'M' + C + ' ' + C + 'L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) +
      'A' + R + ' ' + R + ' 0 ' + grande + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + 'Z';
  }

  function el(nombre, attrs, texto) {
    var n = document.createElementNS(NS, nombre);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (texto != null) n.textContent = texto;
    return n;
  }

  /* svg: <svg>; prop: {V:50,...}; sel: {V:[{nombre}], ...}; grupos: DATA.grupos */
  window.dibujarPlato = function (svg, prop, sel, grupos) {
    svg.setAttribute('viewBox', '0 0 320 320');
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    svg.appendChild(el('circle', { cx: C, cy: C, r: RIM, class: 'plato-borde' }));
    svg.appendChild(el('circle', { cx: C, cy: C, r: R + 4, class: 'plato-fondo' }));

    var ang = 0;
    var etiquetas = [];
    var partesLabel = [];
    Object.keys(prop).forEach(function (g) {
      var pct = prop[g];
      var span = pct * 3.6;
      var items = sel[g] || [];
      var n = Math.max(items.length, 1);
      for (var i = 0; i < n; i++) {
        var a0 = ang + span * i / n, a1 = ang + span * (i + 1) / n;
        var path = el('path', {
          d: sector(a0, a1),
          class: 'sector' + (items.length ? '' : ' vacio'),
          style: 'fill: var(--c-' + g + '); fill-opacity: ' + (items.length ? (1 - (i % 2) * 0.22) : 0.18)
        });
        if (items[i]) path.appendChild(el('title', {}, grupos[g].nombre + ': ' + items[i].nombre));
        svg.appendChild(path);
      }
      var medio = punto(span >= 359.99 ? 0 : R * 0.58, ang + span / 2);
      etiquetas.push({ x: medio[0], y: medio[1], g: g, pct: pct });
      partesLabel.push(grupos[g].nombre + ' ' + pct + ' %' + (items.length ? ' (' + items.map(function (a) { return a.nombre; }).join(', ') + ')' : ' (vacío)'));
      ang += span;
    });

    etiquetas.forEach(function (e) {
      var t = el('text', { x: e.x.toFixed(1), y: (e.y - 4).toFixed(1), class: 'sector-label' }, grupos[e.g].nombre);
      svg.appendChild(t);
      svg.appendChild(el('text', { x: e.x.toFixed(1), y: (e.y + 13).toFixed(1), class: 'sector-pct' }, e.pct + ' %'));
    });

    svg.setAttribute('aria-label', 'Plato: ' + partesLabel.join('; '));
  };
})();
