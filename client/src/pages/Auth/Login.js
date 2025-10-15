import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, web3Login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success(t('auth.login.success', 'Connexion réussie'));
        navigate('/dashboard');
      } else {
        toast.error(result?.message || t('auth.login.failure', 'Échec de la connexion'));
      }
    } catch (e) {
      toast.error(e?.message || t('auth.login.failure', 'Échec de la connexion'));
    }
  };

  const handleWeb3Login = async () => {
    // Simulate MetaMask login
    const walletAddress = '0x' + 'a'.repeat(40);
    const signature = 'simulated-signature';
    try {
      const result = await web3Login(walletAddress, signature);
      if (result.success) {
        toast.success(t('auth.login.walletSuccess', 'Connexion portefeuille réussie'));
        navigate('/dashboard');
      } else {
        toast.error(result?.message || t('auth.login.walletFailure', 'Connexion portefeuille échouée'));
      }
    } catch (e) {
      toast.error(e?.message || t('auth.login.walletFailure', 'Connexion portefeuille échouée'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold mb-4">{t('auth.login.title', 'Login to AgriKonbit')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register('password', { required: t('auth.errors.passwordRequired', 'Password is required') })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? t('auth.login.submitting', 'Signing in...') : t('auth.login.cta', 'Login')}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500 text-sm">{t('common.or', 'or')}</div>

        <button onClick={handleWeb3Login} className="btn btn-outline w-full">{t('auth.login.wallet', 'Login with Wallet (Simulated)')}</button>

        <p className="text-sm text-gray-600 mt-4">
          {t('auth.login.noAccount', "Don't have an account?")}{' '}
          <Link to="/register" className="text-primary-600 font-medium">{t('auth.login.createOne', 'Create one')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
