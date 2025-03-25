// import { useState } from "react";
// import Modal from "../../modais/modalPadrao";

// export default function ConteudoPaginaUsuario() {
//     //iniciando variáveis para utilizar o modal
//     const [modalAberto, setModalAberto] = useState(false);

//     return (
//         <>
//         <div className="overflow-hidden pt-20">
//             <div className="flex">
//                 Conteúdo da primeira página
//             </div>
//             {/* Botão de abrir Modal */}
//             <button 
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={() => setModalAberto(!modalAberto)}
//             >
//                 Abrir Modal
//             </button>
//         </div>
//         <Modal isOpen={modalAberto} onClose={() => setModalAberto(!modalAberto)}>
//                 <h2 className="text-lg font-bold">Conteúdo do Modal</h2>
//                 <p>Este é um modal simples.</p>
//         </Modal>
//         </>
//     );
// } 