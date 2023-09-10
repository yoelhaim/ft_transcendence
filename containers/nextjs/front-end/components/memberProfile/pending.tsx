import { Loader2 } from "lucide-react"

export const PendingUserProfile = () =>{
    return (
        <div className="flex justify-center items-center  w-full p-5">
            <Loader2 size={100} className="animate-spin"/>
        </div>
    )
}