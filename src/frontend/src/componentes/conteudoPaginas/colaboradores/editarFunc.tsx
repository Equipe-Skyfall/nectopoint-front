import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useEdit } from '../../hooks/useEdit';

interface FormData {
    name: string;
    email: string;
    password: string;
    cpf: string;
    title: string;
    department: string,
    workJourneyType: string;
    employeenumber: string;
    bankOfHours: string;
    dailyHours: string;
}

const EditarFuncionario = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        loading, 
        error, 
        getEmployeeById, 
        updateEmployee,
        clearError 
    } = useEdit();
    
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        cpf: '',
        cargo: '',
        departamento: '',
        horas_diarias: 8
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Carrega os dados do funcionário
    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const employee = await getEmployeeById(id);
                setFormData({
                    name: employee.name || '',
                    email: employee.email || '',
                    password: employee.password || '',
                    cpf: employee.cpf || '',
                    title: employee.title || '',
                    department: employee.department || '',
                    workJourneyType: employee.workJourneyType || '',
                    employeenumber: employee.employeenumber || '',
                    bankOfHours: employee.bankOfHours || '',
                    dailyHours: employee.dailyHours || '',
                
                });
            } catch (err) {
                console.error('Erro ao carregar funcionário:', err);
                setSubmitStatus('error');
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'horas_diarias' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || !id) return;

        clearError();
        setSubmitStatus('idle');

        try {
            await updateEmployee(id, formData);
            setSubmitStatus('success');
            
            // Feedback visual antes de redirecionar
            setTimeout(() => {
                navigate('/lista-funcionarios');
            }, 1500);
        } catch (err) {
            console.error('Erro ao atualizar:', err);
            setSubmitStatus('error');
        }
    };

    if (loading && !formData.nome) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="mt-16 min-h-screen p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                        disabled={loading}
                    >
                        <FaArrowLeft className="mr-2" />
                        Voltar
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Editar Funcionário: {formData.name}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">E-mail</label>
                            <input
                                type="text"
                                name="horas_diarias"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Senha</label>
                            <input
                                type="text"
                                name="horas_diarias"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-gray-700">CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-gray-700">Cargo</label>
                            <input
                                type="text"
                                name="cargo"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-gray-700">Departamento</label>
                            <input
                                type="text"
                                name="departamento"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-gray-700">Jornada de trabalho</label>
                            <input
                                type="text"
                                name="horas_diarias"
                                value={formData.workJourneyType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Numero do Funcionário</label>
                            <input
                                type="text"
                                name="horas_diarias"
                                value={formData.employeenumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Banco de Horas</label>
                            <input
                                type="number"
                                name="horas_diarias"
                                value={formData.bankOfHours}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700">Horas Diárias</label>
                            <input
                                type="number"
                                name="horas_diarias"
                                value={formData.dailyHours}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                min="1"
                                max="12"
                            />
                        </div>

                    </div>

                    {/* Mensagens de status */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            {error}
                        </div>
                    )}

                    {submitStatus === 'success' && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                            Funcionário atualizado com sucesso!
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded min-w-32 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
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