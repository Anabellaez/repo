# Armá tu plato — guía para Claude Code

App web para armar platos según el plan de la nutricionista. Usuaria: Anabella, 30 años, 1,54 m, 58,9 kg, grasa corporal 38,6 % (referencia 21–32,8 %). Objetivo: bajar 4 kg perdiendo grasa y no músculo. Come con su pareja.

## Stack actual
- HTML + CSS + JavaScript sin dependencias ni build. Se abre `index.html` directo en el navegador.
- `js/data.js`: **única fuente de verdad** de grupos, proporciones, alimentos y ejemplos. Cambios de contenido van acá, no en la lógica.
- `js/plate.js`: dibuja el plato en SVG (sectores por grupo, subdivididos en partes iguales por alimento).
- `js/app.js`: estado, selección, plato al azar, plan del día, copiar texto. Guarda las 4 comidas del día en `localStorage` (con try/catch, clave `armatuplato:v1`).
- `css/styles.css`: tokens de color en `:root` con modo oscuro. Colores por grupo: `--c-V --c-A --c-P --c-L --c-F --c-G`.

## Reglas de la nutricionista (no romper)
| Comida | Plato | Notas |
| --- | --- | --- |
| Desayuno | Fruta 30 % · Lácteo 40 % · Almidón 20 % · Grasa 10 % (opcional; sin grasa: 30/45/25) | Fruta con vitamina C (frutillas, naranja, mandarina, kiwi). Evitar jugo. |
| Almuerzo | Verduras 50 % · Almidón 25 % · Proteína 25 % | Grasa aparte: 1 cda de aceite en crudo o semillas. Proteína en poca cantidad. |
| Merienda | Igual que desayuno | Banana recomendada (triptófano). No dejar el almidón solo. |
| Cena | Verduras 60 % · Proteína 40 % | **Sin almidones** (ni cereales, panes ni harinas). Grasa aparte. |

- Verduras A y B libres; apuntar a 5 variedades por día. Papa, batata y choclo son **almidón**, no verdura.
- Carnes: 3 veces por semana rojas, 4 blancas.
- Mínimo 3 frutas por día.
- Todo **sin TACC**: avena, pan, galletas, fideos y premezclas solo con logo.
- **Sin cebolla de bulbo** (la pareja no la tolera). Verdeo y puerro sí están en la heladera.
- Grupo 6 (dulces, procesados) es opcional y no está en la app.
- Porciones diarias propuestas (a confirmar con la nutricionista): almidones 3–4, frutas 3, verduras libres, lácteos 2–3, proteínas 2, grasas 2–3.
- Agua: ~2 l por día (35 cc × kg). Actividad: 150 min aeróbico + 2–3 sesiones de fuerza por semana.

## Ideas para seguir (en orden sugerido)
1. ~~**Plan del día**~~ ✅ hecho: cada comida guarda su plato; el panel "3 · Plan del día" suma 1 porción por grupo presente en cada plato (+1 grasa si se marca la grasa aparte en almuerzo/cena, + frutas sueltas) y las verduras por variedad distinta. Objetivos en `DATA.objetivo`.
2. **Semana**: calendario de 7 días con contador de carnes rojas/blancas y aviso si pasa de 3 rojas.
3. **Favoritos**: guardar platos con nombre y reutilizarlos.
4. **Lista de compras** generada a partir de la semana.
5. **Porciones para dos**: multiplicador para la pareja.
6. Agua y actividad: registro diario simple.
7. PWA instalable en el celular (manifest + service worker) para usar sin conexión.

## Convenciones
- Textos en español rioplatense (vos), cortos y concretos.
- Mantener accesible: botones reales, `aria-pressed`/`aria-checked`, foco visible, `aria-label` del plato con los porcentajes.
- Responsive: en escritorio plato a la derecha (sticky); en celular se apila comida → plato → alimentos. Sin scroll horizontal.
- Si se agrega un framework o build, que siga funcionando abrir el resultado como sitio estático.
