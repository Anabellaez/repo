/* Estado, selección, plato al azar, plan del día y copiar texto. */
(function () {
  var D = window.DATA;
  var CLAVE = 'armatuplato:v1';
  var $ = function (id) { return document.getElementById(id); };

  // Índice de alimentos: "G:id" -> { g, alimento }
  var INDICE = {};
  D.orden.forEach(function (g) {
    D.grupos[g].alimentos.forEach(function (a) { INDICE[g + ':' + a.id] = { g: g, a: a }; });
  });
  var COMIDA = {};
  D.comidas.forEach(function (c) { COMIDA[c.id] = c; });

  function diaVacio() {
    var dia = {};
    D.comidas.forEach(function (c) { dia[c.id] = { sel: [], grasa: false }; });
    return dia;
  }

  var state = { comida: 'almuerzo', dia: diaVacio(), frutasExtra: 0 };

  function cargar() {
    try {
      var s = JSON.parse(localStorage.getItem(CLAVE));
      if (!s) return;
      if (COMIDA[s.comida]) state.comida = s.comida;
      if (s.dia) D.comidas.forEach(function (c) {
        var m = s.dia[c.id];
        if (!m) return;
        state.dia[c.id] = {
          sel: (m.sel || []).filter(function (k) { return INDICE[k] && COMIDA[c.id].plato[INDICE[k].g] != null; }),
          grasa: !!m.grasa
        };
      });
      state.frutasExtra = Math.max(0, Math.min(9, +s.frutasExtra || 0));
    } catch (e) { /* sin storage: arranca vacío */ }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(state)); } catch (e) { /* ignorar */ }
  }

  /* ---------- Cálculos ---------- */

  function selPorGrupo(comidaId) {
    var out = {};
    state.dia[comidaId].sel.forEach(function (k) {
      var x = INDICE[k];
      (out[x.g] = out[x.g] || []).push(x.a);
    });
    return out;
  }

  function proporciones(comidaId) {
    var c = COMIDA[comidaId];
    if (c.grasaOpcional && !(selPorGrupo(comidaId).G || []).length) return c.sinGrasa;
    return c.plato;
  }

  // Porciones que aporta una comida: 1 por grupo presente + grasa aparte si se marcó.
  function porcionesComida(comidaId) {
    var c = COMIDA[comidaId], sel = selPorGrupo(comidaId), p = {};
    Object.keys(c.plato).forEach(function (g) { if ((sel[g] || []).length) p[g] = 1; });
    if (c.grasaAparte && state.dia[comidaId].grasa) p.G = (p.G || 0) + 1;
    return p;
  }

  function totalesDia() {
    var t = { V: 0, F: 0, L: 0, A: 0, P: 0, G: 0 };
    var verduras = {};
    D.comidas.forEach(function (c) {
      var p = porcionesComida(c.id);
      Object.keys(p).forEach(function (g) { if (g !== 'V') t[g] += p[g]; });
      (selPorGrupo(c.id).V || []).forEach(function (a) { verduras[a.id] = true; });
    });
    t.F += state.frutasExtra;
    t.V = Object.keys(verduras).length;
    return t;
  }

  function objetivoTexto(g) {
    var o = D.objetivo[g];
    if (o.variedades) return o.min + ' variedades';
    if (o.max == null) return 'mín. ' + o.min;
    return o.min === o.max ? String(o.min) : o.min + '–' + o.max;
  }

  function estadoGrupo(g, n) {
    var o = D.objetivo[g];
    if (n < o.min) return { clase: 'falta', texto: 'Falta' + (o.min - n > 1 ? 'n ' : ' ') + (o.min - n) };
    if (o.max != null && n > o.max) return { clase: 'pasa', texto: 'Te pasaste ' + (n - o.max) };
    return { clase: 'ok', texto: 'Listo' };
  }

  /* ---------- Render ---------- */

  function boton(texto, clase) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.textContent = texto;
    return b;
  }

  function renderComidas() {
    var cont = $('comidas');
    cont.innerHTML = '';
    D.comidas.forEach(function (c) {
      var b = boton(c.nombre, 'comida');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(c.id === state.comida));
      b.tabIndex = c.id === state.comida ? 0 : -1;
      b.dataset.id = c.id;
      b.addEventListener('click', function () { elegirComida(c.id); });
      b.addEventListener('keydown', function (e) {
        var i = D.comidas.indexOf(c), d = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') d = 1;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') d = -1;
        if (!d) return;
        e.preventDefault();
        var sig = D.comidas[(i + d + D.comidas.length) % D.comidas.length].id;
        elegirComida(sig);
        cont.querySelector('[data-id="' + sig + '"]').focus();
      });
      cont.appendChild(b);
    });
    $('tip').textContent = COMIDA[state.comida].tip;
  }

  function renderPlato() {
    var c = COMIDA[state.comida], prop = proporciones(c.id), sel = selPorGrupo(c.id);
    $('titulo-plato').textContent = c.nombre;
    $('formula').textContent = Object.keys(prop).map(function (g) {
      return D.grupos[g].nombre + ' ' + prop[g] + ' %';
    }).join(' · ');
    window.dibujarPlato($('plato'), prop, sel, D.grupos);

    var faltan = Object.keys(c.plato).filter(function (g) {
      return !(c.grasaOpcional && g === 'G') && !(sel[g] || []).length;
    });
    $('estado').innerHTML = '';
    var badge = document.createElement('span');
    badge.className = 'badge ' + (faltan.length ? 'falta' : 'ok');
    badge.textContent = faltan.length ? 'Falta: ' + faltan.map(function (g) { return D.grupos[g].nombre.toLowerCase(); }).join(', ') : 'Plato completo';
    $('estado').appendChild(badge);

    var cond = $('condimento');
    cond.innerHTML = '';
    if (c.grasaAparte) {
      var on = state.dia[c.id].grasa;
      var b = boton(on ? 'Grasa aparte: sumada' : 'Sumar grasa aparte', 'btn toggle');
      b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', function () {
        state.dia[c.id].grasa = !state.dia[c.id].grasa;
        render();
      });
      var p = document.createElement('span');
      p.textContent = D.grasaAparte + ' (cuenta 1 porción de grasa).';
      cond.appendChild(b);
      cond.appendChild(p);
    }

    var ul = $('detalle');
    ul.innerHTML = '';
    Object.keys(prop).forEach(function (g) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="dot" style="background:var(--c-' + g + ')"></span>';
      var t = document.createElement('span');
      t.textContent = D.grupos[g].nombre + ' ' + prop[g] + ' %: ' +
        ((sel[g] || []).map(function (a) { return a.nombre; }).join(', ') || '—');
      li.appendChild(t);
      ul.appendChild(li);
    });
  }

  function renderGrupos() {
    var c = COMIDA[state.comida], cont = $('grupos');
    cont.innerHTML = '';
    D.orden.forEach(function (g) {
      if (c.plato[g] == null) return;
      var grupo = D.grupos[g];
      var fs = document.createElement('fieldset');
      fs.className = 'grupo';
      fs.style.setProperty('--c', 'var(--c-' + g + ')');
      var lg = document.createElement('legend');
      lg.textContent = grupo.nombre + (c.grasaOpcional && g === 'G' ? ' (opcional)' : '');
      fs.appendChild(lg);
      if (grupo.nota) {
        var n = document.createElement('p');
        n.className = 'grupo-nota';
        n.textContent = grupo.nota;
        fs.appendChild(n);
      }
      var chips = document.createElement('div');
      chips.className = 'chips';
      grupo.alimentos.forEach(function (a) {
        var k = g + ':' + a.id, on = state.dia[c.id].sel.indexOf(k) >= 0;
        var b = boton(a.nombre, 'chip');
        b.setAttribute('aria-pressed', String(on));
        b.addEventListener('click', function () { alternar(k); });
        chips.appendChild(b);
      });
      fs.appendChild(chips);
      cont.appendChild(fs);
    });
  }

  function renderDia() {
    var ol = $('dia-comidas');
    ol.innerHTML = '';
    D.comidas.forEach(function (c) {
      var li = document.createElement('li');
      li.className = 'dia-item' + (c.id === state.comida ? ' actual' : '');
      var b = boton(c.nombre, 'dia-nombre');
      b.setAttribute('aria-label', 'Editar ' + c.nombre.toLowerCase());
      if (c.id === state.comida) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', function () {
        elegirComida(c.id);
        $('comidas').querySelector('[data-id="' + c.id + '"]').focus();
      });
      li.appendChild(b);

      var nombres = state.dia[c.id].sel.map(function (k) { return INDICE[k].a.nombre; });
      if (state.dia[c.id].grasa) nombres.push('grasa aparte');
      var s = document.createElement('span');
      s.className = 'dia-sel' + (nombres.length ? '' : ' vacio');
      s.textContent = nombres.length ? nombres.join(', ') : 'Sin armar';
      li.appendChild(s);

      var p = porcionesComida(c.id);
      var pills = document.createElement('span');
      pills.className = 'pills';
      D.orden.forEach(function (g) {
        if (!p[g] || g === 'V') return;
        var x = document.createElement('span');
        x.className = 'pill';
        x.style.setProperty('--c', 'var(--c-' + g + ')');
        x.textContent = D.grupos[g].nombre + (p[g] > 1 ? ' ×' + p[g] : '');
        pills.appendChild(x);
      });
      li.appendChild(pills);
      ol.appendChild(li);
    });

    $('fruta-extra').textContent = state.frutasExtra;
    $('fruta-menos').disabled = state.frutasExtra <= 0;
    $('fruta-mas').disabled = state.frutasExtra >= 9;

    var t = totalesDia(), tb = $('totales');
    tb.innerHTML = '';
    ['A', 'F', 'V', 'L', 'P', 'G'].forEach(function (g) {
      var e = estadoGrupo(g, t[g]);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<th scope="row"><span class="dot" style="background:var(--c-' + g + ')"></span>' + D.grupos[g].nombre + '</th>' +
        '<td class="num">' + t[g] + '</td>' +
        '<td>' + objetivoTexto(g) + '</td>' +
        '<td><span class="badge ' + e.clase + '">' + e.texto + '</span></td>';
      tb.appendChild(tr);
    });
  }

  function render() {
    renderComidas();
    renderPlato();
    renderGrupos();
    renderDia();
    guardar();
  }

  /* ---------- Acciones ---------- */

  function elegirComida(id) {
    state.comida = id;
    $('copia-txt').hidden = true;
    render();
  }

  function alternar(k) {
    var sel = state.dia[state.comida].sel, i = sel.indexOf(k);
    if (i >= 0) sel.splice(i, 1); else sel.push(k);
    // Mantener el foco en el mismo chip tras re-renderizar.
    var idx = Array.prototype.indexOf.call(document.querySelectorAll('#grupos .chip'), document.activeElement);
    render();
    if (idx >= 0) document.querySelectorAll('#grupos .chip')[idx].focus();
  }

  function alAzar(lista, n) {
    var copia = lista.slice(), out = [];
    while (out.length < n && copia.length) out.push(copia.splice(Math.floor(Math.random() * copia.length), 1)[0]);
    return out;
  }

  function armarAlAzar() {
    var c = COMIDA[state.comida], sel = [];
    Object.keys(c.plato).forEach(function (g) {
      if (c.grasaOpcional && g === 'G') return; // la grasa opcional la suma ella si quiere
      var lista = D.grupos[g].alimentos.filter(function (a) { return !a.azar || a.azar.indexOf(c.id) >= 0; });
      if (g === 'F' && c.id === 'desayuno') lista = lista.filter(function (a) { return a.vitC; });
      if (g === 'F' && c.id === 'merienda') lista = lista.filter(function (a) { return a.triptofano; });
      var n = g === 'V' ? 2 + Math.floor(Math.random() * 2) : 1;
      alAzar(lista, n).forEach(function (a) { sel.push(g + ':' + a.id); });
    });
    state.dia[c.id].sel = sel;
    if (c.grasaAparte) state.dia[c.id].grasa = true;
    render();
  }

  function textoComida(id) {
    var prop = proporciones(id), sel = selPorGrupo(id), c = COMIDA[id];
    var lineas = [c.nombre];
    Object.keys(prop).forEach(function (g) {
      lineas.push('- ' + D.grupos[g].nombre + ' ' + prop[g] + ' %: ' +
        ((sel[g] || []).map(function (a) { return a.nombre; }).join(', ') || '—'));
    });
    if (c.grasaAparte && state.dia[id].grasa) lineas.push('- Grasa aparte: ' + D.grasaAparte);
    return lineas.join('\n');
  }

  function textoDia() {
    var t = totalesDia();
    var partes = D.comidas.map(function (c) { return textoComida(c.id); });
    if (state.frutasExtra) partes.push('Frutas sueltas: ' + state.frutasExtra);
    partes.push('Total de porciones\n' + ['A', 'F', 'V', 'L', 'P', 'G'].map(function (g) {
      return '- ' + D.grupos[g].nombre + ': ' + t[g] + ' (objetivo ' + objetivoTexto(g) + ') · ' + estadoGrupo(g, t[g]).texto;
    }).join('\n'));
    return partes.join('\n\n');
  }

  function copiar(texto, boton, area) {
    var listo = function () {
      var orig = boton.textContent;
      boton.textContent = '¡Copiado!';
      setTimeout(function () { boton.textContent = orig; }, 1500);
    };
    var plan = function () {
      area.value = texto;
      area.hidden = false;
      area.focus();
      area.select();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, plan);
    } else plan();
  }

  $('azar').addEventListener('click', armarAlAzar);
  $('vaciar').addEventListener('click', function () {
    state.dia[state.comida] = { sel: [], grasa: false };
    render();
  });
  $('copiar').addEventListener('click', function () {
    copiar(textoComida(state.comida), $('copiar'), $('copia-txt'));
  });
  $('copiar-dia').addEventListener('click', function () {
    copiar(textoDia(), $('copiar-dia'), $('copia-dia-txt'));
  });
  $('nuevo-dia').addEventListener('click', function () {
    if (!confirm('¿Empezar un día nuevo? Se vacían las 4 comidas.')) return;
    state.dia = diaVacio();
    state.frutasExtra = 0;
    $('copia-dia-txt').hidden = true;
    render();
  });
  $('fruta-menos').addEventListener('click', function () {
    state.frutasExtra = Math.max(0, state.frutasExtra - 1);
    render();
  });
  $('fruta-mas').addEventListener('click', function () {
    state.frutasExtra = Math.min(9, state.frutasExtra + 1);
    render();
  });

  cargar();
  render();
})();
