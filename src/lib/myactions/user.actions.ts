"use server"

import { connectToDb } from "../database";
import EventModel from "@/lib/database/models/event.model";
import UserModel from "@/lib/database/models/user.model";
import OrderModel from "../database/models/order.model";
import { CreateUserParams, UpdateUserParams } from "../types";
import { handleError } from "../utils";

export async function createUser(user: CreateUserParams) {


    try {

        await connectToDb(); //yaha humna uss function ko call kia jo humna database connection krwanay ka liya bnaya tha, ab yeh function srf tab hi call hoga jab yeh server action call hoga, or usi ki base pa waha humna condition be lgyi hai yeh check krnay kay liya kay agr connection hua toh new conn hojaye warna previous conn return hoja.
        const newUser = await UserModel.create(user); //yaha simply ek new variable declare kia or usme "UserModel" jo basic humna model bnaya tha na usme create ka operation perform krnay ka liya ".create()" ka method use krka "user" create kr rhay hain. and in return wo ek promise be return kr rha hai jisme wo document hoga jo Db may create hoga or usko hum await ka through resolve krka further apna frontend pa use kreinga.

        return JSON.parse(JSON.stringify(newUser)) //actually yaha yeh JSON.parse() iss liya use kia hai taka jo return ma output milay wo pure JS object ho na kay mongoDB doc joka JSON obj hota hai wo ho, and then uska andar "JSON.stringify(newUser)" iss lia kiya hai taka pehla jo be data ayee "newUser" may wo pehla JSON obj ma convert ho through ".stringify" method and then wo wo JSON obj .parse ka through JS obj ma convert ho, bcuz later on we dont know what type of data can come in newUser toh .parse toh srf JSON ko convert krta hai toh iss lia pehla newUser ko jSON ma convert kia and then .parse ko pass kia. 

    }
    catch (error) {
        handleError(error) //its a simple handle error func imported from util you can go and see.
    }

}

//same like create this func is used to updateUser.
export async function updateUser(clerkId: string, user: UpdateUserParams) {


    try {

        await connectToDb();
        const updatedUser = await UserModel.findOneAndUpdate({ clerkId }, user, { new: true }); //yaha par by using "findOneAndUpdate" method usme jo 1st parameter hai usko clerkId ki base pa user ka doc ko find krega and then usme "user" ka jo updated obj mila wo pass krdia.

        //{new:true} //iska mtlb haka bydefault "findOneAndUpdate" ka method document ko return update honay sa pehlay but when we set new to true, so its mean kay update honay kay bd return kro doc ko.

        //findOneAndUpdate ka jo first parameter hna wo ek obj require krta hai jisme explicitly koi property define nhi wo just ek index signature leta hai like this {[x:string]:any}

        if (!updatedUser) throw new Error("user update failed")
        return JSON.parse(JSON.stringify(updatedUser))

    }
    catch (error) {
        handleError(error) //its a simple handle error func imported from util you can go and see.
    }

}

//for delete action
export async function deleteUser(clerkId: string) {


    try {

        await connectToDb();
        //find user by clerkId field
        const userToDelete = await UserModel.findOne({ clerkId })
        if (!userToDelete) throw new Error("user not found")


        // Unlink relationships
        await Promise.all([
            // Update the 'events' collection to remove references to the user
            EventModel.updateMany(
                { _id: { $in: userToDelete.events } },
                { $pull: { organizer: userToDelete._id } }
            ),

            // Update the 'orders' collection to remove references to the user
            OrderModel.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
        ])



        //delete user by _id, yaha iss tarah sa hoga kay jo be "userToDelete" doc ayega usme _id hogi toh uski base pa user ko delete kreinga.
        const deletedUser = await UserModel.findById(userToDelete._id)
        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null

    }
    catch (error) {
        handleError(error) //its a simple handle error func imported from util you can go and see.
    }

}
export async function getUser(userId: string) { //ab jo yeh wala action hna yeh clerk ki jo webhook bnai hai usme call nhi hoga bcuz waha par humay User get thori krwana hai waha say toh just user ko create krwana hai ya user ka data ma koi be mutation ho wo update and delete.

    //but jo user ka data get krna hai query ka through joka humna nichay likhi hai like this "UserModel.findById({ userId })" , isme jo be data ayega usko frontend pa get krna hai toh iss lia yeh server action be frontend pa hi call hoga.


    try {

        await connectToDb();
        const User = await UserModel.findById({ userId }) //yaha par .findById or findOne ma yeh difference haka findOne jo be doc ma field detay hain uska A/c filter kta hai or jo findById hai wo jo doc ki "_id" hoti hai joka tab bnti hai jab doc create hota hai toh uska A/c filter krta hai.

        if (!User) throw new Error("user not found")
        return JSON.parse(JSON.stringify(User))

    }
    catch (error) {
        handleError(error) //its a simple handle error func imported from util you can go and see.
    }

}