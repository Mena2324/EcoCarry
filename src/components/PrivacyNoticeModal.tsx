import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { X, ShieldCheck, Lock, Eye, Database, Trash2, CheckCircle2 } from 'lucide-react';

export const PrivacyNoticeModal: React.FC = () => {
  const { isPrivacyNoticeOpen, setIsPrivacyNoticeOpen, setIsDeleteAccountOpen } = useGreenBag();

  if (!isPrivacyNoticeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[88vh] rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-5 sm:p-6 shadow-tactile-fab relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DEC2]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#def3e3] border border-[#4A943E]/30 flex items-center justify-center text-[#186049]">
              <ShieldCheck className="w-5 h-5 text-[#186049]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#14261C]">Campus Privacy Notice</h2>
              <p className="text-[10px] text-[#2D3E35] font-semibold">EcoCarry Data Governance & Student Rights</p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivacyNoticeOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#def3e3] text-[#2D3E35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-[#2D3E35] pr-1">
          <div className="p-3 rounded-xl bg-[#def3e3]/60 border border-[#4A943E]/20">
            <span className="font-bold text-[#186049] block mb-1">Our Eco Commitment</span>
            <p className="text-[11px] leading-relaxed">
              EcoCarry is designed exclusively for Asia Pacific University campus bag sharing and plastic diversion.
              We collect only the bare minimum data required to facilitate loans and reward verified sustainability efforts.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#14261C] flex items-center gap-1.5 mb-1.5">
              <Database className="w-4 h-4 text-[#186049]" /> 1. Data We Collect
            </h3>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-[#2D3E35]">
              <li><strong>Student Credentials:</strong> Full name, university email, and student ID.</li>
              <li><strong>Loan Records:</strong> Bag identifier (e.g. GB-1001), kiosk station ID, and borrow/return server timestamps.</li>
              <li><strong>Sustainability Metrics:</strong> Number of bags diverted, calculated carbon footprint avoided, and loyalty stamps.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#14261C] flex items-center gap-1.5 mb-1.5">
              <Lock className="w-4 h-4 text-[#186049]" /> 2. Security & Verification
            </h3>
            <p className="text-[11px] leading-relaxed">
              All transactions are secured by Firebase Authentication and Firestore Security Rules.
              Points and stamps are verified through server-side rules and Firestore transactions to prevent unauthorized modifications.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#14261C] flex items-center gap-1.5 mb-1.5">
              <Eye className="w-4 h-4 text-[#186049]" /> 3. No Commercial Tracking
            </h3>
            <p className="text-[11px] leading-relaxed">
              EcoCarry never sells, monetizes, or shares personal student data with commercial third parties.
              Data is retained strictly for the duration of your academic enrollment.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20">
            <h3 className="font-bold text-[#ba1a1a] flex items-center gap-1.5 mb-1">
              <Trash2 className="w-4 h-4 text-[#ba1a1a]" /> 4. Right to Deletion (GDPR & FERPA)
            </h3>
            <p className="text-[11px] text-[#2D3E35] leading-relaxed mb-2">
              You maintain full ownership of your data. You may delete your account and purge all active records,
              stamps, activity logs, and credentials at any time.
            </p>
            <button
              onClick={() => {
                setIsPrivacyNoticeOpen(false);
                setIsDeleteAccountOpen(true);
              }}
              className="text-xs font-bold text-[#ba1a1a] hover:underline flex items-center gap-1"
            >
              Open Account Deletion Option →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2DEC2] flex items-center justify-between">
          <span className="text-[10px] text-[#707974] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A943E]" /> APU Sustainability Office
          </span>
          <button
            onClick={() => setIsPrivacyNoticeOpen(false)}
            className="px-4 py-2 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold transition-all shadow-tactile-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
