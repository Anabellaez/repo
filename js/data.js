/* Única fuente de verdad: grupos, proporciones, alimentos y objetivos diarios.
   Cambios de contenido van acá, no en la lógica. */
window.DATA = {
  // Orden en que se muestran los grupos en el plato y en las listas.
  orden: ['V', 'F', 'L', 'A', 'P', 'G'],

  grupos: {
    V: {
      nombre: 'Verduras',
      nota: 'Libres. Apuntá a 5 variedades por día.',
      alimentos: [
        { id: 'acelga', nombre: 'Acelga' },
        { id: 'espinaca', nombre: 'Espinaca' },
        { id: 'lechuga', nombre: 'Lechuga' },
        { id: 'rucula', nombre: 'Rúcula' },
        { id: 'tomate', nombre: 'Tomate' },
        { id: 'pepino', nombre: 'Pepino' },
        { id: 'zapallito', nombre: 'Zapallito' },
        { id: 'zucchini', nombre: 'Zucchini' },
        { id: 'berenjena', nombre: 'Berenjena' },
        { id: 'morron', nombre: 'Morrón' },
        { id: 'brocoli', nombre: 'Brócoli' },
        { id: 'coliflor', nombre: 'Coliflor' },
        { id: 'zanahoria', nombre: 'Zanahoria' },
        { id: 'calabaza', nombre: 'Calabaza' },
        { id: 'remolacha', nombre: 'Remolacha' },
        { id: 'chauchas', nombre: 'Chauchas' },
        { id: 'repollo', nombre: 'Repollo' },
        { id: 'hongos', nombre: 'Hongos' },
        { id: 'puerro', nombre: 'Puerro' },
        { id: 'verdeo', nombre: 'Cebolla de verdeo' },
        { id: 'apio', nombre: 'Apio' }
      ]
    },
    A: {
      nombre: 'Almidones',
      nota: 'Sin TACC: avena, pan, galletas, fideos y premezclas solo con logo.',
      alimentos: [
        { id: 'avena', nombre: 'Avena sin TACC', azar: ['desayuno', 'merienda'] },
        { id: 'pan', nombre: 'Pan sin TACC', azar: ['desayuno', 'merienda'] },
        { id: 'galletas-arroz', nombre: 'Galletas de arroz', azar: ['desayuno', 'merienda'] },
        { id: 'papa', nombre: 'Papa', azar: ['almuerzo'] },
        { id: 'batata', nombre: 'Batata', azar: ['almuerzo'] },
        { id: 'choclo', nombre: 'Choclo', azar: ['almuerzo'] },
        { id: 'arroz', nombre: 'Arroz integral', azar: ['almuerzo'] },
        { id: 'fideos', nombre: 'Fideos sin TACC', azar: ['almuerzo'] },
        { id: 'quinoa', nombre: 'Quinoa', azar: ['almuerzo'] },
        { id: 'polenta', nombre: 'Polenta', azar: ['almuerzo'] },
        { id: 'lentejas', nombre: 'Lentejas', azar: ['almuerzo'] },
        { id: 'garbanzos', nombre: 'Garbanzos', azar: ['almuerzo'] }
      ]
    },
    P: {
      nombre: 'Proteínas',
      nota: 'En poca cantidad. Por semana: 3 rojas, 4 blancas.',
      alimentos: [
        { id: 'pollo', nombre: 'Pollo', carne: 'blanca' },
        { id: 'pescado', nombre: 'Pescado', carne: 'blanca' },
        { id: 'atun', nombre: 'Atún al natural', carne: 'blanca' },
        { id: 'pavita', nombre: 'Pavita', carne: 'blanca' },
        { id: 'vaca', nombre: 'Carne vacuna magra', carne: 'roja' },
        { id: 'cerdo', nombre: 'Cerdo magro', carne: 'roja' },
        { id: 'huevo', nombre: 'Huevo' },
        { id: 'tofu', nombre: 'Tofu' }
      ]
    },
    L: {
      nombre: 'Lácteos',
      alimentos: [
        { id: 'leche', nombre: 'Leche descremada' },
        { id: 'yogur', nombre: 'Yogur descremado' },
        { id: 'griego', nombre: 'Yogur griego' },
        { id: 'untable', nombre: 'Queso untable light' },
        { id: 'ricota', nombre: 'Ricota' },
        { id: 'fresco', nombre: 'Queso fresco light' }
      ]
    },
    F: {
      nombre: 'Frutas',
      nota: 'Mínimo 3 por día. Entera, no en jugo.',
      alimentos: [
        { id: 'frutillas', nombre: 'Frutillas', vitC: true },
        { id: 'naranja', nombre: 'Naranja', vitC: true },
        { id: 'mandarina', nombre: 'Mandarina', vitC: true },
        { id: 'kiwi', nombre: 'Kiwi', vitC: true },
        { id: 'banana', nombre: 'Banana', triptofano: true },
        { id: 'manzana', nombre: 'Manzana' },
        { id: 'pera', nombre: 'Pera' },
        { id: 'durazno', nombre: 'Durazno' },
        { id: 'anana', nombre: 'Ananá' },
        { id: 'arandanos', nombre: 'Arándanos' },
        { id: 'uvas', nombre: 'Uvas' },
        { id: 'melon', nombre: 'Melón' }
      ]
    },
    G: {
      nombre: 'Grasas',
      alimentos: [
        { id: 'palta', nombre: 'Palta' },
        { id: 'aceite', nombre: 'Aceite de oliva' },
        { id: 'chia', nombre: 'Semillas de chía' },
        { id: 'lino', nombre: 'Semillas de lino' },
        { id: 'nueces', nombre: 'Nueces' },
        { id: 'almendras', nombre: 'Almendras' },
        { id: 'pasta-mani', nombre: 'Pasta de maní' }
      ]
    }
  },

  comidas: [
    {
      id: 'desayuno',
      nombre: 'Desayuno',
      plato: { F: 30, L: 40, A: 20, G: 10 },
      sinGrasa: { F: 30, L: 45, A: 25 },
      grasaOpcional: true,
      tip: 'Fruta con vitamina C (frutillas, naranja, mandarina, kiwi). Evitá el jugo.'
    },
    {
      id: 'almuerzo',
      nombre: 'Almuerzo',
      plato: { V: 50, A: 25, P: 25 },
      grasaAparte: true,
      tip: 'Proteína en poca cantidad. Papa, batata y choclo cuentan como almidón.'
    },
    {
      id: 'merienda',
      nombre: 'Merienda',
      plato: { F: 30, L: 40, A: 20, G: 10 },
      sinGrasa: { F: 30, L: 45, A: 25 },
      grasaOpcional: true,
      tip: 'Banana recomendada (triptófano). No dejes el almidón solo.'
    },
    {
      id: 'cena',
      nombre: 'Cena',
      plato: { V: 60, P: 40 },
      grasaAparte: true,
      tip: 'Sin almidones: ni cereales, panes ni harinas.'
    }
  ],

  // Grasa que va aparte del plato (almuerzo y cena).
  grasaAparte: '1 cda de aceite en crudo o semillas',

  // Porciones diarias propuestas (a confirmar con la nutricionista).
  // Cada grupo presente en un plato suma 1 porción. Verduras: variedades distintas.
  objetivo: {
    A: { min: 3, max: 4 },
    F: { min: 3 },
    L: { min: 2, max: 3 },
    P: { min: 2, max: 2 },
    G: { min: 2, max: 3 },
    V: { min: 5, variedades: true }
  }
};
