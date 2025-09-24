import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import CredentialsSignInForm from '../credentials-signin-form';

// Mock the dependencies
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useActionState: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('@/lib/actions/user.actions');
jest.mock('@/lib/constants', () => ({
  signInDefaultValues: {
    email: 'admin@example.com',
    password: '123456',
  },
}));

const mockUseActionState = useActionState as jest.MockedFunction<
  typeof useActionState
>;
const mockUseFormStatus = useFormStatus as jest.MockedFunction<
  typeof useFormStatus
>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe('CredentialsSignInForm', () => {
  const mockAction = jest.fn();
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseActionState.mockReturnValue([
      { success: false, message: '' },
      mockAction,
      false,
    ]);

    mockUseFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: null,
      action: null,
    } as unknown as ReturnType<typeof useFormStatus>);

    mockUseSearchParams.mockReturnValue(
      mockSearchParams as unknown as ReturnType<typeof useSearchParams>
    );
    mockSearchParams.get.mockReturnValue(null);
  });

  describe('Form Rendering', () => {
    it('should render all form elements', () => {
      render(<CredentialsSignInForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('should render form with default values', () => {
      render(<CredentialsSignInForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;

      expect(emailInput).toHaveValue('admin@example.com');
      expect(passwordInput).toHaveValue('123456');
    });

    it('should render hidden callbackUrl input with default value', () => {
      render(<CredentialsSignInForm />);

      const hiddenInput = screen.getByDisplayValue('/') as HTMLInputElement;
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).toHaveAttribute('name', 'callbackUrl');
    });

    it('should render callbackUrl from search params', () => {
      mockSearchParams.get.mockReturnValue('/dashboard');

      render(<CredentialsSignInForm />);

      expect(screen.getByDisplayValue('/dashboard')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in email input', async () => {
      const user = userEvent.setup();
      render(<CredentialsSignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should allow typing in password input', async () => {
      const user = userEvent.setup();
      render(<CredentialsSignInForm />);

      const passwordInput = screen.getByLabelText(/password/i);
      await user.clear(passwordInput);
      await user.type(passwordInput, 'newpassword');

      expect(passwordInput).toHaveValue('newpassword');
    });

    it('should call action when form is submitted', async () => {
      const user = userEvent.setup();
      render(<CredentialsSignInForm />);

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('should show loading state when pending', () => {
      mockUseFormStatus.mockReturnValue({
        pending: true,
        data: new FormData(),
        method: 'POST',
        action: '/',
      });

      render(<CredentialsSignInForm />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Signing In...');
      expect(button).toBeDisabled();
    });

    it('should show normal state when not pending', () => {
      render(<CredentialsSignInForm />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Sign In');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when sign in fails', () => {
      mockUseActionState.mockReturnValue([
        { success: false, message: 'Invalid credentials' },
        mockAction,
        false,
      ]);

      render(<CredentialsSignInForm />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should not display error when sign in succeeds', () => {
      mockUseActionState.mockReturnValue([
        { success: true, message: 'Success' },
        mockAction,
        false,
      ]);

      render(<CredentialsSignInForm />);

      expect(screen.queryByText('Success')).not.toBeInTheDocument();
    });

    it('should not display error when message is empty', () => {
      mockUseActionState.mockReturnValue([
        { success: false, message: '' },
        mockAction,
        false,
      ]);

      render(<CredentialsSignInForm />);

      expect(screen.queryByText(/text-destructive/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<CredentialsSignInForm />);

      const form = screen.getByRole('button').closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should have proper labels for inputs', () => {
      render(<CredentialsSignInForm />);

      expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        'id',
        'password'
      );
    });

    it('should have required attributes on inputs', () => {
      render(<CredentialsSignInForm />);

      expect(screen.getByLabelText(/email/i)).toBeRequired();
      expect(screen.getByLabelText(/password/i)).toBeRequired();
    });
  });
});
