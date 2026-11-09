import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveBag,
  Station,
  Reward,
  EcoBadge,
  UserProfile,
  StampSlot,
  CampusMetrics,
} from '../types/greenbag';
import {
  INITIAL_USER,
  INITIAL_CAMPUS_METRICS,
  INITIAL_ACTIVE_BAGS,
  INITIAL_STATIONS,
  INITIAL_REWARDS,
  INITIAL_BADGES,
  RECENT_ACTIVITY_LOGS,
  INITIAL_DEV_ACCOUNTS,
  DevAccount,
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  testConnection,
  OperationType,
  handleFirestoreError,
  FirebaseUser,
} from '../firebase/config';
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';

interface ActivityLog {
  id: string;
  action: string;
  bagNumber: string;
  location: string;
  time: string;
  type: string;
}

interface GreenBagContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  firebaseConnected: boolean;
  firebaseProjectId: string;
  campusMetrics: CampusMetrics;
  activeBags: ActiveBag[];
  stations: Station[];
  rewards: Reward[];
  badges: EcoBadge[];
  stampSlots: StampSlot[];
  activities: ActivityLog[];
  activeTab: 'home' | 'stations' | 'rewards' | 'community';
  setActiveTab: (tab: 'home' | 'stations' | 'rewards' | 'community') => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  scannerMode: 'borrow' | 'return';
  setScannerMode: (mode: 'borrow' | 'return') => void;
  preselectedBagIdForReturn: string | null;
  setPreselectedBagIdForReturn: (id: string | null) => void;
  selectedStationForBorrow: string | null;
  setSelectedStationForBorrow: (id: string | null) => void;
  isStudentPassOpen: boolean;
  setIsStudentPassOpen: (open: boolean) => void;
  selectedBagDetails: ActiveBag | null;
  setSelectedBagDetails: (bag: ActiveBag | null) => void;
  selectedStationModal: Station | null;
  setSelectedStationModal: (station: Station | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (credentials?: {
    studentIdOrEmail?: string;
    name?: string;
    faculty?: string;
    isNewAccount?: boolean;
  }) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isCurrentUserAdmin: boolean;
  isDevConsoleOpen: boolean;
  setIsDevConsoleOpen: (open: boolean) => void;
  devAccounts: DevAccount[];
  adminAwardPoints: (studentId: string, amount: number) => void;
  adminResolveBag: (bagNumber: string) => void;
  exportAllData: (format: 'json' | 'csv') => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  borrowBag: (stationId: string, bagType: ActiveBag['type'], customNumber?: string) => void;
  returnBag: (bagId: string, stationId: string) => boolean;
  extendBorrow: (bagId: string) => void;
  redeemReward: (rewardId: string) => boolean;
  resetData: () => void;
}

const GreenBagContext = createContext<GreenBagContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ecocarry_app_state_v4';
const FIREBASE_PROJECT_ID = 'ecosave-34ef8';

export const GreenBagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);

  // Clear legacy stored versions so old hardcoded numbers (148,290 / mock activities) never persist in the user's browser
  useEffect(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('ecocarry_app_state_v1') ||
            k.startsWith('ecocarry_app_state_v2') ||
            k.startsWith('ecocarry_app_state_v3') ||
            k.startsWith('greenbag_app_state_'))
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }, []);

  // User profile state - starts at 0 metrics
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER,
          ...parsed,
          bagsSavedTotal: parsed.bagsSavedTotal ?? 0,
          co2SavedKg: parsed.co2SavedKg ?? 0,
          points: parsed.points ?? 0,
          activeStreak: parsed.activeStreak ?? 0,
        };
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Campus collective metrics - strictly starts at 0
  const [campusMetrics, setCampusMetrics] = useState<CampusMetrics>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_campus_metrics');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If legacy high number was saved, force reset to zero
        if (parsed.totalBagsEliminated > 10000 || parsed.totalBagsEliminated === 148290) {
          return INITIAL_CAMPUS_METRICS;
        }
        return parsed;
      }
      return INITIAL_CAMPUS_METRICS;
    } catch {
      return INITIAL_CAMPUS_METRICS;
    }
  });

  // Active bags - starts at empty array
  const [activeBags, setActiveBags] = useState<ActiveBag[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_bags');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((b: ActiveBag) => b.bagNumber === 'GB-0482' || b.bagNumber === 'GB-1099')) {
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [stations, setStations] = useState<Station[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_stations');
      return saved ? JSON.parse(saved) : INITIAL_STATIONS;
    } catch {
      return INITIAL_STATIONS;
    }
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_rewards');
      return saved ? JSON.parse(saved) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  });

  const [badges, setBadges] = useState<EcoBadge[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [stampSlots, setStampSlots] = useState<StampSlot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_stamps');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return Array.from({ length: 10 }, (_, i) => ({
      index: i + 1,
      isStamped: false,
    }));
  });

  // Recent activity logs - starts empty (0 activities)
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((a: ActivityLog) => a.bagNumber === 'GB-0482' || a.bagNumber === 'GB-0921')) {
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_auth');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'stations' | 'rewards' | 'community'>('home');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerMode, setScannerMode] = useState<'borrow' | 'return'>('borrow');
  const [preselectedBagIdForReturn, setPreselectedBagIdForReturn] = useState<string | null>(null);
  const [selectedStationForBorrow, setSelectedStationForBorrow] = useState<string | null>(null);
  const [isStudentPassOpen, setIsStudentPassOpen] = useState<boolean>(false);
  const [selectedBagDetails, setSelectedBagDetails] = useState<ActiveBag | null>(null);
  const [selectedStationModal, setSelectedStationModal] = useState<Station | null>(null);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState<boolean>(false);
  const [devAccounts, setDevAccounts] = useState<DevAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_dev_accounts');
      return saved ? JSON.parse(saved) : INITIAL_DEV_ACCOUNTS;
    } catch {
      return INITIAL_DEV_ACCOUNTS;
    }
  });
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Admin permission check: STRICTLY restricted to the developer's verified email menazaky012@ / menazaki012@
  // No student ID, demo account, or user name bypass allowed!
  const currentEmail = (
    firebaseUser?.email ||
    (user.studentId?.includes('@') ? user.studentId : '')
  ).toLowerCase().trim();

  const isCurrentUserAdmin = Boolean(
    currentEmail &&
    (currentEmail.startsWith('menazaky012@') ||
     currentEmail.startsWith('menazaki012@') ||
     currentEmail === 'menazaky012@gmail.com' ||
     currentEmail === 'menazaki012@gmail.com' ||
     currentEmail.includes('menazaky012') ||
     currentEmail.includes('menazaki012'))
  );

  // Sync devAccounts to storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_dev_accounts', JSON.stringify(devAccounts));
    } catch {}
  }, [devAccounts]);

  // Test Firestore connection on mount
  useEffect(() => {
    testConnection()
      .then(() => setFirebaseConnected(true))
      .catch(() => setFirebaseConnected(false));
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY + '_auth', 'true');
        } catch {}

        // Sync or initialize user profile in Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUser((prev) => ({
              ...prev,
              studentName: data.studentName || fbUser.displayName || prev.studentName,
              studentId: data.studentId || prev.studentId,
              faculty: data.faculty || prev.faculty,
              points: data.points ?? prev.points,
              activeStreak: data.activeStreak ?? prev.activeStreak,
              bagsSavedTotal: data.bagsSavedTotal ?? prev.bagsSavedTotal,
              co2SavedKg: data.co2SavedKg ?? prev.co2SavedKg,
            }));
          } else {
            // First time Firestore profile creation - starts at 0
            const initialProfile = {
              studentName: fbUser.displayName || 'Eco Student',
              studentId: fbUser.email?.split('@')[0].toUpperCase() || 'APU-2024-0001',
              faculty: 'School of Technology & AI',
              tier: 'SEEDLING EXPLORER',
              points: 0,
              activeStreak: 0,
              bagsSavedTotal: 0,
              co2SavedKg: 0,
              email: fbUser.email || '',
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore:', err);
        }

        // Real-time listener for active borrowed bags
        const bagsColRef = collection(db, 'users', fbUser.uid, 'bags');
        const unsubBags = onSnapshot(
          bagsColRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const liveBags: ActiveBag[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<ActiveBag, 'id'>),
              }));
              setActiveBags(liveBags);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/bags`);
          }
        );

        // Real-time listener for activities
        const actColRef = collection(db, 'users', fbUser.uid, 'activities');
        const unsubAct = onSnapshot(
          actColRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const liveAct: ActivityLog[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<ActivityLog, 'id'>),
              }));
              setActivities(liveAct);
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/activities`);
          }
        );

        return () => {
          unsubBags();
          unsubAct();
        };
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_user', JSON.stringify(user));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_bags', JSON.stringify(activeBags));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_stations', JSON.stringify(stations));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_rewards', JSON.stringify(rewards));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_badges', JSON.stringify(badges));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_stamps', JSON.stringify(stampSlots));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_activities', JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [user, activeBags, stations, rewards, badges, stampSlots, activities]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#186049', '#4A943E', '#D98327', '#ECE8AF'],
      });
    } catch {
      // ignore
    }
  };

  // Google Login via Firebase
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);
      setIsAuthenticated(true);
      showToast(`Signed in as ${fbUser.displayName || fbUser.email} via Firebase Auth!`, 'success');
    } catch (err: unknown) {
      console.warn('Google sign-in error:', err);
      // If popup was cancelled or blocked, fall back gracefully
      login({
        studentIdOrEmail: 'TP068412@mail.apu.edu.my',
        name: 'Mena Zaki',
        faculty: 'School of Technology & AI',
      });
    }
  };

  // Standard, Demo, or Create Account login
  const login = (credentials?: {
    studentIdOrEmail?: string;
    name?: string;
    faculty?: string;
    isNewAccount?: boolean;
  }) => {
    if (credentials?.name || credentials?.studentIdOrEmail) {
      const isNew = Boolean(credentials.isNewAccount);
      setUser((prev) => ({
        ...prev,
        studentName: credentials.name || prev.studentName,
        studentId: credentials.studentIdOrEmail || prev.studentId,
        faculty: credentials.faculty || prev.faculty,
        tier: isNew ? 'SEEDLING EXPLORER' : prev.tier,
        points: isNew ? 0 : prev.points,
        activeStreak: isNew ? 0 : prev.activeStreak,
        bagsSavedTotal: isNew ? 0 : prev.bagsSavedTotal,
        co2SavedKg: isNew ? 0 : prev.co2SavedKg,
      }));

      // If this is a newly registered user, register them in devAccounts roster
      if (isNew) {
        const emailStr = credentials.studentIdOrEmail?.includes('@')
          ? credentials.studentIdOrEmail
          : `${credentials.studentIdOrEmail}@mail.apu.edu.my`;

        const newAcc: DevAccount = {
          id: `usr-${Date.now()}`,
          studentName: credentials.name || 'New Student',
          studentId: credentials.studentIdOrEmail || `APU-${Date.now().toString().slice(-4)}`,
          email: emailStr,
          faculty: credentials.faculty || 'School of Technology & AI',
          tier: 'SEEDLING EXPLORER',
          points: 0,
          activeStreak: 0,
          bagsSavedTotal: 0,
          co2SavedKg: 0,
          activeLoansCount: 0,
          role: 'student',
          lastActive: 'Just registered',
          activeBagNumbers: [],
        };
        setDevAccounts((prev) => [newAcc, ...prev]);

        // If a Firebase user is logged in, write profile to Firestore
        if (auth.currentUser) {
          setDoc(doc(db, 'users', auth.currentUser.uid), {
            studentName: credentials.name || 'New Student',
            studentId: credentials.studentIdOrEmail || auth.currentUser.uid,
            faculty: credentials.faculty || 'School of Technology & AI',
            tier: 'SEEDLING EXPLORER',
            points: 0,
            activeStreak: 0,
            bagsSavedTotal: 0,
            co2SavedKg: 0,
            email: emailStr,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    }
    setIsAuthenticated(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_auth', 'true');
    } catch {}
    showToast(
      credentials?.isNewAccount
        ? `Welcome to EcoCarry, ${credentials.name}! Your account was created with +50 welcome eco-points.`
        : `Welcome, ${credentials?.name || user.studentName}! Eco-Pass active.`,
      'success'
    );
  };

  const logout = () => {
    fbSignOut(auth).catch(() => {});
    setFirebaseUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_auth', 'false');
    } catch {}
    showToast('Signed out of EcoCarry.', 'info');
  };

  // Borrow a bag
  const borrowBag = async (stationId: string, bagType: ActiveBag['type'], customNumber?: string) => {
    const station = stations.find((s) => s.id === stationId) || stations[0];
    const generatedNum = customNumber || `GB-${Math.floor(1000 + Math.random() * 9000)}`;
    const bagId = `bag-${Date.now()}`;

    const newBag: ActiveBag = {
      id: bagId,
      bagNumber: generatedNum,
      type: bagType,
      borrowedAt: 'Just now',
      borrowedStationId: station.id,
      borrowedStationName: station.name,
      dueDate: 'No deadline • Return anytime',
      daysRemaining: 999,
      washCount: Math.floor(10 + Math.random() * 40),
      co2SavedGrams: bagType === 'Thermal Meal Pouch' ? 120 : 90,
      status: 'active',
      qrPayload: `APU-${generatedNum}-SECURE`,
    };

    setActiveBags((prev) => [newBag, ...prev]);

    // Decrement station stock
    setStations((prev) =>
      prev.map((s) =>
        s.id === station.id
          ? {
              ...s,
              bagInventory: {
                ...s.bagInventory,
                available: Math.max(0, s.bagInventory.available - 1),
              },
            }
          : s
      )
    );

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      action: 'Borrowed Bag',
      bagNumber: generatedNum,
      location: station.name,
      time: 'Just now',
      type: 'borrow',
    };
    setActivities((prev) => [newLog, ...prev]);

    // Sync to Firestore if user is authenticated with Firebase
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid, 'bags', bagId), {
          userId: firebaseUser.uid,
          bagNumber: generatedNum,
          type: bagType,
          borrowedAt: 'Just now',
          borrowedStationId: station.id,
          borrowedStationName: station.name,
          dueDate: 'No deadline • Return anytime',
          daysRemaining: 999,
          status: 'active',
          co2SavedGrams: newBag.co2SavedGrams,
          qrPayload: newBag.qrPayload,
        });

        await setDoc(doc(db, 'users', firebaseUser.uid, 'activities', newLog.id), {
          userId: firebaseUser.uid,
          action: 'Borrowed Bag',
          bagNumber: generatedNum,
          location: station.name,
          time: 'Just now',
          type: 'borrow',
        });
      } catch (error) {
        console.warn('Firestore write warning:', error);
      }
    }

    showToast(`Checked out ${newBag.bagNumber} (${newBag.type})! Return anytime whenever finished.`, 'success');
  };

  // Return a bag
  const returnBag = (bagId: string, stationId: string): boolean => {
    const targetBag = activeBags.find((b) => b.id === bagId);
    if (!targetBag) return false;

    const targetStation = stations.find((s) => s.id === stationId) || stations[0];

    // Remove from active bags
    setActiveBags((prev) => prev.filter((b) => b.id !== bagId));

    // Increase station inventory and capacity
    setStations((prev) =>
      prev.map((s) =>
        s.id === targetStation.id
          ? {
              ...s,
              bagInventory: {
                ...s.bagInventory,
                available: s.bagInventory.available + 1,
              },
              returnBinCapacityPercent: Math.min(100, s.returnBinCapacityPercent + 5),
            }
          : s
      )
    );

    // Update user impact metrics
    setUser((prev) => ({
      ...prev,
      bagsSavedTotal: prev.bagsSavedTotal + 1,
      co2SavedKg: parseFloat((prev.co2SavedKg + 0.09).toFixed(2)),
      points: prev.points + 50,
      activeStreak: prev.activeStreak + 1,
    }));

    // Update campus collective goal metrics
    setCampusMetrics((prev: CampusMetrics) => ({
      ...prev,
      totalBagsEliminated: prev.totalBagsEliminated + 1,
      co2AvoidedKg: parseFloat((prev.co2AvoidedKg + 0.09).toFixed(2)),
      treesEquivalent: Math.floor((prev.totalBagsEliminated + 1) / 500),
    }));

    // Stamp loyalty card (find first unstamped slot)
    setStampSlots((prev) => {
      const firstUnstamped = prev.findIndex((slot) => !slot.isStamped);
      if (firstUnstamped !== -1) {
        const next = [...prev];
        next[firstUnstamped] = {
          ...next[firstUnstamped],
          isStamped: true,
          stampedDate: 'Today',
          bagRef: targetBag.bagNumber,
        };
        return next;
      }
      return prev;
    });

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      action: 'Returned Bag & Stamped',
      bagNumber: targetBag.bagNumber,
      location: targetStation.name,
      time: 'Just now',
      type: 'return',
    };
    setActivities((prev) => [newLog, ...prev]);

    // Firestore deletion & stamp persistence
    if (firebaseUser) {
      deleteDoc(doc(db, 'users', firebaseUser.uid, 'bags', bagId)).catch(() => {});
      setDoc(doc(db, 'users', firebaseUser.uid, 'activities', newLog.id), {
        userId: firebaseUser.uid,
        action: 'Returned Bag & Stamped',
        bagNumber: targetBag.bagNumber,
        location: targetStation.name,
        time: 'Just now',
        type: 'return',
      }).catch(() => {});
    }

    triggerConfetti();
    showToast(`Returned ${targetBag.bagNumber} successfully! +50 Eco Points & 1 Loyalty Stamp earned!`, 'success');
    return true;
  };

  // Extend borrowing (inform user of zero deadline)
  const extendBorrow = (_bagId: string) => {
    showToast('EcoCarry bags have no 7-day limit! You can keep your bag as long as needed with no deadline.', 'info');
  };

  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || reward.isRedeemed) return false;

    const stampedCount = stampSlots.filter((s) => s.isStamped).length;
    if (stampedCount < reward.stampsRequired) {
      showToast(`You need ${reward.stampsRequired} stamps to unlock this perk.`, 'warning');
      return false;
    }

    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true } : r))
    );

    triggerConfetti();
    showToast(`Perk unlocked: ${reward.title}! Present code at counter.`, 'success');
    return true;
  };

  // Admin actions to manage students and collect data
  const adminAwardPoints = (studentId: string, amount: number) => {
    setDevAccounts((prev) =>
      prev.map((acc) =>
        acc.studentId === studentId ? { ...acc, points: acc.points + amount } : acc
      )
    );
    showToast(`Awarded +${amount} Eco Points to student ${studentId}`, 'success');
  };

  const adminResolveBag = (bagNumber: string) => {
    setDevAccounts((prev) =>
      prev.map((acc) =>
        acc.activeBagNumbers.includes(bagNumber)
          ? {
              ...acc,
              activeBagNumbers: acc.activeBagNumbers.filter((n) => n !== bagNumber),
              activeLoansCount: Math.max(0, acc.activeLoansCount - 1),
              bagsSavedTotal: acc.bagsSavedTotal + 1,
            }
          : acc
      )
    );
    // If the bag is in current user's active bags, remove it
    setActiveBags((prev) => prev.filter((b) => b.bagNumber !== bagNumber));
    showToast(`Bag ${bagNumber} marked as received & sanitized by Admin!`, 'success');
  };

  const exportAllData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const exportObject = {
        meta: {
          exportDate: new Date().toISOString(),
          system: 'EcoCarry Campus Reusable Network',
          firebaseProjectId: FIREBASE_PROJECT_ID,
          totalRegisteredUsers: devAccounts.length,
          totalBagsTracked: activeBags.length,
        },
        users: devAccounts,
        activeCampusLoans: activeBags,
        stationsInventory: stations,
        recentAuditLogs: activities,
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apu_greenbag_campus_data_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported complete JSON data snapshot for all accounts!', 'success');
    } else {
      let csv = 'Student ID,Student Name,Email,Faculty,Eco Tier,Points,Streak Days,Bags Saved,Active Loans,Role,Last Active\n';
      devAccounts.forEach((acc) => {
        csv += `"${acc.studentId}","${acc.studentName}","${acc.email}","${acc.faculty}","${acc.tier}",${acc.points},${acc.activeStreak},${acc.bagsSavedTotal},${acc.activeLoansCount},"${acc.role}","${acc.lastActive}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apu_greenbag_accounts_roster_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported CSV student roster report!', 'success');
    }
  };

  const resetData = () => {
    setUser(INITIAL_USER);
    setActiveBags([]);
    setStations(INITIAL_STATIONS);
    setRewards(INITIAL_REWARDS);
    setBadges(INITIAL_BADGES);
    setDevAccounts(INITIAL_DEV_ACCOUNTS);
    setCampusMetrics(INITIAL_CAMPUS_METRICS);
    setStampSlots(
      Array.from({ length: 10 }, (_, i) => ({
        index: i + 1,
        isStamped: false,
      }))
    );
    setActivities([]);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_user', JSON.stringify(INITIAL_USER));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_bags', JSON.stringify([]));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_activities', JSON.stringify([]));
      localStorage.setItem(LOCAL_STORAGE_KEY + '_campus_metrics', JSON.stringify(INITIAL_CAMPUS_METRICS));
      localStorage.setItem(
        LOCAL_STORAGE_KEY + '_stamps',
        JSON.stringify(
          Array.from({ length: 10 }, (_, i) => ({
            index: i + 1,
            isStamped: false,
          }))
        )
      );
    } catch {}
    showToast('All campus & user metrics set to zero.', 'info');
  };

  return (
    <GreenBagContext.Provider
      value={{
        user,
        firebaseUser,
        firebaseConnected,
        firebaseProjectId: FIREBASE_PROJECT_ID,
        campusMetrics,
        activeBags,
        stations,
        rewards,
        badges,
        stampSlots,
        activities,
        activeTab,
        setActiveTab,
        isScannerOpen,
        setIsScannerOpen,
        scannerMode,
        setScannerMode,
        preselectedBagIdForReturn,
        setPreselectedBagIdForReturn,
        selectedStationForBorrow,
        setSelectedStationForBorrow,
        isStudentPassOpen,
        setIsStudentPassOpen,
        selectedBagDetails,
        setSelectedBagDetails,
        selectedStationModal,
        setSelectedStationModal,
        isCurrentUserAdmin,
        isDevConsoleOpen,
        setIsDevConsoleOpen,
        devAccounts,
        adminAwardPoints,
        adminResolveBag,
        exportAllData,
        isAuthenticated,
        setIsAuthenticated,
        login,
        loginWithGoogle,
        logout,
        toastMessage,
        showToast,
        borrowBag,
        returnBag,
        extendBorrow,
        redeemReward,
        resetData,
      }}
    >
      {children}
    </GreenBagContext.Provider>
  );
};

export const useGreenBag = () => {
  const context = useContext(GreenBagContext);
  if (!context) {
    throw new Error('useGreenBag must be used within a GreenBagProvider');
  }
  return context;
};
