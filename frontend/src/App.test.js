import { render, screen } from '@testing-library/react';
import App from './App';

// Socket and chat transports are not under test here.
jest.mock('socket.io-client', () => ({
  io: () => ({ on: jest.fn(), off: jest.fn(), emit: jest.fn(), close: jest.fn(), disconnect: jest.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

test('unauthenticated users are routed to the sign-in page', async () => {
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(await screen.findByText(/sign in to your account/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('an invalid stored token is cleared and the user is sent to sign in', async () => {
  localStorage.setItem('token', 'expired-token');
  global.fetch.mockResolvedValue({ ok: false, json: async () => ({}) });
  window.history.pushState({}, '', '/');
  render(<App />);
  expect(await screen.findByText(/sign in to your account/i)).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/auth\/me$/),
    expect.objectContaining({ headers: { Authorization: 'Bearer expired-token' } }),
  );
  expect(localStorage.getItem('token')).toBeNull();
});
