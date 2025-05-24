import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useEdit } from '../../hooks/useEdit';
import recarregar from '../../hooks/hooksChamarBackend/recarregar';
import { motion } from 'framer-motion';

interface FormData {
    name: string;
    email: string;
    password?: string;
    cpf: string;
    title: 'GERENTE' | 'COLABORADOR';
    department: string;
    workJourneyType: 'CINCO_X_DOIS' | 'SEIS_X_UM';
    employeeNumber: string;
    dailyHours: number;
    bankOfHours: number;
    birthDate: string;
}

const EditarFuncionario = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { loading, error, getEmployeeById, updateEmployee, clearError } = useEdit();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        cpf: '',
        title: 'COLABORADOR',
        department: '',
        workJourneyType: 'CINCO_X_DOIS',
        employeeNumber: '',
        bankOfHours: 0,
        dailyHours: 8,
        birthDate: '',
    });
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const formatCPF = (value: string): string => {
        const cleaned = value.replace(/\D/g, '').slice(0, 11);
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
        if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
    };

    useEffect(() => {
        if (!id || initialDataLoaded) return;

        const loadData = async () => {
            try {
                const employee = await getEmployeeById(id);
                setFormData({
                    name: employee.name || '',
                    email: employee.email || '',
                    password: employee.password || '',
                    cpf: formatCPF(employee.cpf || ''),
                    title: employee.title || 'COLABORADOR',
                    department: employee.department || '',
                    workJourneyType: employee.workJourneyType || 'CINCO_X_DOIS',
                    employeeNumber: employee.employeeNumber || '',
                    bankOfHours: Number(employee.bankOfHours) || 0,
                    dailyHours: Number(employee.dailyHours) || 8,
                    birthDate: employee.birthDate || ''
                });


                setInitialDataLoaded(true);
            } catch (err) {
                console.error('Erro ao carregar funcionário:', err);
                setSubmitStatus('error');
            }
        };

        loadData();
    }, [id, getEmployeeById, initialDataLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            const formattedValue = formatCPF(value);
            setFormData(prev => ({
                ...prev,
                cpf: formattedValue
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'dailyHours' || name === 'bankOfHours'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || isNaN(Number(id)) || !formData) {
            alert("Dados inválidos");
            return;
        }

        try {
            setSubmitStatus('idle');
            clearError();

            const payload = {
                id: Number(id),
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                cpf: formData.cpf.replace(/\D/g, ''),
                title: formData.title,
                department: formData.department,
                workJourneyType: formData.workJourneyType,
                employeeNumber: formData.employeeNumber,
                dailyHours: formData.dailyHours,
                bankOfHours: formData.bankOfHours,
                birthDate: formData.birthDate
            };

            await updateEmployee(id, payload);
            setSubmitStatus('success');
            recarregar();
            setTimeout(() => navigate('/colaboradores'), 0);

        } catch (err) {
            setSubmitStatus('error');
            console.error("Erro ao atualizar:", err);
            alert(err.response?.data?.message || "Erro ao atualizar. Verifique os dados e tente novamente.");
        }
    };

    if (loading && !initialDataLoaded) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-16 min-h-screen p-4 md:p-6 poppins"
        >
            <div className="max-w-7xl mx-auto">
                {/* Título com gradiente */}
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
                >
                    Editar Colaborador: {formData.name}
                </motion.h2>

                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
                    <div className="flex gap-0 sm:flex-row flex-col items-center mb-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/colaboradores')}
                            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            disabled={loading}
                        >
                            <FaArrowLeft className="mr-2" />
                            Voltar
                        </motion.button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campo Nome */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nome*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </motion.div>

                            {/* Campo E-mail */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">E-mail*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </motion.div>

                            {/* Campo CPF */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">CPF*</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                />
                            </motion.div>

                            {/* Campo Cargo */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Cargo*</label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                >
                                    <option value="COLABORADOR">Colaborador</option>
                                    <option value="GERENTE">Gerente</option>
                                </select>
                            </motion.div>

                            {/* Campo Departamento */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Departamento*</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </motion.div>

                            {/* Campo Jornada */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Tipo de Jornada*</label>
                                <select
                                    name="workJourneyType"
                                    value={formData.workJourneyType}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                >
                                    <option value="CINCO_X_DOIS">5x2 (5 dias trabalhados, 2 folgas)</option>
                                    <option value="SEIS_X_UM">6x1 (6 dias trabalhados, 1 folga)</option>
                                </select>
                            </motion.div>

                            {/* Campo Número do Colaborador */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Número do Colaborador*</label>
                                <input
                                    type="text"
                                    name="employeeNumber"
                                    value={formData.employeeNumber}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </motion.div>

                            {/* Campo Banco de Horas */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Banco de Horas</label>
                                <input
                                    type="number"
                                    name="bankOfHours"
                                    value={formData.bankOfHours}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    step="0.5"
                                />
                            </motion.div>

                            {/* Campo Horas Diárias */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Horas Diárias*</label>
                                <input
                                    type="number"
                                    name="dailyHours"
                                    value={formData.dailyHours}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    min="1"
                                    max="12"
                                    required
                                />
                            </motion.div>

                            {/* Campo Data de Nascimento */}
                            <motion.div whileHover={{ y: -2 }} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Data de Nascimento*</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </motion.div>
                        </div>

                        {/* Mensagens de erro/sucesso */}
                        {error && (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg shadow-md"
                            >
                                <p className="font-medium">{error}</p>
                            </motion.div>
                        )}

                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="p-4 bg-green-100 border-l-4 border-green-600 text-green-800 rounded-lg shadow-md"
                            >
                                <p className="font-medium">Funcionário atualizado com sucesso! Redirecionando...</p>
                            </motion.div>
                        )}

                        {/* Botão de submit */}
                        <div className="flex justify-end pt-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        Salvar Alterações
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default EditarFuncionario;