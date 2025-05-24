export default function JornadaBadge ({ jornada }: { jornada: string }){ 
     const jornadaStyles = {
    'CINCO_X_DOIS': { text: '5 x 2', color: 'bg-blue-100 text-blue-800' },
    'SEIS_X_UM': { text: '6 x 1', color: 'bg-purple-100 text-purple-800' },
    default: { text: jornada, color: 'bg-gray-100 text-gray-800' }
  };

  const style = jornadaStyles[jornada] || jornadaStyles.default;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
      {style.text}
    </span>
  );
};