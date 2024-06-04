
# MERN event app

#### exploring new things
1-uploadthings (its a library which is the easiest way to add file uploads to your full stack TypeScript application.)
```
npm i uploadthing/tw
```
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

#### tip:
* when you add new dependencies to your project, then run the server again.
* when you have two or more element in any section it can hero etc , and you want to divide them equally means all element takes equal space use grid instead of flex bcuz flex set space A/c to element width but grid set space of each element A/c to grid cols.

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

