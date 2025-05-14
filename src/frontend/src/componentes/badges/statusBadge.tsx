export default function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    ESCALADO: { text: 'Escalado', color: 'bg-green-100 text-green-800' },
    FOLGA: { text: 'Folga', color: 'bg-yellow-100 text-yellow-800' },
    INATIVO: { text: 'Inativo', color: 'bg-gray-200 text-gray-800' },
    default: { text: status, color: 'bg-blue-100 text-blue-800' }
  };

  const styleStatus = statusStyles[status as keyof typeof statusStyles] || statusStyles.default;

  return (
    <span className={`px-3 py-1 rounded-full text-xs justify-start font-medium ${styleStatus.color}`}>
      {styleStatus.text}
    </span>
  );
}