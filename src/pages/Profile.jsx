import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../services/api";
import Button from "../components/ui/Button";
import BookingCard from "../components/profile/BookingCard";
import UpcomingBookingBanner from "../components/upcoming/UpcomingBookingBanner";
import FormInput from "../components/forms/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  username: z.string().min(1, "Username kiritish majburiy"),
  firstName: z.string().min(1, "Ism kiritish majburiy"),
  lastName: z.string().min(1, "Familiya kiritish majburiy"),
  email: z.string().email("Email noto'g'ri").or(z.literal("")).optional(),
  phone: z.string().optional(),
});

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Check if profile is incomplete
  const isProfileIncomplete =
    user &&
    (!user.username || !user.firstName || !user.lastName || !user.email);

  // Test registrations from API
  const [testRegistrations, setTestRegistrations] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [activeBookingIdx, setActiveBookingIdx] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Set initial form values
    if (user) {
      setValue("username", user.username || "");
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("phone", user.phone || "");
      setValue("email", user.email || "");
    }
  }, [isAuthenticated, navigate, user, setValue]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingBookings(true);
        const response = await authApi.getBookingsByUser(user.id);
        const bookings = response.data || response || [];
        setTestRegistrations(Array.isArray(bookings) ? bookings : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setTestRegistrations([]);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  // Auto-open edit mode if profile is incomplete
  useEffect(() => {
    if (isProfileIncomplete) {
      setIsEditing(true);
    }
  }, [isProfileIncomplete]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveError("");

    try {
      await authApi.completeRegistration({
        username: data.username,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
      });

      // Re-fetch profile to get updated data
      const profileData = await authApi.getProfile();
      updateUser(profileData);
      setIsEditing(false);
    } catch (error) {
      if (error.fieldErrors) {
        // Map API field errors to form fields
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          const fieldMap = {
            firstname: "firstName",
            lastname: "lastName",
            username: "username",
            email: "email",
          };
          const formField = fieldMap[field] || field;
          setError(formField, { message });
        });
      } else {
        setSaveError(error.message || t("common.error"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">
            {t("profile.title")}
          </h1>
          <p className="text-slate-600">{t("profile.subtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("profile.personalInfo")}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isProfileIncomplete && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    {t("profile.incompleteProfile")}
                  </p>
                </div>
              )}

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">
                    {saveError}
                  </p>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormInput
                    label={t("auth.username")}
                    name="username"
                    type="text"
                    register={register}
                    error={errors.username}
                    required
                  />
                  <FormInput
                    label={t("auth.firstName")}
                    name="firstName"
                    type="text"
                    register={register}
                    error={errors.firstName}
                    required
                  />
                  <FormInput
                    label={t("auth.lastName")}
                    name="lastName"
                    type="text"
                    register={register}
                    error={errors.lastName}
                    required
                  />
                  <FormInput
                    label={t("auth.email")}
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                  />
                  <FormInput
                    label={t("testRegistration.step3.phone")}
                    name="phone"
                    type="tel"
                    register={register}
                    error={errors.phone}
                    disabled
                  />
                  <div className="flex gap-3 mt-2">
                    {!isProfileIncomplete && (
                      <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setSaveError("");
                        }}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {t("common.cancel")}
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? t("common.saving") : t("common.save")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <UserCircleIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">
                        {t("auth.username")}
                      </p>
                      <p className="text-slate-900">
                        {user.username ? `@${user.username}` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <UserCircleIcon className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">
                        {t("profile.fullName")}
                      </p>
                      <p className="font-semibold text-slate-900">
                        {user.firstName || user.lastName
                          ? `${user.firstName || ""} ${
                              user.lastName || ""
                            }`.trim()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="text-slate-900">{user.email || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <PhoneIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">
                        {t("profile.phone")}
                      </p>
                      <p className="text-slate-900">{user.phone || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  {t("profile.statistics")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">
                      {testRegistrations.reduce(
                        (sum, reg) => sum + (reg.results?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-slate-600">
                      {t("profile.totalTests")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {testRegistrations.reduce(
                        (sum, reg) =>
                          sum +
                          (reg.results?.filter(
                            (r) => r.examStatus === "COMPLETED"
                          ).length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-slate-600">
                      {t("profile.completedTests")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {testRegistrations.reduce(
                        (sum, reg) => sum + (reg.speakings?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-slate-600">
                      {t("profile.totalSpeaking")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">
                      {testRegistrations.reduce(
                        (sum, reg) =>
                          sum +
                          (reg.speakings?.filter(
                            (s) => s.examStatus === "COMPLETED"
                          ).length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-slate-600">
                      {t("profile.completedSpeaking")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Test History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {t("profile.testHistory")}
              </h2>
              <UpcomingBookingBanner />

              <div className="space-y-6">
                {testRegistrations.map((registration, idx) => (
                  <BookingCard
                    key={registration.id}
                    registration={registration}
                    isOpen={activeBookingIdx === idx}
                    onToggle={() => setActiveBookingIdx(activeBookingIdx === idx ? null : idx)}
                  />
                ))}
              </div>

              {isLoadingBookings && (
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                  <svg
                    className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
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
                  <p className="text-slate-600">{t("common.loading")}</p>
                </div>
              )}

              {!isLoadingBookings && testRegistrations.length === 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                  <TrophyIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {t("profile.noTests")}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {t("profile.noTestsDescription")}
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/test-registration")}
                  >
                    {t("profile.registerForTest")}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
