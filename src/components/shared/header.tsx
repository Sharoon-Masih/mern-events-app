import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import NavItem from './navItem'
import MobileNav from './mobileNav'

const Header = () => {
  return (
    <header className='sticky top-0 bg-white bg-opacity-60 backdrop-blur-sm z-50'>
      <div className='wrapper flex items-center justify-between'>
        <Link href={"/"} className='w-36'>
          <Image src={"/assets/images/logo.svg"} width={128} height={38} alt='eventbox logo' />
        </Link>
        <SignedIn>
          <nav className='hidden md:block'>
          <NavItem />
          </nav>
        </SignedIn>
        <div className='w-32 justify-end flex gap-3'>
          <SignedOut>
            <Button className='rounded-full' size={"lg"}> {/*jab hum asChild pass krtay hain toh iska mtlb kay ab jo BUtton component hai uski apni koi by default styling nhi hogi balka wo jo styling be uska child usme krega uska A/c hogi. */}
              <SignInButton>
                Login
              </SignInButton>

            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <MobileNav />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Header