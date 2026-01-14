import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LayoutDashboard, PlusCircle, Store, Activity } from 'lucide-react';
import Tokenize from './components/Tokenize';
import MyLoans from './components/MyLoans';
import LoanCard from './components/LoanCard';
import Marketplace from './components/Marketplace';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MyLoans />;
      case 'tokenize':
        // AQUI ESTÁ EL CAMBIO:
        return <Tokenize />;
      case 'marketplace':
        return <Marketplace />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <Activity className="text-blue-400" />
          <span className="text-xl font-bold tracking-tight">SynTrade</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Mis Activos</span>
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'marketplace' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Store size={20} />
            <span className="font-medium">Mercado</span>
          </button>

          <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase">Operaciones</div>

          <button
            onClick={() => setActiveTab('tokenize')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'tokenize' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <PlusCircle size={20} />
            <span className="font-medium">Tokenizar</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-700 capitalize">
            {activeTab}
          </h2>
          <ConnectButton />
        </header>

        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;