# eria_portifas
Portfólio Pessoal

Portfólio pessoal de um designer multidisciplinar (UI/UX, embalagens, produtos e design gráfico), com estética brutalista minimalista e camadas de animação/interação.

## Estrutura do projeto

```
portfolio/
├── index.html              # Home
├── about.html               # Sobre
├── projects.html            # Grid de projetos com filtro por categoria
├── project-template.html    # Template de case study individual
├── contact.html              # Contato
├── assets/
│   ├── css/
│   │   ├── style.css         # Estilos base (tipografia, cores, layout)
│   │   ├── animations.css    # Keyframes e transições
│   │   └── responsive.css    # Media queries
│   ├── js/
│   │   ├── main.js           # Lógica geral (filtros, interações)
│   │   ├── animations.js     # Scroll reveal, parallax, microinterações
│   │   └── navigation.js     # Menu, indicador de seção ativa
│   ├── images/                # Imagens dos projetos e assets visuais
│   └── fonts/                 # Fontes customizadas (se houver)
├── README.md
└── .gitignore
```

## Como editar

- **Textos e projetos:** edite diretamente os arquivos `.html`. Cada card de projeto em `projects.html` tem comentários indicando onde trocar título, categoria, imagem e link do case study.
- **Case studies:** duplique `project-template.html` para cada novo projeto e ajuste o conteúdo.
- **Cores e tipografia:** ajuste as variáveis CSS no topo de `assets/css/style.css`.
- **Imagens:** substitua os arquivos em `assets/images/` mantendo os mesmos nomes, ou atualize os caminhos no HTML.

## Como rodar localmente

Não é necessário build. Basta abrir `index.html` no navegador, ou usar uma extensão como **Live Server** (VS Code) para recarregamento automático.

## Como publicar no GitHub Pages

1. Suba o conteúdo desta pasta para um repositório no GitHub (a raiz do repositório deve conter o `index.html`).
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, selecione a branch `main` (ou `master`) e a pasta `/root`.
4. Salve. O site ficará disponível em `https://seu-usuario.github.io/nome-do-repositorio/`.
5. Aguarde alguns minutos para o deploy ser concluído.

## Tecnologias

- HTML5, CSS3 e JavaScript puro (Vanilla)
- Sem dependência de build tools ou frameworks pesados
- Bibliotecas leves via CDN quando necessário (ex: GSAP/ScrollTrigger para animações)

## Licença

Uso pessoal — todo o conteúdo visual e textual pertence ao autor do portfólio.
