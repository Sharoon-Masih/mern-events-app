import { Schema, model, models, Document } from "mongoose";

export interface Ievents extends Document {//basically yeh jo Ievents interface bnaya yeh jaka toh mongoDb ka hi model hoga for creating document so iss liya we have 'extends' it with document taka jo Ievents interface ma jo Document ki property hain wobi rahay or jo new properties Ievents ma bnaye wo be hon isilia Document ko import be ki hai.basically yeh humna schema ki ek type define krdi which will help jab hum frontend pa isko use kreingay bcuz yeh humay btadega kay kon kon si fields humna apna schema ma bnai hai kiu kay zahir hai jo fields schema ma hain wohi isme be as a property define ki hain.
    _id:string; //yeh wali field schema ma toh nhi dali bcuz waha par zarorat nhi kiu kay mongoDb automatic ek Id bnadeta hai document ki but uss "_id" ki field ko frontend pa get krnay kay liya yaha define krdi hai.
    title: string;
    description?: string; // Optional field
    location?: string; // Optional field
    created_At?: Date; // Optional field (default value handled by Mongoose)
    imageUrl: string;
    startDateTime?: Date; // Optional field (default value handled by Mongoose)
    endDateTime?: Date; // Optional field (default value handled by Mongoose)
    price?: string; // Optional field
    isFree?: boolean; // Optional field (default value: false)
    url?: string; // Optional field
    category?: {_id:string, name:string};//isme jo be category ka object ayega usme say srf we need two property that we have defined  // Assuming 'Category' is a string (refers to another collection)
    organizer?: {_id:string, firstName:string, lastName:string};//isme jo be User ka object ayega usme say srf we need three property that we have defined // Assuming 'User' is a string (refers to another collection)


}



const EventSchema = new Schema({
    title: { type: String, required: true, },
    description: { type: String },
    location: { type: String, },
    created_At: { type: Date, default: Date.now() }, //its mean kay agr created_At khud add krna chahay toh that's also possible but agr na bi krein toh by default jo be curren Date hogi wo set hojagi.
    imageUrl:{ type: String, required: true, },
    startDateTime:{ type: Date, default: Date.now() },
    endDateTime:{ type: Date, default: Date.now() },
    price:{type:String},
    isFree:{type:Boolean, default: false},
    url:{type:String},
    category:{type:Schema.Types.ObjectId , ref:'Category'},
    organizer:{type:Schema.Types.ObjectId , ref:'User'}
})

// organizer:{type:Schema.Types.ObjectId , ref:'User'}

// here is the explanation of this field:

// Let’s dissect it:

// organizer: This is the name of the field.
// { type: Schema.Types.ObjectId, ref: 'User' }:
// type: Specifies the data type of the field. In this case, it’s an ObjectId.
// Schema.Types.ObjectId: An ObjectId is a unique identifier automatically assigned to each document in a MongoDB collection, yeh wo Id hai jo jab hum koi be document bnatay hain mongoDB collection may toh automatically assign hjati hai.
// ref: 'User': This part establishes a reference to another collection named 'User'. It means that the organizer field will store an ObjectId that corresponds to a document in the 'User' collection.

// Practical Example:

// Imagine you have an events collection, and each event is associated with a organizer.
// Instead of storing the entire organizer information within the event document, we store only the reference (i.e., the ObjectId) to the corresponding user document in the 'User' collection.
// When you query an event, you can populate the organizer field to retrieve the complete user details from the 'User' collection.

const EventModel= models.Event || model("Event",EventSchema)

export default EventModel;