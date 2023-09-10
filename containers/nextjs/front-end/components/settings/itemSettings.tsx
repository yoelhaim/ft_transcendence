import Link from 'next/link';

import { Ban, Palette, User2 } from 'lucide-react';
import { QrCode } from 'lucide-react';

export default function ItemSettings({ label, aloneOrNot }: { label: string, aloneOrNot: number }) {
  const linkProps = {
    className: aloneOrNot === 0 ? "bg-[#393A6C] w-[200px] h-[42px] flex justify-center items-center text-sm rounded relative" : "md:bg-[#393A6C] w-[60px] min-[950px]:w-[200px] h-[42px] flex justify-center items-center text-sm rounded relative"
  };

  const iconProps = getIconName(label)
;

  const isVisible = aloneOrNot === 0 ? "flex"  : "hidden min-[950px]:flex";
  const isVisOrNot = aloneOrNot === 0 ? "left-5"  : "min-[950px]:left-5";
  
  return (
    <Link href={getLinkHref(label)} {...linkProps}>
      <div className={'absolute ' + isVisOrNot}>
        {iconProps}
      </div>
      <div className={isVisible + ' justify-center items-center'}>
        {label}
      </div>
    </Link>
  );
}

function getLinkHref(label: string) {
  if (label === "Profile") return "/settings/profile";
  if (label === "Themes") return "/settings/themes";
  if (label === "Two-Factor") return "/settings/twofactor";
  return "/settings/blocklist";
}

function getIconName(label: string) {
  if (label === "Profile") return <User2/>;
  if (label === "Themes") return <Palette />;
  if (label === "Two-Factor") return <QrCode/>;
  return <Ban/>;
}