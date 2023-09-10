"use client";

import React, {  useState } from 'react'

import SearchResult from './SearchResult'
import Notification, { OpenChat } from './Notification'

import { Loader2 } from 'lucide-react'


import { useDebance, useMediaQuery } from '../../hooks/customHooks'

import { useSelector, useDispatch } from 'react-redux';

import { openSearch, closeSearch } from '@/redux_toolkit/search/searchSlice';
import Logout from './Logout';


export function GlobalSearch() {
    const [loader, setLoader] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch] = useDebance(search, 500);
    
    const dispatch = useDispatch();

    const {isSearchOpen} = useSelector((state: any) => state.search)

    const getSearchedUser = (e: React.ChangeEvent<HTMLInputElement>) => {

        setLoader(true)
        if (e.target.value == '') setLoader(false);
        setSearch(e.target.value)
        e.target.value.length ? dispatch(openSearch()) : dispatch(closeSearch())
    
      }

    return (
        <div className='relative'>
        <input
            onChange={getSearchedUser}
            type="text"
            maxLength={30}
            name="serach"
            placeholder='Find someone?'
            className={`bg-dark text-white placeholder-white outline-0 border-2 border-green/[.5] rounded-lg h-[41px] w-full
            md:w-[240px] px-2
            `}
        />

        {loader && <span className='absolute top-[50%] right-3 -translate-y-1/2'> <Loader2 strokeWidth={3} className='h-4 w-4 animate-spin text-green/[.5]' /> </span>}
        {isSearchOpen && <SearchResult search={debouncedSearch} setLoader={setLoader} />}

      </div>
    )
}

export default function NavBar() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
  return (
    <div className='flex bg-dark-200 items-center justify-between px-12 py-4'>
        <div>
            {isDesktop && <GlobalSearch />}
        </div>
      <div className='flex justify-between min-w-[100px] gap-4'>
        <OpenChat />
        <Notification name='message.svg' />
        <Logout />
      </div>
    </div>
  )
}
