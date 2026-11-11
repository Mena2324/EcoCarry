import React, { useState } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { X, AlertTriangle, Trash2, ShieldAlert, Check } from 'lucide-react';

export const AccountDeletionModal: React.FC = () => {
  const { isDeleteAccountOpen, setIsDeleteAccountOpen, deleteAccount, activeBags, user } = useGreenBag();
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteAccountOpen) return null;

  const hasActiveBags = activeBags.length > 0;

  const handleDelete = async () => {
    if (!confirmedCheckbox || hasActiveBags) return;
    setIsDeleting(true);
    try {
      await deleteAccount();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-5 sm:p-6 shadow-tactile-fab relative">
        <button
          onClick={() => setIsDeleteAccountOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#def3e3] text-[#2D3E35] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-2 border border-[#ba1a1a]/20">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-extrabold text-[#14261C]">Delete EcoCarry Account</h2>
          <p className="text-xs text-[#2D3E35] mt-0.5">Permanent removal of student credentials & records</p>
        </div>

        {hasActiveBags ? (
          <div className="my-4 p-3.5 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 text-xs text-[#ba1a1a] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Active Borrowed Bags Detected ({activeBags.length})</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#2D3E35]">
              You currently have {activeBags.length} bag(s) checked out. Please deposit them at any campus kiosk
              before deleting your account.
            </p>
          </div>
        ) : (
          <div className="my-4 space-y-3 text-xs text-[#2D3E35]">
            <p className="text-[11px] leading-relaxed">
              Deleting your account for <strong>{user.studentName}</strong> ({user.studentId}) will permanently:
            </p>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-[#707974]">
              <li>Purge your profile from Firebase Auth and Firestore.</li>
              <li>Erase all active points ({user.points} pts) and loyalty stamps.</li>
              <li>Invalidate any issued single-use vouchers.</li>
              <li>Clear all local device cookies and cached session keys.</li>
            </ul>

            {/* Confirmation Checkbox */}
            <div className="bg-[#ECE8AF]/50 p-3 rounded-xl border border-[#E2DEC2] flex items-start gap-2.5 mt-3">
              <button
                type="button"
                onClick={() => setConfirmedCheckbox(!confirmedCheckbox)}
                className={`w-[20px] h-[20px] rounded-[5px] shrink-0 flex items-center justify-center transition-all ${
                  confirmedCheckbox ? 'bg-[#ba1a1a] text-white' : 'bg-white border border-[#E2DEC2]'
                }`}
              >
                {confirmedCheckbox && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <label
                onClick={() => setConfirmedCheckbox(!confirmedCheckbox)}
                className="text-[11px] font-semibold text-[#14261C] cursor-pointer select-none leading-tight"
              >
                I understand that this action is irreversible and my eco balance will be lost.
              </label>
            </div>
          </div>
        )}

        <div className="pt-2 space-y-2">
          <button
            onClick={handleDelete}
            disabled={!confirmedCheckbox || hasActiveBags || isDeleting}
            className="w-full py-3.5 rounded-full bg-[#ba1a1a] hover:bg-[#93000a] disabled:opacity-40 text-white font-bold text-xs shadow-tactile-sm transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}</span>
          </button>
          <button
            onClick={() => setIsDeleteAccountOpen(false)}
            className="w-full py-2.5 rounded-full text-xs font-semibold text-[#2D3E35] hover:bg-[#def3e3] transition-colors"
          >
            Cancel / Keep Account
          </button>
        </div>
      </div>
    </div>
  );
};
