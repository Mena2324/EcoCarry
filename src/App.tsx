import React, { useState } from 'react';
import { GreenBagProvider, useGreenBag } from './context/GreenBagContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { StationsView } from './components/StationsView';
import { RewardsView } from './components/RewardsView';
import { CommunityView } from './components/CommunityView';
import { ScannerModal } from './components/ScannerModal';
import { StudentPassModal } from './components/StudentPassModal';
import { BagDetailsModal } from './components/BagDetailsModal';
import { Toast } from './components/Toast';
import { LoginView } from './components/LoginView';
import { DeveloperConsoleModal } from './components/DeveloperConsoleModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { AccountDeletionModal } from './components/AccountDeletionModal';

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useGreenBag();
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  return (
    <div
      className={`min-h-screen bg-[#FAF9F5] text-[#14261C] flex flex-col items-center ${
        isMobileFrame ? 'py-4 sm:py-8 bg-[#d8eede]/40' : ''
      }`}
    >
      <div
        className={`w-full bg-[#FAF9F5] relative transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-[430px] min-h-[880px] rounded-[44px] shadow-[0_24px_60px_-12px_rgba(20,38,28,0.22)] border-[8px] border-[#14261C] overflow-hidden'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Top Speaker / Dynamic Island notch when in mobile frame mode */}
        {isMobileFrame && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#14261C] rounded-full z-50 pointer-events-none flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#186049]" />
          </div>
        )}

        {/* Global Toast */}
        <Toast />

        {!isAuthenticated ? (
          <div className="p-4 sm:p-6">
            <LoginView />
          </div>
        ) : (
          <>
            {/* Header Bar */}
            <Header isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame} />

            {/* Dynamic Tab Views */}
            <main className="px-4 pt-2">
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'stations' && <StationsView />}
              {activeTab === 'rewards' && <RewardsView />}
              {activeTab === 'community' && <CommunityView />}
            </main>

            {/* Bottom Thumb-Zone Navigation */}
            <Navigation />

            {/* Interactive Modals */}
            <ScannerModal />
            <StudentPassModal />
            <BagDetailsModal />
          </>
        )}

        {/* Developer & Admin Console Modal */}
        <DeveloperConsoleModal />

        {/* Privacy Notice Modal */}
        <PrivacyNoticeModal />

        {/* Account Deletion Modal */}
        <AccountDeletionModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GreenBagProvider>
      <MainContent />
    </GreenBagProvider>
  );
}
