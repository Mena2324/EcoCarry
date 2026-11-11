import React, { useState } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  Users,
  Trophy,
  Flame,
  Award,
  Sparkles,
  TreePine,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Megaphone,
  Calendar,
  Zap,
} from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../data/mockData';

export const CommunityView: React.FC = () => {
  const { badges, user, campusMetrics, events } = useGreenBag();
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'individual' | 'faculty'>('individual');

  const facultyRankings = [
    { faculty: 'School of Technology & AI', bags: 42100, activeStudents: 1120, rank: 1 },
    { faculty: 'Faculty of Business & Management', bags: 38400, activeStudents: 980, rank: 2 },
    { faculty: 'School of Design & Creative Arts', bags: 29800, activeStudents: 740, rank: 3 },
    { faculty: 'Faculty of Engineering', bags: 22100, activeStudents: 610, rank: 4 },
    { faculty: 'International Relations & Law', bags: 15890, activeStudents: 390, rank: 5 },
  ];

  const visibleEvents = events.filter((e) => e.status !== 'ended');

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2D3E35] uppercase tracking-wider">
            Campus Green Pulse
          </span>
          <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">
            Collective Impact & Ranks
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#def3e3] border border-[#4A943E]/30 px-3 py-1.5 rounded-full text-xs font-bold text-[#186049] shadow-tactile-sm">
          <Users className="w-4 h-4 text-[#4A943E]" />
          <span>{campusMetrics.activeCampusers.toLocaleString()} Active</span>
        </div>
      </div>

      {/* University-wide Impact Metric Hero */}
      <div className="rounded-[22px] bg-[#186049] text-white p-5 shadow-tactile-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4A943E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full text-[#acf1d3]">
            All-Time APU Diversion
          </span>
          <span className="text-xs text-white/80 font-medium">Updated Live</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-[#93d8bb] font-semibold block">Total Bags Diverted</span>
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {campusMetrics.totalBagsEliminated.toLocaleString()}
            </span>
            <span className="text-[10px] text-white/70 block mt-1">Single-use bags avoided</span>
          </div>

          <div className="border-l border-white/20 pl-4">
            <span className="text-xs text-[#93d8bb] font-semibold block">CO₂ Prevented</span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {campusMetrics.co2AvoidedKg.toLocaleString()} kg
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#acf1d3] mt-1 font-semibold">
              <TreePine className="w-3.5 h-3.5" />
              <span>≈ {campusMetrics.treesEquivalent} Trees planted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Eco Campaigns & Events List */}
      {visibleEvents.length > 0 && (
        <div className="rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] p-4 shadow-tactile-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#186049]" />
              <h2 className="text-base font-extrabold text-[#14261C]">Campus Eco Campaigns</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049]">
              Active & Upcoming
            </span>
          </div>

          <div className="space-y-2.5">
            {visibleEvents.map((ev) => {
              const isLive =
                ev.status === 'active' ||
                (ev.isPublished && ev.status !== 'ended') ||
                (ev.status === 'scheduled' &&
                  new Date(ev.scheduledStart) <= new Date() &&
                  new Date(ev.scheduledEnd) >= new Date());

              return (
                <div
                  key={ev.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isLive
                      ? 'bg-white border-[#4A943E] shadow-tactile-sm'
                      : 'bg-white/70 border-[#E2DEC2]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#def3e3] text-[#186049]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A943E] animate-pulse" />
                            LIVE NOW
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FAF9F5] text-[#707974] border border-[#E2DEC2]">
                            UPCOMING
                          </span>
                        )}
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#ECE8AF] text-[#186049]">
                          {ev.badgeText}
                        </span>
                        {ev.multiplier > 1 && (
                          <span className="text-[9px] font-bold text-[#D98327] flex items-center gap-0.5">
                            <Zap className="w-3 h-3 fill-[#D98327]" />
                            {ev.multiplier}x Points
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-extrabold text-[#14261C]">{ev.title}</h3>
                      <p className="text-[11px] text-[#2D3E35] mt-0.5 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E2DEC2]/60 flex items-center justify-between text-[10px] text-[#707974]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#186049]" />
                      {new Date(ev.scheduledStart).toLocaleDateString()} – {new Date(ev.scheduledEnd).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-[#186049]">Bonus: +{ev.bonusPoints} pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campus Leaderboard Section */}
      <div className="rounded-[20px] bg-[#FAF9F5] border border-[#E2DEC2] p-4 shadow-tactile-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D98327]" />
            <h2 className="text-base font-extrabold text-[#14261C]">Leaderboard</h2>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center bg-[#def3e3] p-0.5 rounded-full border border-[#E2DEC2]">
            <button
              onClick={() => setActiveLeaderboardTab('individual')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeLeaderboardTab === 'individual'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('faculty')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeLeaderboardTab === 'faculty'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              Faculties
            </button>
          </div>
        </div>

        {activeLeaderboardTab === 'individual' ? (
          <div className="divide-y divide-[#E2DEC2]">
            {INITIAL_LEADERBOARD.map((item) => {
              const isCurrentUser = item.name.includes('You');
              return (
                <div
                  key={item.rank}
                  className={`py-3 flex items-center justify-between px-2 rounded-xl transition-colors ${
                    isCurrentUser ? 'bg-[#ECE8AF]/50 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        item.rank === 1
                          ? 'bg-[#D98327] text-white'
                          : item.rank === 2
                          ? 'bg-[#bfc9c2] text-[#14261C]'
                          : item.rank === 3
                          ? 'bg-[#ffb877] text-[#5f3300]'
                          : 'text-[#707974]'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#14261C] block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#2D3E35]">{item.faculty}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#186049] block">
                      {item.bags} bags
                    </span>
                    <span className="text-[10px] text-[#D98327] font-semibold flex items-center gap-0.5 justify-end">
                      <Flame className="w-3 h-3 fill-current" /> {item.streak}d streak
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-[#E2DEC2]">
            {facultyRankings.map((fac) => (
              <div key={fac.rank} className="py-3 flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      fac.rank === 1
                        ? 'bg-[#D98327] text-white'
                        : 'bg-[#def3e3] text-[#186049]'
                    }`}
                  >
                    #{fac.rank}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-[#14261C] block">
                      {fac.faculty}
                    </span>
                    <span className="text-[11px] text-[#2D3E35]">
                      {fac.activeStudents} active students
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#186049] block">
                    {fac.bags.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#707974]">bags saved</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sustainability Badges & Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#14261C] tracking-tight">
            Sustainability Badges
          </h2>
          <span className="text-xs text-[#186049] font-bold">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-[20px] border transition-all ${
                badge.unlocked
                  ? 'bg-[#FAF9F5] border-[#E2DEC2] shadow-tactile-sm'
                  : 'bg-[#FAF9F5]/50 border-dashed border-[#E2DEC2] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-[#ECE8AF] text-[#D98327] border border-[#E2DEC2]'
                      : 'bg-[#def3e3]/40 text-[#707974]'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-[#14261C]">{badge.name}</h3>
                    {badge.unlocked ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#def3e3] text-[#186049] flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-[#707974]">
                        {badge.progress} / {badge.total}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#2D3E35] mt-0.5">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hygiene & Sanitization Pledge */}
      <div className="rounded-[20px] bg-[#def3e3]/60 border border-[#E2DEC2] p-4 text-xs">
        <div className="flex items-center gap-2 mb-1.5 font-bold text-[#186049]">
          <ShieldCheck className="w-4 h-4 text-[#4A943E]" />
          <span>EcoCarry Hygiene Guarantee</span>
        </div>
        <p className="text-[#2D3E35] text-[11px] leading-relaxed">
          Every bag deposited into an APU return station undergoes automated medical-grade UV-C
          sterilization and weekly certified laundering before returning to circulation.
        </p>
      </div>
    </div>
  );
};
