import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { Home, MapPin, Scan, Ticket, Users } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsScannerOpen, setScannerMode, setPreselectedBagIdForReturn } = useGreenBag();

  const handleOpenScanner = () => {
    setPreselectedBagIdForReturn(null);
    setScannerMode('borrow');
    setIsScannerOpen(true);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E2DEC2] pb-safe pt-1">
      <div className="max-w-md mx-auto px-4 relative flex items-center justify-between h-18">
        {/* Left Side: Home & Stations */}
        <div className="flex items-center justify-around flex-1 pr-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'home'
                ? 'text-[#186049] font-bold scale-105'
                : 'text-[#707974] hover:text-[#14261C] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'home' ? 'bg-[#def3e3]' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'stations'
                ? 'text-[#186049] font-bold scale-105'
                : 'text-[#707974] hover:text-[#14261C] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'stations' ? 'bg-[#def3e3]' : ''}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Stations</span>
          </button>
        </div>

        {/* Center Floating Action Button (Elevated 64px button as specified) */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 flex flex-col items-center">
          <button
            onClick={handleOpenScanner}
            aria-label="Scan bag or return bin"
            className="w-16 h-16 rounded-full bg-[#186049] hover:bg-[#004734] text-white flex items-center justify-center shadow-tactile-fab transition-transform transform active:scale-95 hover:scale-105 ring-4 ring-[#FAF9F5] group"
          >
            <div className="relative">
              <Scan className="w-7 h-7 text-white stroke-[2.2]" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#4A943E] rounded-full border-2 border-[#186049]" />
            </div>
          </button>
          <span className="text-[10px] font-bold tracking-wider text-[#186049] mt-1 uppercase">
            Scan QR
          </span>
        </div>

        {/* Right Side: Rewards & Community */}
        <div className="flex items-center justify-around flex-1 pl-6">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'rewards'
                ? 'text-[#186049] font-bold scale-105'
                : 'text-[#707974] hover:text-[#14261C] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'rewards' ? 'bg-[#def3e3]' : ''}`}>
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Perks</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'community'
                ? 'text-[#186049] font-bold scale-105'
                : 'text-[#707974] hover:text-[#14261C] font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-full ${activeTab === 'community' ? 'bg-[#def3e3]' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Pulse</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
