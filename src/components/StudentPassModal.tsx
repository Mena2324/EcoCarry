import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { X, ShieldCheck, Sparkles, Leaf, CheckCircle2, User } from 'lucide-react';

export const StudentPassModal: React.FC = () => {
  const { isStudentPassOpen, setIsStudentPassOpen, user, logout } = useGreenBag();

  if (!isStudentPassOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-5 shadow-tactile-fab relative animate-subtle-pulse">
        {/* Close Button */}
        <button
          onClick={() => setIsStudentPassOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#def3e3] text-[#2D3E35] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Campus Card */}
        <div className="rounded-[20px] bg-gradient-to-br from-[#186049] via-[#004734] to-[#14261C] text-white p-5 shadow-tactile-md relative overflow-hidden">
          {/* Subtle gold watermarks */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D98327]/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute right-4 bottom-4 text-white/10 pointer-events-none">
            <Leaf className="w-28 h-28 transform -rotate-12" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-[#93d8bb]">
                  <Leaf className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold uppercase tracking-widest text-[#acf1d3]">
                    EcoCarry Pass
                  </span>
                  <span className="block text-[9px] text-white/70">Asia Pacific University</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D98327] text-white">
                {user.tier}
              </span>
            </div>

            {/* Profile Row */}
            <div className="mt-4 flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#def3e3] border-2 border-[#93d8bb] flex items-center justify-center text-[#186049] shrink-0 overflow-hidden shadow-sm">
                <User className="w-8 h-8 text-[#186049]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
                  {user.studentName}
                </h3>
                <span className="text-xs font-mono font-bold text-[#acf1d3] block">
                  {user.studentId}
                </span>
                <span className="text-[10px] text-white/80 block mt-0.5">
                  {user.faculty}
                </span>
              </div>
            </div>

            {/* Scannable Barcode & QR Code */}
            <div className="mt-5 p-3 rounded-xl bg-white text-[#14261C] flex flex-col items-center justify-center shadow-inner">
              {/* Simulated barcode */}
              <div className="flex items-center justify-center gap-[3px] h-10 w-full px-2">
                {Array.from({ length: 44 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full ${
                      i % 3 === 0
                        ? 'w-[3px] bg-black'
                        : i % 2 === 0
                        ? 'w-[1.5px] bg-black'
                        : 'w-[1px] bg-black/40'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-widest text-black font-bold mt-1">
                {user.studentId} • VERIFIED-NFC
              </span>
            </div>

            {/* Footer metadata */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-white/80">
              <span className="flex items-center gap-1 font-semibold text-[#acf1d3]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Good Standing • Unlimited Loan Period
              </span>
              <span>Member since {user.memberSince}</span>
            </div>
          </div>
        </div>

        {/* Verification guarantee info */}
        <div className="mt-4 p-3 rounded-xl bg-[#def3e3] border border-[#E2DEC2] text-xs text-[#2D3E35] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#186049] shrink-0" />
          <span>
            This digital pass grants instant checkout privileges at all 6 APU Eco kiosks.
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setIsStudentPassOpen(false)}
            className="flex-1 py-3 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold transition-all shadow-tactile-sm"
          >
            Close Pass
          </button>
          <button
            onClick={() => {
              setIsStudentPassOpen(false);
              logout();
            }}
            className="py-3 px-4 rounded-full bg-[#FAF9F5] border border-[#E2DEC2] text-[#ba1a1a] hover:bg-[#ffdad6] text-xs font-bold transition-colors"
            title="Sign out of this student pass"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
