"use client"
import { Event } from '@/lib/types'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './checkout'

const CheckoutBtn = ({ EventInfo }: { EventInfo: Event }) => {
    const { user } = useUser() // as this component is client therefore using useUser hook.
    const userId = user?.id
    const hasEventFinished = new Date(EventInfo.endDateTime) < new Date()
    return (
        <div className='flex items-center gap-3'>
            {hasEventFinished ? <p>Event has been Finished</p> :
                <>
                    <SignedOut>
                        <Button size="lg" className='rounded-full' >
                            <Link href={"/sign-in"}>Get Tickets</Link></Button>
                    </SignedOut>
                    <SignedIn>
                        <Checkout event={EventInfo} userId={userId!}/>
                    </SignedIn>
                </>}
        </div>
    )
}

export default CheckoutBtn