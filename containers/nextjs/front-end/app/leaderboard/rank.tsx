'use client';
import Image from 'next/image';

import React, { useState, useEffect } from 'react';

import axios from '@/api/axiosInstances';

import { ChevronLeft, ChevronRight } from 'lucide-react';
export interface RankProps {
  users: userType[];
  league: string;
  relation: string;
  setusers : (param : userType[]) => void;
  count : number;
}

export default function Rank({ users, league, relation , setusers, count}: RankProps) {

   

  const [active, setActive] = useState(0);
  const navigate = (index: number) => {
    
    if (index == -1 && active == 0) return;
    if (index == 1 && active == count - 1) return;

    setActive(active + index);
  };

  useEffect(() => {

  
    axios.get('/leaderboard', {
        params: {
          page: active,
          league,
          relation,
        },
      })
        .then((res) => {
            if (res.data.user.length == 0) return;
            setusers(res.data.user)
            }
        )

  }, [active]);

  return (
    <div>
      {!users.length ? (
        <div className="text-red p-1 grid place-content-center">no users</div>
      ) : (
        <table className="w-full">
          <thead className="">
            <tr className="bg-dark h-16 font-semibold">
              <th>Rank</th>
              <th className="text-left pl-6">Players</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody className="py-4">
            {users?.map((element: any, index: number) => {
              return (
                <tr
                  key={index}
                  className="h-14 text-center  bg-dark-200 text-md font-semibold items-center"
                >
                  <td>
                    <span
                      className={`w-[35px] h-[35px] m-auto grid place-content-center rounded-md ${
                        index === 0
                          ? 'bg-[#FFC800]'
                          : index  === 1
                          ? 'bg-[#9DB2BF]'
                          : index === 2
                          ? 'bg-[#A78867]'
                          : ''
                      }`}
                    >
                      <div>
                        <span>#</span>
                        {((index + 1) + (active * 10))}
                      </div>
                    </span>
                  </td>
                  <td className="mt-4 flex justify-start items-center">
                    { element.avatar ? (
                      <Image
                        src={element.avatar}
                        height={30}
                        width={30}
                        alt="logo"
                         blurDataURL='/images/blur.jpg'
                      />
                    ) : null}
                    <span className="pl-4">{element.UserName}</span>
                  </td>
                  <td className=""> {element.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div>
        {
          <div className="select-none w-full bg-dark-200 rounded-br-md rounded-bl-md py-4 flex justify-end px-8 items-center">
            <span
              className={`mx-1 w-[30px] h-[30px] grid place-content-center rounded-lg hover:bg-dark/[.5] ${
                active == 0 ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => {
                navigate(-1);
              }}
            >
              <ChevronLeft />
            </span>

            <span
              className={`mx-1 w-[30px] h-[30px] grid place-content-center rounded-lg hover:bg-dark/[.5] ${
                active == count - 1
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              onClick={() => {
                navigate(1);
              }}
            >
              <ChevronRight />
            </span>
          </div>
        }
      </div>
    </div>
  );
}
