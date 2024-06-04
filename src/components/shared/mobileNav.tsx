import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { Separator } from '../ui/separator'
import NavItem from './navItem'

const MobileNav = () => {
    return (
        <nav className='block md:hidden'>
            <Sheet>
                <SheetTrigger className=' align-middle '>
                <Image
                src={"/assets/icons/menu.svg"} 
                width={24}
                height={24}
                alt="menu"
                className=''/>
                </SheetTrigger>
                <SheetContent className='bg-white  flex flex-col gap-6 '>
                   <Image
                   src={"assets/images/logo.svg"}
                   width={138}
                   height={38}
                   alt='logo'/>
                   <Separator className='border '/>
                   <NavItem/>
                </SheetContent>
            </Sheet>

        </nav>
    )
}

export default MobileNav