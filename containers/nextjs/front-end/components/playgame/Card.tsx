'use client';
import React from 'react';

import Image from 'next/image';

interface Props {
  src: string;
  rating?: number;
  rating2?: number;
  rating3?: number;
}


import { useEffect, useRef, useState } from 'react';

export function LoadCard() {
  const ref = useRef(null);
  const [src, setSrc] = useState<string>('/images/random/1.jpg');

  const images: string[] = [
    '/images/random/1.jpg',
    '/images/random/2.jpg',
    '/images/random/3.jpg',
    '/images/random/4.jpg',
    '/images/random/5.jpg',
    '/images/random/6.jpg',
    '/images/random/7.jpg',
    '/images/random/8.jpg',
    '/images/random/9.jpg',
    '/images/random/10.jpg',
    '/images/random/11.jpg',
    '/images/random/12.jpg',
    '/images/random/13.jpg',
    '/images/random/14.jpg',
  ];

  useEffect(() => {
    let index: number = 1;

    const node: any = ref.current;
    if (!node) return;

    const id = setInterval(() => {
      setSrc(images[index++]);
      if (index === images.length) index = 0;
    }, 300);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <div className="h-[500px] w-[350px] rounded-lg overflow-hidden">
        <Image
          ref={ref}
          src={src}
          width={300}
          height={400}
          alt="#"
          className="w-full h-full object-cover"
           blurDataURL='/images/blur.jpg'
        />
      </div>
    </div>
  );
}

export default function Card({
  src,
}: Props) {
  return (
    <div
      className='h-[300px] md:h-[500px] w-[80%] md:w-[350px] rounded-lg overflow-hidden relative
      after:content[""] after:absolute after:left-0 after:w-full after:h-[90%]
      after:from-dark-200 after:to-transparent
      after:bg-gradient-to-t after:bottom-0 after:z-20 m-auto'
    >
      <Image
        src={src}
        width={300}
        height={400}
        alt="#"
        className="w-full h-full object-cover"
         blurDataURL='/images/blur.jpg'
      />
    </div>
  );
}
