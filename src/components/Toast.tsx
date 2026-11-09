import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useGreenBag();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none transition-all duration-300">
      <div
        className={`p-3.5 rounded-2xl shadow-tactile-fab border flex items-center gap-2.5 backdrop-blur-md ${
          toastMessage.type === 'warning'
            ? 'bg-[#ffdcc1]/95 border-[#D98327] text-[#5f3300]'
            : toastMessage.type === 'info'
            ? 'bg-[#ECE8AF]/95 border-[#E2DEC2] text-[#14261C]'
            : 'bg-[#186049]/95 border-[#93d8bb] text-white'
        }`}
      >
        {toastMessage.type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-[#D98327] shrink-0" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-5 h-5 text-[#186049] shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#93d8bb] shrink-0" />
        )}
        <p className="text-xs font-bold leading-tight">{toastMessage.text}</p>
      </div>
    </div>
  );
};
