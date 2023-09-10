'use client';

import React, { useEffect } from 'react';

import Settings from '@/components/settings/settings';


import { useState } from 'react';
import axiosa from '@/api/axiosInstances';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { KeySquare } from 'lucide-react';

export default function LaunchTwoFa() {
  const [qrdata, setqrdata] = useState<string>('');
  const [qrsecretkey, setqrsecretkey] = useState<string>('');
  const twofactor = useSelector((state: any) => state.auth.twofactor);
  const [checked, setIsChecked] = useState<boolean>(
    twofactor === true ? true : false,
  );
 qrsecretkey;
  const generateqr = () => {
    axiosa
      .get('/google/tokenGen')
      .then((res) => {
        setqrdata(res.data.link);
        setqrsecretkey(res.data.secretkey);
      })
      .catch((err) => {err});
  };
  const fiwtoken = (checked: boolean) => {
    if (checked === true) {
      axiosa
        .get('/google/deleteToken')
        .then((res) => {res})
        .catch((err) => {err});
      return;
    }
    generateqr();
  };

  useEffect(() => {
    if (twofactor === false) return;
    generateqr();
    setIsChecked(twofactor);
  }, [twofactor]);

  return (
    <div className="">
      <div className="p-5 text-xl text-semibold tracking-wider hidden sm:block">
        Settings
      </div>
      <div className="flex justify-start w-full h-full p-0 overflow-hidden relative rounded-sm space-x-0 md:space-x-3 max-w-[1300px]">
        <Settings index={1} />
        <div className="m-5">
        <div className='flex gap-2'><KeySquare />
          two factor</div>
          <div className="mt-5">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  onChange={() => {
                    setIsChecked(!checked);
                    fiwtoken(checked);
                  }}
                  className="hidden"
                />
                <div
                  className={`w-10 h-6 ${
                    checked ? 'bg-green-100' : 'bg-dark'
                  } rounded-full shadow-inner transition duration-200 ease-in-out`}
                ></div>
                <div
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform ${
                    checked
                      ? 'translate-x-4 bg-green-100'
                      : 'translate-x-0 bg-green-100'
                  } transition duration-200 ease-in-out`}
                ></div>
              </div>
            </label>
            {checked ? (
              <div>
                {qrdata.length > 1 ? (
                  <Image
                    loading="lazy"
                    src={qrdata}
                    height={200}
                    width={200}
                    alt="qr code"
                    className="m-5 rounded-2xl"
                     blurDataURL='/images/blur.jpg'
                  />
                ) : null}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
