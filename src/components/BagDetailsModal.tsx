import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  X,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Clock,
  QrCode,
  Tag,
} from 'lucide-react';

export const BagDetailsModal: React.FC = () => {
  const {
    selectedBagDetails,
    setSelectedBagDetails,
    setIsScannerOpen,
    setScannerMode,
    setPreselectedBagIdForReturn,
  } = useGreenBag();

  if (!selectedBagDetails) return null;

  const bag = selectedBagDetails;

  const handleReturnFromDetails = () => {
    setPreselectedBagIdForReturn(bag.id);
    setScannerMode('return');
    setSelectedBagDetails(null);
    setIsScannerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-6 shadow-tactile-fab relative">
        <button
          onClick={() => setSelectedBagDetails(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#def3e3] text-[#2D3E35] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bag Header */}
        <div className="text-center pb-4 border-b border-[#E2DEC2]">
          <div className="w-14 h-14 rounded-2xl bg-[#def3e3] border border-[#E2DEC2] flex items-center justify-center mx-auto mb-2 text-[#186049] shadow-sm">
            <Tag className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A943E] bg-[#def3e3] px-2.5 py-0.5 rounded-full">
            Active Loan
          </span>
          <h2 className="text-xl font-extrabold text-[#14261C] mt-1.5">{bag.bagNumber}</h2>
          <p className="text-xs font-semibold text-[#2D3E35]">{bag.type}</p>
        </div>

        {/* Detailed Stats */}
        <div className="py-4 space-y-2.5 text-xs text-[#2D3E35]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#e3f9e9]/60 border border-[#E2DEC2]/60">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#4A943E]" /> Return Policy
            </span>
            <span className="font-extrabold text-[#186049]">Keep as long as needed • No 7-day limit</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#186049]" /> Origin Station
            </span>
            <span className="font-bold text-[#14261C] text-right truncate max-w-[160px]">
              {bag.borrowedStationName}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#707974]" /> Borrowed On
            </span>
            <span className="font-bold text-[#14261C]">{bag.borrowedAt}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E2DEC2]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A943E]" /> UV-C Sanitization
            </span>
            <span className="font-bold text-[#186049]">{bag.washCount} cycles certified</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#ECE8AF] border border-[#E2DEC2]">
            <span className="flex items-center gap-1.5 font-medium text-[#186049]">
              <Sparkles className="w-3.5 h-3.5 text-[#D98327]" /> Single-Use Offset
            </span>
            <span className="font-extrabold text-[#186049]">+{bag.co2SavedGrams}g CO₂ avoided</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleReturnFromDetails}
            className="w-full py-3.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-tactile-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Drop-off / Return Now
          </button>
          <button
            onClick={() => setSelectedBagDetails(null)}
            className="w-full py-2.5 rounded-full bg-[#FAF9F5] hover:bg-[#def3e3] text-[#2D3E35] border border-[#E2DEC2] text-xs font-semibold transition-all"
          >
            Keep Carrying
          </button>
        </div>
      </div>
    </div>
  );
};
