import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({ //creatting Schema by importing Schema class and creating new instance of Schema class. 
    clerkId: { type: String, required: true, unique: true }, //these are fields that are required in schema.
    email: { type: String, required: true, unique: true },
    // userName: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: true },
})

//now our first Schema is created, Schema is basically a blueprint for creating documents in collection, it defines that what fields should be present in documents.

//the most appropriate way to create schema is by using the Schema object from mongoose.

//Now creating model:

//what is model?
//model is basically nothing with the help of model class jo schema humna bnaya hai usko kisi na kisi collection pa set be toh kra hai hna kay hn yeh iss collection ka schema hai ad so on, on the Other hand later on jab kisi be collection say interaction be krni hoti hna like CRUD operation krna ya etc, toh tab be jo Model class hai uska Interface kay through usme jo be methods hongay unkay through hum Collection say interact kreinga.

const UserModel = models.User || model("User",UserSchema) //yeh yaha condition apply ki hai for creating model yeh iss liya ki hai bcuz are working with edge time environment now to understand it more clearly go and check my ZOD repo "model.ts" file.

//yha condition yeh haka agar "models.User" ho mean kay jo "models" array hai agr usme "User" model ho toh phr new "User" model nhi bnana else new bnado. 

export default UserModel