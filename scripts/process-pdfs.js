const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

// Lista de PDFs únicos (removendo duplicatas)
const pdfsToProcess = [
  'ACERVO_BOOK_CORRETORES.pdf',
  'ACERVO APARTAMENTS APRESENTAÇÃO CORRETOR.pdf',
  'JOY BARUERI BOOK VERSÃO FINAL.pdf',
  'DUQ - BOOK.pdf',
  'APRESENTACAO LIVE ALTINO DUBAI .pdf',
  'MOB-BOOK.pdf',
  'BOOK- Griffe por Dubai.pdf',
  'TREND - BOOK.pdf',
  'book_preliminar_ASD_INFINITY_digital.pdf',
  'ALTTO - BOOK.pdf',
  'BOOK CLIENTE.pdf',
  'YARA POR DUBAI - BOOK DIGITAL.pdf',
  'book_corretor_DEC_essence_VF.pdf',
  'book digital Open View 47.pdf',
  'BOOK EDITION - CLIENTE.pdf',
];

const downloadsPath = path.join(process.env.HOME, 'Downloads');
const publicPdfsPath = path.join(__dirname, '..', 'public', 'pdfs');
const publicImagesPath = path.join(__dirname, '..', 'public', 'images', 'empreendimentos');
const dataPath = path.join(__dirname, '..', 'data');

// Criar diretórios se não existirem
[publicPdfsPath, publicImagesPath, dataPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Função para normalizar nome do arquivo
function normalizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// Função para extrair informações do PDF
async function processPDF(fileName) {
  const sourcePath = path.join(downloadsPath, fileName);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`Arquivo não encontrado: ${fileName}`);
    return null;
  }

  try {
    const dataBuffer = fs.readFileSync(sourcePath);
    const pdfData = await pdf(dataBuffer);
    
    const text = pdfData.text;
    const normalizedName = normalizeFileName(fileName.replace('.pdf', ''));
    
    // Extrair informações básicas do texto
    const nome = extractNome(text, fileName);
    const enderecoCompleto = extractEndereco(text);
    const bairro = extractBairro(text);
    const cidade = extractCidade(text);
    const tipo = extractTipo(text);
    const metragem = extractMetragem(text);
    const dormitorios = extractDormitorios(text);
    const vaga = extractVaga(text);
    const descricao = generateDescricao(text, nome);
    
    // Copiar PDF para public/pdfs
    const pdfDestPath = path.join(publicPdfsPath, fileName);
    fs.copyFileSync(sourcePath, pdfDestPath);
    
    // Criar diretório para imagens do empreendimento
    const empreendimentoImagesPath = path.join(publicImagesPath, normalizedName);
    if (!fs.existsSync(empreendimentoImagesPath)) {
      fs.mkdirSync(empreendimentoImagesPath, { recursive: true });
    }
    
    // Por enquanto, vamos criar um placeholder para as imagens
    // Em produção, você usaria uma biblioteca como pdf-poppler ou pdf2pic
    const galeria = [`/images/empreendimentos/${normalizedName}/placeholder.jpg`];
    
    return {
      id: normalizedName,
      nome,
      enderecoCompleto,
      bairro,
      cidade,
      tipo,
      metragem,
      dormitorios,
      vaga,
      descricao,
      galeria,
      arquivoPDF: `/pdfs/${fileName}`,
    };
  } catch (error) {
    console.error(`Erro ao processar ${fileName}:`, error.message);
    return null;
  }
}

// Funções de extração
function extractNome(text, fileName) {
  // Tentar extrair do texto ou usar o nome do arquivo
  const patterns = [
    /(?:empreendimento|projeto|residencial|edifício)[\s:]+([A-Z][A-Za-z\s]+)/i,
    /([A-Z][A-Za-z\s]{3,30})/,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return fileName.replace('.pdf', '').replace(/BOOK|book|CORRETOR|corretor/gi, '').trim();
}

function extractEndereco(text) {
  const patterns = [
    /(?:endereço|localização|localizado em)[\s:]+([A-Za-z0-9\s,.-]+)/i,
    /(?:rua|avenida|av\.|r\.)[\s]+([A-Za-z0-9\s,.-]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return 'Endereço a definir';
}

function extractBairro(text) {
  const patterns = [
    /(?:bairro)[\s:]+([A-Za-z\s]+)/i,
    /(?:Barueri|Dubai|Alphaville|Vila|Jardim|Centro)[\s,]+/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1]?.trim() || match[0].trim();
  }
  
  return '';
}

function extractCidade(text) {
  const cities = ['Barueri', 'Dubai', 'São Paulo', 'Alphaville', 'Osasco'];
  for (const city of cities) {
    if (text.includes(city)) return city;
  }
  return 'São Paulo';
}

function extractTipo(text) {
  if (/apartamento|apto|ap\./i.test(text)) return 'Apartamento';
  if (/casa|residencial/i.test(text)) return 'Casa';
  if (/studio|estúdio/i.test(text)) return 'Studio';
  if (/loft/i.test(text)) return 'Loft';
  if (/terreno/i.test(text)) return 'Terreno';
  return 'Apartamento';
}

function extractMetragem(text) {
  const patterns = [
    /(\d+)[\s]*(?:m²|m2|metros?)/i,
    /(?:área|metragem)[\s:]+(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return `${match[1]} m²`;
  }
  
  return 'A partir de 50 m²';
}

function extractDormitorios(text) {
  const patterns = [
    /(\d+)[\s]*(?:dormitório|dorm|quarto)/i,
    /(?:dormitórios?)[\s:]+(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return `${match[1]} dormitório${match[1] > 1 ? 's' : ''}`;
  }
  
  return '1 a 3 dormitórios';
}

function extractVaga(text) {
  if (/vaga|garagem/i.test(text)) {
    const match = text.match(/(\d+)[\s]*(?:vaga|garagem)/i);
    if (match) return `${match[1]} vaga${match[1] > 1 ? 's' : ''}`;
    return '1 vaga';
  }
  return '1 vaga';
}

function generateDescricao(text, nome) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20).slice(0, 5);
  let descricao = `O empreendimento ${nome} oferece uma excelente oportunidade de investimento imobiliário. `;
  
  if (sentences.length > 0) {
    descricao += sentences.join('. ').substring(0, 300) + '. ';
  }
  
  descricao += 'Localizado em uma região privilegiada, com fácil acesso a principais vias e comércio. Projeto arquitetônico moderno e sofisticado, com acabamentos de primeira linha e áreas de lazer completas.';
  
  return descricao;
}

// Processar todos os PDFs
async function main() {
  console.log('Iniciando processamento dos PDFs...');
  
  const projetos = [];
  
  for (const pdfFile of pdfsToProcess) {
    console.log(`Processando: ${pdfFile}`);
    const projeto = await processPDF(pdfFile);
    if (projeto) {
      projetos.push(projeto);
    }
  }
  
  // Salvar projetos.json
  const projetosJson = JSON.stringify(projetos, null, 2);
  fs.writeFileSync(path.join(dataPath, 'projetos.json'), projetosJson, 'utf-8');
  
  console.log(`\nProcessamento concluído! ${projetos.length} projetos processados.`);
  console.log(`Arquivo salvo em: ${path.join(dataPath, 'projetos.json')}`);
}

main().catch(console.error);



