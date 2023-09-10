'use client';

import { useState } from 'react';
import { LoadingIcon } from '../icon/loadingIcon';
import { useRouter } from 'next/navigation';

export default function FormJoinRoom() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const routes = useRouter();

  const goToRoom = (e: any) => {
    e.preventDefault();
    if (password === '') {
      alert('error password is Empty');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      routes.push('/rooms/1/2');
    }, 3000);
  };

  return (
    <div>
      <form autoComplete='false'
        className="mt-5"
        onSubmit={(e: any) => goToRoom(e)}
        name="joined_form"
        id="joined_form"
      >
        <label id="password">Password</label>
        <input
          type="password"
          id="password"
          className="w-full p-2 bg-dark-100 border-none outline-none mt-2 rounded-md"
          placeholder="password :  Pongster Room "
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className={`text-center ${
            !password || password.length <= 3
              ? 'bg-[#03C988]/50'
              : 'bg-[#03C988] '
          } mt-5 w-full p-3 rounded-lg  flex justify-center space-x-3 items-center`}
          type="submit"
          disabled={!password || password.length <= 3}
        >
          {isLoading ? <LoadingIcon /> : ''}
          <span className="ml-3"> Join Now</span>
        </button>
      </form>
    </div>
  );
}
