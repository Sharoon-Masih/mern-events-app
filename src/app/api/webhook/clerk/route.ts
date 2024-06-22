import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {   //this is related to svix setup.
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    //this part is important to understand.
    //why this part of code is important ?
    //bcuz here we are going to define some actions that will trigger when the event will occur.

    //now what is happening here.
    //1-basically the "evt" is a variable which we have declare on 34 line whose type is "WebhookEvent".
    //2-Now what is this WebhookEvent, it is special type basically this type consist of all data of event which is occured, iska mtlb kay like jab clerk pa koi user sign-up etc krega toh at that time Webhook event trigger hoga toh jo be data user input krega wo iss WebhookEvent type ka through later on hum apni application ma get krenga.
    //3-special thing yeh haka yeh jo Webhookevent type hna yeh na srf user ka data deti hai balka yeh be info provide krti haka "new user create" hua hai ya existing user na sign-in kia hai etc.    
    const { id } = evt.data; //now here jo .data property hai isme sara data mil rha hai jo user sa get hoga.
    const eventType = evt.type; //".type" property may event ki jo type hai wo mil rhi hai like kay event  konsa occur hua hai such as : user.created", "user.updated" etc.

    // console.log(`Webhook with and ID of ${id} and type of ${eventType}`) //yeh simple console hai jisme id and evenetype print hogi so i am comenting it.
    // console.log('Webhook body:', body)

    if (eventType === "user.created") {  //here we are checking that agar eventType ki  "user.created" toh below code execute hoga.
        const { id, username, first_name, last_name, image_url, email_addresses } = evt.data //now yaha par yeh ho rha hai actually jo ".data" property usme bht sari union types hain, ab jab hum line 60 pa "evt.data" may sa username ya koi or property destructure krna cha rhay thy to waha yeh ho rha tha hai kay ".data" ma bht sari union type thi jisma kisi ma username ki property thi or kisi ma nhi thi but "id" iss lia agyi bcuz "id" har type ma hi hoti hai. or yaha par ab jab humna if ka check lgya toh ab "evt.data" ma srf "UserJson" wali jo type hna usi ka data ayega so basically we narrow down it.

        const User = { //here simply jo data uper humna get kia uski base pa ek new object bna kay usme jo be fields humna apna "userSchema" ma define ki thi wo yaha par initialize krka jo property uper get hui unko as a value assign krdia.
            clerkId: id,
            email: email_addresses[0].email_address,
            // userName: username as string, //basically putting ! or type casting by using "as", both meaning same that they are basically explicitly saying TS that agar "evt.data" ma inki type "string | null" be hna toh usko ignore kro ma apko yeh gurantee deta hun kay apka pss yaha "string" value hi ayegi.
            firstName: first_name!,
            lastName: last_name!,
            photo: image_url
        }

        const newUser = await createUser(User) //ab jo uper object create kia hai named as "User" jisma sara user ka data aa raha hai wo humna server action ko pass krdia or server action ab usko dataBase ma jaka "User" ki collection ma as a doc bnadega.

        if (newUser) {  //or ab kiu kay createUser ma humna kuch return be krwaya hai jokay basically data hi hai user ka toh yaha hum "newuser" ma check kr rhay hain kay agr toh wo newUser ma data hai toh phr agay ka further code chlega.

            await clerkClient.users.updateUserMetadata(id, {  //yaha humna yeh kia kay "clerk" ma jo user ki id hai or as we know jab new doc bnta hai Db ma toh usko ek new "_id" assign hoti hai, toh hum yeh chahtay hain jo user create hua hna clerk ma or sth hi webhook event be occur hogya toh wo user db mabi bn gya toh ab jo uss user ki id db ma bani hai usko clerk mabi uss specific user ko by using ".updateUserMetadata()" method publicMetaData ma ek userId field bna kay usko assign krdi taka ab clerk ma or db ma ek connection build through this id bcuz yehi id db mabi hai or jo clerk hai usme be us user kay metadata ma hai.
                publicMetadata: { //publicMetadata means asa data jo app ka frontend pa show ho or backend (server) pa be show ho, par usme koi changes nhi krskta srf dekh skta hai.
                    userId: newUser._id,

                }

            })
            return NextResponse.json({ "message": "OK", "user": newUser }) //yaha hum Nextresponse API ka through response return kr rhay hain jismay simply humara pss ek msg property hai or obj of newUser hai.

        }
    }
    //now by using the same logic we will create conditions for updateUser, deleteUser.

    //for update
    if (eventType === "user.updated") {
        const { id, username, first_name, last_name, image_url, email_addresses } = evt.data;

        const userUpdate = {
            userName: username as string,
            firstName: first_name!,
            lastName: last_name!,
            photo: image_url
        }

        const updatedUser = await updateUser(id, userUpdate)
        return NextResponse.json({ "message": "OK", "user": updatedUser })
    }

    //for delete
    if (eventType === "user.deleted") {
        const { id } = evt.data;

        const deletedUser = await deleteUser(id!)

        return NextResponse.json({ "message": "OK", "user": deletedUser })
    }

    return new Response('', { status: 200 })
}