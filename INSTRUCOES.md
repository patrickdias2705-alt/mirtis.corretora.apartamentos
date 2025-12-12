# Instruções Rápidas

## 🚀 Como Iniciar o Projeto

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar o servidor de desenvolvimento:**
```bash
npm run dev
```

3. **Acessar no navegador:**
Abra [http://localhost:3000](http://localhost:3000)

## 📋 Funcionalidades Implementadas

✅ **Página Inicial (Home)**
- Campo de busca grande com ícone de lupa roxa
- Tabs: Comprar | Alugar | Imóvel novo
- Dropdown para tipo de imóvel
- Design com gradiente amarelo ↔ azul-marinho

✅ **Página de Resultados**
- Listagem de imóveis em cards
- Filtros aplicados automaticamente
- Layout responsivo

✅ **Página Detalhada do Imóvel**
- Carrossel de imagens (Embla Carousel)
- Descrição completa
- Informações técnicas em sidebar
- Botão para baixar PDF

✅ **Sistema de Busca**
- Busca por endereço, bairro, cidade ou nome
- Filtros por tipo de transação e tipo de imóvel
- Case-insensitive

✅ **Design**
- Paleta de cores: Amarelo (#FFD43B), Branco, Azul-marinho (#001F3F)
- Totalmente responsivo (mobile, tablet, desktop)
- Animações suaves com Framer Motion

## 📁 Estrutura de Dados

Os dados dos imóveis estão em `/data/projetos.json`. Cada imóvel possui:
- Nome, endereço, bairro, cidade
- Tipo, metragem, dormitórios, vagas
- Descrição
- Galeria de imagens
- Link para PDF

## 🔄 Processar Novos PDFs

Para processar novos PDFs:
```bash
npm run process-pdfs
```

**Nota:** O script procura PDFs na pasta Downloads. Certifique-se de que os PDFs estão lá antes de executar.

## 🎨 Personalização

### Cores
Edite `tailwind.config.ts` para alterar as cores:
- `primary.yellow`: #FFD43B
- `primary.blue`: #001F3F

### Adicionar Novos Imóveis
Edite `/data/projetos.json` e adicione novos objetos seguindo a mesma estrutura.

## 📱 Teste de Responsividade

O site foi testado e funciona em:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Full HD (1920px+)

## 🐛 Solução de Problemas

**Erro ao instalar dependências:**
- Certifique-se de ter Node.js 18+ instalado
- Tente `npm cache clean --force` e reinstale

**Imagens não aparecem:**
- As imagens são placeholders por padrão
- Para adicionar imagens reais, coloque-as em `/public/images/empreendimentos/<nome-do-projeto>/`

**PDFs não abrem:**
- Verifique se os PDFs estão em `/public/pdfs/`
- Certifique-se de que os nomes dos arquivos correspondem aos do JSON

## 📞 Próximos Passos

1. Extrair imagens reais dos PDFs (usar ferramentas como pdf-poppler)
2. Melhorar extração de dados dos PDFs (usar IA ou OCR)
3. Adicionar mapa com localização real
4. Implementar sistema de favoritos
5. Adicionar mais filtros (preço, área, etc.)

---

**Desenvolvido com Next.js 14, React, TypeScript e TailwindCSS**



