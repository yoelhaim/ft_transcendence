import { FormCreateNewRoom } from "@/components/forms/FormCreateNewRoom";

const CreateRoom = ()=>{
    return (
       <div className="flex items-center flex-col w-full h-full">
         <div className="w-full h-full lg:bg-dark-200 px-2 lg:px-6 py-10 lg:max-w-[820px] rounded-md">

            <h3 className="text-2xl font-semibold antialiased mb-4">Create New Room </h3>
           <FormCreateNewRoom />
        
        </div>
       </div>
    )

}

export default CreateRoom;