import EventForm from '@/components/shared/eventForm'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const CreateEvents = () => {
    const {sessionClaims,}=auth() //it is helper to get currently actiev user Auth object, it only works on server-side rendered component.

    //we have to two helper given by clerk to access clerk data on nextJS app within server components one is "auth()" and other is "currentUser()", Now the Auth will return you the Auth object like userId,sessionId etc.
    
    //But currentUser() will return you the user data like firstName, lastName, etc. you will use this func when you want to show user Info on UI.
    const userId = sessionClaims?.userId as string

    return (
        <>
        <section className="bg-primary-50 bg-dotted-pattern py-5 md:py-10 bg-center bg-cover">
            <h3 className='wrapper text-center sm:text-left h3-bold'>Create Event</h3>
        </section>
        <div className='wrapper my-8'>
            <EventForm userId={userId as string} type={"create"}/>
        </div>
        </>
    )
}

export default CreateEvents