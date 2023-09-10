import Image from "next/image";

const Logo : React.FC = () => {
    return (   
        <div className="flex items-center sm:m-auto w-1/2 sm:w-[75%]">
              <Image
                src="/img/logo.svg"
                height={30}
                width={200}
                alt="logo"
                className="w-16"
                 blurDataURL='/images/blur.jpg'
            />
            <span className="ml-2 pt-2 font-bold">PONGSTER</span>
        </div>
    
        // <h1 className="text-3xl"><Image src="/img/logo.svg" height={30} width={200} alt="logo"/></h1>
    );
}
export default Logo;