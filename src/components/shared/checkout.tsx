
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { Event } from '@/lib/types'
import { loadStripe } from '@stripe/stripe-js'; //this we have import from packages we instal using: npm install --save stripe @stripe/stripe-js next
import {checkoutOrder} from '@/lib/actions/order.action';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
 loadStripe( //yeh sab stripe ki website sa milta hai basic yeh function initially jab component mount hoga toh at that time "Stripe object" basically it creates a checkout session, so isi lia isko component sa bahir rakha hai taka component re-render be hoga toh phr be yeh srf first time initial load pa create krega.
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string //this is our secret
);
const Checkout = ({ event, userId }: { event: any, userId:string }) => {

    useEffect(() => {  //this code is also pasted from stripe docs
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search); //basically here by using URLSearchParams class it to manipulate query.
        if (query.get('success')) { //now here we are checking that jo searchParam ma "success" query parameter ho agr wo exist krta ho toh its mean order placed.
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (query.get('canceled')) { //else here it is saying that searchParam ma "canceled" query parameter ho agr wo exist krta ho toh its mean order canceled.
            console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
    }, []); 

    async function onCheckOut() {
        const order={
            eventTitle:event.title,
            eventId:event._id,
            price:event.price,
            isFree:event.isFree,
            buyerId:userId,
        }
        await checkoutOrder(order)
    }
    return (
        <form action={onCheckOut} method='post'>
            <Button type='submit' size={"lg"} role='link' variant={"default"}>{event.isFree ? "Get Ticket" : "Buy Ticket"}</Button>
        </form>
    )
}

export default Checkout