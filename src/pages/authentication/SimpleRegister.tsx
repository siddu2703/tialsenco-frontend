/**
 * Simplified Register Component - Clean and focused
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { useLogin } from './common/hooks';
import { InputField } from '$app/components/forms/InputField';
import { Button } from '$app/components/forms/Button';
import { Link } from '$app/components/forms/Link';
import { ErrorMessage } from '$app/components/ErrorMessage';
import { Header } from './components/Header';
import { useColorScheme } from '$app/common/colors';

interface RegisterForm {
  email: string;
  password: string;
  password_confirmation: string;
  terms_of_service: boolean;
  privacy_policy: boolean;
}

export function SimpleRegister() {
  const [t] = useTranslation();
  const colors = useColorScheme();
  const navigate = useNavigate();
  const login = useLogin();

  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    password_confirmation: '',
    terms_of_service: false,
    privacy_policy: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RegisterForm, value: string | boolean) => {
    setForm((prev: RegisterForm) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (form.password !== form.password_confirmation) {
      setErrors({
        password_confirmation: ['Password confirmation does not match.'],
      });
      return;
    }

    if (!form.terms_of_service || !form.privacy_policy) {
      setMessage('Please accept the terms of service and privacy policy.');
      return;
    }

    // Clear previous errors
    setErrors({});
    setMessage('');
    setLoading(true);

    try {
      // Step 1: Register the user
      await request('POST', endpoint('/api/v1/signup'), form);

      // Step 2: Immediately login the user to get authentication data
      const loginResponse = await request('POST', endpoint('/api/v1/login'), {
        email: form.email,
        password: form.password,
      });

      // Step 3: Use the login hook to handle authentication
      login(loginResponse);

      // Navigate to dashboard after successful registration
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setMessage(
          error.response?.data?.message ||
            'Registration failed. Please try again.'
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
            {t('register_label')}
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
              placeholder="Enter your password (min 6 characters)"
              required
            />

            <InputField
              type="password"
              label={t('password_confirmation')}
              value={form.password_confirmation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange('password_confirmation', e.target.value)
              }
              errorMessage={errors.password_confirmation?.[0]}
              placeholder="Confirm your password"
              required
            />

            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={form.terms_of_service}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('terms_of_service', e.target.checked)
                  }
                  className="mt-1"
                  required
                />
                <span className="text-sm" style={{ color: colors.$3 }}>
                  I agree to the{' '}
                  <Link to="/terms" className="underline">
                    Terms of Service
                  </Link>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={form.privacy_policy}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange('privacy_policy', e.target.checked)
                  }
                  className="mt-1"
                  required
                />
                <span className="text-sm" style={{ color: colors.$3 }}>
                  I agree to the{' '}
                  <Link to="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {message && (
              <ErrorMessage className="text-center">{message}</ErrorMessage>
            )}

            <Button disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : t('register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm" style={{ color: colors.$3 }}>
              Already have an account?{' '}
            </span>
            <Link to="/login" className="text-sm font-medium">
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
