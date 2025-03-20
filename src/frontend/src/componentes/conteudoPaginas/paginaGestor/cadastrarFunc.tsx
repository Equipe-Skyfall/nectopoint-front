import React, { useState } from 'react';

export default function CadastrarFunc() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    title: 'COLABORADOR', // Valor fixo, como no exemplo
    department: '',
    workJourneyType: '',
    employeeNumber: '',
    dailyHours: '',
    bankOfHours: '',
    birthDate: '' // Formato YYYY-MM-DD
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Funcionário cadastrado com sucesso!');
        // Limpar o formulário após o sucesso
        setFormData({
          name: '',
          email: '',
          password: '',
          cpf: '',
          title: 'COLABORADOR',
          department: '',
          workJourneyType: '',
          employeeNumber: '',
          dailyHours: '',
          bankOfHours: '',
          birthDate: '' // Limpa o campo de data
        });
      } else {
        alert('Erro ao cadastrar funcionário.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar funcionário.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-blue-600 text-center">Olá, Gestor!</h2>
          <h3 className="mb-10 text-gray-700">Cadastre um colaborador</h3>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-600">Nome do Funcionário</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-600">E-mail</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600">Senha</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-gray-600">CPF do Funcionário</label>
              <input
                type="text"
                id="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-gray-600">Departamento</label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="workJourneyType" className="block text-gray-600">Tipo de Jornada</label>
              <input
                type="text"
                id="workJourneyType"
                value={formData.workJourneyType}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="employeeNumber" className="block text-gray-600">Número do Funcionário</label>
              <input
                type="text"
                id="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="dailyHours" className="block text-gray-600">Horas Diárias</label>
              <input
                type="number"
                id="dailyHours"
                value={formData.dailyHours}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="bankOfHours" className="block text-gray-600">Banco de Horas</label>
              <input
                type="number"
                id="bankOfHours"
                value={formData.bankOfHours}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-gray-600">Data de Nascimento (YYYY-MM-DD)</label>
              <input
                type="text"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}