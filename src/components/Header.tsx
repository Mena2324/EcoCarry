import React from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import { Leaf, QrCode, Sparkles, RefreshCw, Smartphone, Monitor, LogOut, Database, Shield } from 'lucide-react';

interface HeaderProps {
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMobileFrame, setIsMobileFrame }) => {
  const {
    user,
    setIsStudentPassOpen,
    resetData,
    logout,
    setIsDevConsoleOpen,
    isCurrentUserAdmin,
    setIsPrivacyNoticeOpen,
  } = useGreenBag();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E2DEC2] px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#186049] flex items-center justify-center text-white shadow-tactile-sm">
            <Leaf className="w-5 h-5 text-[#93d8bb]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#14261C]">
                EcoCarry
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#4A943E]/15 text-[#226d1b] tracking-wider uppercase">
                Eco
              </span>
            </div>
            <p className="text-xs text-[#2D3E35] font-medium">
              {user.faculty}
            </p>
          </div>
        </div>

        {/* User Badge, Digital Pass Button & Frame Toggle */}
        <div className="flex items-center gap-2">
          {/* Frame view toggle for desktop testing */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-[#E2DEC2] text-[#2D3E35] hover:bg-[#def3e3] transition-colors"
            title="Toggle between mobile viewport frame and wide layout"
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5 text-[#186049]" /> : <Smartphone className="w-3.5 h-3.5 text-[#186049]" />}
            <span className="font-semibold text-[11px]">{isMobileFrame ? 'Full View' : 'Phone Frame'}</span>
          </button>

          {/* Quick Demo Reset */}
          <button
            onClick={resetData}
            title="Reset demo data"
            className="p-2 rounded-full text-[#2D3E35] hover:text-[#186049] hover:bg-[#def3e3] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => setIsPrivacyNoticeOpen(true)}
            title="Campus Privacy Notice & Data Policy"
            className="p-2 rounded-full text-[#2D3E35] hover:text-[#186049] hover:bg-[#def3e3] transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Logout / Switch User */}
          <button
            onClick={logout}
            title="Sign out / Switch Account"
            className="p-2 rounded-full text-[#2D3E35] hover:text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Developer Console Button (ONLY visible to developer account: menazaki012@gmail.com) */}
          {isCurrentUserAdmin && (
            <button
              onClick={() => setIsDevConsoleOpen(true)}
              title="Open Developer & Admin Console"
              className="flex items-center gap-1.5 bg-[#def3e3] border border-[#4A943E]/40 hover:border-[#186049] text-[#186049] px-2.5 py-1.5 rounded-full transition-all shadow-tactile-sm"
            >
              <Database className="w-3.5 h-3.5 text-[#186049]" />
              <span className="font-bold text-[11px] hidden sm:inline">Dev Console</span>
            </button>
          )}

          {/* Student Pass Button */}
          <button
            onClick={() => setIsStudentPassOpen(true)}
            className="flex items-center gap-1.5 bg-[#ECE8AF] border border-[#E2DEC2] hover:border-[#186049] text-[#14261C] px-3 py-1.5 rounded-full transition-all shadow-tactile-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4 text-[#186049]" />
            <div className="text-left">
              <span className="block text-[11px] font-bold leading-none text-[#186049]">
                {user.tier}
              </span>
              <span className="text-[10px] font-medium text-[#2D3E35] leading-none">
                {user.points} pts
              </span>
            </div>
            <Sparkles className="w-3 h-3 text-[#D98327]" />
          </button>
        </div>
      </div>
    </header>
  );
};
