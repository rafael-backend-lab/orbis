# orbis — Loja oficial do ORBIS Executive Cyberpunk 2027

Página de produto (formato e-commerce) estática (HTML, CSS e JS puros), pronta para o GitHub Pages.

## Estrutura

```
orbis/
├── index.html          página
├── css/style.css       estilos
├── js/config.js        ← ÚNICO arquivo de configuração (checkout, preço, imagens)
├── js/main.js          comportamento
├── assets/favicon.svg
├── assets/img/         imagens de demonstração (ver LEIA-ME.txt)
├── .nojekyll
└── .gitignore          bloqueia PDF/ZIP para não expor o produto pago
```

## Pendências antes de vender

1. **Checkout:** em `js/config.js`, preencha `CHECKOUT_URL` com o link da Kiwify.
   Só links `https` de domínios `kiwify.com.br` / `kiwify.com` são aceitos.
   Enquanto estiver vazio, os botões principais mostram "Disponível em breve" e ficam desativados.
2. **Imagens:** copie as imagens oficiais para `assets/img/` com os nomes listados em
   `assets/img/LEIA-ME.txt`. Sem elas, a página mostra painéis neutros da marca — **não publique sem as imagens oficiais**.
3. **Compartilhamento:** depois de criar `assets/img/og-orbis.jpg`, descomente a tag `og:image` no `index.html`.
4. **Conteúdo:** confirme nos arquivos reais os números do pacote (3 versões, 72 adesivos).
   Número de páginas e de hiperlinks não foram divulgados de propósito.
5. **Contato (opcional):** `CONTACT_EMAIL` em `js/config.js`.

## Ver localmente

```bash
cd orbis
python3 -m http.server 8080
# abra http://localhost:8080
```

## Publicar (somente quando autorizado)

```bash
cd orbis
git init && git add . && git commit -m "ORBIS landing page"
git branch -M main
git remote add origin https://github.com/rafael-backend-lab/orbis.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Endereço previsto: `https://rafael-backend-lab.github.io/orbis/` (confirmar após publicar).

## Licenças

- Fontes **Inter** e **Inter Tight**: SIL Open Font License (uso comercial permitido), via Google Fonts.
- Ícones, moldura de tablet e efeitos: feitos em SVG/CSS próprios deste projeto.
- Nenhuma imagem de terceiros incluída.
