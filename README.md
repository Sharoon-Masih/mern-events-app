
# MERN event app

#### exploring new things
1-uploadthings (its a library which is the easiest way to add file uploads to your full stack TypeScript application.) [docs](https://docs.uploadthing.com/)
```
npm i uploadthing/tw 

```
[for getting start with upload things](https://docs.uploadthing.com/getting-started/appdir)

2-CSS variables
CSS Variables (Custom Properties):

* CSS variables allow you to store and reuse values in your stylesheets.
* They start with -- followed by a name (e.g., --main-color).
* You can use them anywhere in your CSS rules.

3-how to add favicon.(go and check layout.tsx).
4-Why we use asChild in most of shadcn component?

The Party Analogy:
* Imagine you’re hosting a party, and you have a special room for entertainment.
* You want to decorate this room differently based on the type of event (like a birthday party or a dance night).
* Instead of decorating it yourself, you decide to let the event organizer (a guest) handle the decorations.
Delegating Render:
* In React (and Radix UI), components can delegate part of their rendering to a child component.
* The parent component says, “Hey child, you take care of this part!”
* The child component then customizes that part based on its own logic.
The “asChild” Pattern:
* Radix UI uses the “asChild” pattern with their <Slot> utility component.
* When you use <Slot>, you pass a child component to it.
The child component gets control over rendering a specific part of the UI.
* It’s like saying, “Child, you’re in charge of decorating this room!”
5-bg-dotted-pattern (it is tailwind class to make your background dotted)
* **File** this File is a special type that provides all info about files and allow JS to access the info in web page.
* **React.Children.only expected to receive a single React element child.** when this type of error come while using shadcn component so its mean that the element only take one parent element and then inside that parent element we can use multiple element.
* if you want to remove outline border from input field use these classes:  outline-offset-0  border-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 
* Styling based on sibling state (peer-{modifier}) When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers like peer-invalid to style the target element.
#### tip:
* when you add new dependencies to your project, then run the server again.
* when you have two or more element in any section it can hero etc , and you want to divide them equally means all element takes equal space use grid instead of flex bcuz flex set space A/c to element width but grid set space of each element A/c to grid cols.
* if you are going to perform a task that can be time taking list loading more than 100 post on UI which are coming from DB or storing any data in DB through server action or any method and you dont want to block UI in these cases so use **startTransition** for server component and if you are in client component you can use **useTransition** hook.
* always remember if you have define any class in global.css by using @apply directive layer utilities so let Suppose you define a color for box bg-red-500 in that class and when you are creating box or div etc, and you apply that class on it and at the same time you are applying the same property to that element like you have defined bg color in layer utilities class also and in defining it in element as well so tailwind will give more priority to that class which you have defined. 
* if facing error while creating events in Db, so go in network tab by inspecting and click on the request that occurring and then check request payload so you will understand that why the event is not creating in Db. In my case the JSON obj i am passing to **Model.create** method so in that obj **userId** field is undefined and it is required by mongoDb document bcuz when i have created the schema i put it as required so therefore i have facing the error.
* also remember this that if already the user exist in Db and again you are trying to sign-in and looking at clerk webhook so it show failed user.created, bcuz user already exist in Db.
#### Connection with MongoDb
* create database folder in lib.
* create index.ts inside it.
* install two packages using the command below:
```
npm i mongoose mongodb
```
Certainly! Let's explore what **Mongoose** is and how it works with MongoDB:

1. **What Is Mongoose?**:
   - **Mongoose** is an **Object Data Modeling (ODM)** library for **MongoDB**.
   - MongoDB is a popular **NoSQL** database, and Mongoose acts as an abstraction layer over it.
   - Think of Mongoose as a helpful bridge between your Node.js application and MongoDB.

2. **Why Use Mongoose?**:
   - **Structured Data Modeling**: Mongoose helps you define a **schema** for your data.
   - **Validation**: It enforces rules for data validation (e.g., required fields, data types).
   - **Middleware**: Mongoose allows you to add custom logic before or after certain operations (e.g., saving a document).
   - **Relationships**: You can define relationships between different collections (similar to SQL joins).

3. **How Mongoose Works**:
   - **Schema Definition**:
     - You create a **schema** that defines the structure of your data (like a blueprint).
     - The schema specifies fields, their data types, and any validation rules.
   - **Model Creation**:
     - From the schema, you create a **model** using Mongoose.
     - The model represents a collection in MongoDB.
   - **CRUD Operations**:
     - You use the model to perform **CRUD (Create, Read, Update, Delete)** operations on the database.
     - For example, you can create new documents, query existing ones, update data, and delete records.
   - **Middleware and Hooks**:
     - Mongoose allows you to add custom logic (middleware) before or after certain actions (e.g., saving a document).
   - **Query Building**:
     - Mongoose provides a powerful query builder for complex queries.
     - You can chain methods to build queries (e.g., filtering, sorting, pagination).

4. **Example**:
   - Suppose you're building a blogging app.
   - With Mongoose, you define a schema for blog posts (fields like title, content, author).
   - You create a model based on this schema.
   - Then, you can use the model to create, read, update, and delete blog posts in MongoDB.

In summary, Mongoose simplifies MongoDB data modeling, validation, and interaction in Node.js applications! 🚀📊

* In simple words, Mongoose allows us to make some validation on our mongoDB as we know that in MongoDb we cannot create standard schema there is a dynamic collections of documents where fields can be created dynamically in documents, So mongoose serve as a driver that allow us to create schema,middlewares,relationships b/w different collections(similar to SQL).

* by doing methods chaining we can build complex queries.
* But remember one thing that even if we created a schema by using mongoose, but still mongoDb will accept other fields as well those are not in schema and to solve this problem you can check this:[check here](https://stackoverflow.com/questions/28063849/mongoose-select-only-fields-explicitly-declared-in-schema)
* remember that when the model is created once so mongoose cached it therefore when we makes changes in schema so it does not appear in , to solve this remember whenever make changes in model restart your application so then mongoose we again create fresh model with new schema. 

**Mongoose**, a Node.js-based Object Data Modeling (ODM) library, is primarily designed for **MongoDB**. However, there are some considerations regarding its compatibility with other NoSQL databases:

1. **MongoDB**: Mongoose is specifically tailored for MongoDB. It provides an elegant way to model data, define schemas, and interact with MongoDB collections. If you're working with MongoDB, Mongoose is a powerful choice.

2. **Other NoSQL Databases**:
    - **CosmosDB from Azure**: Mongoose is compatible with CosmosDB, which is a multi-model database service. If you're using CosmosDB, you can still leverage Mongoose for data modeling.
    - **TingoDB**: TingoDB claims compatibility with Mongoose using an additional driver called Tingus.
    - **NeDB**: NeDB's API is a subset of the MongoDB API, so there may be some compatibility with Mongoose as well.

3. **Limitations**:
    - While Mongoose can work with other NoSQL databases, it's essential to recognize that its features and design are optimized for MongoDB. Using Mongoose with other databases might require workarounds and may not provide the same seamless experience.

In summary, Mongoose shines brightest when paired with MongoDB, but it's worth exploring its compatibility with other NoSQL databases if your project demands it. 🌟

Let make Connection with MongoDB with the help of mongoose:
```
import mongoose from 'mongoose' //ODM or In simple words driver to make connection b/w mongoDb and nodeJS.

const MONGO_URI = process.env.MONGODB_URI; //mongoDb connection string

// const cached = mongoose || { conn: null, promise: null } //here error is coming therefore convert it to global.  

const cached = (global as any).mongoose || { conn: null, promise: null } // This complex line handles connection caching. It checks if the mongoose property exists on the global object ((global as any)). If it does (meaning a connection has already been established), it uses that connection. Otherwise, it creates a new object with conn and promise properties set to null.




export const connectToDb = async () => {
    if (cached.conn) return cached.conn //basically here i am saying that if connection already exist so return the same "cached.conn" dont create new connection.But as you can see in the above line where i have declared "cached" variable whose type is mongoose bcuz typescript inferred its type, So its raising an error that ".conn" property not exist on "mongoose type" so to solve it i have now declared mongoose as global object and set its type to any which means now it is globally accessible and accept any property.

    if (!MONGO_URI) throw new Error('MONGO_URI is missing') //if MONGO_URI is undefined it will immdiately throw an error which it will pause the further execution.

    cached.promise = cached.promise || mongoose.connect(MONGO_URI, { //here we set that in the cached.promise property if promise exist set it to the same or otherwise create new connection, remember ".connect" will return a promise.
        dbName: "Evently",  //DB name
        bufferCommands: false  //now mongoose will not do buffering, which means now mongoose will not wait, it will execute operation immediatly. 
    })

    cached.conn = await cached.promise; //here the promise in "cached.promise" is resolving and storing final promise resolved output to "cached.conn" and returning it.
    return cached.conn
}

//now why i used this pattern for connecting mongoDb to nextJS app

// Actually as we know that we are not in the pure server environment, Basically we are working with serverless functions which means that in normal server which we create using "expressJs" etc, we simply run that servers one-time and they will continously run until we terminate them or due to some error.

//but in serverless environment, there are serverless functions which they will invoke everytime when we want to perform some operation, like iss tarah sa samjh lo kay serverless ma yeh hota haka server hi nhi chlta jasa jab hum "npm run dev" krtay hain toh humara node ka server run hojata hai jo ka automatically chlta rehta hai jab tk kay koi error na ajay ya hum usko khud terminate na krdein likin serverless ma asa nhi hota yaha simple functions hotay hain toh har dafa new point sa execute hotay hain jab be hum un serverless functions ko call krtay hain, toh isi wajah sa hum yaha with the help of mongoose check/condition lagatay hain kay agr already connection ho toh new connection create na ho else new connection create  hojaye.
```

### ways to create schema with the help of mongoose in mongodb:
Certainly! Let's explore how to create schemas using **Mongoose** for MongoDB. Mongoose is a powerful library that simplifies data modeling, schema enforcement, and general data manipulation. Here are the steps to create a schema and model using Mongoose:

1. **What is a Schema?**
    - A schema defines the structure of your collection documents. In Mongoose, a schema directly maps to a MongoDB collection.
    - Each field in the schema specifies its data type (e.g., String, Number, Date, etc.).

2. **Creating a Schema:**
    - Define your schema by specifying the fields and their data types.
    - Example schema for a blog post:

    ```javascript
    import mongoose from 'mongoose';

    const { Schema, model } = mongoose;

    const blogSchema = new Schema({
      title: String,
      slug: String,
      published: Boolean,
      author: String,
      content: String,
      tags: [String],
      createdAt: Date,
      updatedAt: Date,
      comments: [
        {
          user: String,
          content: String,
          votes: Number,
        }
      ],
    });

    const Blog = model('Blog', blogSchema);

    export default Blog;
    ```

    - In this example:
        - `blogSchema` defines fields like `title`, `slug`, `published`, etc.
        - The permitted data types include `String`, `Number`, `Date`, `Buffer`, `Boolean`, `Mixed`, `ObjectId`, `Array`, and `Decimal128`.
        - The `Blog` model applies this schema to each document in the collection.

### difference b/w schema and model 
Certainly! Let's delve into the distinction between **schema** and **model** in the context of **MongoDB**:

1. **Schema**:
    - A **schema** defines the **structure** of a document or record within a MongoDB collection.
    - It specifies:
        - The **fields** (also known as keys or properties) that the document will contain.
        - The **data types** for each field (e.g., `String`, `Number`, `Date`, etc.).
        - Any **default values** for fields.
        - **Validation rules** for data integrity (e.g., required fields, maximum length, etc.).
        - **Indexes** for efficient querying.
    - Think of a schema as answering the question: "What will the data in this collection look like?"

2. **Model**:
    - A **model** provides an **interface** to interact with a MongoDB collection.
    - It is essentially a **class** that represents the collection.
    - Key functionalities provided by a model include:
        - **CRUD operations**: Creating, reading, updating, and deleting records.
        - **Querying**: Finding records based on specific conditions.
        - **Inserting new documents** into the collection.
        - **Updating existing documents**.
        - **Deleting documents**.
    - In summary, a model answers questions like:
        - "Are there any records matching this query?"
        - "Add a new document to the collection."

#### Difference b/w schema and model in mongodb:
Certainly! Let's delve into the distinction between **schema** and **model** in the context of **MongoDB**:

1. **Schema**:
    - A **schema** defines the **structure** of a document or record within a MongoDB collection.
    - It specifies:
        - The **fields** (also known as keys or properties) that the document will contain.
        - The **data types** for each field (e.g., `String`, `Number`, `Date`, etc.).
        - Any **default values** for fields.
        - **Validation rules** for data integrity (e.g., required fields, maximum length, etc.).
        - **Indexes** for efficient querying.
    - Think of a schema as answering the question: "What will the data in this collection look like?"

2. **Model**:
    - A **model** provides an **interface** to interact with a MongoDB collection.
    - It is essentially a **class** that represents the collection.
    - Key functionalities provided by a model include:
        - **CRUD operations**: Creating, reading, updating, and deleting records.
        - **Querying**: Finding records based on specific conditions.
        - **Inserting new documents** into the collection.
        - **Updating existing documents**.
        - **Deleting documents**.
    - In summary, a model answers questions like:
        - "Are there any records matching this query?"
        - "Add a new document to the collection."

Remember, while MongoDB's flexible schema allows variations between documents, Mongoose provides a structured way to define and interact with data. 🌟

#### Webhook with clerk :

basically here we are syncing Clerk data to application backend, Which means that at the moment when anyone come and signup or sign-in etc on our app so User data will automatically Save in DB as well.[click here](https://clerk.com/docs/integrations/webhooks/sync-data)

* Step-01 : If you want to test it locally so then first we have to deploy using Ngrok server which will create a URL that looks like domain, but basically your app is running locally n your system, but best option is to dont do this step directly go on vercel and deploy your websute properly (this you can do after setuping webhook)
* step-02: move to step-5 in the top above link steps, where we are going to install Svix package.
* step-03: move to step-6, where we are going to create endpoint in my application, where the webhook request will hit when event will occur.
* step-04:make conditions for every possible condition at which the Webhook Event can trigger, for more you can go after app directory /api/webhook/clerk/route.ts at line 68.
* step-05: then create a file for server actions, for more go and check /lib/actions.ts
* step-06:after creating actions, Go on vercel and must deploy it, also remember to add env vriables.
* step-07:after deploy go at your clerk dashboard and navigate to webhooks from side bar and then add their endpoint like: https://yourdomain.vercel.app/api/webhook/clerk
* step-08:copy the Webhook Secret from the same page  where you put endpoint.
* step-09:put that secret in .env.local and as well as on vercel. it is named as WEBHOOK_SECRET=your secret

#### Now if you are encountering some errors:
* DB not showing anything when you are opening your cluster, so go and check your connection string always put your cluster name after " net/ " before " ? " like this: net/clusteName? 
* still error, then go and check your  /api/webhook/clerk/route.ts and /lib/actions.ts , if cant find error then copy the exact file of person whose tutorial you are watching, and if it works so then check the error in your code.
* after solving above, now if this error is coming that when you are logining in or signing up and it is not storing in your Db, so go and must check your schema and also check that the fields you defined in schema they should be fullfill when you are logining or signup on Clerk. like you have defined firstName feild in your schema but you are not inputting that field when you logining or signup in clerk so at the end it will raise error.

### React Hook Form 
* i have used shadcn Form component to take the advantage of React Form Hook.
* for creating form using react-form-hook you can visit these link:
[1st link](https://blog.logrocket.com/react-hook-form-complete-guide/)
[2nd link](https://catalins.tech/form-validation-with-react-hook-form-zod-typescript/#:~:text=zodResolver%20is%20a%20function%20for%20integrating%20an%20external,enables%20you%20to%20access%20Zod%27s%20functions%20and%20features.)

### Stripe 
* go on its website first
* this link will guide that how the checkout work in Stripe : [click here](https://docs.stripe.com/payments/checkout/how-checkout-works)
* for getting started:[click here](https://docs.stripe.com/checkout/quickstart)
* Now after implementing stripe simply by following the above link, But we want to perform some more actions when the order is placed successfully like it can be adding a order in database as well so for that purpose now we are going to use stripe webhook.

### Stripe Webhook
* to getting start with stripe webhook.
* go on dashboard page
* then, click the developer in nav bar.
* [click on this link to directly navigate to webhook page](https://dashboard.stripe.com/test/webhooks)
* step-01:add endpoint of where the webhook will be hit.like we have done in clerk above.(add endpoint here)[https://dashboard.stripe.com/test/webhooks/create]
* step-02: on the same page below,there is select events option, go and select **checkout.session.completed**
* step-03:copy the NodeJS server code on your right side and click Add endpoint.
* step-04:Now go in your app/api/webhook and create a stripe folder and also create route.ts within stripe folder.
* step-05:go back to stripe tab there you have automatically redirected to the webhook which you have created now there is signing_secret copy it and paste in .env like : STRIPE_WEBHOOK_SECRET=value
* step-06:Now edit the code you pasted in app/api/webhook/stripe and then final code is below , you can also skip the step-03 and direct copy the below code :
```
import stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.action'

//now here we created a webhook 
export async function POST(request: Request) { //here we define a POST method bcuz the request that will come when the webhook will be hitted, so that request is for doing some data mutation not for getting data so therefore here i define POST method.
    const body = await request.text() //here by using ".text()" method converting req into string format.

    const sig = request.headers.get('stripe-signature') as string //here getting header named as "stripe-signature"

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET! //it is our Webhook API secret.

    let event; //here we let this variable as any.

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret) //now here we are constructing Event which is main task and assigning the result to "event" variable which we have declared above.now basically ".constructEvent()" method from stripe.webhook takes 3 parameter which we have defined above . 
        
        // body -> this variable basicaly contain the body that we receive with request and then when we assign the body variable to .construct method take it as payload.Now basically payload is itself nothing it is a data that you send in body via request, but payload is a data that is neccessary for performing that operation it does not contain unneccesary data. 

        //sig -> it is header that ".constructEvent" require
        //endpointSecret -> it is our stripe secret webhook key.
        
        
    } catch (err) {
        return NextResponse.json({ message: 'Webhook error', error: err })  //this msg will print in case of errror.
    }

    // Get the ID and type
    const eventType = event.type //now here we assigning the type of event that occur to "eventType" variable

    // CREATE
    if (eventType === 'checkout.session.completed') { //here we are implementing the condition that if event is of type "checkout.session.completed" so then execute the below code, in simple words that if the eventType is = checkout.session.completed then our order will be save in Db through the createOrder() server action.
        const { id, amount_total, metadata } = event.data.object //now here retrieving the data from ".object" like the stripeId, amount_total of product for which this checkout session is created and the metadata of product.

        const order = { //then here we created a obj named as order and assign the above values to this obj properties
            stripeId: id,
            eventId: metadata?.eventId || '', //if ".eventId" property exist in metadata obj else empty string will be assigned. 
            buyerId: metadata?.buyerId || '',
            totalAmount: amount_total ? (amount_total / 100).toString() : '0', //here if amount_total exist so convert the amount in dollar as string value bcuz in Db we have defined the price field as string else assign '0'. (amount_total / 100) actually by default from stripe we get amount in cents so to convert it in dollar we nned to divide by 100.
            createdAt: new Date(), //here creating additional for storing the order placing date in DB.
        }

        const newOrder = await createOrder(order) //here simply invoking the server action and passing order obj to it.
        return NextResponse.json({ message: 'OK', order: newOrder }) //in response we get this msg and the newOrder obj.    
    }

    return new Response('', { status: 200 })
}
```
* step-07: now finally push your code on github because, webhook endpoint is your final domain so webhook will only occur when we properly deploy code on vercel.
 

## Pagination

* step-01: create a component file named as pagination.tsx. 
* step-02: then, create a component named as Pagination. 
* step-03: then, go to collection.tsx and on check line 43 we have implementing pagination.
* step-04: then, go to app/page.tsx from where we are getting "page" number and "totalPage". 
* step-05: then, go to getAllEvents() server action in event.action.tsx
* step-06: then, finally you can gain look at pagination.tsx