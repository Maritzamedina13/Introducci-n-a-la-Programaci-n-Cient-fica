/*
 * Registro de materias/módulos disponibles.
 * Para añadir una materia nueva:
 *   1. Crea materias/<clave>.data.js con window.QUIZ_DATA = { meta, topics, bank }.
 *   2. Copia materias/programacion-cientifica.html a materias/<clave>.html y cambia
 *      el <title>, la <meta description> y el nombre del <script src="...data.js">.
 *   3. Añade una entrada aquí abajo. El menú (index.html) la recoge automáticamente.
 */
window.QUIZ_REGISTRY = [
  {
    file: "materias/programacion-cientifica.html",
    name: "Introducción a la Programación Científica",
    desc: "Bases de datos biológicas, Git/GitHub, lenguajes de programación, sistemas operativos, Linux y Perl/BioPerl.",
    bank: 100,
    quizLen: 30,
    topics: 10
  },
  {
    file: "materias/estadistica-r-ciencias-salud.html",
    name: "Estadística y R para Ciencias de la Salud",
    desc: "Bioestadística descriptiva e inferencial, representación gráfica, modelos multivariables, PCA, imputación de datos y evaluación de modelos.",
    bank: 400,
    quizLen: 40,
    topics: 10
  }
];
