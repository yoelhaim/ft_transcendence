import Image from 'next/image'


 interface Props {
    score : number
}

export default function Archivment({score}: Props) {
  
    const archivmentName = score > 1000 ? 'Crystal': score > 100 ? 'Silver' : 'Bronze'
  return (

    <div
        className='p-4 text-center rounded-md w-full h-[500px] grid place-items-center my-2'
        style={{
            background: 'linear-gradient(208deg,#35155D,#512B81,#4477CE,#8CABFF)',
            backgroundSize: '300% 300%',
            animation: 'gradient-animation 5s ease infinite',
        }}
        >
        <div>
         
            <Image
                src={`/icons/archivment/${archivmentName}.svg`}
                alt="Archivment"
                width={100}
                height={100}
                 blurDataURL='/images/blur.jpg'
            />
            <h3 className='text-white text-2xl font-bold antialiased mt-2' >{archivmentName}</h3>
            <p className='text-white text-lg font-semibold antialiased' >{score}xp</p>
        </div>
    </div>
  )
}
