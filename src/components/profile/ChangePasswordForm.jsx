import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { authApi } from '../../services/api';
import FormInput from '../forms/FormInput';
import Button from '../ui/Button';

const FIELDS = ['oldPassword', 'newPassword', 'confirmNewPassword'];

// Change-password form on the profile page.
//
// Props:
//   onSuccess   () => void   called after the API accepted the new password
//   onCancel    () => void
const ChangePasswordForm = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const schema = z
    .object({
      oldPassword: z.string().min(1, t('profile.changePassword.required')),
      newPassword: z.string().min(6, t('auth.passwordMin')),
      confirmNewPassword: z.string().min(1, t('profile.changePassword.required')),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t('profile.changePassword.mismatch'),
      path: ['confirmNewPassword'],
    });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    setServerError('');

    try {
      await authApi.updatePassword(data);
      onSuccess();
    } catch (error) {
      // Show API field errors under their inputs; anything else goes above the form
      const fieldErrors = Object.entries(error.fieldErrors || {}).filter(([field]) => FIELDS.includes(field));
      if (fieldErrors.length > 0) {
        fieldErrors.forEach(([field, message]) => setError(field, { message }));
      } else {
        setServerError(error.message || t('common.error'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-slate-50 rounded-xl space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">
        {t('profile.changePassword.title')}
      </h3>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{serverError}</p>
        </div>
      )}

      <FormInput
        label={t('profile.changePassword.oldPassword')}
        name="oldPassword"
        type="password"
        autoComplete="current-password"
        register={register}
        error={errors.oldPassword}
        required
      />
      <FormInput
        label={t('profile.changePassword.newPassword')}
        name="newPassword"
        type="password"
        autoComplete="new-password"
        register={register}
        error={errors.newPassword}
        required
      />
      <FormInput
        label={t('profile.changePassword.confirmNewPassword')}
        name="confirmNewPassword"
        type="password"
        autoComplete="new-password"
        register={register}
        error={errors.confirmNewPassword}
        required
      />

      <div className="flex gap-3">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSaving} className="flex-1">
          {t('common.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={isSaving} className="flex-1">
          {isSaving ? t('profile.changePassword.saving') : t('profile.changePassword.submit')}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
