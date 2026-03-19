'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

import { UserPlus, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { SigninSchema, signinSchema } from '../../../entities/user/model/auth.schema';
import Link from 'next/link';
import useAuthStore from '../../../entities/user/model/auth.store';
import { useRouter } from 'next/navigation';


export default function Signin() {

    const { register, handleSubmit, formState: { errors } } = useForm<SigninSchema>({
        resolver: zodResolver(signinSchema),
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
  
  const { signin } = useAuthStore();
  const navigate = useRouter();



  const onSubmit = async (data: SigninSchema) => {
    setError('');
    setLoading(true);
    try {
      await signin(data.email, data.password);
      toast.success('Signed in successfully! Welcome back');
      navigate.push('/products');
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      let errorMessage = 'Sign in failed';
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message ?? 'Sign in failed';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full bg-white min-h-screen">
      <div className="bg-white p-8 w-full max-w-md border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h2>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 mb-6 border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          

          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium text-gray-900 text-sm">Email Address</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
            />
            {errors.email && <p className="text-red-600 text-sm flex items-center gap-1 mt-1"><AlertTriangle className="w-4 h-4" />{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium text-gray-900 text-sm">Password</label>
            <input
              type="password"
              id="password"
              {...register('password')}
              required
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all"
            />
            {errors.password && <p className="text-red-600 text-sm flex items-center gap-1 mt-1"><AlertTriangle className="w-4 h-4" />{errors.password.message}</p>}
          </div>

          

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full px-4 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {`Don't have an account? `}
            <Link href="/auth/signup" className="text-gray-900 hover:text-gray-700 font-semibold transition-colors">
              Sign up instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


