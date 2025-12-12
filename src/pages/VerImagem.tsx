export default function VerImagem() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Informações dos Projetos</h1>
        <img 
          src="/images/info-projetos.jpeg" 
          alt="Informações dos projetos"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
}


