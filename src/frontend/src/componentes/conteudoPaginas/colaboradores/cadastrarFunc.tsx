import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const CadastrarFunc = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        cpf: '',
        title: 'COLABORADOR',
        department: '',
        workJourneyType: 'CINCO_X_DOIS',
        employeeNumber: '',
        dailyHours: 8,
        bankOfHours: 0,
        birthDate: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const formatCPF = (value: string): string => {
        const cleaned = value.replace(/\D/g, '').slice(0, 11);
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            const formattedValue = formatCPF(value);
            setFormData(prev => ({ ...prev, cpf: formattedValue }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'dailyHours' || name === 'bankOfHours' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmitStatus('idle');

        try {
            await axios.post('/usuario/', {
                ...formData,
                cpf: formData.cpf.replace(/\D/g, '')
            });

            setSubmitStatus('success');
            setTimeout(() => navigate('/colaboradores'), 2000);
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setSubmitStatus('error');
            alert('Erro ao cadastrar funcionário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-7 p-4 md:p-6 !overflow-y-hidden">
            <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md p-6">
                <div className="flex gap-0 sm:gap-52 sm:flex-row flex-col items-center mb-6">
                    <button
                        onClick={() => navigate('/colaboradores')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                        disabled={loading}
                    >
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </button>
                    <h2 className="sm:text-2xl text-xl font-semibold sm:mt-0 mt-5 text-blue-600">
                        Cadastrar Colaborador
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-gray-700">Nome*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">E-mail*</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Senha*</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">CPF*</label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Cargo*</label>
                            <select
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="COLABORADOR">Colaborador</option>
                                <option value="GERENTE">Gerente</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Departamento*</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Tipo de Jornada*</label>
                            <select
                                name="workJourneyType"
                                value={formData.workJourneyType}
                                onChange={handleChange}
                                className="w-full p-2 border text-center rounded"
                                required
                            >
                                <option value="CINCO_X_DOIS">5x2 (5 dias trabalhados, 2 folgas)</option>
                                <option value="SEIS_X_UM">6x1 (6 dias trabalhados, 1 folga)</option>
                            </select>

                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Número do Colaborador*</label>
                            <input
                                type="text"
                                name="employeeNumber"
                                value={formData.employeeNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Banco de Horas</label>
                            <input
                                type="number"
                                name="bankOfHours"
                                value={formData.bankOfHours}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="0"
                                step="0.5"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Horas Diárias*</label>
                            <input
                                type="number"
                                name="dailyHours"
                                value={formData.dailyHours}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Data de Nascimento*</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    {submitStatus === 'success' && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                            Funcionário cadastrado com sucesso! Redirecionando...
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center sm:w-40 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded min-w-32 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastrarFunc;