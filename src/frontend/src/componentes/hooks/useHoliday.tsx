import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export default function useHolidayHook() {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    repeatsYearly: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  const fetchHolidays = async (pageNumber = 0, pageSize = 6) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/feriados/listar?page=${pageNumber}&size=${pageSize}`);
      setHolidays(response.data.content);
      setPage(response.data.number);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar feriados:", );
      toast.error('Erro ao carregar feriados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Updated submit function to accept userIds array
  const handleSubmit = async (e, selectedUserIds = []) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
      repeatsYearly: form.repeatsYearly,
      userIds: selectedUserIds, // Use the passed userIds instead of parsing string
    };

    try {
      await axios.post("http://localhost:8080/feriados/", payload);
      toast.success("Feriado cadastrado com sucesso!");
      setShowModal(false);
      fetchHolidays(page);
      resetForm();
    } catch (error) {
      
      toast.error("Erro ao cadastrar feriado , : " + error.response?);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/feriados/${id}`);
      fetchHolidays(page);
      return true;
    } catch (error) {
      console.error("Erro ao deletar feriado:", error);
      throw error;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchHolidays(newPage);
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const resetForm = () => {
    setForm({
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      repeatsYearly: false,
    });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      resetForm();
    }
  };

  return {
    form,
    showModal,
    holidays,
    page,
    totalPages,
    loading,
    handleChange,
    handleSubmit,
    handleDelete,
    handlePageChange,
    formatShortDate,
    toggleModal,
    setShowModal,
    resetForm
  };
}