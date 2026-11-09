import React, { useState } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  Ticket,
  Sparkles,
  Check,
  Coffee,
  BookOpen,
  Utensils,
  Award,
  QrCode,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Reward } from '../types/greenbag';

export const RewardsView: React.FC = () => {
  const { stampSlots, rewards, redeemReward, user } = useGreenBag();
  const [selectedVoucherForModal, setSelectedVoucherForModal] = useState<Reward | null>(null);

  const stampedCount = stampSlots.filter((s) => s.isStamped).length;

  // Icon mapper helper
  const renderRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#D98327]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#186049]" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[#D98327]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#4A943E]" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2D3E35] uppercase tracking-wider">
            Green Rewards
          </span>
          <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">
            Perks & Stamp Card
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#ECE8AF] border border-[#E2DEC2] px-3 py-1.5 rounded-full text-xs font-bold text-[#186049] shadow-tactile-sm">
          <Award className="w-4 h-4 text-[#D98327]" />
          <span>{user.points} Eco Pts</span>
        </div>
      </div>

      {/* Featured Stamp Card with Simulated Perforated Edges & Golden Seal Stamps */}
      <div className="relative rounded-[22px] bg-[#ECE8AF] border border-[#E2DEC2] p-5 shadow-tactile-md overflow-hidden">
        {/* Decorative Perforated punchout effect on top-right */}
        <div className="absolute top-0 right-10 w-6 h-3 bg-[#FAF9F5] rounded-b-full border-b border-x border-[#E2DEC2]" />

        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#186049] text-white">
                APU Loyalty Card
              </span>
              <span className="text-xs font-bold text-[#186049]">
                {stampedCount} of 10 Collected
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-[#14261C] mt-1 tracking-tight">
              Return & Reward Passport
            </h2>
            <p className="text-xs text-[#2D3E35]">
              Earn 1 gold stamp with each verified on-time bag return.
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-[#E2DEC2] flex items-center justify-center text-[#D98327] shadow-tactile-sm">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* 10 Stamp Slots Grid */}
        <div className="grid grid-cols-5 gap-2.5 my-4">
          {stampSlots.map((slot) => (
            <div
              key={slot.index}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 relative transition-all ${
                slot.isStamped
                  ? 'bg-[#FAF9F5] border-2 border-[#D98327] shadow-sm transform scale-105'
                  : 'bg-[#FAF9F5]/60 border-2 border-dashed border-[#E2DEC2]'
              }`}
            >
              {slot.isStamped ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-[#D98327] text-white flex items-center justify-center shadow-inner">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-[9px] font-extrabold text-[#D98327] mt-0.5">
                    STAMP
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-[#bfc9c2]">#{slot.index}</span>
                  <span className="text-[8px] font-semibold text-[#707974]">Empty</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Next Reward Progress Notice */}
        <div className="pt-3 border-t border-[#E2DEC2] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#14261C]">
            <ShieldCheck className="w-4 h-4 text-[#4A943E]" />
            <span>
              {10 - stampedCount > 0
                ? `${10 - stampedCount} more stamps unlocks $5 Bookstore Voucher`
                : 'Card Completed! Ready to redeem top tier!'}
            </span>
          </div>
          <span className="text-[11px] font-extrabold text-[#186049]">
            {Math.round((stampedCount / 10) * 100)}%
          </span>
        </div>
      </div>

      {/* Available Rewards & Partner Perks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#14261C] tracking-tight">
            Campus Partner Vouchers
          </h2>
          <span className="text-xs text-[#2D3E35]">
            {rewards.filter((r) => r.isRedeemed).length} Claimed
          </span>
        </div>

        <div className="space-y-3">
          {rewards.map((reward) => {
            const canRedeem = stampedCount >= reward.stampsRequired;
            return (
              <div
                key={reward.id}
                className="rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] p-4 shadow-tactile-sm hover:border-[#186049]/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#def3e3] border border-[#E2DEC2] flex items-center justify-center shrink-0">
                    {renderRewardIcon(reward.iconName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#186049] bg-[#def3e3] px-2 py-0.5 rounded-full">
                        {reward.category}
                      </span>
                      <span className="text-xs font-bold text-[#D98327]">
                        {reward.stampsRequired} Stamps Required
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#14261C] mt-1">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-[#2D3E35] mt-0.5">{reward.description}</p>
                    <span className="text-[11px] font-medium text-[#707974] block mt-1">
                      Partner: {reward.vendor}
                    </span>
                  </div>
                </div>

                {/* Perforated voucher separator */}
                <div className="my-3 border-t-2 border-dashed border-[#E2DEC2] relative">
                  <div className="absolute -left-6 -top-2 w-4 h-4 rounded-full bg-[#FAF9F5] border-r border-[#E2DEC2]" />
                  <div className="absolute -right-6 -top-2 w-4 h-4 rounded-full bg-[#FAF9F5] border-l border-[#E2DEC2]" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#186049]">
                    {reward.discountText}
                  </span>

                  {reward.isRedeemed ? (
                    <button
                      onClick={() => setSelectedVoucherForModal(reward)}
                      className="px-4 py-2 rounded-full bg-[#def3e3] border border-[#4A943E]/40 text-[#186049] text-xs font-bold flex items-center gap-1.5 hover:bg-[#cbeed4] transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> View Pass
                    </button>
                  ) : (
                    <button
                      onClick={() => redeemReward(reward.id)}
                      disabled={!canRedeem}
                      className="px-4 py-2 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-tactile-sm transition-all"
                    >
                      {canRedeem ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#93d8bb]" /> Unlock Voucher
                        </>
                      ) : (
                        `Need ${reward.stampsRequired - stampedCount} more stamps`
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Voucher Modal Sheet */}
      {selectedVoucherForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-6 shadow-tactile-fab relative">
            <button
              onClick={() => setSelectedVoucherForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#def3e3] text-[#2D3E35]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A943E] bg-[#def3e3] px-2.5 py-1 rounded-full">
                Active Campus Voucher
              </span>
              <h3 className="text-lg font-extrabold text-[#14261C] mt-2">
                {selectedVoucherForModal.title}
              </h3>
              <p className="text-xs text-[#2D3E35] mt-0.5">
                {selectedVoucherForModal.vendor}
              </p>

              {/* QR Voucher Code Box */}
              <div className="my-5 p-4 rounded-2xl bg-white border border-[#E2DEC2] flex flex-col items-center justify-center shadow-inner">
                <div className="w-40 h-40 bg-[#FAF9F5] p-2 rounded-xl border border-[#E2DEC2] flex flex-col items-center justify-center">
                  {/* Generated clean QR graphic */}
                  <div className="grid grid-cols-6 gap-1 w-32 h-32 p-1 bg-white">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[2px] ${
                          i % 2 === 0 || i % 7 === 0 || i < 8 || i > 28
                            ? 'bg-[#186049]'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#14261C] tracking-widest mt-3">
                  {selectedVoucherForModal.code}
                </span>
                <span className="text-[10px] text-[#707974] mt-0.5">
                  Valid for 15 minutes upon activation
                </span>
              </div>

              <div className="text-left bg-[#e3f9e9] p-3 rounded-xl border border-[#E2DEC2]/60 text-xs space-y-1 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-[#186049]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Student Perk</span>
                </div>
                <p className="text-[11px] text-[#2D3E35]">
                  Show this screen at the checkout terminal before payment.
                </p>
              </div>

              <button
                onClick={() => setSelectedVoucherForModal(null)}
                className="w-full py-3.5 rounded-full bg-[#186049] hover:bg-[#004734] text-white text-xs font-bold transition-all shadow-tactile-sm"
              >
                Done / Back to Perks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
