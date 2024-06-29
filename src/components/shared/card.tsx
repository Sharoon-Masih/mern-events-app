
import { Ievents } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DeleteConfirmation } from './deleteConfirm'

const Card = ({
    event,
    hasOrderlink,
    hideTicketPrice
}: { event: Ievents, hasOrderlink: boolean, hideTicketPrice: boolean }) => {

    // yaha basic humna condition lagyi hai yeh check krnay ka liya kay agr toh userId jo be current user login hai uski userId and jo events object mil rha hai usme jo organizer ki _id mil rahi hai agr wo dono same hon toh isEventOrganizer true rturn hoga else false.  
    const { sessionClaims } = auth()
    const userId = sessionClaims?.userId as string
    const isEventOrganizer = userId === event.organizer?._id?.toString() //yaha isko toString() ma iss liya convert kia hai bcuz sometimes jo organizer _id hoti hai wo object ki form mabi hoskti hai.
    return (
        <div className='flex flex-col min-h-[380px] w-full max-w-[400px] bg-white group relative overflow-hidden shadow-md hover:shadow-lg rounded-xl transition-all duration-100'>
            <Link href={`/events/${event._id}`} className='flex items-center justify-center flex-grow text-grey-500 bg-center bg-cover' style={{ backgroundImage: `url(${event.imageUrl})` }} />
            {/* only the creator have edit btn and delete btn, A/c to jo uper condition banayi thi uska A/c yaha render hoga. */}
            {isEventOrganizer && <div className='absolute right-2 top-2 p-3 bg-white rounded-xl shadow-sm flex flex-col items-center transition-all '>
                <Link href={`/events/${event._id}/update`} className='pb-2'><Image
                    src={"/assets/icons/edit.svg"}
                    alt='edit-icon'
                    width={20}
                    height={20} />
                </Link>

                <DeleteConfirmation eventId={event._id} />
            </div>}
            <div className='flex flex-col min-h-[230px] justify-between p-5 '>
                <Link href={`/events/${event._id}`}><div className='flex flex-col gap-3  md:gap-4'>
                    <div className='flex gap-2 '>
                        {!hideTicketPrice && <span className='text-green-500 bg-green-500/10 px-3 py-2 rounded-full'>
                            {event.isFree ? 'FREE' : `$${event.price}`}
                        </span>}
                        {!hideTicketPrice && <span className='text-grey-500 bg-grey-500/10 px-3 py-2 rounded-full line-clamp-1'>
                            {event.category?.name}
                        </span>}
                    </div>
                    <div className='flex flex-col gap-3 '>
                        <p className='p-medium-16 text-grey-500'>{formatDateTime(event.startDateTime as Date).dateTime}</p>
                        <p className='p-medium-18 line-clamp-2 md:p-medium-20'>{event.title}</p>
                    </div>
                </div></Link>

                <div className='flex gap-2
                flex-row justify-between'>
                    <p className='  text-grey-500 p-medium-16'>{event.organizer?.firstName} {event.organizer?.lastName}
                    </p>
                    {hasOrderlink && <Link href={`/orders?eventId=${event._id}`}
                        className='flex gap-2'>
                        <p className='text-primary-500'>Order Details:</p>
                        <Image
                            src={"/assets/icons/arrow.svg"}
                            alt='search'
                            height={10}
                            width={10} />

                    </Link>}
                </div>

            </div></div>
    )
}

export default Card