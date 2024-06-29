"use server"

import { redirect } from "next/navigation"
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "../types"
import { handleError } from "../utils"
import { Stripe } from 'stripe'
import { connectToDb } from "../database"
import OrderModel from "../database/models/order.model"
import {ObjectId} from 'mongodb'
import EventModel from "../database/models/event.model"
import UserModel from "../database/models/user.model"

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

export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
    try {
      await connectToDb()
  
      if (!eventId) throw new Error('Event ID is required')
      const eventObjectId = new ObjectId(eventId) //yaha par evenetId string format ma mil rhi hai toh usko ObjectId ma iss lia convert kia hai kiu nichay humay isko as a ObjectId use krna hai .
  
      const orders = await OrderModel.aggregate([
        {
          $lookup: { //yaha par simply lookup ka through jo user ka data hai wo order collection ma jo doc hai usme ajyega.
            from: 'users',
            localField: 'buyer',
            foreignField: '_id',
            as: 'buyer', //as a result wo lookup new buyer field ma store hojayega 
          },
        },
        {
          $unwind: '$buyer', //as we know jo lookup hai wo array return krta hai toh $unwind ka through usko simple object ma convert krenga
        },
        {
          $lookup: { //uper jis tarah buyer ka data aya hai isi tarah yaha par event ka jo data hai wo ajayega.
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },
        {
          $unwind: '$event', //yaha par be jo event field hai wo ek array contain krti hogi toh iss liya usko simple ek object ma change krenga.
        },
        {
          $project: { //yaha par basic $project operator ka through yeh decide kr rhay hain kay final document ki shape kya hogi.Acha remember jab be hum yeh aggregate pipeline ya aggregation ka operation perform krtay hain toh yeh Database a kuch change nhi krtay bcuz yeh srf READ operation hotay hain mtlb inkay through hum query krta hain nay kay database ma kuch create wagera krtay hain, toh isi lia hum yaha par apni marzi say result may new field add kr rhay hain ya etc..
            _id: 1, //yaha par interesting thing yeh haka yeh jo mena _id ko "1" assign kia hna yeh koi value nhi hai yeh basic iss cheez ko represent kr rha hai kay _id exist krti hai iss document may, baki jo iski original value hai wo MongoDb automatically assign krdega but make sure field name should be "_id" bcuz as its reserve field in mongodb doc so it knows. 
            totalAmount: 1, 
            createdAt: 1,
            eventTitle: '$event.title', //yeh be ek new field add ki evenetTitle jiski value jo lookup ka through object bna hai event ka usme jo "title" property hai.
            eventId: '$event._id', // same as above
            buyer: {
              $concat: ['$buyer.firstName', ' ', '$buyer.lastName'], //yaha hum jo buyer object hai usme say jo firstname and lastname hai usko concatenate krka single value bna rahay hain, but remember yeh jo hum buyer ki field ka agay pehlay {} object bnaya hai then usmay concat ko use kia hai . toh wo basically iss lia kia hai kiu kay $concat ka operator ko direct as a value use nhi krskta tha, but jo result hoga wo simple string value hogi "buyer" field may.
            },
          },
        },
        {
          $match: { //iss stage pay humna uper jo document as a result milega uspa condition lgadi kay jo "$and" ka through condition lgyi hai which is saying that kay resulting document jo aya hai usme two cheezain match krni chaiya ek eventId jo kay "eventObjectId" say match krni chaiya jo uper humna get ki hai and 2nd condition jo "buyer" field ma name hai wo jo search string hai usse match krna chaiya mtlb kay wo jo user search kray usse match kray or RegExp ka through jo 'i' put kia hai wo case-insensitive ko represent krta hai like agr john = John hoga toh that is acceptable. 
            $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
          },
        },
      ])
  
      return JSON.parse(JSON.stringify(orders))
    } catch (error) {
      handleError(error)
    }
  }

  // GET ORDERS BY USER
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
    try {
      await connectToDb()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { buyer: userId }
  
      const orders = await OrderModel.distinct('event._id')  //basic yeh jo distinct ka method hai yeh Orders ma jo event._id wali field hna usme jo jo _id same hongi unko common lelaga or single hi return krega duplicate nhi. ab yaha yeh ho rha haka srf wohi orders collection may say document return hongay jinki eventid distinct hongi, or then phr wo jo documents return hongay unpa condition apply hogi jo next line pa hai.
        .find(conditions) //yaha humna kaha hai kay srf wohi order ayenga jinma buyer id "currentuserid" say match kregi.
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
        .populate({
          path: 'event',
          model:EventModel,
          populate: {
            path: 'organizer',
            model: UserModel,
            select: '_id firstName lastName',
          },
        })
  
      const ordersCount = await OrderModel.distinct('event._id').countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }
  