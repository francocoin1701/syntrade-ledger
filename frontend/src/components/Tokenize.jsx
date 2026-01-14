import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { keccak256, encodePacked } from 'viem';
import { FACTORY_ADDRESS, FACTORY_ABI } from '../constants';
import { FileText, ShieldCheck, Loader2, ArrowRight, Banknote, Scale, Calendar, AlertCircle } from 'lucide-react';

const PENDING_LOANS = [
  {
    id: "SYN-2025-EU-001",
    borrower: "GreenVolt Energies SA",
    sector: "Energy / Renewables",
    type: "Term Loan B (Green Loan)",
    amount: "EUR 25,000,000",
    pricing: "EURIBOR + 325bps",
    maturity: "15 Dec 2029",
    governingLaw: "English Law",
    debtorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
    lmaCompliant: true
  },
  {
    id: "SYN-2025-UK-042",
    borrower: "London Infrastructure Ltd",
    sector: "Construction / Infra",
    type: "Revolving Credit Facility",
    amount: "GBP 10,000,000",
    pricing: "SONIA + 400bps",
    maturity: "01 Mar 2027",
    governingLaw: "English Law",
    debtorAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", 
    lmaCompliant: true
  }
];

export default function Tokenize() {
  const { address } = useAccount();
  
  // Estado para saber cuál préstamo se está procesando actualmente
  const [processingId, setProcessingId] = useState(null);
  
  // Estado para guardar qué préstamos ya se tokenizaron en esta sesión (para cambiar la UI)
  const [tokenizedIds, setTokenizedIds] = useState([]);

  // Hook de Escritura (Interacción con MetaMask)
  const { 
    data: hash, 
    writeContract, 
    isPending: isWalletOpening, 
    error: walletError 
  } = useWriteContract();

  // Hook de Espera (Esperando a Sepolia)
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash });

  // EFECTO: Cuando la transacción se confirma, actualizamos la UI
  useEffect(() => {
    if (isConfirmed && processingId) {
      setTokenizedIds(prev => [...prev, processingId]);
      setProcessingId(null); // Liberamos el estado de carga
    }
  }, [isConfirmed, processingId]);

  const handleTokenize = (loan) => {
    if (!address) return alert("Conecta tu wallet primero.");
    
    setProcessingId(loan.id); // Marcamos este préstamo como "en proceso"

    const legalHash = keccak256(encodePacked(['string'], [loan.id]));

    writeContract({
      address: FACTORY_ADDRESS,
      abi: FACTORY_ABI,
      functionName: 'tokenizeLoan',
      args: [loan.debtorAddress, address, legalHash], 
    }, {
      onError: (err) => {
        console.error("Error al firmar:", err);
        setProcessingId(null); // Si falla o cancela, reseteamos el botón
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Banknote className="text-blue-600"/> Originación Digital
        </h2>
        <p className="text-slate-500 mt-1">
          Convierte contratos fiat en activos digitales.
        </p>
      </div>

      {/* ERROR DE WALLET */}
      {walletError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
          <AlertCircle size={20}/>
          <span>Error: {walletError.shortMessage || walletError.message}</span>
        </div>
      )}

      {/* MENSAJE DE ESPERA DE RED */}
      {isConfirming && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 border border-blue-200 animate-pulse">
          <Loader2 className="animate-spin" size={20}/>
          <span>Confirmando transacción en Sepolia... Esto puede tardar unos 30 segundos.</span>
        </div>
      )}

      {/* MENSAJE DE ÉXITO */}
      {isConfirmed && !isConfirming && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
          <ShieldCheck size={20}/>
          <span>¡Activo creado! Ya puedes verlo en el Mercado.</span>
        </div>
      )}

      <div className="grid gap-6">
        {PENDING_LOANS.map((loan) => {
          const isProcessing = processingId === loan.id;
          const isDone = tokenizedIds.includes(loan.id);

          return (
            <div key={loan.id} className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${isDone ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:shadow-md'}`}>
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`p-3 border rounded-lg transition-colors ${isDone ? 'bg-green-100 text-green-600 border-green-200' : 'bg-white text-slate-600 border-slate-200'}`}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">{loan.borrower}</h3>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
                      {loan.sector}
                    </span>
                  </div>
                </div>
                
                {/* LÓGICA DEL BOTÓN */}
                <div>
                  {isDone ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm border border-green-200 shadow-sm cursor-default">
                      <ShieldCheck size={18} /> MINTED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleTokenize(loan)}
                      disabled={isProcessing || isConfirming}
                      className={`
                        px-6 py-3 rounded-lg font-bold text-sm transition-all shadow flex items-center gap-2
                        ${isProcessing || isConfirming 
                          ? 'bg-slate-300 text-slate-500 cursor-wait' 
                          : 'bg-slate-900 hover:bg-blue-600 text-white hover:shadow-lg'}
                      `}
                    >
                      {isProcessing && isWalletOpening ? 'Abriendo Wallet...' : 
                       isProcessing && isConfirming ? <><Loader2 className="animate-spin" size={18}/> Confirmando...</> : 
                       <>Tokenizar <ArrowRight size={18} /></>}
                    </button>
                  )}
                </div>
              </div>

              {/* ... (Resto de datos igual que antes) ... */}
              <div className="p-6 grid grid-cols-4 gap-6 text-sm opacity-90">
                <div><p className="text-slate-400 text-xs uppercase font-bold">Type</p>{loan.type}</div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Amount</p>{loan.amount}</div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Pricing</p>{loan.pricing}</div>
                <div><p className="text-slate-400 text-xs uppercase font-bold">Maturity</p>{loan.maturity}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}