import { ActiveBag, Station, Reward, EcoBadge, UserProfile, CampusMetrics } from '../types/greenbag';

export const INITIAL_USER: UserProfile = {
  studentName: 'Eco Student',
  studentId: 'APU-2024-0001',
  faculty: 'School of Technology & AI',
  tier: 'SEEDLING EXPLORER',
  points: 0,
  activeStreak: 0,
  bagsSavedTotal: 0,
  co2SavedKg: 0,
  avatarSeed: 'ecouser',
  memberSince: 'March 2024',
};

export const INITIAL_CAMPUS_METRICS: CampusMetrics = {
  totalBagsEliminated: 0,
  monthlyGoal: 180000,
  co2AvoidedKg: 0,
  activeCampusers: 0,
  treesEquivalent: 0,
};

export const INITIAL_ACTIVE_BAGS: ActiveBag[] = [];

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'st-1',
    name: 'APU Central Cafeteria',
    shortName: 'Central Cafe B1',
    zone: 'Main Campus',
    coordinates: { x: 38, y: 44 },
    bagInventory: {
      available: 18,
      total: 30,
    },
    returnBinCapacityPercent: 42,
    hours: '07:30 AM – 09:30 PM',
    is24Hours: false,
    distanceMeters: 60,
    features: ['UV-C Disinfection Unit', 'High Speed Dispenser', 'Staffed Help'],
    address: 'Block E, Ground Floor, Food Court Entryway',
  },
  {
    id: 'st-2',
    name: 'Student Activity Centre',
    shortName: 'SAC Lobby',
    zone: 'Student Center',
    coordinates: { x: 55, y: 32 },
    bagInventory: {
      available: 12,
      total: 25,
    },
    returnBinCapacityPercent: 78,
    hours: '08:00 AM – 10:00 PM',
    is24Hours: false,
    distanceMeters: 180,
    features: ['Express Drop Bin', 'Thermal Bag Section', 'Instant Receipt'],
    address: 'Student Centre Level 1, Beside Co-op Mart',
  },
  {
    id: 'st-3',
    name: 'APU Library Ground Floor',
    shortName: 'Library Atrium',
    zone: 'Main Campus',
    coordinates: { x: 42, y: 68 },
    bagInventory: {
      available: 24,
      total: 35,
    },
    returnBinCapacityPercent: 20,
    hours: '24 Hours Open',
    is24Hours: true,
    distanceMeters: 240,
    features: ['24/7 Smart Lockers', 'RFID Auto-Check', 'Heavy Tote Focus'],
    address: 'Main Library, Left Turnstile Entrance',
  },
  {
    id: 'st-4',
    name: 'Faculty of Computing & AI Hub',
    shortName: 'Computing Wing',
    zone: 'Main Campus',
    coordinates: { x: 72, y: 48 },
    bagInventory: {
      available: 7,
      total: 20,
    },
    returnBinCapacityPercent: 65,
    hours: '08:00 AM – 08:00 PM',
    is24Hours: false,
    distanceMeters: 310,
    features: ['Compact Bag Kiosk', 'Fast QR Reader'],
    address: 'Tech Atrium, Opposite Lab 4B',
  },
  {
    id: 'st-5',
    name: 'APU Residences Hall D',
    shortName: 'Dorm Block D',
    zone: 'Residential',
    coordinates: { x: 22, y: 24 },
    bagInventory: {
      available: 15,
      total: 20,
    },
    returnBinCapacityPercent: 30,
    hours: '24 Hours Open',
    is24Hours: true,
    distanceMeters: 450,
    features: ['24/7 Resident Access', 'Dual Drop Chute', 'Weekend Restock'],
    address: 'Residence Block D Mailroom Corridor',
  },
  {
    id: 'st-6',
    name: 'Sports Complex & Arena',
    shortName: 'Sports Arena',
    zone: 'Sports Complex',
    coordinates: { x: 80, y: 75 },
    bagInventory: {
      available: 9,
      total: 15,
    },
    returnBinCapacityPercent: 15,
    hours: '07:00 AM – 11:00 PM',
    is24Hours: false,
    distanceMeters: 550,
    features: ['Water-Resistant Bags', 'Locker Room Drop'],
    address: 'Gymnasium Lobby, Next to Smoothie Bar',
  },
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    title: '50% Off Campus Cafe Oat Latte',
    vendor: 'APU Bean & Leaf Cafe',
    stampsRequired: 5,
    discountText: '50% OFF',
    category: 'Food & Drink',
    expiresInDays: 14,
    isRedeemed: false,
    code: 'APU-LATTE-ECO50',
    description: 'Valid for any regular or large handcrafted espresso drink with oat, soy, or dairy milk.',
    iconName: 'Coffee',
  },
  {
    id: 'rew-2',
    title: '$5 Off Campus Bookstore & Supplies',
    vendor: 'APU University Bookstore',
    stampsRequired: 10,
    discountText: '$5.00 VOUCHER',
    category: 'Campus Store',
    expiresInDays: 30,
    isRedeemed: false,
    code: 'APU-BOOK-STAMP10',
    description: 'Redeem on stationery, textbooks, or official APU merchandise with minimum $10 purchase.',
    iconName: 'BookOpen',
  },
  {
    id: 'rew-3',
    title: 'Free APU Reusable Metal Straw Kit',
    vendor: 'APU Eco Club & Sustainability Office',
    stampsRequired: 8,
    discountText: '100% FREE GIFT',
    category: 'Eco Merchandise',
    expiresInDays: 45,
    isRedeemed: true,
    code: 'APU-STRAW-CLAIMED',
    description: 'Includes 2 titanium straws, cotton cleaner brush, and handmade canvas pouch.',
    iconName: 'Sparkles',
  },
  {
    id: 'rew-4',
    title: 'Free Fresh Bakery Pastry',
    vendor: 'Artisan Corner Bakery',
    stampsRequired: 6,
    discountText: 'FREE PASTRY',
    category: 'Food & Drink',
    expiresInDays: 10,
    isRedeemed: false,
    code: 'APU-BAKE-ECO99',
    description: 'Choice of fresh butter croissant, chocolate twist, or savory spinach roll.',
    iconName: 'Utensils',
  },
];

export const INITIAL_BADGES: EcoBadge[] = [
  {
    id: 'badge-1',
    name: 'Zero Waste Pioneer',
    description: 'Complete your first 5 verified bag returns',
    icon: 'Leaf',
    unlocked: false,
    progress: 0,
    total: 5,
  },
  {
    id: 'badge-2',
    name: 'Eco Champion',
    description: 'Save over 40 single-use plastic bags from campus waste',
    icon: 'Award',
    unlocked: false,
    progress: 0,
    total: 40,
  },
  {
    id: 'badge-3',
    name: 'Daily Green Habit',
    description: 'Maintain consecutive days of zero single-use bags on campus',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    total: 7,
  },
  {
    id: 'badge-4',
    name: 'Century Hero',
    description: 'Divert 100 bags and save 4.5kg of carbon footprint',
    icon: 'ShieldCheck',
    unlocked: false,
    progress: 0,
    total: 100,
  },
  {
    id: 'badge-5',
    name: 'Campus Recycler Ambassador',
    description: 'Return bags to 5 different stations across APU campus',
    icon: 'MapPin',
    unlocked: false,
    progress: 0,
    total: 5,
  },
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Aisha Al-Nuaimi', faculty: 'Computing & Tech', bags: 68, streak: 19, avatar: 'aisha' },
  { rank: 2, name: 'Kenji Sato', faculty: 'Design & Media', bags: 61, streak: 14, avatar: 'kenji' },
  { rank: 3, name: 'David Lim', faculty: 'Business Admin', bags: 39, streak: 11, avatar: 'david' },
  { rank: 4, name: 'Priya Sharma', faculty: 'Engineering', bags: 36, streak: 6, avatar: 'priya' },
  { rank: 5, name: 'Lucas Rossi', faculty: 'International Relations', bags: 31, streak: 4, avatar: 'lucas' },
  { rank: 6, name: 'Mena Zaki (You)', faculty: 'Technology & AI', bags: 0, streak: 0, avatar: 'mena' },
];

export const RECENT_ACTIVITY_LOGS: {
  id: string;
  action: string;
  bagNumber: string;
  location: string;
  time: string;
  type: 'borrow' | 'return' | 'points';
}[] = [];

export interface DevAccount {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  faculty: string;
  tier: 'ECO CHAMPION' | 'GREEN GUARDIAN' | 'SEEDLING EXPLORER';
  points: number;
  activeStreak: number;
  bagsSavedTotal: number;
  co2SavedKg: number;
  activeLoansCount: number;
  role: 'student' | 'staff' | 'admin';
  lastActive: string;
  activeBagNumbers: string[];
}

export const INITIAL_DEV_ACCOUNTS: DevAccount[] = [
  {
    id: 'usr-mena-1',
    studentName: 'Mena Zaki',
    studentId: 'APU-2024-8912',
    email: 'menazaki012@gmail.com',
    faculty: 'School of Technology & AI',
    tier: 'SEEDLING EXPLORER',
    points: 0,
    activeStreak: 0,
    bagsSavedTotal: 0,
    co2SavedKg: 0,
    activeLoansCount: 0,
    role: 'admin',
    lastActive: 'Just now',
    activeBagNumbers: [],
  },
  {
    id: 'usr-kenji-2',
    studentName: 'Kenji Sato',
    studentId: 'APU-2023-4109',
    email: 'kenji.sato@mail.apu.edu.my',
    faculty: 'School of Design & Creative Arts',
    tier: 'ECO CHAMPION',
    points: 620,
    activeStreak: 14,
    bagsSavedTotal: 61,
    co2SavedKg: 2.74,
    activeLoansCount: 1,
    role: 'student',
    lastActive: '2 hours ago',
    activeBagNumbers: ['GB-2041'],
  },
  {
    id: 'usr-aisha-3',
    studentName: 'Aisha Al-Nuaimi',
    studentId: 'APU-2022-7714',
    email: 'aisha.nuaimi@mail.apu.edu.my',
    faculty: 'School of Technology & AI',
    tier: 'ECO CHAMPION',
    points: 750,
    activeStreak: 19,
    bagsSavedTotal: 68,
    co2SavedKg: 3.12,
    activeLoansCount: 2,
    role: 'student',
    lastActive: '5 hours ago',
    activeBagNumbers: ['GB-3310', 'GB-5521'],
  },
  {
    id: 'usr-david-4',
    studentName: 'David Lim',
    studentId: 'APU-2024-3019',
    email: 'david.lim@mail.apu.edu.my',
    faculty: 'Faculty of Business & Management',
    tier: 'GREEN GUARDIAN',
    points: 390,
    activeStreak: 11,
    bagsSavedTotal: 39,
    co2SavedKg: 1.62,
    activeLoansCount: 1,
    role: 'student',
    lastActive: 'Yesterday',
    activeBagNumbers: ['GB-1890'],
  },
  {
    id: 'usr-priya-5',
    studentName: 'Priya Sharma',
    studentId: 'APU-2023-8821',
    email: 'priya.sharma@mail.apu.edu.my',
    faculty: 'Faculty of Engineering',
    tier: 'GREEN GUARDIAN',
    points: 360,
    activeStreak: 6,
    bagsSavedTotal: 36,
    co2SavedKg: 1.48,
    activeLoansCount: 0,
    role: 'student',
    lastActive: '3 days ago',
    activeBagNumbers: [],
  },
  {
    id: 'usr-sarah-6',
    studentName: 'Dr. Sarah Chen',
    studentId: 'STAFF-APU-018',
    email: 'sarah.chen@apu.edu.my',
    faculty: 'APU Sustainability Office',
    tier: 'ECO CHAMPION',
    points: 920,
    activeStreak: 32,
    bagsSavedTotal: 94,
    co2SavedKg: 4.25,
    activeLoansCount: 1,
    role: 'staff',
    lastActive: 'Today, 9:00 AM',
    activeBagNumbers: ['GB-9002'],
  },
];

