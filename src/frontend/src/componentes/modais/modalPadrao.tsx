import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    Botão Fechar Modal
                </button>
                <div className="modal-body">
                    <div className="scrollable-area">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;