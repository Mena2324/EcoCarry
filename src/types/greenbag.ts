export interface ActiveBag {
  id: string;
  bagNumber: string;
  type: 'Heavy Canvas Tote' | 'Thermal Meal Pouch' | 'Compact Daily Sling';
  borrowedAt: string;
  borrowedStationId: string;
  borrowedStationName: string;
  dueDate: string;
  daysRemaining: number;
  washCount: number;
  co2SavedGrams: number;
  status: 'active' | 'warning' | 'overdue' | 'returned';
  qrPayload: string;
}

export interface Station {
  id: string;
  name: string;
  shortName: string;
  zone: 'Main Campus' | 'Student Center' | 'Residential' | 'Sports Complex';
  coordinates: { x: number; y: number }; // Relative map coordinates (%)
  bagInventory: {
    available: number;
    total: number;
  };
  returnBinCapacityPercent: number; // e.g. 45% full
  hours: string;
  is24Hours: boolean;
  distanceMeters: number;
  features: string[];
  address: string;
}

export interface Reward {
  id: string;
  title: string;
  vendor: string;
  stampsRequired: number;
  discountText: string;
  category: 'Food & Drink' | 'Campus Store' | 'Eco Merchandise';
  expiresInDays: number;
  isRedeemed: boolean;
  code: string;
  description: string;
  iconName: string;
}

export interface StampSlot {
  index: number;
  isStamped: boolean;
  stampedDate?: string;
  bagRef?: string;
}

export interface EcoBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  total: number;
}

export interface UserProfile {
  studentName: string;
  studentId: string;
  faculty: string;
  tier: 'ECO CHAMPION' | 'GREEN GUARDIAN' | 'SEEDLING EXPLORER';
  points: number;
  activeStreak: number;
  bagsSavedTotal: number;
  co2SavedKg: number;
  avatarSeed: string;
  memberSince: string;
}

export interface CampusMetrics {
  totalBagsEliminated: number;
  monthlyGoal: number;
  co2AvoidedKg: number;
  activeCampusers: number;
  treesEquivalent: number;
}

export interface GlobalBag {
  id: string;
  bagNumber: string;
  type: 'Heavy Canvas Tote' | 'Thermal Meal Pouch' | 'Compact Daily Sling';
  status: 'available' | 'borrowed' | 'maintenance';
  currentBorrowerId: string | null;
  currentBorrowerName: string | null;
  borrowedStationId: string | null;
  borrowedStationName: string | null;
  borrowedAt: string | null;
  lastReturnedAt: string | null;
  lastReturnStationId: string | null;
  washCount: number;
  qrToken: string;
  co2SavedGrams: number;
}

export interface RewardVoucher {
  id: string;
  code: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  userId: string;
  studentName: string;
  status: 'active' | 'redeemed' | 'expired';
  issuedAt: string;
  expiresAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  bagNumber: string;
  location: string;
  time: string;
  type: 'borrow' | 'return' | 'points';
}

