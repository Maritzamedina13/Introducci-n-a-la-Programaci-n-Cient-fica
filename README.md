# Quiz BIOINF

Dos sitios estáticos de una sola página (sin dependencias externas), cada uno con
un quiz de preguntas aleatorias y dos modos:

- **Estudiar** — revisión instantánea al responder cada pregunta.
- **Evaluar** — revisión y nota completas al terminar el cuestionario.

## Módulos

- **`index.html`** — Introducción a la Programación Científica. 30 preguntas por
  partida sobre un banco de 100 (10 temas): bases de datos biológicas, Git/GitHub,
  lenguajes de programación, sistemas operativos, Linux y Perl/BioPerl.
- **`estadistica-r-ciencias-salud.html`** — Estadística y R para Ciencias de la
  Salud. 40 preguntas por partida sobre un banco de 400 (10 temas): bioestadística
  descriptiva e inferencial, representación gráfica, modelos multivariables (lineales
  y avanzados), PCA, imputación de datos y evaluación de modelos. Extraído del PDF
  *Repaso Bioestadística - Bioinformática - Estadistica.pdf*.

## Publicarlo con GitHub Pages (sin usar git)

1. Entra en [github.com/new](https://github.com/new) y crea un repositorio nuevo
   (público, para poder usar Pages gratis). Por ejemplo: `quiz-bioinf`.
2. Dentro del repo recién creado, pulsa **Add file → Upload files**.
3. Arrastra los archivos `.html` de esta carpeta (y este `README.md` si quieres).
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
git add index.html estadistica-r-ciencias-salud.html README.md
git commit -m "Añade quiz BIOINF"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/quiz-bioinf.git
git push -u origin main
```

Luego repite los pasos 5-8 de arriba para activar Pages.

## Actualizar el quiz más adelante

Si cambias alguno de los `.html` localmente, vuelve a subirlo (Upload files, o
`git push`) y GitHub Pages se actualiza solo en un par de minutos.
