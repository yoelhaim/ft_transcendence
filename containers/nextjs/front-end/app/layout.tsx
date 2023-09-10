import './globals.css'

import { Poppins } from "next/font/google";

const poppins = Poppins({ 
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
  title: 'Pongster',
  description: 'Play ping pong online with our web app! Compete against players worldwide, enjoy thrilling matches, and climb the leaderboard. Challenge friends, chat in real-time, and experience the excitement of this classic game from the comfort of your home.',
}

import Childs from '@/components/Childs/Childs'

import ReduxProvider from '@/redux_toolkit/provider'
// import Link from 'next/link';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ReduxProvider>
      <Childs chil={children} className={`${poppins.className}`}/>
      {/* <Link href="/_next/static/media/a5c349ac2ad38ba2-s.p.woff2" rel="preload"  /> */}

    </ReduxProvider>
  )
}
