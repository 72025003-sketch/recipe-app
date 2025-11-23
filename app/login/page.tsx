'use client';

import { useActionState } from 'react';
import { login, signup } from './actions';

const initialState = null;

export default function LoginPage() {
  const [state, loginAction, isPending] = useActionState(login, initialState);

  return (
    <form action={loginAction} className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required className="border p-2 rounded" />
        {state?.errors?.email && (
          <div className="text-red-500 text-sm">
            {state.errors.email.map((err: string) => <p key={err}>{err}</p>)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required className="border p-2 rounded" />
        {state?.errors?.password && (
          <div className="text-red-500 text-sm">
            {state.errors.password.map((err: string) => <p key={err}>{err}</p>)}
          </div>
        )}
      </div>

      {state?.message && (
        <div className="text-red-500 text-sm">{state.message}</div>
      )}

      <button disabled={isPending} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {isPending ? 'Logging in...' : 'Log in'}
      </button>
      <button formAction={signup} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
        Sign up
      </button>
    </form>
  );
}