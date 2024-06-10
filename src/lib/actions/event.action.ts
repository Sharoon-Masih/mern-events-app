"use server"

import { error } from "console"
import { connectToDb } from "../database"
import CategoryModel from "../database/models/category.model"
import EventModel, { Ievents } from "../database/models/event.model"
import UserModel from "../database/models/user.model"
import { handleError } from "../utils"
import { Category, Event, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, Organizer, UpdateEventParams } from "../types"
import { revalidatePath } from "next/cache"


type eventParams = {
  title: string
  description: string
  location: string
  imageUrl: string
  startDateTime: Date
  endDateTime: Date
  categoryId: string
  price: string
  isFree: boolean
  url: string
}

export async function createEvent(eventInfo: { event: eventParams, userId: string, path: string }) {

  try {
    await connectToDb()

    const organizer = await UserModel.findById(eventInfo.userId) //yehe just hum userId kathrough check kr rhay hainn kay user exist be krta hai ya nhi.

    if (!organizer) { //agar user nhi hoga toh code agay execute nhi hoga yahi error ajaga.
      throw new Error("Organizer not found")
    }

    const newEventCreated: Ievents = await EventModel.create({  //yaha jo humara model hai usko simply sara data provide kr rhay hain.
      ...eventInfo.event, //destructuring whole obj using spread op.
      organizer: eventInfo.userId,
      category: eventInfo.event.categoryId //acha iska kia reason haka hum yun explicitly "categoryId" assign kr rhay hain toh wo janany ka lia go at  "updateEvent" func below at line 125.
    })
    revalidatePath("/")
    return JSON.parse(JSON.stringify(newEventCreated))

  }
  catch (error) {
    handleError(error)
  }

}

export async function getEventById(_id: string) {

  try {
    await connectToDb();
    const requiredEvent: Event | null = await EventModel.findById(_id) //here we have find eveet by _id,further after finding the event i do populate method chaining,Now basicallly this method is used to populate specific path(path means field defined in your EventModel) with another document. like if we want to populate organizer field with organizer document so we simply set path to "organizer" bcuz path is that field you want to populate,then tell the model name that from which model you want extract that doc and last is "select" which means that what fields you want from the document like in "User" model we have 3-4 fields but i want only two "_id" and "firstName" , so i set only _id and firstname in "select".
      .populate({ path: "organizer", model: "User", select: "_id firstName" })
      .populate({ path: "category", model: "Category", select: "_id name" });

    if (!requiredEvent) {
      throw new Error("event not found")
    }
    // const organizer: Organizer | null = await UserModel.findById(requiredEvent.organizer) //agar iss tarah sa organizer ka data get krenga but usma humay direct iss tarah sa get nhi hota kiu kay basic jo humari Event ka model hai usme humna organizer ko and category ko as a ref type pass kia hai so thats why uska jo proper way hai wo hum dekhtay hain abhi and same goes for category. Go and check above at line 55 where i have doing .populae method chaining.
    // const category: Category | null = await UserModel.findById(requiredEvent.category)

    return JSON.parse(JSON.stringify(requiredEvent))

  }
  catch (error) {
    handleError(error)
  }

}

async function populateEvents(query: any) { //yeh basic func iss lia bnaya haka jo kam hum uper wala func "getEventById" may manually kr rhay thy na to populate event fields with other document wohi kam krnay kay humna ek func bnadia or usme ek parameter dia joka wo query accept krega like this one query: "EventModel.findById(_id)and phr automatically." 
  return await query
    .populate({ path: "organizer", model: "User", select: "_id firstName lastName" })
    .populate({ path: "category", model: "Category", select: "_id name" })
}


export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {

  try {
    await connectToDb();

    const condition = {}

    const eventsQuery = EventModel.find(condition)
      .sort({ created_At: "desc" })
      .skip(0)
      .limit(limit)

    const events = await populateEvents(eventsQuery)

    const eventsCount = await EventModel.countDocuments(condition)

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),

    }
  }
  catch (error) {
    handleError(error)
  }

}

export async function deleteEventById(deleteParams: { eventId: string, path: string }) {

  try {
    await connectToDb();
    const deletedEvent = await EventModel.findByIdAndDelete(deleteParams.eventId)

    if (deletedEvent) { //here we are saying that when the deletedEvent occur after that must revalidate the path so we can see the fresh data on UI.
      revalidatePath(deleteParams.path)
    }

  }
  catch (error) {
    handleError(error)
  }

}

export async function updateEvent({ event, userId, path }: UpdateEventParams) {
  try {
    await connectToDb()
    const eventToUpdate = await EventModel.findById(event._id)
    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("unauthorized Or event not found")
    }
    const updateEvent = await EventModel.findByIdAndUpdate(event._id, {
      ...event,
      category: event.categoryId, //acha ab ques yeh haka jo event hum get kr rhay hain event obj say so automatic si bt haka usme category be hogi, but phr be hum explicitly kiu category likh kay usko categoryId assign kr rhay hain wo be "event" ka obj sa hi extract krka kr rhay hain toh uski waja yeh haka jo schema humna bnaya  hai usme field ka name "category" hai or jo event sa get ho rhi hai property wo "categoryId" hai toh iss lia apna schema ka A/c field ko set krnay kay explicitly "category" ki field ko categoryId assign kr rhay hain.   
      oraganizer: userId
    },
      { new: true })
    revalidatePath(path)
    return updateEvent ? JSON.parse(JSON.stringify(updateEvent)) : null
  } catch (error) {
    handleError(error)
  }
}

export async function getRelatedEventsByCategory({ categoryId, eventId, page, limit = 6 }: GetRelatedEventsByCategoryParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit

    const condition = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] } //here we set condition that first toh yeh kay category jo hon same hon A/c jo categoryId provide ki hai and second yeh haka right now jo event ki id ayo hna wo walay event ko chor kay baki events return krdo same category kay. "$ne" operator ka mtlb hai not equal to.

    const eventQuery = EventModel.find(condition) //yaha jo uper condition bnayi wo put krdi.
      .sort({ created_At: "desc" })
      .skip(skipAmount)
      .limit(limit)

    const relatedEvent: Ievents[] = await populateEvents(eventQuery)
    const relatedEventCount = await EventModel.countDocuments(condition)
    return {
      data: JSON.parse(JSON.stringify(relatedEvent)),
      totalPages: Math.ceil(relatedEventCount / limit)
    }
  } catch (error) {
    handleError(error)
  }
}

export async function getEventsOrganizedByUserId({ userId, page, limit = 6 }: GetEventsByUserParams) {

  try {
    await connectToDb()
    const Organizer = await UserModel.findById(userId)
    if (!Organizer) {
      throw new Error("Organizer not found")
    }
    const condition = { organizer: userId }
    const skipAmount = (page - 1) * limit
    const eventQuery = EventModel.find(condition)
      .sort({ created_At: "desc" })
      .skip(skipAmount)
      .limit(limit)
    const organizedEvents: Ievents[] = await populateEvents(eventQuery)
    const organizedEventsCount: number = await EventModel.countDocuments(condition)

    return {
      data: JSON.parse(JSON.stringify(organizedEvents)),
      totalPages: Math.ceil(organizedEventsCount)
    }
    return
  } catch (error) {
    handleError(error)
  }
}