'use client';

import { CheckCircle2, Fingerprint, Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import axiosa from '@/api/axiosInstances';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setEnable2fa } from '@/redux_toolkit/auth';

export default function TwoFactorConfirme() {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const verificationTo = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    const obj = {
      token: code,
    };
    if (obj.token.length > 6) {
      toast.warn('passcode is Long please insert 6 number');
      setLoading(false);
      return;
    }
    axiosa
      .post('/google/passcode', obj)
      .then((res) => {
        setLoading(false);
        if (res.data === true) {
          toast.success('2fa verified Successfully');
          dispatch(setEnable2fa(false));
          push('/');
        } else {
          toast.warn('Verification Failed');
        }
        setCode('');
      })
      .catch(() => {
        setLoading(false);
        toast.error('Verification Failed');
        setLoading(false);
      });
  };
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <form autoComplete='false'
      onSubmit={(e: any) => verificationTo(e)}
      className="max-w-sm text-center flex flex-col justify-center gap-4 antialiased px-5 md:p-0"
      name='twoFactorConfirme_form'
      id='twoFactorConfirme_form'
    >
      <Fingerprint size={50} className="mx-auto" />
      <p className="tracking-tight">
        Please check your email for a verification code from Google. Enter the
        code to continue.
      </p>

      <div>
        <input
          type="text"
          className="bg-dark-200 p-2 rounded-md outline-none w-full"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="code"
        />
      </div>

      <button
        type="submit"
        className="flex justify-center items-center bg-dark-200 h-10 active:scale-95 rounded-md text-sm font-medium transition-colors disabled:opacity-50  disabled:pointer-events-none"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 size={20} className="mr-2" />
        )}
        Confirm
      </button>
    </form>
  );
}
