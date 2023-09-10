import { Info } from "lucide-react";

const NotFoundRoom = () =>{
    return(
        <div className="flex flex-col gap-4 justify-center items-center h-full">
            <Info color="red"  size={100}/>
            <h3>Room notFound Or not have permisson </h3>

        </div>
    )
}
export default NotFoundRoom;