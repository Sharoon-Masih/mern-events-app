
import { Ievents } from '@/lib/database/models/event.model'
import React from 'react'
import Card from './card'
import Pagination from './pagination'

type CollectionProps = {
    data: Ievents[],
    emptyTitle: string,
    emptyStateSubText: string,
    collectionType?: "All_Events" | "My_Tickets" | "Events_Organized",
    limit: number,
    page: number | string,
    totalPage?: number,
    urlParamName?: string
}

const Collection = ({
    data,
    emptyTitle,
    emptyStateSubText,
    collectionType,
    limit,
    page, //pagination ka liya yeh page number and totalpage hi chaiya kiu kay page number btyega ka user currently konsay page pa hai and wo hum searchParam ka through page.tsx sa get krenga ya or be jaha jaha par yeh "Collection" render ho rha hai and jo totalPage hai wo yeh btyega ka total page kitnay hain like 2, 3 etc on the basis of eventsCount and limit and totalPage humay event action ma getAllevent() walay func sa milega.
    totalPage,  
    urlParamName

}: CollectionProps) => {
    return (
        <div>{data?.length > 0 ?
            <div className='flex flex-col items-center gap-10'>
            <ul className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {data.map((event) => {
                    const hasOrderlink = collectionType === "Events_Organized";
                    const hideTicketPrice = collectionType === "My_Tickets";
                    return (
                        <li key={event._id} className='flex justify-center'>
                            <Card event={event} hasOrderlink={hasOrderlink} hideTicketPrice={hideTicketPrice} />
                        </li>
                    )
                })}
            </ul>
                {totalPage! > 1 && <Pagination urlParamName={urlParamName} page={page} totalPage={totalPage!} />} {/*here we are applying pagination on the condition when totalpage are > 1, bcuz agar totalPage = 1 hoga toh phr pagination ki zarorat hi nhi.*/}

            </div> : <div className='flex flex-col items-center justify-center bg-grey-50 rounded-[14px] min-h-[200px] w-full wrapper py-28 gap-3 text-center'>
                <h3 className='p-bold-20 md:h5-bold'>{emptyTitle}</h3>
                <p className='p-regular-14'>{emptyStateSubText}</p>
            </div>}</div>
    ) 
}

export default Collection