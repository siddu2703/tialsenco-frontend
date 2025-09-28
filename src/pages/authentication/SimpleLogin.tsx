/**
 * Simplified Login Component - Clean and focused
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './common/hooks';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { InputField } from '$app/components/forms/InputField';
import { Button } from '$app/components/forms/Button';
import { Link } from '$app/components/forms/Link';
import { ErrorMessage } from '$app/components/ErrorMessage';
import { Header } from './components/Header';
import { useColorScheme } from '$app/common/colors';

interface LoginForm {
  email: string;
  password: string;
}

export function SimpleLogin() {
  const [t] = useTranslation();
  const colors = useColorScheme();
  const navigate = useNavigate();
  const login = useLogin();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((prev: LoginForm) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setMessage('');
    setLoading(true);

    try {
      const response = await request('POST', endpoint('/api/v1/login'), form);
      login(response); // useLogin hook handles all authentication logic

      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status === 503) {
        setMessage('App maintenance mode');
      } else {
        setMessage(
          error.response?.data?.message ||
            'Login failed. Please check your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md p-8 rounded-lg shadow-lg border"
          style={{ backgroundColor: colors.$1, borderColor: colors.$5 }}
        >
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{ color: colors.$3 }}
          >
            {t('login')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              type="email"
              label={t('email_address')}
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('email', e.target.value)
              }
              errorMessage={errors.email?.[0]}
              placeholder="Enter your email"
              required
            />

            <InputField
              type="password"
              label={t('password')}
              value={form.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('password', e.target.value)
              }
              errorMessage={errors.password?.[0]}
              placeholder="Enter your password"
              required
            />

            {message && (
              <ErrorMessage className="text-center">{message}</ErrorMessage>
            )}

            <Button disabled={loading} className="w-full">
              {loading ? 'Signing in...' : t('login')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <Link to="/recover_password" className="text-sm">
              {t('forgot_password')}
            </Link>

            <div>
              <span className="text-sm" style={{ color: colors.$3 }}>
                Don't have an account?{' '}
              </span>
              <Link to="/register" className="text-sm font-medium">
                {t('register_label')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
