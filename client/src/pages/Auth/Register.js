import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
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
        toast.success('Compte créé avec succès');
        navigate('/dashboard');
      } else {
        toast.error(result?.message || 'Échec de la création du compte');
      }
    } catch (e) {
      toast.error(e?.message || 'Échec de la création du compte');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold mb-4">Create your account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              {...register('fullName', { required: 'Full name is required', minLength: 2 })}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              {...register('password', { required: 'Password is required', minLength: 6 })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="label">Role</label>
            <select className="input" {...register('role', { required: true })}>
              <option value="investor">Investor</option>
              <option value="farmer">Farmer</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <button disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
