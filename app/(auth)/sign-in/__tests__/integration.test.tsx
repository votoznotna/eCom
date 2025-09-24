import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInPage from '../page';
import { auth } from '@/auth';

jest.mock('@/auth');
jest.mock('@/lib/actions/user.actions');

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe('SignIn Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockAuth as jest.Mock).mockResolvedValue(null);
  });

  it('should render complete sign in flow', async () => {
    const props = {
      searchParams: Promise.resolve({ callbackUrl: '/dashboard' }),
    };

    const result = await SignInPage(props);
    render(result);

    // Check all main elements
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('should handle user interaction flow', async () => {
    const user = userEvent.setup();
    const props = { searchParams: Promise.resolve({ callbackUrl: '/' }) };
    const result = await SignInPage(props);
    render(result);

    // User can interact with form
    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'user@test.com');

    expect(emailInput).toHaveValue('user@test.com');
  });
});
