import ItemSettings from "./itemSettings";


export default function Settings({index}: {index: number}) {
    const items = [
        "Profile",
        "Block List",
        "Themes",
        "Two-Factor",
      ];
    if (index === 0) return (
        <div className="flex relative md:rounded w-full">
            <div className="flex flex-col p-5 h-full w-full space-y-2 relative justify-center" >
                {items.map((item: string, index: number) => <ItemSettings aloneOrNot={0} key={index} label={item} />)}
            </div>
        </div>
        );
    else return (
        <div className="bg-[#414273] md:bg-[#00000000] flex relative md:rounded w-[15%] min-w-[50px] md:w-auto flex-shrink-0">
            <div className="flex flex-col justify-start items-center px-5 h-full w-full space-y-2 relative" >
                {items.map((item: string, index: number) => <ItemSettings aloneOrNot={1} key={index} label={item} />)}
            </div>
        </div>
    );
};