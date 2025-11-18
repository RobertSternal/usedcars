'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyAccount() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number | undefined>();
  const [userInfo, setUserInfo] = useState<{ userId: string; email: string; name?: string } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Get pending verification info from localStorage
    const pendingData = localStorage.getItem('pendingVerification');
    if (pendingData) {
      setUserInfo(JSON.parse(pendingData));
    } else {
      // No pending verification, redirect to signup
      router.push('/signup');
    }
  }, [router]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (index === 5 && value && newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      // Auto-submit
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    if (!userInfo) return;

    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      setError('Wprowadź wszystkie 6 cyfr kodu');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/usedcars/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          code: codeToVerify,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAttemptsLeft(data.attemptsLeft);
        throw new Error(data.error || 'Nieprawidłowy kod weryfikacyjny');
      }

      // Success!
      setSuccess('Konto zostało pomyślnie zweryfikowane!');
      localStorage.removeItem('pendingVerification');
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin?verified=true');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      // Clear code inputs on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!userInfo || countdown > 0) return;

    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/usedcars/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          email: userInfo.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setCountdown(data.waitTime || 60);
        }
        throw new Error(data.error || 'Nie udało się wysłać kodu');
      }

      setSuccess('Nowy kod weryfikacyjny został wysłany na Twój email');
      setCountdown(60); // 60 seconds cooldown
      setAttemptsLeft(undefined);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setResending(false);
    }
  };

  if (!userInfo) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 w-full"></div>
        
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Potwierdź swoje konto
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Wysłaliśmy 6-cyfrowy kod weryfikacyjny na adres:
            </p>
            <p className="mt-1 text-base font-semibold text-blue-600">
              {userInfo.email}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  {attemptsLeft !== undefined && attemptsLeft > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      Pozostało prób: {attemptsLeft}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Code Input */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Wprowadź kod weryfikacyjny
            </label>
            <div className="flex justify-center space-x-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading || !!success}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  aria-label={`Cyfra ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || code.some(d => !d) || !!success}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Weryfikacja...
              </span>
            ) : (
              'Zweryfikuj konto'
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Nie otrzymałeś kodu?
            </p>
            <button
              onClick={handleResendCode}
              disabled={resending || countdown > 0 || !!success}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {resending ? (
                'Wysyłanie...'
              ) : countdown > 0 ? (
                `Wyślij ponownie (${countdown}s)`
              ) : (
                'Wyślij kod ponownie'
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs text-blue-700">
                  <strong>Wskazówka:</strong> Kod jest ważny przez 10 minut. 
                  Sprawdź folder spam, jeśli nie widzisz wiadomości w skrzynce odbiorczej.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Sign In */}
          <div className="text-center">
            <Link 
              href="/signin" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Powrót do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
