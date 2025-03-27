import React, { useState } from 'react';
import axios from 'axios';

export default function CadastrarFunc() {
  const [formData, setFormData] = useState({
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
    birthDate: ''
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
      const response = await axios.post('/usuario/', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert('Funcionário cadastrado com sucesso!');
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
          birthDate: ''
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
      <div className=" mt-[15%]  md:mt-[2%] flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-blue-600 poppins text-center">Olá, Gestor!</h2>
          <h3 className="mb-[5%] poppins text-gray-400">Cadastre um colaborador</h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block poppins text-gray-600">Nome do Funcionário</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block poppins text-gray-600">E-mail</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block poppins text-gray-600">Senha</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block poppins text-gray-600">Departamento</label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cpf" className="block poppins text-gray-600">CPF do Funcionário</label>
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <label htmlFor="workJourneyType" className="block poppins text-gray-600">Tipo de Jornada</label>
                <input
                  type="text"
                  id="workJourneyType"
                  value={formData.workJourneyType}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employeeNumber" className="block poppins text-gray-600">Número do Funcionário</label>
                <input
                  type="text"
                  id="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="dailyHours" className="block poppins text-gray-600">Horas Diárias</label>
                <input
                  type="number"
                  id="dailyHours"
                  value={formData.dailyHours}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankOfHours" className="block poppins text-gray-600">Banco de Horas</label>
                <input
                  type="number"
                  id="bankOfHours"
                  value={formData.bankOfHours}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block poppins text-gray-600">Data de Nascimento (YYYY-MM-DD)</label>
                <input
                  type="text"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full poppins bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Cadastrar
            </button>
            <button className="w-full poppins bg-red-500 text-white font-semibold p-3 rounded-lg hover:bg-red-600 transition">
              <a href='/colaboradores'>Voltar</a>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}