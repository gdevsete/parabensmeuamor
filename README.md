# 💕 Memória do Amor

Uma aplicação web romântica inspirada no Memoryiit para criar páginas digitais personalizadas e emocionantes para pessoas especiais.

## ✨ Funcionalidades

### 🎯 Principais Recursos
- **📸 Galeria de Fotos**: Upload de até 7 fotos com visualização em carrossel
- **🎵 Player de Música**: Reprodutor integrado para músicas de fundo especiais
- **⏰ Contador Regressivo**: Countdown animado para datas importantes
- **🌟 Animações Românticas**: Chuva de emojis, corações flutuantes e confetes
- **💖 Interface Romântica**: Design gradiente com tema rosa e roxo
- **📱 Responsivo**: Funciona perfeitamente em desktop e mobile

### 🛠️ Tecnologias Utilizadas
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones elegantes
- **Canvas Confetti** - Efeitos de confete
- **React Dropzone** - Upload de arquivos

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <seu-repositorio>

# Entre na pasta do projeto
cd memoryiit

# Instale as dependências
npm install

# Execute o projeto em desenvolvimento
npm run dev
```

### Executar a Aplicação
```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 📋 Como Criar uma Memória

### Passo 1: Informações Básicas
- Digite o título da memória
- Escreva uma mensagem carinhosa
- Selecione uma data especial

### Passo 2: Adicionar Fotos
- Faça upload de até 7 fotos
- Visualize em galeria com carrossel
- Remova fotos se necessário

### Passo 3: Música de Fundo
- Adicione uma música especial (opcional)
- Player integrado com controles
- Formatos suportados: MP3, WAV, OGG

### Passo 4: Finalizar
- Visualize o resumo da memória
- Crie sua página do amor
- Compartilhe com sua pessoa especial

## 🎨 Características Visuais

### Animações Especiais
- **Corações Flutuantes**: Animação contínua de corações subindo
- **Chuva de Emojis**: Efeito especial com emojis românticos
- **Confetes**: Explosão de confetes coloridos
- **Transições Suaves**: Animações entre etapas

### Paleta de Cores
- Rosa: `#ec4899`, `#f472b6`, `#fce7f3`
- Roxo: `#a855f7`, `#c084fc`, `#f3e8ff`
- Gradientes românticos personalizados

## 📁 Estrutura do Projeto

```
memoryiit/
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globais
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   └── components/
│       ├── Countdown.tsx    # Componente de countdown
│       ├── PhotoGallery.tsx # Galeria de fotos
│       └── MusicPlayer.tsx  # Player de música
├── public/                  # Arquivos estáticos
├── package.json            # Dependências
├── tailwind.config.ts      # Configuração Tailwind
├── tsconfig.json          # Configuração TypeScript
└── next.config.js         # Configuração Next.js
```

## 🌐 Hospedagem e Deploy

### Opções de Hospedagem Gratuita

#### 1. Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

#### 2. Netlify
1. Conecte seu repositório GitHub
2. Configure build: `npm run build`
3. Pasta de deploy: `out`

#### 3. GitHub Pages
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar ao package.json
"homepage": "https://seuusuario.github.io/memoryiit",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d out"
}
```

## 💡 Funcionalidades Futuras

- [ ] Sistema de pagamento integrado
- [ ] Geração de QR Code personalizado
- [ ] URLs personalizadas
- [ ] Envio automático por email
- [ ] Templates de design diferentes
- [ ] Integração com redes sociais
- [ ] Dashboard para gerenciar memórias
- [ ] Sistema de comentários

## 🎯 Inspiração

Este projeto foi inspirado no [Memoryiit.com](https://memoryiit.com), uma plataforma que permite criar memórias digitais únicas para pessoas especiais.

## 💝 Feito com Amor

Criado especialmente para ajudar pessoas a expressarem seus sentimentos de forma única e emocionante através da tecnologia.

---

**"Eternize seus momentos especiais com tecnologia e muito amor!"** 💕