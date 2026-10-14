import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { api, AppApiError } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { loginFormSchema, type LoginFormValues } from '../validations/auth.validation';
import type { AuthResponseData } from '../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Preserve previous route destination if user was redirected by ProtectedRoute
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const data = await api.post<AuthResponseData>('/auth/login', {
        email: values.email,
        password: values.password,
      });

      setUser(data.user);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AppApiError) {
        if (err.errors && err.errors.length > 0) {
          // Map backend field-level errors if any
          err.errors.forEach((fieldErr) => {
            if (fieldErr.field === 'email' || fieldErr.field === 'password') {
              setError(fieldErr.field, { message: fieldErr.message });
            }
          });
        }
        setServerError(err.message);
      } else {
        setServerError('Unable to sign in. Please verify your connection.');
      }
    }
  };

  return (
    <Card className="w-full shadow-2xl border-slate-800 bg-slate-900/90 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm text-slate-400 mt-1">
            Sign in with your email and password to access your DSA workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4 pt-4">
          {/* Server-level Error Alert */}
          {serverError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-relaxed">{serverError}</div>
            </div>
          )}

          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            id="login-email"
            placeholder="student@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" />}
            {...register('email')}
          />

          {/* Password Field with Visibility Toggle */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.password?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-md"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            {...register('password')}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2 font-semibold shadow-glow-sm"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-center py-4 bg-slate-950/60">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
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
