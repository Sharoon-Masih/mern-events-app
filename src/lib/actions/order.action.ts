"use server"

import { redirect } from "next/navigation"
import { CheckoutOrderParams, CreateOrderParams } from "../types"
import { handleError } from "../utils"
import { Stripe } from 'stripe'
import { connectToDb } from "../database"
import OrderModel from "../database/models/order.model"


export const checkoutOrder = async (order: CheckoutOrderParams) => { //yeh server action hai jo stripe kay checkout pa re-direct krega user ko.

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string) //yeh basically stripe ka constructor hai jisme stripe ka sub methods hotay hain jiska trhough further process hoga.but isko first "npm i stripe" krka then import krna hai. yeh constrcutor just ek arg leta hai and that is stripe secret key.

    const price = order.isFree ? 0 : Number(order.price) * 100; //yaha par jo order ka parameter hai uski base pa price assign kr rhay hain or kiu kay stripe jo hai wo price ko as a number value leta hai toh iss lia humna usko number ma convert kia hai or 100 say iss lia multiply kia hai bcuz stripe accept price in cents  currency. (1$ = 100cents)
    try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [ //yeh basically wo list of product hai jo checkout session ma ayengi, but zahir hai humay toh ek sth sab items ek hi checkout ma nhi lani humay just one item wobi jo order ka obj may data milay srf wohi product yaha list ma aye.   
                {
                    price_data: { //jo be product ka data hota hai jo required hota hai like price, unit, name wo sb line item ma define kro else jo baki additional info hai wo metadata ma.
                        currency: "usd",
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle,
                        }
                    },
                    quantity: 1
                },
            ],
            metadata: { //basically metaData is nothing it is a additional info that you provide to an product object, agr metadata ko koi empty value be dendenga toh wo error nhi dega like this " ", kiu kay wo required info nhi additional info hai.
                event: order.eventId,
                buyerId: order.buyerId
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`, //yeh success Url hai means if order placed successfully will redirect to this URL.
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,//yeh cancel url hai, agr order_place na hua toh user cancel url pa re-direct hoja ga which is homepage. 
            //remember NEXT_PUBLIC_SERVER_URL yeh lazmi dena hai bcuz it is your application domain. 
        });

        redirect(session.url as string) //yeh redirect iss lia kia hai bcuz iska mtlb haka jasa hi yeh server action call hoga frontend say toh pehla in above code, session create hojayega or then phr jasa hi session create ho toh jo be uss session ka url hoga yeh user ko uss URL pa redirect kredega, or remember kay right now abhi hum stripe ki taraf sa jo hosted page milta hai uspa redirect hongay but agr hum chahay toh hum apna custom page b bna kay stripe ko direct apni app ma embed krsktay hain.

    } catch (error) {
        throw (error)
    }

}

export async function createOrder(orderInfo: CreateOrderParams) {
    try {
        await connectToDb()
        const newOrder = await OrderModel.create(orderInfo)
        if (!newOrder) {
            throw new Error("order does not exist")
        }
        return JSON.parse(JSON.stringify(newOrder))
    } catch (error) {
        handleError(error)
    }
}