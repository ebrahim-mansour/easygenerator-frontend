import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { signupSchema, type SignupFormData } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export const SignUp = () => {
  const { signup } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError('');
    setIsSubmitting(true);

    try {
      await signup(data.email, data.name, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'error' : ''}`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" className="form-error" role="alert">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`form-input ${errors.name ? 'error' : ''}`}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <div id="name-error" className="form-error" role="alert">
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`form-input ${errors.password ? 'error' : ''}`}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <div id="password-error" className="form-error" role="alert">
              {errors.password.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="form-button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="form-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </div>
    </div>
  );
};

