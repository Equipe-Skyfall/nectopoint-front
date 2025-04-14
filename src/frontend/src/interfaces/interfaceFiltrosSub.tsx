export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
}

export interface StatusSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export interface TipoJornadaProps {
    jornadaSelecionada: string; 
    onChange: (value: string) => void;
}

export interface FiltrosColaboradorProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    jornadaSelecionada: string;
    setJornadaSelecionada: (value: string) => void;
    limparFiltros: () => void;
}

export interface FiltrosHistoricoProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusTurno: string;
    setStatusTurno: (value: string) => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    limparFiltros: () => void;
}