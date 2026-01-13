import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import PasswordInput from './PasswordInput';
import Button from '../ui/Button';
import { registrationSchema, generateTestDates, TEST_TYPES, USER_TYPES } from '../../utils/validationSchemas';

const RegistrationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const testDates = generateTestDates();

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form submitted:', data);
      setSubmittedData(data);
      setIsSubmitted(true);
      reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <section id="register" className="section-padding bg-primary relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-display font-display text-white mb-4">
            Register for Your Free Mock Test
          </h2>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Take the first step towards your target band score. Get instant access
            to our authentic IELTS mock exam platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-background-paper rounded-2xl shadow-card p-8 md:p-12 border border-border">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircleIcon className="w-16 h-16 text-green-600" />
                  </motion.div>
                  <h3 className="text-3xl font-display font-bold text-primary mb-4">
                    Registration Successful!
                  </h3>
                  <p className="text-lg text-primary/70 mb-2">
                    Thank you, {submittedData?.name}!
                  </p>
                  <p className="text-primary/60 mb-8">
                    We have sent a confirmation email to{' '}
                    <span className="font-semibold">{submittedData?.email}</span>
                  </p>
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-sm text-primary/60 mb-1">
                      Account Type:{' '}
                      <span className="font-semibold capitalize text-primary">
                        {submittedData?.userType}
                      </span>
                    </p>
                    <p className="text-sm text-primary/60 mb-3">
                      Your test is scheduled for:
                    </p>
                    <p className="text-lg font-bold text-accent">
                      {submittedData?.testDate &&
                        new Date(submittedData.testDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </p>
                    <p className="text-sm text-primary/60 mt-2">
                      Test Type:{' '}
                      <span className="font-semibold capitalize text-primary">
                        {submittedData?.testType}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">
                      Personal Information
                    </h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          label="Full Name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          register={register}
                          error={errors.name}
                          required
                        />

                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          register={register}
                          error={errors.email}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          placeholder="+998901234567"
                          register={register}
                          error={errors.phone}
                          required
                        />

                        <div>
                          <label className="block text-sm font-semibold text-primary mb-3">
                            User Type <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {USER_TYPES.map((type) => (
                              <label
                                key={type.value}
                                className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  errors.userType
                                    ? 'border-red-500 animate-shake'
                                    : 'border-border hover:border-accent hover:shadow-minimal'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    value={type.value}
                                    {...register('userType')}
                                    className="text-accent focus:ring-accent"
                                  />
                                  <span className="ml-2 font-semibold text-primary text-sm">
                                    {type.label}
                                  </span>
                                </div>
                                <div className="text-xs text-primary/60 ml-6">
                                  {type.description}
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.userType && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600"
                            >
                              {errors.userType.message}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">
                      Account Security
                    </h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <PasswordInput
                          label="Password"
                          name="password"
                          placeholder="Create a strong password"
                          register={register}
                          error={errors.password}
                          required
                          showStrength={true}
                        />

                        <PasswordInput
                          label="Confirm Password"
                          name="confirmPassword"
                          placeholder="Re-enter your password"
                          register={register}
                          error={errors.confirmPassword}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Test Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 pb-2 border-b border-border">
                      Test Information
                    </h3>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormSelect
                          label="Test Date"
                          name="testDate"
                          options={testDates}
                          placeholder="Select a Saturday"
                          register={register}
                          error={errors.testDate}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-3">
                          Test Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {TEST_TYPES.map((type) => (
                            <label
                              key={type.value}
                              className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                errors.testType
                                  ? 'border-red-500 animate-shake'
                                  : 'border-border hover:border-accent hover:shadow-minimal'
                              }`}
                            >
                              <input
                                type="radio"
                                value={type.value}
                                {...register('testType')}
                                className="mt-1 mr-3 text-accent focus:ring-accent"
                              />
                              <div>
                                <div className="font-semibold text-primary">
                                  {type.label}
                                </div>
                                <div className="text-sm text-primary/60">
                                  {type.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.testType && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.testType.message}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      {...register('agreeToTerms')}
                      className="mt-1 text-accent focus:ring-accent rounded"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-primary/70">
                      I agree to the{' '}
                      <a href="#terms" className="text-accent hover:text-accent-light font-semibold underline underline-offset-2">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="text-accent hover:text-accent-light font-semibold underline underline-offset-2">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-600">
                      {errors.agreeToTerms.message}
                    </p>
                  )}

                  <div className="pt-6">
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
                          Submitting...
                        </span>
                      ) : (
                        'Register for Free Mock Test'
                      )}
                    </Button>
                    <p className="text-xs text-primary/40 text-center mt-4">
                      No credit card required. Start practicing immediately.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationForm;
