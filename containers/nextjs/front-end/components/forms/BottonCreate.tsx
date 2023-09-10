import { Loader2 } from "lucide-react";

interface props {
    isLoading: boolean;
    type?: boolean
   
}

export const ButtonForm = ({isLoading,type}:props) =>{
    return (
        <div className="mt-10 md:mt-0">
         <button
         disabled={isLoading}
          type="submit"
          className=" w-full p-3 bg-[#03C988]  outline-none mt-2 rounded-sm border-[1px] flex justify-center gap-3"
        >
           {
            isLoading ? <Loader2 className="animate-spin"/> :""
           }
          <span>{type ? "Create Room": "Update Room"}</span>
        </button>
    </div>
    )

}