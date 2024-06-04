import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
   <footer className='wrapper flex justify-between items-center flex-col sm:flex-row gap-5'>
     <Image
     src={"/assets/images/logo.svg"}
     width={128}
     height={38}
     alt='logo'/>
     <span className='text-gray-400 text-center sm:text-start'>2023 Evently. All Rights Reserved</span>
   </footer>
  )
}

export default Footer