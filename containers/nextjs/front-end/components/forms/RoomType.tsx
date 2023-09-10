'use client';

import { Globe2, KeyRound, Lock } from 'lucide-react';

interface inputProps {
  typeRoom: string;
  setTypeRoom: (typeRoom: string) => void;
}

export const RoomType = ({ typeRoom, setTypeRoom }: inputProps) => {
  type forms = {
    name: string;
    icon: React.ReactNode;
  };
  const inputForm = [
    {
      name: 'public',
      icon: <Globe2 className='w-12 md:w-7'/>,
    },
    {
      name: 'private',
      icon:  <KeyRound className='w-12 md:w-7'/>,
    },
    {
      name: 'protected',
      icon: <Lock className='w-12 md:w-7'/>,
    },
  ];

  const elmentForm = inputForm.map((Element: forms) => {
    return (
      <div
        key={Element.name}
        className={`flex md:flex-col flex-row justify-center  items-center gap-5 md:gap:2 rounded-lg border  ${
          typeRoom === Element.name
            ? 'bg-dark-100/50 border-[#03C988]'
            : 'bg-dark-100 border-white'
        }  w-full h-24 md:w-28 md:h-28 cursor-pointer font-medium first:justify-self-start last:justify-self-end`}
        onClick={() => setTypeRoom(Element.name)}
      >
       { Element.icon}
        <span className='text-2xl md:text-sm'>{Element.name}</span>
      </div>
    );
  });

  return (
    <div className="mt-8">
      <div className="w-full grid-cols-1 grid md:grid-cols-3  gap-3 md:gap-1  justify-items-center mb-6">
        {elmentForm}
      </div>
    </div>
  );
};