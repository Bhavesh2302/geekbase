import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
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
import { registerFormSchema, type RegisterFormValues } from '../validations/auth.validation';
import type { AuthResponseData } from '../types/auth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });
  const hasMinLength = passwordValue.length >= 8;
  const hasLetter = /[A-Za-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      const data = await api.post<AuthResponseData>('/auth/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof AppApiError) {
        if (err.errors && err.errors.length > 0) {
          err.errors.forEach((fieldErr) => {
            if (
              fieldErr.field === 'name' ||
              fieldErr.field === 'email' ||
              fieldErr.field === 'password'
            ) {
              setError(fieldErr.field, { message: fieldErr.message });
            }
          });
        }
        setServerError(err.message);
      } else {
        setServerError('Registration failed. Please check your inputs.');
      }
    }
  };

  return (
    <Card className="w-full shadow-2xl border-slate-800 bg-slate-900/90 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="w-full text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm text-slate-400 mt-1">
            Sign up to start tracking your DSA journey and study calendar.
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

          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            id="register-name"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isSubmitting}
            error={errors.name?.message}
            leftIcon={<User className="w-4 h-4" />}
            {...register('name')}
          />

          {/* Email Address */}
          <Input
            label="Email Address"
            type="email"
            id="register-email"
            placeholder="student@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            leftIcon={<Mail className="w-4 h-4" />}
            {...register('email')}
          />

          {/* Password with Visibility Toggle */}
          <div className="space-y-1.5">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="register-password"
              placeholder="••••••••••••"
              autoComplete="new-password"
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

            {/* Password Criteria Feedback Checklist */}
            <div className="px-1 pt-1 grid grid-cols-3 gap-1 text-[11px] text-slate-400">
              <span
                className={`flex items-center gap-1 transition-colors ${
                  hasMinLength ? 'text-emerald-400 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 shrink-0" /> 8+ characters
              </span>
              <span
                className={`flex items-center gap-1 transition-colors ${
                  hasLetter ? 'text-emerald-400 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 shrink-0" /> Has letter
              </span>
              <span
                className={`flex items-center gap-1 transition-colors ${
                  hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 shrink-0" /> Has number
              </span>
            </div>
          </div>

          {/* Confirm Password with Visibility Toggle */}
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="register-confirm-password"
            placeholder="••••••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-md"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
                tabIndex={0}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            {...register('confirmPassword')}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2 font-semibold shadow-glow-sm"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-center py-4 bg-slate-950/60">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors focus:outline-none focus:underline"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
