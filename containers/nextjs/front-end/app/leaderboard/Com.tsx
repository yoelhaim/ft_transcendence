'use client';

import Button from './Button';
import Lead from './header';


import React, { useEffect, useState } from 'react';
import Rank from './rank';
import { Profile } from './profile';
import axios from '@/api/axiosInstances';
import { toast } from 'react-toastify';
import { Globe2, Users2 } from 'lucide-react';
import Icon from '@/components/icon/Icon';


const Com = () => {
  const items = [
    {
      name: 'Region',
      src: <Globe2 />,
      children: [
        {
          name: 'Global',
          src: <Globe2 />,
        },
        {
          name: 'Friends',
          src: <Users2 />,
        },
      ],
    },
    {
      name: 'League',
      src: 'Crystal.svg',
      children: [
        {
          name: 'Crystal',
          src: (
            <Icon
              name="archivment/Crystal.svg"
              width={30}
              height={30}
              alt="logo"
              style={{ width: '15px' }}
            />
          ),
        },
        {
          name: 'Silver',
          src: (
            <Icon
              name="archivment/Silver.svg"
              width={30}
              height={30}
              style={{ width: '15px' }}
            />
          ),
        },
        {
          name: 'Bronze',
          src: (
            <Icon
              name="archivment/Bronze.svg"
              width={30}
              height={30}
              style={{ width: '15px' }}
            />
          ),
        },
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState<number>(-1);
  const [selected, setSelected] = useState<Array<number>>([0, 0, 0]);
  const [users, setusers] = useState<userType[]>([] as userType[]);
  const [page, setPage] = useState<number>(0);

  const [league, setLeague] = useState<string>('Crystal');
  const [relation, setRelation] = useState<string>('Global');

  const Openset = (e: number) => {
    e == isOpen ? setIsOpen(-1) : setIsOpen(e);
  };

  const selectItem = (index: number, value: number) => {
    let temp = [...selected];
    temp[index] = value;
    setSelected(temp);

    setLeague(items[1].children[temp[1]].name);
    setRelation(items[0].children[temp[0]].name);
    
    fetchData(temp[1], temp[0]);
  };

  const fetchData = async (league: number, relation: number) => {
    try {
      const result = await axios.get('/leaderboard', {
        params: {
          page: 0,
          league: items[1].children[league].name,
          relation: items[0].children[relation].name,
        },
      });
      setusers(result.data.user);
      setPage(result.data.count);
    } catch (error) {
      toast.error('Error');
    }
  };

  useEffect(() => {
    fetchData(0, 0);
  }, []);
  return (
    <div>
      <Lead />
      <div className="flex flex-col-reverse xl:flex-row gap-3">
        <div className="max-w-5xl">
          <div className="flex flex-col xl:flex-row xl:space-x-10 space-y-2 xl:space-y-0 w-full">
            {items.map((item: any, index: number) => {
              return (
                <Button
                  key={index}
                  item={item.children}
                  isOpen={isOpen}
                  index={index}
                  Openset={Openset}
                  selected={selected[index]}
                  selectItem={selectItem}
                />
              );
            })}
          </div>
          
          <div className="mt-10 ">
            <Rank users={users} league={league} relation={relation} setusers={setusers} count={page}/>
          </div>
        </div>
        <div className="mb-6">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Com;
