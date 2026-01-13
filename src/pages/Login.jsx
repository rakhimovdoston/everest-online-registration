import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSchema } from '../utils/validationSchemas';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/forms/FormInput';
import PasswordInput from '../components/forms/PasswordInput';
import GoogleButton from '../components/auth/GoogleButton';
import Button from '../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setServerError('');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Login data:', data);

      // Simulate API response with user data
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: data.email,
        phone: '+998901234567'
      };

      // Store user data in auth context
      login(userData);

      // Redirect to returnUrl or test registration
      navigate(returnUrl || '/test-registration');
    } catch (error) {
      setServerError('Invalid email or password. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    alert('Google login integration coming soon!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Sign in to continue to IELTS Mock Exam
            </p>
          </motion.div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Google Login */}
          <div className="mb-6">
            <GoogleButton onClick={handleGoogleLogin} text="Sign in with Google" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600 text-center">{serverError}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              register={register}
              error={errors.email}
              required
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              required
            />

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                onClick={() => alert('Forgot password feature coming soon!')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By signing in, you agree to our{' '}
          <a href="#terms" className="underline hover:text-slate-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="underline hover:text-slate-600">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
