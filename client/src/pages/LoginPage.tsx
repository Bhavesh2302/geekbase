import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api, AppApiError } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { AuthResponseData } from '../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect destination if user was redirected from a protected route
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.post<AuthResponseData>('/auth/login', {
        email,
        password,
      });

      setUser(data.user);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AppApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to log in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="w-full text-center">
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your DSA workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors focus:outline-none focus:underline"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
