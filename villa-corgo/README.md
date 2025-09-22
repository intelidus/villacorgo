# Villa Corgo — Website

Site estático de apresentação para o empreendimento Villa Corgo (29 apartamentos) na Rua Jaime Campos, Vila Real.

## Estrutura

- `index.html`: homepage com hero, secções, CTAs e formulário
- `assets/css/styles.css`: estilos base e responsivos
- `assets/js/script.js`: interações (menu mobile, scroll suave, feedback de formulário)
- `assets/icons/favicon.svg`: favicon do site
- `assets/img/`: imagens (adicione as suas)
  - `assets/img/plantas/`: plantas das tipologias (T1, T2...)
  - `assets/img/galeria/`: fotografias do empreendimento/ambiente

## Usar localmente

Abrir o `index.html` diretamente no navegador ou usar um servidor simples:

```bash
# Python 3
cd /workspace/villa-corgo && python3 -m http.server 8080
# Depois abra http://localhost:8080
```

## Personalização rápida

- Nome do projeto e meta tags: editar `<title>` e `<meta name="description">` no `index.html`.
- Fotografias: coloque ficheiros em `assets/img/` e substitua as referências.
- Mapa: o iframe no bloco "Localização" pode ser trocado por um mapa com API key.
- Formulário: o `script.js` simula submissão. Substitua pelo seu endpoint (por ex., Formspree, Airtable, Google Apps Script ou backend próprio).

### Upload de imagens (plantas e galeria)

1. Coloque os ficheiros em:
   - `assets/img/plantas/` (ex.: `t1.png`, `t2.png`)
   - `assets/img/galeria/` (ex.: `fachada.jpg`, `interiores.jpg`)
2. Edite o `index.html` e substitua os `src`/`href` das imagens de exemplo pelos seus caminhos, por exemplo:
   ```html
   <a href="assets/img/plantas/t2.png" data-caption="T2 — Planta">
     <img src="assets/img/plantas/t2.png" alt="Planta T2" />
   </a>
   ```
3. Commit e push:
   ```bash
   git add assets/img index.html
   git commit -m "feat: adicionar plantas e fotos"
   git push origin main
   ```

Exemplo (Formspree):
```js
// no script.js, dentro do submit handler
await fetch('https://formspree.io/f/SEU_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

## Deploy

- GitHub Pages: publique o conteúdo da pasta `villa-corgo/`
- Netlify/Vercel: importar repositório e definir diretório base como `villa-corgo`

## Licença

Uso livre para este projeto. Sem garantias.