'use client';
import Icon from '@/components/icon/Icon';

import Image from 'next/image';
import axios from '@/api/axiosInstances';
import { useEffect, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { toast } from 'react-toastify';

export function Profile() {

  const [score, setScore] = useState<number>(0);
  const [avatar, setAvatar] = useState<string>('/images/profile.svg');

  const [UserName, setUserName] = useState<string>('');
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [pors, setPors] = useState<string>('0');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('leaderboard/getCard');
      setScore(result.data.score);
      setAvatar(result.data.avatar);
      setUserName(result.data.UserName);
      setWins(result.data.wins as number);
      setLosses(result.data.losses as number);
      const rr = (((result.data.wins - result.data.losses) / (result.data.wins + result.data.losses)) * 100);
      if (rr)
        setPors(rr.toFixed(2));
      } catch (error) {
        toast.warn('error');
      }
      
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 w-full  h-[550px] font-semibold bg-dark-200 rounded-l">
      
      <span>{UserName}</span>
      <div className="relative inline-block">
        <div className="absolute -bottom-[40px] left-0 w-full flex justify-center items-end animate-rotate-once">
            {
                   score > 200 ?   <Icon
                   name={`archivment/Crystal.svg`}
                   width={60}
                   height={60}
                   style={{width: '50px'}}
                 /> : score > 100 ?   <Icon
                 name={`archivment/Silver.svg`}
                 width={60}
                 height={60}
                 style={{width: '50px'}}
               /> :   <Icon
               name={`archivment/Bronze.svg`}
               width={60}
               height={60}
               style={{width: '50px'}}
             />
                
            }
          
        </div>
        <div className="h-[132px] w-[132px] min-[425px]:w-[200px] min-[425px]:h-[200px]">
          {avatar === '' || !avatar ? (
            <div className="w-full h-full bg-dark-200 rounded-full"></div>
          ) : (
            <Image
              width={100}
              height={100}
              loading="eager"
              src={avatar}
              alt="profile"
               blurDataURL='/images/blur.jpg'
              className="mt-4 object-cover h-full w-full"
            />
          )}
        </div>
      </div>
      <div className="mt-10 ">
        <div>
          Rank : {score > 200 ? 'Crystal' : score > 100 ? 'Silver' : 'Bronze'}
        </div>
        <div className="flex flex-row items-center justify-center">
          <Globe2 size={30} />
          <span className="ml-2">{score} </span>
        </div>
      </div>

      <hr className="border-b-1 border-[#40586F] border-[1px] mt-5 w-full" />
      <div className="mt-10 text-md w-full space-y-3">
        <div className="flex justify-between w-full items-center">
          <div>Percentile:</div>
          <div>{pors}%</div>
        </div>
        <div className="flex justify-between">
          <div>Record:</div>
          <div className='text-sm flex gap-2'>
           <div>
            <span className='text-xs font-light text-green-100'>win </span> {wins}
           </div>
           <div>
                <span className='text-xs font-light text-red'>lose </span> {losses}
           </div>

          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Played:</div>
          <div> {Number(wins) + Number(losses)} </div>
        </div>
      </div>
    </div>
  );
}
