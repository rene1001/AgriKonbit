import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register: doRegister } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: 'investor'
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await doRegister({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role
      });
      if (result.success) {
        toast.success(t('auth.register.success', 'Compte créé avec succès'));
        navigate('/dashboard');
      } else {
        toast.error(result?.message || t('auth.register.failure', 'Échec de la création du compte'));
      }
    } catch (e) {
      toast.error(e?.message || t('auth.register.failure', 'Échec de la création du compte'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold mb-4">{t('auth.register.title', 'Create your account')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">{t('auth.fields.fullName', 'Full name')}</label>
            <input
              className="input"
              {...register('fullName', { required: t('auth.errors.fullNameRequired', 'Full name is required'), minLength: 2 })}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="label">{t('auth.fields.email', 'Email')}</label>
            <input
              type="email"
              className="input"
              {...register('email', { required: t('auth.errors.emailRequired', 'Email is required') })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">{t('auth.fields.password', 'Password')}</label>
            <input
              type="password"
              className="input"
              {...register('password', { required: t('auth.errors.passwordRequired', 'Password is required'), minLength: 6 })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="label">{t('auth.fields.role', 'Role')}</label>
            <select className="input" {...register('role', { required: true })}>
              <option value="investor">{t('roles.investor', 'Investor')}</option>
              <option value="farmer">{t('roles.farmer', 'Farmer')}</option>
              <option value="consumer">{t('roles.consumer', 'Consumer')}</option>
            </select>
          </div>

          <button disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? t('auth.register.submitting', 'Creating account...') : t('auth.register.cta', 'Create account')}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          {t('auth.register.haveAccount', 'Already have an account?')}{' '}
          <Link to="/login" className="text-primary-600 font-medium">{t('auth.login.cta', 'Login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
