import { Loader2 } from "lucide-react"

const Loadingdata = () => {
    return (
        <div className="h-full flex justify-center items-center">
            <Loader2 size={50} className="animate-spin"/>
        </div>
    )
}

export default Loadingdata