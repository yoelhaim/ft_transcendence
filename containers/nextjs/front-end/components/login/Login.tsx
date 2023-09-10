'use client';

import Image from "next/image";
import Link from "next/link";

// import React, { useState, useEffect, useRef } from "react";

// import BIRDS from "vanta/dist/vanta.birds.min";
// import * as THREE from "three";

export default function Login() {

    // const [vantaEffect, setVantaEffect] = useState<any>(0);
    // const vantaRef = useRef(null);
  
    // useEffect(() => {
    //   if (!vantaEffect) {
    //     setVantaEffect(
    //       BIRDS({
    //         el: vantaRef.current,
    //         THREE: THREE,
    //         mouseControls: true,
    //         touchControls: true,
    //         gyroControls: false,
    //         minHeight: 600.0,
    
    //         minWidth: 600.0,
    //         scale: 1.0,
    //         scaleMobile: 1.0
    //       })
    //     );
    //   }
    //   return () => {
    //     if (vantaEffect) vantaEffect.destroy();
    //   };
    // }, [vantaEffect]);

    return (
        <div className="h-screen w-screen  grid place-content-center overflow-x-hidden bg-dark text-white">
            {/* <div className="w-full h-full bg-[url('/fortnite.jpg')] bg-cover max-sm:hidden"></div> */}
            <div className="text-center space-y-7">
                <div>
                    <Image src="/logo.svg" width={100} height={30} alt='/' className="m-auto" style={{width: 100}} />
                </div>
                <div className="text-center space-y-7">
                    <h5 className="font-semibold text-3xl ">Log in</h5>
                    <p className="text-lg capitalize antialiased max-w-sm">
                        Join us now and experience the ultimate excitement of PigPong!
                    </p>
                    <Link
                        href={`${process.env.BASE_URL}/42/oauth`} className="flex outline-0 items-center hover:shadow-xl hover:bg-[#BE4FC2] px-5 sm:px-10 m-auto bg-[#F4F4F4] h-[60px]  rounded-[60px] text-dark font-blod w-fit">
                        <Image src="/logo42.svg" width={30} height={30} alt="42 logo" className="" style={{ width : 30}}   blurDataURL='/images/blur.jpg' />
                        <span className="ml-2 font-semibold">sign in with 42</span>
                    </Link>
                </div>
            </div>
        </div>

    )
}



