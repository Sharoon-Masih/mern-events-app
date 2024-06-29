import Collection from '@/components/shared/collection'
import { Button } from '@/components/ui/button'
import { getEventsOrganizedByUserId } from '@/lib/actions/event.action'
import { getOrdersByUser } from '@/lib/actions/order.action'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({searchParams}:SearchParamProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string
    const ordersPage = Number(searchParams.ordersPage) || 1
    const eventsPage = Number(searchParams.eventsPage) || 1
    const orders = await getOrdersByUser({ userId: userId, page: ordersPage })
    const orderedEvents = orders?.data.map((order:IOrder) => order.event) || [] 
    const Events_organized = await getEventsOrganizedByUserId({ userId: userId, page: eventsPage })
    return (
<>
    <section className='flex flex-col '>
        <div className='bg-primary-50 bg-dotted-pattern py-5 md:py-10 bg-center bg-cover'>
            <div className='wrapper flex justify-between items-center flex-col gap-5 sm:flex-row '>
                <h3 className='text-center sm:text-left h3-bold'>My Tickets</h3>
                <Link href={"/#explore"}><Button size={"lg"} className='rounded-full text'>Explore More Events</Button></Link>
            </div>
        </div>
        <div className='py-10 wrapper'>
            <Collection
            collectionType="My_Tickets"
            data={orderedEvents}
            emptyTitle='No Events tickets purchased yet'
            emptyStateSubText='no worries - plenty of exciting events to explore!'
            limit={3}
            totalPage={orderedEvents?.totalPages}
            urlParamName='ordersPage'
            page={ordersPage}

        />
        </div>
    </section>
    <section className='flex flex-col '>
        <div className='bg-primary-50 bg-dotted-pattern py-5 md:py-10 bg-center bg-cover'>
            <div className='wrapper flex justify-between items-center flex-col gap-5 sm:flex-row '>
                <h3 className='text-center sm:text-left h3-bold'>Events Organized</h3>
                <Link href={"/events/create"}><Button size={"lg"} className='rounded-full text'>Create New Event</Button></Link>
            </div>
        </div>
        <div className='py-10 wrapper'>
            <Collection
                collectionType="Events_Organized"
                data={Events_organized?.data}
                emptyTitle='No Events Organized'
                emptyStateSubText='You have not Created any Event Yet!'
                limit={6}
                totalPage={Events_organized?.totalPages}
                urlParamName='eventsPage' 
                page={eventsPage} //yeh wali property basically yeh btye gi at initial current page konsa show hoga jasa like yaha "1" likh dia na toh its mean yaha initially 1 page show hoga.
            />
        </div>
    </section>
</>
    )
}

export default ProfilePage