import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import SignInPage from '../page';
import { auth } from '@/auth';

jest.mock('next/navigation');
jest.mock('@/auth');
jest.mock('../credentials-signin-form', () => {
  return function MockCredentialsSignInForm() {
    return <div data-testid='credentials-signin-form'>Sign In Form</div>;
  };
});

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should redirect authenticated user to home when no callbackUrl', async () => {
      (mockAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const props = {
        searchParams: Promise.resolve({ callbackUrl: '/' }),
      };

      await SignInPage(props);

      expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('should redirect authenticated user to callbackUrl when provided', async () => {
      (mockAuth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const props = {
        searchParams: Promise.resolve({ callbackUrl: '/dashboard' }),
      };

      await SignInPage(props);

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should render sign in page for unauthenticated user', async () => {
      (mockAuth as jest.Mock).mockResolvedValue(null);

      const props = {
        searchParams: Promise.resolve({ callbackUrl: '/' }),
      };

      const result = await SignInPage(props);
      render(result);

      expect(screen.getByTestId('credentials-signin-form')).toBeInTheDocument();
    });
  });

  describe('Page Content', () => {
    beforeEach(() => {
      (mockAuth as jest.Mock).mockResolvedValue(null);
    });

    it('should render page title and description', async () => {
      const props = { searchParams: Promise.resolve({ callbackUrl: '/' }) };
      const result = await SignInPage(props);
      render(result);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    it('should render logo with correct attributes', async () => {
      const props = { searchParams: Promise.resolve({ callbackUrl: '/' }) };
      const result = await SignInPage(props);
      render(result);

      const logo = screen.getByAltText(/logo/i);
      expect(logo).toHaveAttribute('src', '/images/logo.svg');
      expect(logo).toHaveAttribute('width', '100');
      expect(logo).toHaveAttribute('height', '100');
    });
  });
});
