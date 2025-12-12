const fs = require('fs');
const path = require('path');
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

// Função para extrair imagens usando operadores do PDF
async function extractImagesFromPDF(pdfPath, outputDir) {
  try {
    console.log(`Processando: ${path.basename(pdfPath)}`);
    
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    
    const images = [];
    const numPages = Math.min(pdf.numPages, 5); // Máximo 5 páginas
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const operators = await page.getOperatorList();
        
        // Procurar por imagens nos operadores
        for (let i = 0; i < operators.fnArray.length; i++) {
          const op = operators.fnArray[i];
          
          // Operador 'Do' é usado para desenhar imagens
          if (op === pdfjsLib.OPS.paintImageXObject || op === pdfjsLib.OPS.paintJpegXObject) {
            const imageName = operators.argsArray[i][0];
            
            try {
              const image = await page.objs.get(imageName);
              
              if (image && image.data) {
                const imageData = image.data;
                const imagePath = path.join(outputDir, `image_${pageNum}_${i}.jpg`);
                
                // Salvar imagem
                fs.writeFileSync(imagePath, imageData);
                const relativePath = `/images/empreendimentos/${path.basename(outputDir)}/image_${pageNum}_${i}.jpg`;
                
                if (!images.includes(relativePath)) {
                  images.push(relativePath);
                }
              }
            } catch (err) {
              // Ignorar erros de imagens individuais
            }
          }
        }
        
        // Se não encontrou imagens nos operadores, renderizar a página como imagem
        if (images.length === 0 && pageNum === 1) {
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = require('canvas').createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext('2d');
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
          const imagePath = path.join(outputDir, `page_${pageNum}.jpg`);
          fs.writeFileSync(imagePath, buffer);
          images.push(`/images/empreendimentos/${path.basename(outputDir)}/page_${pageNum}.jpg`);
        }
        
        console.log(`  ✓ Página ${pageNum} processada`);
      } catch (error) {
        console.log(`  ✗ Erro na página ${pageNum}:`, error.message);
      }
    }
    
    return images;
  } catch (error) {
    console.error(`Erro ao processar PDF:`, error.message);
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
  
  // Ler projetos existentes
  const projetosPath = path.join(__dirname, '..', 'data', 'projetos.json');
  let projetos = [];
  
  if (fs.existsSync(projetosPath)) {
    projetos = JSON.parse(fs.readFileSync(projetosPath, 'utf-8'));
  }
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(publicPdfsPath, pdfFile);
    const normalizedName = normalizeFileName(pdfFile.replace('.pdf', '').replace(/\([0-9]+\)/g, '').trim());
    
    // Encontrar ou criar projeto
    let projeto = projetos.find(p => 
      p.id === normalizedName || 
      p.arquivoPDF.includes(pdfFile.replace(/ \(.*\)/, ''))
    );
    
    if (!projeto) {
      // Criar projeto básico se não existir
      projeto = {
        id: normalizedName,
        nome: pdfFile.replace('.pdf', ''),
        enderecoCompleto: 'A definir',
        bairro: '',
        cidade: 'São Paulo',
        tipo: 'Apartamento',
        metragem: 'A partir de 50 m²',
        dormitorios: '1 a 3 dormitórios',
        vaga: '1 vaga',
        descricao: 'Empreendimento imobiliário de qualidade.',
        galeria: [],
        arquivoPDF: `/pdfs/${pdfFile}`
      };
      projetos.push(projeto);
    }
    
    // Criar diretório para imagens
    const outputDir = path.join(publicImagesPath, projeto.id);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Extrair imagens
    const images = await extractImagesFromPDF(pdfPath, outputDir);
    
    if (images.length > 0) {
      projeto.galeria = images;
      console.log(`✓ ${projeto.nome}: ${images.length} imagens extraídas\n`);
    } else {
      console.log(`⚠ ${projeto.nome}: Nenhuma imagem extraída (usando renderização de página)\n`);
      // Garantir pelo menos uma imagem renderizada
      if (projeto.galeria.length === 0) {
        projeto.galeria = [`/images/empreendimentos/${projeto.id}/page_1.jpg`];
      }
    }
  }
  
  // Salvar projetos atualizados
  fs.writeFileSync(projetosPath, JSON.stringify(projetos, null, 2), 'utf-8');
  
  console.log('\n✅ Extração concluída!');
  console.log(`Total de projetos processados: ${projetos.length}`);
}

main().catch(console.error);


