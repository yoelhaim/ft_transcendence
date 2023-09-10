'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import Rooms from '../rooms/Rooms';
import Bar from '@/data/bar';
import { CreateRoom } from '../rooms/CreateRoom';
import { useState } from 'react';
import UserInfo from '../profile/_info';

import { motion, AnimatePresence } from 'framer-motion';

import { useMediaQuery } from '@/hooks/customHooks';
import { XCircle } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { GlobalSearch } from '../navbar/NavBar';

interface SidBarHideProps {
  sidBarHide: Boolean;
  setSidBarHide: (param: Boolean) => void;
}

function SidBarHide({ sidBarHide, setSidBarHide }: SidBarHideProps) {
  const { showHide } = useSelector((state: any) => state.navbar);

  return (
    <>
      {showHide ? (
        <button
          onClick={() => setSidBarHide(!sidBarHide)}
          className="flex lg:hidden z-10 p-2 rounded-full absolute left-5 w-10 bg-dark top-4 hover:shadow-lg hover:border-dark"
        >
          <Menu size={22} />
        </button>
      ) : null}
    </>
  );
}

function SideBarNav({
  setSidBarHide,
}: {
  setSidBarHide: (param: Boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="mt-[3rem] space-y-[.5rem]">
      {Bar.map((item: any) => (
        <div key={item.name}>
          <Link href={item.link} onClick={() => setSidBarHide(false)}>
            <div
              className={`p-4 space-x-5 border-l-8 ${
                pathname === item.link ? 'border-[#7E73FF] ' : 'border-dark'
              }`}
            >
              <div className="flex space-x-3 pl-5">
                {item.icon}
                <span className="font-semibold text-white pt-[.1rem] antialiased">
                  {item.name}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
}

function MotionSidebar({ children }: { children: any }) {
  return (
    <motion.aside
      className="z-10 w-64 inset-y-0 bg-dark pb-2 pt-4 sm:pt-12 overflow-y-auto scrollbar scrollbar-thumb-dark-200/50 scrollbar-track-dark scrollbar-thumb-rounded-full scrollbar-w-1 fixed left-0"
      initial={{ left: -500 }}
      animate={{ left: 0 }}
      exit={{ left: -500 }}
    >
      {children}
    </motion.aside>
  );
}

function SimpleSideBar({ children }: { children: any }) {
  return (
    <aside className="z-10 w-64 inset-y-0 bg-dark pb-2 pt-4 sm:pt-12 overflow-y-auto scrollbar scrollbar-thumb-dark-200/50 scrollbar-track-dark scrollbar-thumb-rounded-full scrollbar-w-1 fixed md:left-0">
      {children}
    </aside>
  );
}

function SidebarContent({
  toggleSidebar,
  setSideBarHide,
}: {
  toggleSidebar: any;
  setSideBarHide: (param: Boolean) => void;
}) {

    const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      <div className="pr-3 py-2">
        <div className="flex justify-between items-center px-4 sm:px-0">
          <Link href="/" className="sm:m-auto w-1/2 sm:w-[75%]">
            <Image
              src="/img/logo.svg"
              height={30}
              width={200}
              alt="logo"
               blurDataURL='/images/blur.jpg'
            />
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg cursor-pointer md:hidden"
          >
            <XCircle size={20} />
          </button>
        </div>
        <UserInfo />
      </div>

        {!isDesktop && <div className='w-[90%] m-auto'><GlobalSearch/></div>}
      <SideBarNav setSidBarHide={setSideBarHide} />
      <Rooms hideBar={setSideBarHide} />
      <CreateRoom />
    </>
  );
}

export default function Sidebar() {
  const [sideBarHide, setSideBarHide] = useState<Boolean>(false);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const toggleSidebar = () => {
    setSideBarHide(!sideBarHide);
  };

  const sideBarContentProps = {
    toggleSidebar,
    setSideBarHide,
  };

  return (
    <div>
      <AnimatePresence>
        {sideBarHide && (
          <motion.div
            onClick={toggleSidebar}
            className={`z-10 bg-[#101a30bf] md:hidden fixed inset-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <SidBarHide sidBarHide={sideBarHide} setSidBarHide={setSideBarHide} />

      <AnimatePresence>
        {sideBarHide && (
          <MotionSidebar>
            {' '}
            <SidebarContent {...sideBarContentProps} />{' '}
          </MotionSidebar>
        )}
        {isDesktop && (
          <SimpleSideBar>
            {' '}
            <SidebarContent {...sideBarContentProps} />{' '}
          </SimpleSideBar>
        )}
      </AnimatePresence>
    </div>
  );
}
