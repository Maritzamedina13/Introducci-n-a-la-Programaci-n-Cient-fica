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
```

Cada quiz (`materias/<clave>.html`) es solo un cascarón HTML de ~15 líneas: carga
`assets/quiz.css`, su propio `<clave>.data.js` (que define `window.QUIZ_DATA` con
metadatos + temas + banco de preguntas) y el motor compartido `assets/quiz.js`, que
construye toda la interfaz a partir de esos datos. El menú (`index.html`) simplemente
lee `materias/registry.js` y pinta una tarjeta por materia.

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
       { t:1, q:"Enunciado de la pregunta", o:["Opción A","Opción B","Opción C","Opción D"], c:0, e:"Explicación de la respuesta correcta." }
       // c es el índice (0-3) de la opción correcta dentro de "o"
     ]
   };
   ```
2. Copia `materias/programacion-cientifica.html` a `materias/<clave>.html` y cambia
   el `<title>`, la `<meta name="description">` y el nombre del `<script src="...data.js">`.
3. Añade una entrada en `materias/registry.js` (nombre, descripción corta, tamaño del
   banco, preguntas por partida, número de temas). El menú (`index.html`) la recoge
   automáticamente, no hace falta tocar `index.html`.

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
