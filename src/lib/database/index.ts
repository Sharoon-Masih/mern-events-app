import mongoose from 'mongoose' //ODM or In simple words driver to make connection b/w mongoDb and nodeJS.

const MONGO_URI = process.env.MONGODB_URI; //mongoDb connection string

// const cached = mongoose || { conn: null, promise: null } //here error is coming therefore convert it to global.  

const cached = (global as any).mongoose || { conn: null, promise: null } // This complex line handles connection caching. It checks if the mongoose property exists on the global object ((global as any)). If it does (meaning a connection has already been established), it uses that connection. Otherwise, it creates a new object with conn and promise properties set to null.




export const connectToDb = async () => {
    if (cached.conn) return cached.conn //basically here i am saying that if connection already exist so return the same "cached.conn" dont create new connection.But as you can see in the above line where i have declared "cached" variable whose type is mongoose bcuz typescript inferred its type, So its raising an error that ".conn" property not exist on "mongoose type" so to solve it i have now declared mongoose as global object and set its type to any which means now it is globally accessible and accept any property.

    if (!MONGO_URI) throw new Error('MONGO_URI is missing') //if MONGO_URI is undefined it will immdiately throw an error which it will pause the further execution.

    cached.promise = cached.promise || mongoose.connect(MONGO_URI, { //here we set that in the cached.promise property if promise exist set it to the same or otherwise create new connection, remember ".connect" will return a promise.
        dbName: "EventlyCluster",  //DB name
        bufferCommands: false  //now mongoose will not do buffering, which means now mongoose will not wait, it will execute operation immediatly. 
    })

    cached.conn = await cached.promise; //here the promise in "cached.promise" is resolving and storing final promise resolved output to "cached.conn" and returning it.
    return cached.conn
}

//now why i used this pattern for connecting mongoDb to nextJS app

// Actually as we know that we are not in the pure server environment, Basically we are working with serverless functions which means that in normal server which we create using "expressJs" etc, we simply run that servers one-time and they will continously run until we terminate them or due to some error.

//but in serverless environment, there are serverless functions which they will invoke everytime when we want to perform some operation, like iss tarah sa samjh lo kay serverless ma yeh hota haka server hi nhi chlta jasa jab hum "npm run dev" krtay hain toh humara node ka server run hojata hai jo ka automatically chlta rehta hai jab tk kay koi error na ajay ya hum usko khud terminate na krdein likin serverless ma asa nhi hota yaha simple functions hotay hain toh har dafa new point sa execute hotay hain jab be hum un serverless functions ko call krtay hain, toh isi wajah sa hum yaha with the help of mongoose check/condition lagatay hain kay agr already connection ho toh new connection create na ho else new connection create  hojaye.