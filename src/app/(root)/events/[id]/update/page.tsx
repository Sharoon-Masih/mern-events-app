import EventForm from '@/components/shared/eventForm'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const CreateEvents = () => {
    const { sessionClaims } = auth() //it is helper to get currently actiev user Auth object, it only works on server-side rendered component.//to understand session claim see below after the code

    //we have to two helper given by clerk to access clerk data on nextJS app within server components one is "auth()" and other is "currentUser()", Now the Auth will return you the Auth object like userId,sessionId etc.

    //But currentUser() will return you the user data like firstName, lastName, etc. you will use this func when you want to show user Info on UI.
    const userId = sessionClaims?.userId as string
    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern py-5 md:py-10 bg-center bg-cover">
            <h3 className='wrapper text-center sm:text-left h3-bold'>Create Event</h3>

            </section>
            <div className='wrapper my-8'>
                <EventForm userId={userId} type={"update"} />
            </div>
        </>
    )
}

export default CreateEvents;

// Certainly! Let’s dive into the concept of session claims in the context of Clerk, a user authentication and permissions management platform.

// Session Management:

// Clerk manages the full session lifecycle, including critical security functionality like active device monitoring and session revocation.

// When a user logs into a website or app, the server creates a unique session ID associated with that authenticated user. This session ID allows the server to identify subsequent requests from the same user without requiring re-authentication1.

// Clerk uses this session ID to save user sessions in httpOnly cookies, ensuring security and preventing unauthorized access.

// The session management process involves handling various aspects, such as maintaining user state, handling timeouts, and managing session data.

// Why Session Claims Matter:

// In the context of authentication, claims are pieces of information about the user (e.g., roles, permissions, user ID) that are included in the session token.
// Session claims play a crucial role in determining what a user can access within an application.

// For example, a claim might specify that a user has admin privileges, allowing them to perform certain actions or access specific resources.

// Clerk handles both authentication and session management, making it easier for developers to implement secure user sessions.

// In production, Clerk deploys on a subdomain (e.g., clerk.yourdomain.com) to save sessions in cookies securely. This approach ensures that the active user can communicate with Clerk’s servers for tasks like self-serving password changes2.
