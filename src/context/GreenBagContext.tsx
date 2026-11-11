import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  fbSignOut,
  onAuthStateChanged,
  deleteUser,
  updateProfile,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  runTransaction,
  serverTimestamp,
  increment,
  FirebaseUser,
  handleFirestoreError,
  OperationType,
} from '../firebase/config';
import {
  ActiveBag,
  Station,
  Reward,
  EcoBadge,
  UserProfile,
  StampSlot,
  CampusMetrics,
  GlobalBag,
  RewardVoucher,
  ActivityLog,
} from '../types/greenbag';
import {
  INITIAL_USER,
  INITIAL_STATIONS,
  INITIAL_REWARDS,
  INITIAL_BADGES,
  INITIAL_CAMPUS_METRICS,
  INITIAL_GLOBAL_BAGS,
  INITIAL_DEV_ACCOUNTS,
  DevAccount,
} from '../data/mockData';

interface GreenBagContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  firebaseConnected: boolean;
  firebaseProjectId: string;
  campusMetrics: CampusMetrics;
  globalBags: GlobalBag[];
  activeBags: ActiveBag[];
  stations: Station[];
  rewards: Reward[];
  badges: EcoBadge[];
  stampSlots: StampSlot[];
  activities: ActivityLog[];
  userVouchers: RewardVoucher[];
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
  isPrivacyNoticeOpen: boolean;
  setIsPrivacyNoticeOpen: (open: boolean) => void;
  isDeleteAccountOpen: boolean;
  setIsDeleteAccountOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmailPassword: (email: string, pass: string) => Promise<void>;
  registerWithEmailPassword: (email: string, pass: string, name: string, faculty: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
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
  borrowBag: (stationId: string, bagId: string, scannedQrToken?: string) => Promise<boolean>;
  returnBag: (bagId: string, stationId: string) => Promise<boolean>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  resetData: () => void;
}

const GreenBagContext = createContext<GreenBagContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ecocarry_app_state_v5';
const FIREBASE_PROJECT_ID = 'ecosave-34ef8';

export const GreenBagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Clear legacy stored versions so old hardcoded numbers never persist
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
            k.startsWith('ecocarry_app_state_v4') ||
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
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Campus collective metrics - strictly starts at 0
  const [campusMetrics, setCampusMetrics] = useState<CampusMetrics>(INITIAL_CAMPUS_METRICS);

  // Global bags registry from Firestore collection /bags
  const [globalBags, setGlobalBags] = useState<GlobalBag[]>(INITIAL_GLOBAL_BAGS);

  // Active bags borrowed by current user
  const [activeBags, setActiveBags] = useState<ActiveBag[]>([]);

  // Stations, Rewards, Badges
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [badges, setBadges] = useState<EcoBadge[]>(INITIAL_BADGES);

  // Stamps & Vouchers
  const [stampSlots, setStampSlots] = useState<StampSlot[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      index: i + 1,
      isStamped: false,
    }))
  );
  const [userVouchers, setUserVouchers] = useState<RewardVoucher[]>([]);

  // Recent activity logs
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'stations' | 'rewards' | 'community'>('home');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerMode, setScannerMode] = useState<'borrow' | 'return'>('borrow');
  const [preselectedBagIdForReturn, setPreselectedBagIdForReturn] = useState<string | null>(null);
  const [selectedStationForBorrow, setSelectedStationForBorrow] = useState<string | null>(null);
  const [isStudentPassOpen, setIsStudentPassOpen] = useState<boolean>(false);
  const [selectedBagDetails, setSelectedBagDetails] = useState<ActiveBag | null>(null);
  const [selectedStationModal, setSelectedStationModal] = useState<Station | null>(null);
  const [isPrivacyNoticeOpen, setIsPrivacyNoticeOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState<boolean>(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState<boolean>(false);
  const [devAccounts, setDevAccounts] = useState<DevAccount[]>(INITIAL_DEV_ACCOUNTS);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Admin permission check: STRICTLY restricted to verified email menazaky012@ / menazaki012@
  const currentEmail = (firebaseUser?.email || '').toLowerCase().trim();
  const isCurrentUserAdmin = Boolean(
    firebaseUser &&
      (currentEmail.startsWith('menazaky012@') ||
        currentEmail.startsWith('menazaki012@') ||
        currentEmail === 'menazaky012@gmail.com' ||
        currentEmail === 'menazaki012@gmail.com' ||
        currentEmail.includes('menazaky012') ||
        currentEmail.includes('menazaki012'))
  );

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
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

  // 1. Initialize Global Bags collection /bags in Firestore if empty
  useEffect(() => {
    const initGlobalBags = async () => {
      try {
        const bagsColRef = collection(db, 'bags');
        const snap = await getDocs(bagsColRef);
        if (snap.empty) {
          for (const bag of INITIAL_GLOBAL_BAGS) {
            await setDoc(doc(db, 'bags', bag.id), {
              ...bag,
              createdAt: serverTimestamp(),
            });
          }
        }
      } catch (err) {
        console.warn('Could not bootstrap global bags collection:', err);
      }
    };

    initGlobalBags();

    // Real-time listener for global bags
    const unsubGlobalBags = onSnapshot(
      collection(db, 'bags'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveBags: GlobalBag[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<GlobalBag, 'id'>),
          }));
          setGlobalBags(liveBags);

          // Update station bag counts dynamically
          setStations((prevStations) =>
            prevStations.map((station) => {
              const stationAvailable = liveBags.filter(
                (b) => b.borrowedStationId === station.id && b.status === 'available'
              ).length;
              return {
                ...station,
                bagInventory: {
                  ...station.bagInventory,
                  available: stationAvailable > 0 ? stationAvailable : station.bagInventory.available,
                },
              };
            })
          );
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bags');
      }
    );

    // Real-time listener for campus-wide totals (/campus/totals)
    const unsubCampus = onSnapshot(
      doc(db, 'campus', 'totals'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCampusMetrics({
            totalBagsEliminated: data.totalBagsEliminated ?? 0,
            monthlyGoal: data.monthlyGoal ?? 180000,
            co2AvoidedKg: data.co2AvoidedKg ?? 0,
            activeCampusers: data.activeCampusers ?? 1,
            treesEquivalent: data.treesEquivalent ?? 0,
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'campus/totals');
      }
    );

    return () => {
      unsubGlobalBags();
      unsubCampus();
    };
  }, []);

  // 2. Real-time Firebase Auth listener & User Subcollections sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsAuthenticated(true);
        setFirebaseConnected(true);

        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUser({
              studentName: data.studentName || fbUser.displayName || 'Eco Student',
              studentId: data.studentId || fbUser.email?.split('@')[0].toUpperCase() || 'APU-STUDENT',
              faculty: data.faculty || 'School of Technology & AI',
              tier: data.tier || 'SEEDLING EXPLORER',
              points: data.points ?? 0,
              activeStreak: data.activeStreak ?? 0,
              bagsSavedTotal: data.bagsSavedTotal ?? 0,
              co2SavedKg: data.co2SavedKg ?? 0,
              avatarSeed: 'ecouser',
              memberSince: data.memberSince || 'November 2024',
            });
          } else {
            // First time profile creation: strictly 0 points and 0 bags
            const initialProfile = {
              studentName: fbUser.displayName || 'Eco Student',
              studentId: fbUser.email?.split('@')[0].toUpperCase() || 'APU-STUDENT',
              faculty: 'School of Technology & AI',
              tier: 'SEEDLING EXPLORER',
              points: 0,
              activeStreak: 0,
              bagsSavedTotal: 0,
              co2SavedKg: 0,
              email: fbUser.email || '',
              memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, initialProfile);
            setUser({
              ...INITIAL_USER,
              studentName: initialProfile.studentName,
              studentId: initialProfile.studentId,
              faculty: initialProfile.faculty,
              points: 0,
              activeStreak: 0,
              bagsSavedTotal: 0,
              co2SavedKg: 0,
            });
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore:', err);
        }

        // Real-time listener for user profile doc updates
        const unsubUserDoc = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const d = snap.data();
            setUser((prev) => ({
              ...prev,
              studentName: d.studentName || prev.studentName,
              studentId: d.studentId || prev.studentId,
              faculty: d.faculty || prev.faculty,
              points: d.points ?? 0,
              activeStreak: d.activeStreak ?? 0,
              bagsSavedTotal: d.bagsSavedTotal ?? 0,
              co2SavedKg: d.co2SavedKg ?? 0,
            }));
          }
        });

        // Real-time listener for active borrowed bags (/users/{uid}/bags)
        const bagsColRef = collection(db, 'users', fbUser.uid, 'bags');
        const unsubBags = onSnapshot(
          bagsColRef,
          (snapshot) => {
            const liveBags: ActiveBag[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<ActiveBag, 'id'>),
            }));
            setActiveBags(liveBags);
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/bags`);
          }
        );

        // Real-time listener for user activities (/users/{uid}/activities)
        const actColRef = collection(db, 'users', fbUser.uid, 'activities');
        const unsubAct = onSnapshot(
          actColRef,
          (snapshot) => {
            const liveAct: ActivityLog[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<ActivityLog, 'id'>),
            }));
            setActivities(liveAct);
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/activities`);
          }
        );

        // Real-time listener for redeemed vouchers (/users/{uid}/vouchers)
        const vchColRef = collection(db, 'users', fbUser.uid, 'vouchers');
        const unsubVch = onSnapshot(
          vchColRef,
          (snapshot) => {
            const liveVouchers: RewardVoucher[] = snapshot.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<RewardVoucher, 'id'>),
            }));
            setUserVouchers(liveVouchers);
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/vouchers`);
          }
        );

        // Real-time listener for stamps
        const stampsColRef = collection(db, 'users', fbUser.uid, 'stamps');
        const unsubStamps = onSnapshot(stampsColRef, (snapshot) => {
          if (!snapshot.empty) {
            const stampMap: Record<number, StampSlot> = {};
            snapshot.docs.forEach((docSnap) => {
              const data = docSnap.data() as StampSlot;
              stampMap[data.index] = data;
            });
            setStampSlots(
              Array.from({ length: 10 }, (_, i) => {
                const idx = i + 1;
                return (
                  stampMap[idx] || {
                    index: idx,
                    isStamped: false,
                  }
                );
              })
            );
          }
        });

        return () => {
          unsubUserDoc();
          unsubBags();
          unsubAct();
          unsubVch();
          unsubStamps();
        };
      } else {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        setActiveBags([]);
        setActivities([]);
        setUserVouchers([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 3. Real Firebase Auth Operations ONLY (NO MOCK / NO FALLBACK)
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);
      setIsAuthenticated(true);
      showToast(`Welcome, ${fbUser.displayName || fbUser.email}! Verified with Firebase.`, 'success');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      showToast(err.message || 'Google sign-in was interrupted. Please try again.', 'warning');
    }
  };

  const loginWithEmailPassword = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = result.user;
      setFirebaseUser(fbUser);
      setIsAuthenticated(true);
      showToast(`Welcome back, ${fbUser.displayName || fbUser.email}!`, 'success');
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid university email address.';
      }
      showToast(msg, 'warning');
      throw new Error(msg);
    }
  };

  const registerWithEmailPassword = async (email: string, pass: string, name: string, faculty: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = result.user;

      if (name.trim()) {
        await updateProfile(fbUser, { displayName: name.trim() });
      }

      // Send Firebase Email Verification
      await sendEmailVerification(fbUser);

      // Create Initial Firestore User Profile with 0 stats
      const userDocRef = doc(db, 'users', fbUser.uid);
      await setDoc(userDocRef, {
        studentName: name.trim() || 'Eco Student',
        studentId: email.split('@')[0].toUpperCase(),
        faculty: faculty || 'School of Technology & AI',
        tier: 'SEEDLING EXPLORER',
        points: 0,
        activeStreak: 0,
        bagsSavedTotal: 0,
        co2SavedKg: 0,
        email: email.trim(),
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        updatedAt: serverTimestamp(),
      });

      setFirebaseUser(fbUser);
      setIsAuthenticated(true);
      showToast(
        `Account created! A verification link was sent to ${email}. Please check your inbox.`,
        'success'
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      let msg = 'Registration failed. Please check your details.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      }
      showToast(msg, 'warning');
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        showToast(`Verification email resent to ${auth.currentUser.email}.`, 'info');
      } catch (err: any) {
        showToast(err.message || 'Could not resend email at this moment.', 'warning');
      }
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast(`Password reset link sent to ${email}.`, 'success');
    } catch (err: any) {
      console.error('Password reset error:', err);
      showToast(err.message || 'Could not send reset email. Verify the address.', 'warning');
    }
  };

  // 4. Logout: Purges local data completely
  const logout = () => {
    fbSignOut(auth).catch(() => {});
    setFirebaseUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.clear();
    } catch {}
    setUser(INITIAL_USER);
    setActiveBags([]);
    setActivities([]);
    setUserVouchers([]);
    showToast('Signed out of EcoCarry. Local session data purged.', 'info');
  };

  // 5. Account Deletion: Purges user data and Firebase Auth profile
  const deleteAccount = async () => {
    if (!firebaseUser) return;
    if (activeBags.length > 0) {
      showToast('Please return all active borrowed bags before deleting your account.', 'warning');
      return;
    }

    try {
      const uid = firebaseUser.uid;

      // 1. Delete user subcollections and root document
      const bagsSnap = await getDocs(collection(db, 'users', uid, 'bags'));
      for (const d of bagsSnap.docs) {
        await deleteDoc(d.ref);
      }
      const actSnap = await getDocs(collection(db, 'users', uid, 'activities'));
      for (const d of actSnap.docs) {
        await deleteDoc(d.ref);
      }
      const stampsSnap = await getDocs(collection(db, 'users', uid, 'stamps'));
      for (const d of stampsSnap.docs) {
        await deleteDoc(d.ref);
      }
      const vchSnap = await getDocs(collection(db, 'users', uid, 'vouchers'));
      for (const d of vchSnap.docs) {
        await deleteDoc(d.ref);
      }
      await deleteDoc(doc(db, 'users', uid));

      // 2. Delete Firebase Auth account
      await deleteUser(firebaseUser);

      // 3. Clear all local storage
      localStorage.clear();

      // 4. Reset local state
      setFirebaseUser(null);
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      setActiveBags([]);
      setActivities([]);
      setUserVouchers([]);
      setIsDeleteAccountOpen(false);

      showToast('Your account and all personal data have been completely deleted.', 'info');
    } catch (err: any) {
      console.error('Account deletion error:', err);
      if (err.code === 'auth/requires-recent-login') {
        showToast('Security policy: Please re-sign in before deleting your account.', 'warning');
      } else {
        showToast(err.message || 'Failed to delete account.', 'warning');
      }
    }
  };

  // 6. Borrow a physical bag using a Firestore Transaction
  const borrowBag = async (stationId: string, bagId: string, scannedQrToken?: string): Promise<boolean> => {
    if (!firebaseUser) {
      showToast('Please sign in to borrow campus bags.', 'warning');
      return false;
    }

    const station = stations.find((s) => s.id === stationId) || stations[0];
    const bagDocRef = doc(db, 'bags', bagId);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userBagDocRef = doc(db, 'users', firebaseUser.uid, 'bags', bagId);
    const actDocRef = doc(collection(db, 'users', firebaseUser.uid, 'activities'));

    try {
      await runTransaction(db, async (transaction) => {
        const bagDoc = await transaction.get(bagDocRef);
        if (!bagDoc.exists()) {
          throw new Error(`Physical bag ${bagId} does not exist in the campus database.`);
        }

        const bagData = bagDoc.data() as GlobalBag;
        if (bagData.status !== 'available') {
          throw new Error(`Bag ${bagData.bagNumber} is currently checked out by another borrower.`);
        }

        // Verify QR security token if provided
        if (scannedQrToken && bagData.qrToken && bagData.qrToken !== scannedQrToken) {
          throw new Error(`Invalid or expired QR security token for bag ${bagData.bagNumber}.`);
        }

        // 1. Update physical bag in global collection
        transaction.update(bagDocRef, {
          status: 'borrowed',
          currentBorrowerId: firebaseUser.uid,
          currentBorrowerName: user.studentName,
          borrowedStationId: station.id,
          borrowedStationName: station.name,
          borrowedAt: serverTimestamp(),
        });

        // 2. Add to user's active bag list
        transaction.set(userBagDocRef, {
          bagNumber: bagData.bagNumber,
          type: bagData.type,
          borrowedAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          borrowedStationId: station.id,
          borrowedStationName: station.name,
          dueDate: 'No deadline • Return anytime',
          daysRemaining: 999,
          status: 'active',
          co2SavedGrams: bagData.co2SavedGrams || 50,
          washCount: bagData.washCount || 0,
          qrPayload: `ECOCARRY:BAG:${bagData.bagNumber}:${bagData.qrToken}`,
        });

        // 3. Log activity record with server timestamp
        transaction.set(actDocRef, {
          action: 'Borrowed Bag',
          bagNumber: bagData.bagNumber,
          location: station.name,
          time: 'Just now',
          type: 'borrow',
          timeServer: serverTimestamp(),
        });
      });

      showToast(`Verified checkout for bag #${bagId}! Return anytime to any campus kiosk.`, 'success');
      return true;
    } catch (err: any) {
      console.error('Borrow transaction error:', err);
      showToast(err.message || 'Failed to borrow bag in Firestore transaction.', 'warning');
      return false;
    }
  };

  // 7. Return a physical bag using a Firestore Transaction
  // Stop letting clients write points: transaction enforces exactly +50 points on verified return
  const returnBag = async (bagId: string, stationId: string): Promise<boolean> => {
    if (!firebaseUser) {
      showToast('Please sign in to return bags.', 'warning');
      return false;
    }

    const station = stations.find((s) => s.id === stationId) || stations[0];
    const bagDocRef = doc(db, 'bags', bagId);
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userBagDocRef = doc(db, 'users', firebaseUser.uid, 'bags', bagId);
    const campusDocRef = doc(db, 'campus', 'totals');
    const actDocRef = doc(collection(db, 'users', firebaseUser.uid, 'activities'));

    // Generate fresh cryptographic QR token for next checkout cycle
    const newQrToken = `TOKEN_${bagId.replace(/[^A-Z0-9]/g, '')}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      await runTransaction(db, async (transaction) => {
        const bagDoc = await transaction.get(bagDocRef);
        if (!bagDoc.exists()) {
          throw new Error(`Bag record not found in system.`);
        }

        const bagData = bagDoc.data() as GlobalBag;
        if (bagData.status !== 'borrowed' || bagData.currentBorrowerId !== firebaseUser.uid) {
          throw new Error(`You can only return bags currently assigned to your account.`);
        }

        const userDoc = await transaction.get(userDocRef);
        const currentPoints = userDoc.exists() ? (userDoc.data().points || 0) : 0;
        const currentBags = userDoc.exists() ? (userDoc.data().bagsSavedTotal || 0) : 0;
        const currentCo2 = userDoc.exists() ? (userDoc.data().co2SavedKg || 0) : 0;

        // 1. Return bag in global collection with new rotated QR token
        transaction.update(bagDocRef, {
          status: 'available',
          currentBorrowerId: null,
          currentBorrowerName: null,
          lastReturnedAt: serverTimestamp(),
          lastReturnStationId: station.id,
          washCount: increment(1),
          qrToken: newQrToken,
        });

        // 2. Award exactly 50 points and 1 bag to user profile
        transaction.update(userDocRef, {
          points: currentPoints + 50,
          bagsSavedTotal: currentBags + 1,
          co2SavedKg: Number((currentCo2 + 0.05).toFixed(2)),
          activeStreak: increment(1),
          updatedAt: serverTimestamp(),
        });

        // 3. Remove from user active bags
        transaction.delete(userBagDocRef);

        // 4. Update campus collective goal on server
        transaction.set(
          campusDocRef,
          {
            totalBagsEliminated: increment(1),
            co2AvoidedKg: increment(0.05),
            treesEquivalent: increment(1),
            monthlyGoal: 180000,
            lastCalculatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // 5. Activity log with server timestamp
        transaction.set(actDocRef, {
          action: 'Returned Bag & Stamped',
          bagNumber: bagData.bagNumber,
          location: station.name,
          time: 'Just now',
          type: 'return',
          timeServer: serverTimestamp(),
        });
      });

      // Update stamp card
      const firstUnstamped = stampSlots.findIndex((s) => !s.isStamped);
      if (firstUnstamped !== -1) {
        const stampIndex = firstUnstamped + 1;
        await setDoc(doc(db, 'users', firebaseUser.uid, 'stamps', `slot-${stampIndex}`), {
          userId: firebaseUser.uid,
          index: stampIndex,
          isStamped: true,
          stampedDate: new Date().toISOString(),
          bagRef: bagId,
        }).catch(() => {});
      }

      showToast(`Bag #${bagId} successfully returned! Earned +50 Eco Points & 1 Gold Stamp.`, 'success');
      triggerConfetti();
      return true;
    } catch (err: any) {
      console.error('Return transaction error:', err);
      showToast(err.message || 'Failed to process return transaction.', 'warning');
      return false;
    }
  };

  // 8. Reward Redemption on the Server with Single-Use Voucher Codes
  const redeemReward = async (rewardId: string): Promise<boolean> => {
    if (!firebaseUser) {
      showToast('Please sign in to redeem campus rewards.', 'warning');
      return false;
    }

    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return false;

    if (user.points < reward.stampsRequired) {
      showToast(
        `Insufficient points. You need ${reward.stampsRequired} points (current balance: ${user.points}).`,
        'warning'
      );
      return false;
    }

    try {
      // Call server redemption endpoint
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardId: reward.id,
          rewardName: reward.title,
          pointsCost: reward.stampsRequired,
          userId: firebaseUser.uid,
          studentName: user.studentName,
        }),
      });

      if (!response.ok) {
        throw new Error('Server redemption failed');
      }

      const resData = await response.json();
      const voucher: RewardVoucher = resData.voucher;

      // Deduct points in Firestore transaction and store single-use voucher
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const voucherDocRef = doc(db, 'users', firebaseUser.uid, 'vouchers', voucher.id);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        const currentPoints = userDoc.exists() ? (userDoc.data().points || 0) : user.points;
        if (currentPoints < reward.stampsRequired) {
          throw new Error('Insufficient points balance.');
        }

        // Deduct points
        transaction.update(userDocRef, {
          points: currentPoints - reward.stampsRequired,
          updatedAt: serverTimestamp(),
        });

        // Store server single-use voucher code
        transaction.set(voucherDocRef, {
          ...voucher,
          createdAt: serverTimestamp(),
        });
      });

      showToast(`Voucher ${voucher.code} unlocked! Single-use code issued.`, 'success');
      triggerConfetti();
      return true;
    } catch (err: any) {
      console.error('Redeem error:', err);
      showToast(err.message || 'Failed to redeem reward.', 'warning');
      return false;
    }
  };

  // Developer & Admin helpers (Exclusive to developer email)
  const adminAwardPoints = async (studentId: string, amount: number) => {
    if (!isCurrentUserAdmin || !firebaseUser) return;
    try {
      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        {
          points: increment(amount),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      showToast(`Admin: Awarded +${amount} points to student.`, 'success');
    } catch (err) {
      showToast('Admin write failed.', 'warning');
    }
  };

  const adminResolveBag = async (bagNumber: string) => {
    if (!isCurrentUserAdmin || !firebaseUser) return;
    try {
      await setDoc(
        doc(db, 'bags', bagNumber),
        {
          status: 'available',
          currentBorrowerId: null,
          lastReturnedAt: serverTimestamp(),
        },
        { merge: true }
      );
      showToast(`Admin: Bag #${bagNumber} restored to available status.`, 'info');
    } catch (err) {
      showToast('Admin bag resolve failed.', 'warning');
    }
  };

  const exportAllData = (format: 'json' | 'csv') => {
    const dataToExport = {
      campusMetrics,
      globalBags,
      activeBags,
      user,
      activities,
      userVouchers,
      timestamp: new Date().toISOString(),
    };

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ecocarry_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const csvRows = [
        ['Type', 'ID', 'Details', 'Timestamp'],
        ['Campus', 'Totals', `${campusMetrics.totalBagsEliminated} bags`, new Date().toISOString()],
        ...globalBags.map((b) => ['Bag', b.bagNumber, `${b.type} (${b.status})`, b.borrowedAt || 'N/A']),
        ...activities.map((a) => ['Activity', a.bagNumber, `${a.action} at ${a.location}`, a.time]),
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `ecocarry_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    showToast(`Exported campus records as ${format.toUpperCase()}`, 'success');
  };

  const resetData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setActiveBags([]);
    setActivities([]);
    setUserVouchers([]);
    showToast('Local metrics reset to zero.', 'info');
  };

  return (
    <GreenBagContext.Provider
      value={{
        user,
        firebaseUser,
        firebaseConnected,
        firebaseProjectId: FIREBASE_PROJECT_ID,
        campusMetrics,
        globalBags,
        activeBags,
        stations,
        rewards,
        badges,
        stampSlots,
        activities,
        userVouchers,
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
        isPrivacyNoticeOpen,
        setIsPrivacyNoticeOpen,
        isDeleteAccountOpen,
        setIsDeleteAccountOpen,
        isCurrentUserAdmin,
        isDevConsoleOpen,
        setIsDevConsoleOpen,
        devAccounts,
        adminAwardPoints,
        adminResolveBag,
        exportAllData,
        isAuthenticated,
        loginWithGoogle,
        loginWithEmailPassword,
        registerWithEmailPassword,
        resendVerificationEmail,
        sendPasswordReset,
        deleteAccount,
        logout,
        toastMessage,
        showToast,
        borrowBag,
        returnBag,
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
