# Site de Busca e Visualização de Imóveis

Plataforma completa para busca e visualização de imóveis, desenvolvida com Next.js 14, React, TailwindCSS e Framer Motion.

## 🚀 Funcionalidades

- **Busca Inteligente**: Busque imóveis por endereço, rua, bairro ou cidade
- **Filtros Avançados**: Filtre por tipo de transação (comprar, alugar, imóvel novo) e tipo de imóvel
- **Visualização Detalhada**: Página completa de cada imóvel com:
  - Galeria de fotos com carrossel
  - Descrição detalhada
  - Informações técnicas
  - Download do PDF completo (book)
- **Design Moderno**: Interface elegante com paleta de cores amarelo, branco e azul-marinho
- **Totalmente Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (animações)
- **Embla Carousel** (carrossel de imagens)
- **pdf-parse** (processamento de PDFs)

## 📦 Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd "site cor"
```

2. Instale as dependências:
```bash
npm install
```

3. Processe os PDFs para extrair informações:
```bash
npm run process-pdfs
```

Este comando irá:
- Ler os PDFs da pasta Downloads
- Extrair informações (nome, endereço, tipo, metragem, etc.)
- Copiar os PDFs para `/public/pdfs`
- Criar o arquivo `/data/projetos.json` com todos os dados

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
site cor/
├── app/
│   ├── api/
│   │   └── imoveis/
│   │       └── route.ts          # API para buscar imóveis
│   ├── resultados/
│   │   └── page.tsx              # Página de resultados
│   ├── imovel/
│   │   └── [id]/
│   │       └── page.tsx          # Página detalhada do imóvel
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página inicial (home)
│   └── globals.css               # Estilos globais
├── components/
│   ├── SearchBar.tsx             # Componente de busca
│   ├── ImovelCard.tsx            # Card de imóvel
│   └── ImageCarousel.tsx         # Carrossel de imagens
├── data/
│   └── projetos.json             # Dados dos empreendimentos
├── public/
│   ├── pdfs/                     # PDFs dos empreendimentos
│   └── images/
│       └── empreendimentos/      # Imagens extraídas dos PDFs
├── scripts/
│   └── process-pdfs.js           # Script para processar PDFs
└── package.json
```

## 🎨 Paleta de Cores

- **Amarelo Primário**: `#FFD43B`
- **Azul-Marinho**: `#001F3F`
- **Branco**: `#FFFFFF`

## 📝 Processamento de PDFs

O script `process-pdfs.js` processa automaticamente os PDFs encontrados na pasta Downloads. Ele:

1. Extrai texto e informações básicas de cada PDF
2. Identifica nome, endereço, tipo, metragem, dormitórios e vagas
3. Gera descrições automáticas
4. Copia os PDFs para a pasta pública
5. Cria o arquivo JSON com todos os dados

**Nota**: Para extrair imagens dos PDFs, você pode usar ferramentas adicionais como `pdf-poppler` ou `pdf2pic`. Por enquanto, o sistema usa placeholders.

## 🔍 Como Usar

1. **Buscar Imóveis**: Na página inicial, digite um endereço, bairro ou cidade
2. **Aplicar Filtros**: Selecione o tipo de transação (comprar/alugar/novo) e tipo de imóvel
3. **Ver Resultados**: Navegue pelos cards de imóveis encontrados
4. **Ver Detalhes**: Clique em "Ver mais" para ver a página completa do imóvel
5. **Baixar PDF**: Na página do imóvel, clique em "Baixar o Book (PDF)" para baixar o documento completo

## 🚢 Deploy

Para fazer deploy:

1. Build do projeto:
```bash
npm run build
```

2. Iniciar em produção:
```bash
npm start
```

O projeto está pronto para deploy em plataformas como Vercel, Netlify ou qualquer servidor Node.js.

## 📱 Responsividade

O site foi desenvolvido com abordagem mobile-first e é totalmente responsivo:

- **Mobile**: Layout otimizado para telas pequenas
- **Tablet**: Adaptação para telas médias
- **Desktop**: Layout completo para monitores grandes (Full HD)

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto é de uso privado.

---

Desenvolvido com ❤️ usando Next.js e React



