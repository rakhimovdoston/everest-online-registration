import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { authRegistrationSchema } from '../utils/validationSchemas';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/forms/FormInput';
import PasswordInput from '../components/forms/PasswordInput';
import GoogleButton from '../components/auth/GoogleButton';
import Button from '../components/ui/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(authRegistrationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Registration data:', data);

      // Create user data object
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: '' // Will be filled in Step3 if needed
      };

      // Store user data in auth context (auto-login)
      registerUser(userData);

      // Handle successful registration
      setRegisteredEmail(data.email);
      setIsSuccess(true);
      reset();

      // Auto redirect to test registration after 3 seconds
      setTimeout(() => {
        navigate('/test-registration');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    console.log('Google registration clicked');
    alert('Google registration integration coming soon!');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Account Created!
            </h2>
            <p className="text-slate-700 mb-2">
              Welcome to IELTS Mock Exam Platform
            </p>
            <p className="text-sm text-slate-600 mb-6">
              A confirmation email has been sent to{' '}
              <span className="font-semibold">{registeredEmail}</span>
            </p>
            <div className="space-y-3">
              <Link to="/test-registration" className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Start Test Registration
                </Button>
              </Link>
              <p className="text-xs text-slate-400">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
              Create Account
            </h1>
            <p className="text-slate-600">
              Join IELTS Mock Exam Platform today
            </p>
          </motion.div>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Google Registration */}
          <div className="mb-6">
            <GoogleButton onClick={handleGoogleRegister} text="Sign up with Google" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                Or register with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                placeholder="John"
                register={register}
                error={errors.firstName}
                required
              />

              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Doe"
                register={register}
                error={errors.lastName}
                required
              />
            </div>

            {/* Email */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              register={register}
              error={errors.email}
              required
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a strong password"
              register={register}
              error={errors.password}
              required
              showStrength={true}
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              register={register}
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-6"
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By creating an account, you agree to our{' '}
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

export default Register;
