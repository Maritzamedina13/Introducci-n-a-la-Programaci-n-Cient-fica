# Quiz BIOINF

Sitio estático (sin dependencias externas, sin build) con un menú de materias
del Máster en Bioinformática. Cada materia es un quiz de preguntas aleatorias
con dos modos:

- **Estudiar** — revisión instantánea al responder cada pregunta.
- **Evaluar** — revisión y nota completas al terminar el cuestionario.

## Estructura

```
index.html                     ← menú: lista las materias (lee materias/registry.js)
assets/
  quiz.css                     ← estilos compartidos por el menú y todos los quizzes
  quiz.js                      ← motor del quiz (pantallas, modos, puntuación, resultados)
  helix.js                     ← fondo decorativo animado, compartido
materias/
  registry.js                  ← lista de materias que aparecen en el menú
  <clave>.html                 ← página muy corta: solo carga su .data.js + el motor
  <clave>.data.js              ← banco de preguntas de esa materia (temas + preguntas)
  img/<clave>/...              ← imágenes que usan las preguntas de esa materia (opcional)
```

Cada quiz (`materias/<clave>.html`) es solo un cascarón HTML de ~15 líneas: carga
`assets/quiz.css`, su propio `<clave>.data.js` (que define `window.QUIZ_DATA` con
metadatos + temas + banco de preguntas) y el motor compartido `assets/quiz.js`, que
construye toda la interfaz a partir de esos datos. El menú (`index.html`) simplemente
lee `materias/registry.js` y pinta una tarjeta por materia.

Una pregunta puede llevar una imagen (gráfico, salida de R, captura de consola) con
el campo opcional `img` en su entrada del banco — se muestra sobre las opciones y
también en el detalle de revisión. Dos quizzes pueden además enlazarse entre sí como
"compañeros" con `meta.companion` (ver más abajo), útil cuando una misma materia tiene
un banco teórico y otro práctico.

## Materias actuales

- **Introducción a la Programación Científica** (`materias/programacion-cientifica.html`)
  — 30 preguntas por partida sobre un banco de 100 (10 temas): bases de datos
  biológicas, Git/GitHub, lenguajes de programación, sistemas operativos, Linux y
  Perl/BioPerl.
- **Estadística y R para Ciencias de la Salud** (`materias/estadistica-r-ciencias-salud.html`)
  — 40 preguntas por partida sobre un banco de 400 (10 temas): bioestadística
  descriptiva e inferencial, representación gráfica, modelos multivariables (lineales
  y avanzados), PCA, imputación de datos y evaluación de modelos. Extraído del PDF
  *Repaso Bioestadística - Bioinformática - Estadistica.pdf*.
  - Incluye un banco **práctico** hermano, enlazado desde la misma página
    (`materias/estadistica-r-practico.html`): 15 preguntas por partida sobre un banco
    de 22 (9 bloques), cada una con la imagen real del gráfico o salida de R a
    interpretar (regresión logística, PCA, volcano plots, clustering/heatmaps, LASSO,
    curvas ROC/PR…). Extraído del PDF *Repaso - Practico_Estadistica.pdf*; las
    imágenes viven en `materias/img/practico/`.

## Cómo añadir una materia nueva

1. Crea `materias/<clave>.data.js` con esta forma:
   ```js
   window.QUIZ_DATA = {
     meta: {
       eyebrow: "BIOINF · Nombre de la materia",
       title: "Quiz de repaso",
       pageTitle: "Quiz BIOINF — Nombre de la materia",  // <title> de la pestaña
       sub: "Descripción corta + cuántas preguntas hay por partida.",
       quizLen: 30                                        // preguntas por partida
     },
     topics: { 1: "Nombre del tema 1", 2: "Nombre del tema 2", /* ... */ },
     bank: [
       { t:1, q:"Enunciado de la pregunta", o:["Opción A","Opción B","Opción C","Opción D"], c:0, e:"Explicación de la respuesta correcta." },
       // c es el índice (0-3) de la opción correcta dentro de "o"
       // "img" es opcional: ruta relativa al .html de la materia, p. ej. "img/<clave>/grafico1.png"
       { t:1, q:"Pregunta con gráfico", o:["A","B","C","D"], c:2, e:"...", img:"img/<clave>/grafico1.png" }
     ]
   };
   ```
2. Copia `materias/programacion-cientifica.html` a `materias/<clave>.html` y cambia
   el `<title>`, la `<meta name="description">` y el nombre del `<script src="...data.js">`.
   Si la materia usa imágenes, guárdalas en `materias/img/<clave>/`.
3. Añade una entrada en `materias/registry.js` (nombre, descripción corta, tamaño del
   banco, preguntas por partida, número de temas). El menú (`index.html`) la recoge
   automáticamente, no hace falta tocar `index.html`.
4. (Opcional) Si la materia nueva es un banco hermano de otra ya existente (p. ej. un
   banco práctico que complementa uno teórico) y no quieres que aparezca como tarjeta
   suelta en el menú, omite el paso 3 y en su lugar añade `companion` al `meta` de
   **ambos** ficheros `.data.js`, enlazándose entre sí:
   ```js
   "companion": { "href": "otra-materia.html", "label": "Texto del enlace" }
   ```
   Esto pinta un enlace dentro de la propia página del quiz (bajo la descripción),
   en vez de una tarjeta nueva en `index.html`.

No hace falta ningún paso de build: todo es HTML/CSS/JS plano.

## Publicarlo con GitHub Pages (sin usar git)

1. Entra en [github.com/new](https://github.com/new) y crea un repositorio nuevo
   (público, para poder usar Pages gratis). Por ejemplo: `quiz-bioinf`.
2. Dentro del repo recién creado, pulsa **Add file → Upload files**.
3. Arrastra `index.html`, la carpeta `assets/`, la carpeta `materias/` y este
   `README.md` (manteniendo la misma estructura de carpetas).
4. Pulsa **Commit changes**.
5. Ve a **Settings → Pages**.
6. En **Build and deployment → Source**, elige **Deploy from a branch**.
7. En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego **Save**.
8. Espera 1-2 minutos; GitHub te mostrará la URL pública, del tipo:
   `https://<tu-usuario>.github.io/quiz-bioinf/`

## Publicarlo con git (alternativa, si prefieres línea de comandos)

```bash
cd "BIOINF EVAL"
git init
git add index.html assets materias README.md
git commit -m "Añade quiz BIOINF"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/quiz-bioinf.git
git push -u origin main
```

Luego repite los pasos 5-8 de arriba para activar Pages.

## Actualizar el sitio más adelante

Si cambias algo localmente, vuelve a subirlo (Upload files, o `git push`) y GitHub
Pages se actualiza solo en un par de minutos.
