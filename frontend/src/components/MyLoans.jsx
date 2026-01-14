import React, { useState } from 'react';
import { useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { FACTORY_ADDRESS, FACTORY_ABI, NFT_ADDRESS, NFT_ABI, MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from '../constants';
import LoanCard from './LoanCard';
import { Wallet, Tag, Gavel, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function MyLoans() {
  const [selectedId, setSelectedId] = useState(null);
  const [price, setPrice] = useState('');
  const [listingStep, setListingStep] = useState(0);

  // Leer todos los IDs
  const { data: loanCounter } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'loanCounter', watch: true,
  });
  const totalLoans = loanCounter ? Number(loanCounter) : 0;
  const loanIds = totalLoans > 0 ? Array.from({ length: totalLoans }, (_, i) => i + 1) : [];

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const handleCreateOrder = async () => {
    if (!price) return alert("Pon precio");
    try {
      setListingStep(1);
      // 1. Aprobar
      const tx1 = await writeContractAsync({
        address: NFT_ADDRESS, abi: NFT_ABI, functionName: 'approve', args: [MARKETPLACE_ADDRESS, BigInt(selectedId)],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx1 });
      
      setListingStep(2);
      // 2. Listar
      const tx2 = await writeContractAsync({
        address: MARKETPLACE_ADDRESS, abi: MARKETPLACE_ABI, functionName: 'listLoan', args: [BigInt(selectedId), parseEther(price)],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx2 });
      
      setListingStep(3);
      setTimeout(() => { 
        setSelectedId(null); 
        setListingStep(0); 
        setPrice('');
        window.location.reload(); // Recargar para actualizar vistas
      }, 2000);
    } catch (e) {
      console.error(e);
      alert("Error: " + (e.shortMessage || e.message));
      setListingStep(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 text-white rounded-lg"><Wallet size={24} /></div>
        <h2 className="text-2xl font-bold text-slate-800">Mi Cartera (Activos en Custodia)</h2>
      </div>

      {/* SOLO MUESTRA MIS ACTIVOS NO LISTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanIds.map((id) => (
          <LoanCard 
            key={id} 
            loanId={id} 
            filterType="portfolio" 
            onSellClick={(id) => setSelectedId(id)} 
          />
        ))}
      </div>

      {/* MODAL DE VENTA */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 p-5 text-white flex justify-between">
              <h3 className="font-bold">Vender Activo #{selectedId}</h3>
              <button onClick={() => setSelectedId(null)}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio de Venta (ETH)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-3 border rounded text-lg font-mono" placeholder="0.05" disabled={listingStep > 0} />
              </div>
              
              <button onClick={handleCreateOrder} disabled={listingStep > 0} className={`w-full py-3 rounded-lg font-bold text-white flex justify-center gap-2 ${listingStep === 3 ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {listingStep === 0 && "Crear Orden (2 Pasos)"}
                {listingStep === 1 && <><Loader2 className="animate-spin"/> Aprobando...</>}
                {listingStep === 2 && <><Loader2 className="animate-spin"/> Listando...</>}
                {listingStep === 3 && <><CheckCircle/> ¡Listo!</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}