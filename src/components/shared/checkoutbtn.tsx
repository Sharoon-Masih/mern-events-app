"use client"
import { Event } from '@/lib/types'
import { SignedIn, SignedOut, useSession, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './checkout'

const CheckoutBtn = ({ EventInfo }: { EventInfo: Event }) => {
    const { session, isLoaded } = useSession() // as this component is client therefore using useUser hook.
    const userId = session?.user.publicMetadata.userId as string
    console.log(userId);
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
                        {isLoaded && <Checkout event={EventInfo} userId={userId!} />}
                    </SignedIn>
                </>}
        </div>
    )
}

export default CheckoutBtn