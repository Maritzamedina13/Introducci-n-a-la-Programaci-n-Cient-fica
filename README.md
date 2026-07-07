# Quiz BIOINF — Introducción a la Programación Científica

Sitio estático de una sola página (`index.html`, sin dependencias externas) con un quiz
de 30 preguntas aleatorias sacadas del banco de 100 preguntas del curso (10 temas).
Incluye dos modos:

- **Estudiar** — revisión instantánea al responder cada pregunta.
- **Evaluar** — revisión y nota completas al terminar las 30 preguntas.

## Publicarlo con GitHub Pages (sin usar git)

1. Entra en [github.com/new](https://github.com/new) y crea un repositorio nuevo
   (público, para poder usar Pages gratis). Por ejemplo: `quiz-bioinf`.
2. Dentro del repo recién creado, pulsa **Add file → Upload files**.
3. Arrastra el archivo `index.html` de esta carpeta (y este `README.md` si quieres).
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
git add index.html README.md
git commit -m "Añade quiz BIOINF"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/quiz-bioinf.git
git push -u origin main
```

Luego repite los pasos 5-8 de arriba para activar Pages.

## Actualizar el quiz más adelante

Si cambias `index.html` localmente, vuelve a subirlo (Upload files, o `git push`)
y GitHub Pages se actualiza solo en un par de minutos.
