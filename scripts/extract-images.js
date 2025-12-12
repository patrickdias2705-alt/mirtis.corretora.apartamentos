const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configurar pdfjs-dist
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Configurar worker
const workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const publicPdfsPath = path.join(__dirname, '..', 'public', 'pdfs');
const publicImagesPath = path.join(__dirname, '..', 'public', 'images', 'empreendimentos');

// Função para normalizar nome do arquivo
function normalizeFileName(fileName) {
  return fileName
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

// Função para extrair imagens de um PDF
async function extractImagesFromPDF(pdfPath, outputDir) {
  try {
    console.log(`Processando: ${pdfPath}`);
    
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    
    const images = [];
    const numPages = pdf.numPages;
    
    // Processar até 5 páginas (ou menos se o PDF tiver menos páginas)
    const maxPages = Math.min(numPages, 5);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Criar canvas
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext('2d');
        
        // Renderizar página no canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Salvar como imagem
        const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
        const imagePath = path.join(outputDir, `page_${pageNum}.jpg`);
        fs.writeFileSync(imagePath, buffer);
        
        images.push(`/images/empreendimentos/${path.basename(outputDir)}/page_${pageNum}.jpg`);
        console.log(`  ✓ Página ${pageNum} extraída`);
      } catch (error) {
        console.log(`  ✗ Erro ao processar página ${pageNum}:`, error.message);
      }
    }
    
    return images;
  } catch (error) {
    console.error(`Erro ao processar PDF ${pdfPath}:`, error.message);
    return [];
  }
}

// Função principal
async function main() {
  console.log('Iniciando extração de imagens dos PDFs...\n');
  
  if (!fs.existsSync(publicPdfsPath)) {
    console.error('Pasta de PDFs não encontrada!');
    return;
  }
  
  const pdfFiles = fs.readdirSync(publicPdfsPath).filter(file => file.endsWith('.pdf'));
  
  if (pdfFiles.length === 0) {
    console.log('Nenhum PDF encontrado na pasta public/pdfs/');
    return;
  }
  
  console.log(`Encontrados ${pdfFiles.length} PDFs\n`);
  
  const projetos = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'projetos.json'), 'utf-8')
  );
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(publicPdfsPath, pdfFile);
    const normalizedName = normalizeFileName(pdfFile.replace('.pdf', ''));
    
    // Encontrar projeto correspondente
    const projeto = projetos.find(p => p.id === normalizedName || 
      p.arquivoPDF.includes(pdfFile.replace(' (1)', '').replace(' (2)', '').replace(' (3)', '')));
    
    if (!projeto) {
      console.log(`Projeto não encontrado para: ${pdfFile}`);
      continue;
    }
    
    // Criar diretório para imagens
    const outputDir = path.join(publicImagesPath, projeto.id);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extrair imagens
    const images = await extractImagesFromPDF(pdfPath, outputDir);
    
    if (images.length > 0) {
      // Atualizar projeto com as imagens
      projeto.galeria = images;
      console.log(`✓ ${projeto.nome}: ${images.length} imagens extraídas\n`);
    } else {
      console.log(`✗ ${projeto.nome}: Nenhuma imagem extraída\n`);
    }
  }
  
  // Salvar projetos atualizados
  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'projetos.json'),
    JSON.stringify(projetos, null, 2),
    'utf-8'
  );
  
  console.log('\n✅ Extração concluída!');
  console.log(`Arquivo projetos.json atualizado com as imagens.`);
}

main().catch(console.error);


