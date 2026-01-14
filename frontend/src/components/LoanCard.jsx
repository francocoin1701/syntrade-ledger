import React, { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignMessage } from 'wagmi';
import { formatEther } from 'viem';
import { FACTORY_ADDRESS, FACTORY_ABI, NFT_ADDRESS, NFT_ABI, MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from '../constants';
import { FileText, Activity, ShieldAlert, Lock, Eye, Banknote, Building2, ShoppingCart, Loader2, CheckCircle, HandCoins, ArrowRight, AlertCircle } from 'lucide-react';

const METADATA_DB = {
  1: { borrower: "GreenVolt Energies SA", amount: "EUR 25,000,000", rate: "5.5%", type: "Term Loan B", sector: "Energy" },
  2: { borrower: "London Infrastructure Ltd", amount: "GBP 10,000,000", rate: "4.2%", type: "RCF", sector: "Construction" },
  3: { borrower: "Corporate Borrower S.A.", amount: "USD 5,000,000", rate: "Float + 3%", type: "Syndicated", sector: "General" },
  4: { borrower: "Tech Giant Inc", amount: "USD 12,000,000", rate: "6.0%", type: "Term Loan A", sector: "Technology" },
  default: { borrower: "Unknown Borrower", amount: "---", rate: "---", type: "Loan", sector: "General" }
};

export default function LoanCard({ loanId, filterType, onSellClick }) {
  if (!loanId) return null;
  const id = BigInt(loanId);

  const { address } = useAccount();
  const meta = METADATA_DB[Number(loanId)] || METADATA_DB.default;
  const [offerPrice, setOfferPrice] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);

  // --- LECTURAS ---
  const { data: owner } = useReadContract({
    address: NFT_ADDRESS, abi: NFT_ABI, functionName: 'ownerOf', args: [id], watch: true
  });
  const { data: loanData } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'debtRecords', args: [id],
  });
  const { data: listing } = useReadContract({
    address: MARKETPLACE_ADDRESS, abi: MARKETPLACE_ABI, functionName: 'listings', args: [id], watch: true
  });

  // --- ESCRITURA (USANDO ASYNC PARA CAPTURAR ERRORES) ---
  const { writeContractAsync, data: buyHash, isPending: isBuying } = useWriteContract();
  const { isLoading: isConfirmingBuy, isSuccess: isBought } = useWaitForTransactionReceipt({ hash: buyHash });
  const { signMessageAsync } = useSignMessage();

  if (!owner || !loanData) return <div className="bg-slate-100 h-80 rounded-xl animate-pulse m-2"></div>;

  // --- ESTADOS ---
  const isListed = listing && listing[2] === true;
  const priceWei = isListed ? listing[0] : BigInt(0);
  const priceEth = isListed ? formatEther(priceWei) : "0";
  const seller = listing ? listing[1] : null;
  
  const amIOwner = owner === address;
  const amISeller = seller === address;

  // --- FILTRADO ---
  if (filterType === 'market' && !isListed) return null;
  if (filterType === 'portfolio') {
    if (!amIOwner) return null;
    if (isListed) return null;
  }

  // --- FUNCIÓN COMPRAR BLINDADA ---
  const handleBuy = async () => {
    if (!isListed) return;
    
    console.log("Intentando comprar ID:", id.toString());
    console.log("Precio Wei:", priceWei.toString());
    console.log("Dirección Mercado:", MARKETPLACE_ADDRESS);

    try {
      await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: 'buyLoan',
        args: [id],
        value: priceWei // Envío de ETH
      });
    } catch (error) {
      console.error("ERROR DE COMPRA:", error);
      // Muestra el error exacto en pantalla (ej: Insufficient Funds)
      alert(`ERROR: ${error.shortMessage || error.message}`);
    }
  };

  const handleOffer = async () => {
    if(!offerPrice) return;
    try {
      await signMessageAsync({ message: `Oferta: ${offerPrice} ETH (ID #${id})` });
      alert("Oferta enviada");
      setShowOfferInput(false);
    } catch (e) { console.error(e); }
  };

  const health = loanData[1] === 0 ? {color:'bg-green-500', text:'Excelente'} : {color:'bg-yellow-500', text:'Riesgo'};

  return (
    <div className={`bg-white rounded-xl overflow-hidden border shadow-sm flex flex-col m-2 
      ${isListed ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
      
      {/* CABECERA */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{meta.borrower}</h3>
            <p className="text-xs text-slate-500">{meta.type}</p>
          </div>
          {isListed && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow animate-pulse">
              {priceEth} ETH
            </span>
          )}
        </div>
      </div>

      {/* CUERPO */}
      <div className="p-5 space-y-4 flex-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Monto:</span>
          <span className={`font-bold text-slate-900 ${filterType === 'market' && !amIOwner ? 'blur-sm select-none' : ''}`}>
            {meta.amount}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Salud:</span>
          <span className={`font-bold text-green-600`}>Excelente</span>
        </div>
      </div>

      {/* --- BOTONES --- */}
      <div className="px-5 pb-5 space-y-2">
        
        {/* CASO: MERCADO */}
        {filterType === 'market' && (
          <>
            {isBought ? (
              <div className="w-full bg-green-100 text-green-700 font-bold py-2 rounded text-center">¡COMPRADO!</div>
            ) : (
              <div className="space-y-2">
                {/* BOTÓN COMPRAR */}
                <button 
                  onClick={handleBuy} 
                  disabled={isBuying || isConfirmingBuy} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg flex justify-center gap-2 shadow-sm"
                >
                  {isBuying || isConfirmingBuy ? <Loader2 className="animate-spin" size={16}/> : <><ShoppingCart size={18}/> Comprar Ahora</>}
                </button>

                {/* BOTÓN OFERTAR */}
                {!showOfferInput ? (
                  <button onClick={() => setShowOfferInput(true)} className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-2.5 rounded-lg flex justify-center gap-2 hover:bg-slate-50">
                    <HandCoins size={18}/> Hacer Oferta
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input type="number" placeholder="ETH" className="w-full p-2 border rounded" value={offerPrice} onChange={(e)=>setOfferPrice(e.target.value)}/>
                    <button onClick={handleOffer} className="bg-slate-900 text-white px-4 rounded font-bold">OK</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* CASO: CARTERA */}
        {filterType === 'portfolio' && (
          <button onClick={() => onSellClick(loanId)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg flex justify-center gap-2 transition-all">
            <ArrowRight size={18}/> Vender
          </button>
        )}

      </div>
    </div>
  );
}