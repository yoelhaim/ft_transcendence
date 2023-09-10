'use client';

import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { LogOut as LogoutIcon } from 'lucide-react';
import axiosInstances from '@/api/axiosInstances';

interface Props {
    setIsOpen: (param: boolean) => void;
}

export default function Logout() {
  const { push } = useRouter();
  function Logoutb() {
    try {
      axiosInstances.get('42/logout/goodbye').then((res) => {
        res;
         push('/login');
      }).catch(() => {
        push('/login?er');
      });
    
    } catch (e) {}
  }

  function ToggleLogout({setIsOpen}: Props) {


    const logOutRef = useRef<HTMLDivElement>(null);

    const closeLogout = (e: any) => {

      if (!logOutRef.current?.contains(e.target)) {
        setIsOpen(false);
        return;
      }
    };
  
    useEffect(() => {
      document.addEventListener('click', closeLogout);
      return () => {
        document.removeEventListener('click', closeLogout);
      };
    }, []);

    return (
      <div
        className="absolute bg-dark shadow-md shadow-[#151634] break-words right-0
              py-4 px-6 rounded-lg z-50 flex gap-2 translate-y-2 cursor-pointer"
        onClick={() => {
          Logoutb();
        }}
      >
        <LogoutIcon />
        logout
      </div>
    );
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div
        onClick={toggle}
        className={`grid place-content-center bg-dark border-2 border-green/[.5] rounded-[10px] h-[41px] w-[41px] relative cursor-pointer select-none`}
      >
        <LogoutIcon size={20} />
      </div>

      {isOpen && <ToggleLogout setIsOpen={setIsOpen} />}
    </div>
  );
}
