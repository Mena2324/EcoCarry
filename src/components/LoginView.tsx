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
  Building,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginWithGoogle } = useGreenBag();

  // Mode: Sign In vs Create Account
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [studentIdOrEmail, setStudentIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('School of Technology & AI');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<'student' | 'staff' | 'guest'>('student');
  const [ecoPledgeAccepted, setEcoPledgeAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (authMode === 'register') {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!studentIdOrEmail.trim()) {
        setValidationError('Please enter your Student ID or Email.');
        return;
      }
      if (password && confirmPassword && password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
      if (!ecoPledgeAccepted) {
        setValidationError('Please accept the EcoCarry campus pledge to continue.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        login({
          studentIdOrEmail: studentIdOrEmail.trim(),
          name: fullName.trim(),
          faculty: selectedFaculty,
          isNewAccount: true,
        });
      }, 500);
      return;
    }

    // Sign In mode
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let faculty = 'School of Technology & AI';
      let name = 'Student';

      if (role === 'staff') {
        faculty = 'APU Sustainability Office';
        name = 'Dr. Sarah Chen';
      } else if (role === 'guest') {
        faculty = 'Campus Eco Visitor';
        name = 'Alex Morgan';
      } else if (studentIdOrEmail) {
        if (studentIdOrEmail.toLowerCase().includes('menazaky') || studentIdOrEmail.toLowerCase().includes('menazaki')) {
          name = 'Mena Zaki';
        } else {
          name = studentIdOrEmail.includes('@') ? studentIdOrEmail.split('@')[0] : `Student ${studentIdOrEmail}`;
        }
      }

      login({
        studentIdOrEmail: studentIdOrEmail.trim() || 'APU-STUDENT',
        name,
        faculty,
      });
    }, 450);
  };

  const handleQuickPersona = (
    name: string,
    id: string,
    fac: string,
    targetRole: 'student' | 'staff' | 'guest'
  ) => {
    setRole(targetRole);
    setStudentIdOrEmail(id);
    setPassword('••••••••••••');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login({
        studentIdOrEmail: id,
        name,
        faculty: fac,
      });
    }, 350);
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
            <h1 className="text-2xl font-extrabold text-[#14261C] tracking-tight">
              EcoCarry
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4A943E]/15 text-[#226d1b] uppercase tracking-wider">
              Eco-Pass
            </span>
          </div>
          <p className="text-xs text-[#2D3E35] font-medium max-w-xs mx-auto">
            Asia Pacific University • Campus Reusable Bag & Rewards Network
          </p>
        </div>

        {/* Auth Mode Switcher (Sign In vs Create Account) */}
        <div className="flex items-center justify-center">
          <div className="bg-[#def3e3] border border-[#E2DEC2] p-1 rounded-full flex items-center gap-1 shadow-sm w-full max-w-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setValidationError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
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
                setValidationError(null);
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Role Selector Tabs (Only in Sign In mode or when registering as Staff/Visitor) */}
        <div className="flex items-center justify-center">
          <div className="bg-[#FAF9F5] border border-[#E2DEC2] p-1 rounded-full flex items-center gap-1 shadow-tactile-sm">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                role === 'student'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                role === 'staff'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Faculty / Staff
            </button>
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                role === 'guest'
                  ? 'bg-[#186049] text-white shadow-sm'
                  : 'text-[#2D3E35] hover:text-[#186049]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Visitor
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-[24px] bg-[#FAF9F5] border border-[#E2DEC2] p-5 shadow-tactile-sm">
          {validationError && (
            <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-semibold">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name field (Only in Create Account mode) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#14261C] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-4 text-xs font-medium text-[#14261C] placeholder:text-[#707974] outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Student ID / Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#14261C] mb-1">
                {role === 'student'
                  ? 'Student ID or APU Email'
                  : role === 'staff'
                  ? 'Staff ID or University Email'
                  : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={
                    role === 'student'
                      ? 'e.g. TP012345@mail.apu.edu.my or student ID'
                      : 'e.g. staff.id@apu.edu.my'
                  }
                  value={studentIdOrEmail}
                  onChange={(e) => setStudentIdOrEmail(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-4 text-xs font-medium text-[#14261C] placeholder:text-[#707974] outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Faculty Dropdown (In Create Account mode) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#14261C] mb-1">
                  Faculty / Department
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] px-3.5 text-xs font-medium text-[#14261C] outline-none transition-all shadow-inner"
                >
                  <option value="School of Technology & AI">School of Technology & AI</option>
                  <option value="School of Design & Creative Arts">School of Design & Creative Arts</option>
                  <option value="Faculty of Business & Management">Faculty of Business & Management</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="APU Sustainability Office">APU Sustainability Office</option>
                  <option value="General Campus / Visitor">General Campus / Visitor</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#14261C]">
                  {authMode === 'register' ? 'Create Password' : 'Password or Campus PIN'}
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your university inbox.')}
                    className="text-[11px] font-semibold text-[#186049] hover:underline"
                  >
                    Forgot PIN?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-10 text-xs font-medium text-[#14261C] placeholder:text-[#707974] outline-none transition-all shadow-inner"
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

            {/* Confirm Password (In Create Account mode) */}
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#14261C] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[52px] rounded-[12px] bg-[#FAF9F5] border border-[#E2DEC2] focus:border-[2px] focus:border-[#186049] pl-10 pr-4 text-xs font-medium text-[#14261C] placeholder:text-[#707974] outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Checkbox (Keep Signed In or Eco-Pledge) */}
            {authMode === 'signin' ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center transition-all ${
                      rememberMe
                        ? 'bg-[#186049] text-[#FAF9F5]'
                        : 'bg-[#FAF9F5] border border-[#E2DEC2]'
                    }`}
                  >
                    {rememberMe && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <label
                    onClick={() => setRememberMe(!rememberMe)}
                    className="text-xs text-[#2D3E35] font-semibold cursor-pointer select-none"
                  >
                    Keep signed in for kiosk scan
                  </label>
                </div>
                <span className="text-[11px] font-bold text-[#4A943E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fast NFC
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setEcoPledgeAccepted(!ecoPledgeAccepted)}
                  className={`w-[22px] h-[22px] rounded-[6px] shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    ecoPledgeAccepted
                      ? 'bg-[#186049] text-[#FAF9F5]'
                      : 'bg-[#FAF9F5] border border-[#E2DEC2]'
                  }`}
                >
                  {ecoPledgeAccepted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <label
                  onClick={() => setEcoPledgeAccepted(!ecoPledgeAccepted)}
                  className="text-[11px] text-[#2D3E35] font-semibold cursor-pointer select-none leading-snug"
                >
                  I agree to the EcoCarry pledge to return borrowed bags clean & sanitized within 7 days.
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-full bg-[#186049] hover:bg-[#004734] disabled:opacity-60 text-white font-bold text-sm shadow-tactile-sm transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <span>
                  {authMode === 'register' ? 'Creating EcoCarry Profile...' : 'Authenticating...'}
                </span>
              ) : authMode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create EcoCarry Account</span>
                </>
              ) : (
                <>
                  <span>Sign In to EcoCarry</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Alternative Auth divider (Only in Sign In mode) */}
          {authMode === 'signin' && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2DEC2]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#707974]">
                  Or Sign In With
                </span>
                <div className="flex-1 h-px bg-[#E2DEC2]" />
              </div>

              <div className="space-y-2">
                {/* Firebase Google Sign-In */}
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full py-3 px-4 rounded-full bg-white hover:bg-[#def3e3] text-[#14261C] border border-[#E2DEC2] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
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
                  <span>Sign In with Google (Firebase)</span>
                </button>

                {/* Single Sign-On Button */}
                <button
                  type="button"
                  onClick={() => {
                    login({
                      studentIdOrEmail: 'TP068412@mail.apu.edu.my',
                      name: 'Mena Zaki',
                      faculty: 'School of Technology & AI',
                    });
                  }}
                  className="w-full py-3 px-4 rounded-full bg-[#ECE8AF] hover:bg-[#e4df9c] text-[#186049] border border-[#E2DEC2] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <GraduationCap className="w-4 h-4 text-[#186049]" />
                  <span>APU Student WebSpace SSO</span>
                </button>
              </div>
            </>
          )}

          {/* Toggle between Sign In and Create Account Link */}
          <div className="mt-4 pt-3 border-t border-[#E2DEC2] text-center">
            {authMode === 'signin' ? (
              <p className="text-xs text-[#2D3E35]">
                New to EcoCarry?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setValidationError(null);
                  }}
                  className="font-bold text-[#186049] underline hover:text-[#004734]"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#2D3E35]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setValidationError(null);
                  }}
                  className="font-bold text-[#186049] underline hover:text-[#004734]"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Demo Fast-Switch Persona Cards (Only in Sign In mode) */}
        {authMode === 'signin' && (
          <div className="space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#707974] px-1">
              Demo Student Accounts (Instant Sign-in)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickPersona(
                    'Campus Student',
                    'APU-2024-1001',
                    'School of Technology & AI',
                    'student'
                  )
                }
                className="p-3 rounded-2xl bg-[#def3e3]/70 hover:bg-[#def3e3] border border-[#E2DEC2] text-left transition-colors flex items-center justify-between group shadow-tactile-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[#14261C]">APU Student</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#186049] text-white">
                      Student
                    </span>
                  </div>
                  <span className="text-[11px] text-[#2D3E35] block">
                    Tech & AI • Standard User
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-[#D98327] group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickPersona(
                    'Kenji Sato',
                    'APU-2023-4109',
                    'Design & Media Hub',
                    'student'
                  )
                }
                className="p-3 rounded-2xl bg-[#def3e3]/70 hover:bg-[#def3e3] border border-[#E2DEC2] text-left transition-colors flex items-center justify-between group shadow-tactile-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-[#14261C]">Kenji Sato</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#4A943E] text-white">
                      Student
                    </span>
                  </div>
                  <span className="text-[11px] text-[#2D3E35] block">
                    Design • Standard User
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-[#D98327] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Tactile Kraft Paper Sustainability Note */}
        <div className="rounded-[20px] bg-[#ECE8AF] border border-[#E2DEC2] p-4 text-xs text-[#14261C] shadow-tactile-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#186049] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Leaf className="w-4 h-4 text-[#93d8bb]" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#186049]">Did you know?</h4>
            <p className="text-[11px] text-[#2D3E35] mt-0.5 leading-relaxed">
              Every reusable EcoCarry bag borrowed helps eliminate campus single-use plastic waste.
              Bags can be kept as long as needed with no return time limit.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 pb-2 text-center text-[11px] text-[#707974] flex items-center justify-center gap-3">
        <span>APU Eco-Policy</span>
        <span>•</span>
        <span>Campus Privacy</span>
        <span>•</span>
        <span>Support & Stations</span>
      </div>
    </div>
  );
};
