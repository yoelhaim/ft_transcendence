import React from 'react'
import Image from 'next/image'

interface Props {
    style?: React.CSSProperties,
    width?: number,
    height?: number,
    className?: string,
    name: string,
    alt?: string,
}

// React FC

export default function Icon({
        style = {},
        width = 30,
        height = 30,
        className = 'h-auto',
        name,
        alt = '/'
    } : Props
    ) {


  return <Image src={ `/icons/${name}` } width={width} height={height} alt={alt} className={className} style={style}  blurDataURL='/images/blur.jpg'  />


}

