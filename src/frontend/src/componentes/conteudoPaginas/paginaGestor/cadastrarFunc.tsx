export default function CadastrarFunc() {
    return (
        <>
        <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-blue-600 text-center">Olá, Gestor!</h2>
        <h3 className="mb-10 text-gray-700">Cadastre um colaborador</h3>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-gray-600 ">Nome do Funcionário</label>
            <input type="text" id="nome" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600 ">E-mail</label>
            <input type="email" id="email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-gray-600 ">CPF do Funcionário</label>
              <input type="text" id="cpf" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="rg" className="block text-gray-600 ">RG do Funcionário</label>
              <input type="text" id="rg" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="setor" className="block text-gray-600 font-medium">Setor Operante</label>
              <input type="text" id="setor" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="data_nascimento" className="block text-gray-600 font-medium">Data de Nascimento</label>
              <input type="date" id="data_nascimento" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition">
            Cadastrar
          </button>
        </form>
      </div>
    </div>


        </>
    )
}
