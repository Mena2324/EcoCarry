import React, { useState } from 'react';
import { useGreenBag } from '../context/GreenBagContext';
import {
  Leaf,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
  KeyRound,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const {
    loginWithGoogle,
    loginWithEmailPassword,
    registerWithEmailPassword,
    sendPasswordReset,
    setIsPrivacyNoticeOpen,
  } = useGreenBag();

  // Mode: Sign In vs Create Account
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('School of Technology & AI');
  const [showPassword, setShowPassword] = useState(false);
  const [ecoPledgeAccepted, setEcoPledgeAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const faculties = [
    'School of Technology & AI',
    'Faculty of Business & Management',
    'School of Design & Creative Arts',
    'Faculty of Engineering',
    'APU Sustainability Office & Staff',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'register') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full student name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid university email address.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!ecoPledgeAccepted) {
        setErrorMessage('Please accept the campus reusable pledge to proceed.');
        return;
      }

      setIsLoading(true);
      try {
        await registerWithEmailPassword(email.trim(), password, fullName.trim(), selectedFaculty);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Sign In mode
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmailPassword(email.trim(), password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage('Please provide a valid email to receive the reset link.');
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-3 sm:py-6 px-1">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="text-center pt-1">
          <div className="w-16 h-16 rounded-[22px] bg-[#186049] text-white flex items-center justify-center mx-auto mb-3 shadow-tactile-md ring-4 ring-[#def3e3]">
            <Leaf className="w-8 h-8 text-[#93d8bb]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">EcoCarry</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4A943E]/15 text-[#226d1b] uppercase tracking-wider">
              Firebase Auth
            </span>
          </div>
          <p className="text-xs text-[#2D3E35] font-medium max-w-xs mx-auto">
            Asia Pacific University • Verified Campus Reusable Bag Network
          </p>
        </div>

        {/* Auth Mode Switcher (Sign In vs Create Account) */}
        <div className="flex items-center justify-center">
          <div className="bg-[#def3e3] border border-[#E2DEC2] p-1 rounded-full flex items-center gap-1 shadow-sm w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMessage(null);
                setIsForgotPasswordOpen(false);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signin' && !isForgotPasswordOpen
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage(null);
                setIsForgotPasswordOpen(false);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register' && !isForgotPasswordOpen
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-xs text-[#ba1a1a] flex items-start gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Forgot Password Flow */}
        {isForgotPasswordOpen ? (
          <div className="p-5 rounded-[22px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2DEC2]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#186049]" />
                <h3 className="text-sm font-extrabold text-[#14261C]">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setResetSubmitted(false);
                }}
                className="text-xs font-semibold text-[#707974] hover:text-[#14261C]"
              >
                Back to Sign in
              </button>
            </div>

            {resetSubmitted ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#def3e3] text-[#186049] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <p className="text-xs font-bold text-[#14261C]">Check your university inbox</p>
                <p className="text-[11px] text-[#2D3E35]">
                  A password reset link was sent to <strong>{resetEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setResetSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-[#186049] text-white text-xs font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                <p className="text-[11px] text-[#2D3E35]">
                  Enter your registered campus email to receive a password reset link from Firebase Auth.
                </p>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707974]" />
                  <input
                    type="email"
                    placeholder="student.name@mail.apu.edu.my"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-3 text-xs text-[#14261C] outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-50 text-white font-bold text-xs shadow-tactile-sm transition-all"
                >
                  {isLoading ? 'Sending...' : 'Send Password Reset Email'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Main Auth Form */
          <div className="p-5 rounded-[22px] bg-[#FAF9F5] border border-[#E2DEC2] shadow-tactile-sm">
            {/* Google Firebase Login Button */}
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full py-3.5 rounded-full bg-white border border-[#E2DEC2] hover:bg-[#def3e3]/50 text-[#14261C] font-bold text-xs flex items-center justify-center gap-2.5 shadow-sm transition-all mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#E2DEC2]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#707974]">
                or email & password
              </span>
              <div className="flex-1 h-px bg-[#E2DEC2]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name (Only on Registration) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#14261C] mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707974]" />
                    <input
                      type="text"
                      placeholder="e.g. Mena Zaki"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-3 text-xs text-[#14261C] outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-[11px] font-bold text-[#14261C] mb-1">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707974]" />
                  <input
                    type="email"
                    placeholder="student.name@mail.apu.edu.my"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-3 text-xs text-[#14261C] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Faculty Selector (Only on Registration) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#14261C] mb-1">
                    Faculty / Department
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="w-full h-[48px] px-3 rounded-[12px] bg-white border border-[#E2DEC2] text-xs text-[#14261C] font-semibold outline-none focus:border-[#186049]"
                  >
                    {faculties.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#14261C]">Password</label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[10px] font-bold text-[#186049] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707974]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-10 text-xs text-[#14261C] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#14261C]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Only on Registration) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#14261C] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#707974]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-[48px] rounded-[12px] bg-white border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-3 text-xs text-[#14261C] outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Eco Pledge Checkbox on Registration */}
              {authMode === 'register' && (
                <div className="bg-[#ECE8AF]/60 p-3 rounded-xl border border-[#E2DEC2] flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEcoPledgeAccepted(!ecoPledgeAccepted)}
                    className={`w-[20px] h-[20px] rounded-[5px] shrink-0 flex items-center justify-center transition-all ${
                      ecoPledgeAccepted ? 'bg-[#186049] text-white' : 'bg-white border border-[#E2DEC2]'
                    }`}
                  >
                    {ecoPledgeAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <label
                    onClick={() => setEcoPledgeAccepted(!ecoPledgeAccepted)}
                    className="text-[11px] text-[#14261C] font-semibold cursor-pointer select-none leading-tight"
                  >
                    I pledge to borrow reusable EcoCarry bags conscientiously and deposit clean bags to campus kiosks.
                  </label>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-50 text-white font-bold text-xs shadow-tactile-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating with Firebase...</span>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In to EcoCarry' : 'Create Verified Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Sustainability Assurance Note */}
        <div className="rounded-[20px] bg-[#ECE8AF] border border-[#E2DEC2] p-4 text-xs text-[#14261C] shadow-tactile-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#186049] text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#93d8bb]" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#186049]">Authenticated Security</h4>
            <p className="text-[11px] text-[#2D3E35] mt-0.5 leading-relaxed">
              Every borrow, return, and reward transaction is verified through Firebase Security Rules and
              atomic Firestore transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info & Privacy Link */}
      <div className="pt-6 pb-2 text-center text-[11px] text-[#707974] flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setIsPrivacyNoticeOpen(true)}
          className="hover:text-[#186049] underline"
        >
          Campus Privacy Notice
        </button>
        <span>•</span>
        <span>Zero Single-Use Plastics</span>
        <span>•</span>
        <span>APU Green Initiative</span>
      </div>
    </div>
  );
};
