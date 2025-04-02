import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useEdit } from '../../hooks/useEdit';
import recarregar from '../../hooks/hooksChamarBackend/recarregar';

interface FormData {
    name: string;
    email: string;
    password?: string;
    cpf: string;
    title: 'GERENTE' | 'COLABORADOR';
    department: string;
    workJourneyType: string;
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
        workJourneyType: '',
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
                    workJourneyType: employee.workJourneyType || '',
                    employeeNumber: employee.employeeNumber || '',
                    bankOfHours: Number(employee.bankOfHours) || 0,
                    dailyHours: Number(employee.dailyHours) || 8,
                    birthDate: employee.birthDate || ''
                });
                console.log('Dados do funcionário:', employee);
                
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
            
            setTimeout(() => navigate('/colaboradores'));
            recarregar();
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
        <div className="mt-7 p-4 md:p-6 !overflow-y-hidden">
            <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md p-6">
                <div className="flex  gap-0 sm:flex-row flex-col items-center mb-6">
                    <button
                        onClick={() => navigate('/colaboradores')}
                        className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                        disabled={loading}
                    >
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </button>
                    <h2 className="sm:text-2xl text-xl font-semibold sm:mt-0 mt-5 text-blue-600">
                        Editar Colaborador: {formData.name}
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
                            <input
                                type="text"
                                name="workJourneyType"
                                value={formData.workJourneyType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
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

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            {error}
                        </div>
                    )}

                    {submitStatus === 'success' && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                            Funcionário atualizado com sucesso! Redirecionando...
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center sm:w-40 w-full justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded min-w-32 ${loading ? 'opacity-50 cursor-not-allowed' : ''
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
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarFuncionario;