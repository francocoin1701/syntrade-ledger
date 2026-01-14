import React from 'react';
import { useReadContract } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '../constants';
import LoanCard from './LoanCard';
import { Store, Loader2 } from 'lucide-react';

export default function Marketplace() {
  const { data: loanCounter, isLoading } = useReadContract({
    address: FACTORY_ADDRESS, abi: FACTORY_ABI, functionName: 'loanCounter', watch: true,
  });

  const totalLoans = loanCounter ? Number(loanCounter) : 0;
  const loanIds = totalLoans > 0 ? Array.from({ length: totalLoans }, (_, i) => i + 1) : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-900 text-white rounded-lg"><Store size={24} /></div>
        <h2 className="text-2xl font-bold text-slate-800">Mercado Secundario</h2>
      </div>

      {isLoading ? (
        <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loanIds.map((id) => (
            // FILTRO: Solo mostrar si está listado
            <LoanCard key={id} loanId={id} filterType="market" />
          ))}
        </div>
      )}
    </div>
  );
}