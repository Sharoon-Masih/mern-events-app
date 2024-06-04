"use client"
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavItem = () => {
    const pathName=usePathname()
    return (

        <ul className=' flex flex-col md:flex-row items-start justify-between md:items-center gap-5 w-full '>
            {
                headerLinks.map((item) => pathName === item.route ? <Link key={item.route} className='text-primary-500 font-semibold' href={item.route}><li>{item.label}</li></Link>:<Link key={item.route} href={item.route}><li>{item.label}</li></Link>)
            }
        </ul>
    )
}

export default NavItem