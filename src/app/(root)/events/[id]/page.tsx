import CheckoutBtn from '@/components/shared/checkoutbtn';
import Collection from '@/components/shared/collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.action'
import { Event } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const SingleEvent = async ({ params, searchParams }: { params: { id: string }, searchParams: { page: string } }) => {

    const getEvent: Event = await getEventById(params.id);
    const RelatedEvents = await getRelatedEventsByCategory({
        categoryId: getEvent.category._id,
        eventId: getEvent._id,
        page: searchParams.page
    })
    console.log(RelatedEvents?.data);
    return (
        <>
            <section className='flex justify-center bg-primary-50 bg-dotted-pattern bg-contain'>
                {getEvent && <div className='grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl'>
                    <Image
                        src={getEvent.imageUrl}
                        width={1000}
                        height={1000}
                        alt={getEvent.title}
                        className='h-full min-h-[300px] object-center object-contain' />
                    <div className='flex flex-col gap-8 p-5 md:p-10'>
                        <h2 className='h2-bold'>{getEvent.title}</h2>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                            <div className='flex flex-row gap-3'>
                                <p className='p-bold-20 rounded-full bg-green-500/10 text-green-700 px-5 py-2'>
                                    {getEvent.isFree ? 'Free' : `$${getEvent.price}`}
                                </p>
                                <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500 '>
                                    {getEvent.category.name}
                                </p>
                            </div>
                            <p className='p-medium-18 ml-2 mt-2 sm:mt-0'>
                                by{" "}
                                <span className='text-primary-500'>{getEvent.organizer.firstName} {getEvent.organizer.lastName}</span>
                            </p>
                        </div>
                        {/* checkout btn */}
                        <CheckoutBtn EventInfo={getEvent}/>
                        <div className='flex flex-col gap-5'>
                            <div className='flex gap-3 items-center'>
                                <Image
                                    src={'/assets/icons/calendar.svg'}
                                    width={32}
                                    height={32}
                                    alt='calender' />
                                <div className='flex flex-col gap-1'>
                                    <p className='p-medium-16'>{formatDateTime(getEvent.startDateTime).dateOnly} - {" "}{formatDateTime(getEvent.startDateTime).timeOnly}</p>
                                    <p className='p-medium-16'>{formatDateTime(getEvent.endDateTime).dateOnly} - {" "}{formatDateTime(getEvent.endDateTime).timeOnly}</p>

                                </div>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <Image
                                    src={'/assets/icons/location.svg'}
                                    width={32}
                                    height={32}
                                    alt='calender' />
                                <p className='bg-grey-500/35 px-1'>{getEvent.location}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <p className='text-grey-500 p-bold-24'>What You&apos;ll Learn:</p>
                            <p className='p-regular-16'>{getEvent.description}</p>
                            <p className='text-primary-500 underline line-clamp-1'><Link href={getEvent.url}>{getEvent.url}</Link></p>
                        </div>
                    </div>
                </div>}
            </section>
            {/* basically jo yaha related events ka idea hna wo iss tarah haka jo events same category ki hain wo show hongay related events may. */}
            <section id="relatedevents" className="my-8 md:my-12">
                <div className="wrapper flex flex-col gap-8 md:gap-12  ">
                    <h2 className="h2-bold">Related Events </h2>
                    <Collection
                        data={RelatedEvents?.data}
                        emptyTitle="No Event found"
                        emptyStateSubText="Right now there is no related event come back later"
                        limit={6}
                        page={1}
                        totalPage={2} />
                </div>

            </section>
        </>
    )
}

export default SingleEvent