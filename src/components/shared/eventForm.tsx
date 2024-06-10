"use client"
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod" //basically this zodResolver is a simple function that allow us to integrate Zod library with react-hook-form, its mean that it help us to pass the ZOD schema we have made for validation to react-hook-form by simply calling zodResolver and pass Zod schema as argument like :  zodResolver(zodSchemaName).

import { useForm } from "react-hook-form" //this is the hook that allow us to create and handle the entire form.

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from '@/lib/zodSchema/schema'
import { eventDefaultValues } from '@/constants'
import DropDown from './dropDown'
import { Textarea } from '../ui/textarea'
import { FileUploader } from './fileUploader'
import Image from 'next/image'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { useUploadThing } from '@/lib/uploadthings'
import { usePathname, useRouter } from 'next/navigation'
import { createEvent, updateEvent } from '@/lib/actions/event.action'
import { Ievents } from '@/lib/database/models/event.model'
// const formSchema = z.object({ //creating new folder there i will define all zodschemas
//   username: z.string().min(2).max(50)
// })

type EventFormProps = {
  userId: string,
  type: "create" | "update",
  event?: Ievents,
  eventId?: string
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {

  const route = useRouter()
  const path = usePathname()

  const { startUpload } = useUploadThing("imageUploader") //now here we are using the hook and destructuring the startUpload func that we are using below.and the arg we pass to "imageUploader" this is the endpoint where our data will be upload, but ques is that how would i know that we have to provide "imageUploader" it is bcuz if we go api/uploadthings/core.ts there we define that the FileRoute will "imageUploader". 

  const [File, setFile] = useState<File[]>([]) //this File is a special type that provides all info about files and allow JS to access the info in web page. 

  // this condition will true when we are updating event
  const initialValues = event && type === "update" ? {
    ...event,
    startDateTime: new Date(event.startDateTime as Date),
    endDateTime: new Date(event.endDateTime as Date),
  } : eventDefaultValues //yaha par basically hum yeh kr rhay hain kay agr event be ho or type be = "update" ho toh phr jo event obj mil rha hai which populated with data wo pass hojay else jo "eventDefaultValues" obj hai which is ot populated wo pass hojaye. 

  type FormSchemaType = z.infer<typeof eventFormSchema> //Now basically ZOD is a TypeScript-first schema validation library with static type inference, which means that now if we want the type of Zodschema which we have made above so we dont need to create an interfac or type aliases for defining its type first, Now the Zod will infer it and return it.you can hover on "FormSchemaType" and experience it.

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(eventFormSchema), //here we implemented our zod schema on the form.

    // defaultValues:{ //this parameter will take default values for fields, but here we will not define default value we have already made the interface for default in constants we will use it.
    //   username:""
    // }

    defaultValues: initialValues //here we are simply assigning the initialValues.

  })
  // 2. Define a submit handler.
  async function onSubmit(values: FormSchemaType) { //now within this function we will define our actions that how the user inputted values will be store in Db.And basic jo iss func kay pss values parameter hai wo wohi types hain jo humna apna events zod schma na rakhi thi, or ab yeh jo onSubmit func hai isko humna jo useForm ki tarf sa "handleSubmit" ka method milta hai joka sari fields ma user na jo input kia hota hai uska ek object return krta hai toh in below code at line 62 humna be same asa hi ki haka ek callBack func pass kia or jo usme "values" parameter hai wo basically un sab values ka object hai jo user na input ki hain toh further uss obj ko agay jo humara onSubmit func hai usko pass krdia hai,Now we will play with values obj and store data to the Db.

    let uploadedImgUrl = values.imageUrl; //here we are getting the ImgUrl by values object which we get onSubmit, but now when here we got the ImgUrl so why we are making conditions below and executing further code,uski waja yeh haka yeh toh current ImgURl hai but yeh url Db ma store nhi hua or uploadThings pa upload be nhi hua toh before storing it to DB hum yeh check kr rhay hain kay agr File ka jo array hai uski length ma increase hua hai toh phr uss file ko uload krdo, but btw i am also confuse in this right now. 

    if (File.length > 0) {
      const uploadImgs = await startUpload(File) //here by using startUpload func we are going to upload file to uploadthings.

      if (!uploadImgs) { //agr jo files upload hon wo return hoja toh ok else nhi toh yeh yehi terminate hojaga next line a nhi jayega.
        return
      }

      uploadedImgUrl = uploadImgs[0].url; //agar uploadImgs sa file mil jaye toh then phr "uploadedImgUrl" ko new url assign hoja.

    }

    if (type === "create") {

      try {

        const newEvent = await createEvent(  //this is server action for creating events, this server takes one parameter as obj.
          {
            event: { ...values, imageUrl: uploadedImgUrl }, //here we are assigning a object to event where "...values" means that jo values humay form submission pa receive ho rhi hai. ab yaha yeh ho rha hai kay by using spread operator we are saying that jo properties values ma hain wo sb hi add hon iska sth "imageUrl" wali property be add hojaye, now here agr if we look at values obj so there is already "imageUrl" property exsist so now it will take the common of same properties and give priority to that property which we have assigned now thats mean now the "imageUrl" property in values obj will be neglected.
            userId: userId,
            path: "/profile"
          }
        )

        if (newEvent) {
          form.reset()  //this means kay agr newEvent create hojata hai toh form reset hojaga or again apni initial stage pa ajaga.
          route.push(`/events/${newEvent._id}`) //or jasa hi newEvent creae hoga toh we will be pushed to the newEvent that is created by us.
        }
      }
      catch (error) {     //this is for catching error.
        console.log(error);
      }

    }
     console.log(values);
    if (type === "update") {

      if(!eventId){
        route.back()
        return
      }

      try {
        const Update_Event = await updateEvent({
          event: { ...values, imageUrl: uploadedImgUrl, _id: event?._id as string },
          userId: userId,
          path: path

        })

        if (Update_Event) {
          form.reset();
          route.push(`/events/${event?._id}`)
        }

      }
      catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <Form {...form}>{/*in actual this "Form" is not an ordinary form tag like html one it is wrapper around the react-hook-form library and it is provided by shadcn.or more info check shadcn form component */}
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className=" flex flex-col gap-5">  {/*yeh jo "handleSubmit" ka method hai yeh hume useForm hook sa mil raha hai jokay ek callback func leta hai jiska mtlb hota hai callback ma jo be parameter denga wo pura form ma jitni be fields hna un fields ko and unki corresponding value ko return krega.*/}

        {/* the "form" tag on line 50 is a html form tag now basically our entire form will be created within this tag.*/}

        <div className='flex flex-col md:flex-row gap-5 '> {/*here we create div in which we will wrap our form fields */}

          {/*Now this "FormField" is main component which will use for creating every fields, basically this FormField component says that i will handle the everthing inside field  */}
          {/* it takes some props "control" which accept the control property fromm useForm which consist of all the fields which we have defined in zod Schema */}

          {/* "name" props, automatically its type become literal type A/c to the fields we define in schema, it basically defines the name of field and it is v.imp bcuz on the basis of this name prop the render function which is passes as another prop to FormField perform the operation.*/}

          {/* now the render prop is basically  function that can accept 3 parameter and within this func we put the "Formitem" and within FormItem we write all require items that we want in field like label,title,desc,input etc.*/}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (  //this "field" parameter will return all the data inside "title" field like the value that the user input or onChange event as well etc.

              //this render func can accept 3 parameter and it return JSX element like we can see that below we define Jsx code or we can say its type is ReactNode. 
              <FormItem className='w-full '>
                <FormControl>
                  <Input placeholder="event title" {...field} className='input-field' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField  //this is for categoryId field
            control={form.control}
            name="categoryId"
            render={({ field }) => (

              <FormItem className='w-full '>
                <FormControl>
                  {/*now as here we dont want "Input" component so therefore we remove it and put DropDown component that we have made. */}
                  <DropDown value={field.value} onChangeHandler={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex gap-5 flex-col md:flex-row'>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (

              <FormItem className='w-full'>
                <FormControl className='h-72'>
                  <Textarea placeholder="event title" {...field} className='textarea rounded-2xl ' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className='w-full '>
                <FormControl className='h-72'>
                  <FileUploader
                    onFieldChange={field.onChange}
                    setFiles={setFile}
                    imageUrl={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className='w-full '>
                <FormControl>
                  <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full'>
                    <Image src="/assets/icons/location-grey.svg" width={24} height={24} alt='location' />
                    <Input placeholder="event location or online" {...field} className='input-field' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className='w-full '>
                <FormControl>
                  <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full'>
                    <Image src="/assets/icons/calendar.svg" width={24} height={24} alt='calendar'
                      className='filter-grey' />
                    <p className='ml-3 text-grey-600 whitespace-nowrap'>Start Date</p>
                    <DatePicker //its a third party package.
                      className='text-primary-500'
                      dateFormat={"MM/dd/yyyy h:mm aa"}
                      showTimeSelect
                      timeInputLabel='Time'
                      wrapperClassName="datePicker"
                      selected={field.value} //this props define that any date which user will select wil show in UI.where  "field.value" is the value that user will select.
                      onChange={(date: Date) => { //yeh func DatePicker sa milta hai iska mtlb hai kay jab jab value change hogi toh yeh automatically trigger hoga and isme jo "date" parameter hai wo wo wali date hai jo user select krega.

                        field.onChange(date)
                      }} /> {/*and further kiu kay basic jo be date ki value hai wo hume apna field.value ma store krni hai taka wo "selected" prop ka through UI pa bhi show ho and later on Db mabi store kr sakein toh iss lia jab onChange occur hoga usme jo "field.onChange" uska through "field.value" change hoja gi. its same like jasa huma useState hook ka use krka onChange ma new value set krtay thy isi tarah when working with react & shadcn hook form so yaha "field.onChange" ka through krenga. */}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className='w-full '>
                <FormControl>
                  <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full'>
                    <Image src="/assets/icons/calendar.svg" width={24} height={24} alt='calendar'
                      className='filter-grey' />
                    <p className='ml-3 text-grey-600 whitespace-nowrap'>End Date</p>
                    <DatePicker //its for select end date
                      className='text-primary-500'
                      dateFormat={"MM/dd/yyyy h:mm aa"}
                      showTimeSelect
                      timeInputLabel='Time'
                      wrapperClassName="datePicker"
                      selected={field.value}
                      onChange={(date: Date) => {

                        field.onChange(date)
                      }} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          <div className='flex bg-grey-50 rounded-full items-center w-full'>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className='w-full '>
                  <FormControl>
                    <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full'>
                      <Image src="/assets/icons/dollar.svg" width={24} height={24} alt='location' />
                      <Input type='number' placeholder="price" {...field} className='p-regular-16 outline-offset-0 bg-grey-50 border-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0' />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) =>

              (
                <FormItem>
                  <FormControl >
                    <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full gap-3'>
                      <Label htmlFor='isFree' className='whitespace-nowrap leading-none '>Free Ticket</Label>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isFree" className='h-5 w-5 mr-2 border-2 border-primary-500 ' /> {/*isko id iss lia di hai takay label ko pta chl jayeg kay iss element ka A/c wrk krna hai. */}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className='w-full '>
                <FormControl>
                  <div className='px-4 py-2 bg-grey-50 rounded-full h-[54px] overflow-hidden flex items-center justify-center w-full'>
                    <Image src="/assets/icons/link.svg" width={24} height={24} alt='location' />
                    <Input type="url" placeholder="URL" {...field} className='input-field' />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit"
          size={"lg"}
          disabled={form.formState.isSubmitting}>
          {/*form.formState.isSubmitting these are properties which we get from useForm hook ".formState" method, this method tells us about the state of form that isLoading,isSubmitted etc so that A/c to these state we can make interaction on UI. */}

          {/*this disabled prop takes boolean, basically its mean that if disabled is true so the color of btn become light and it become disable which means that if user click on it but no response, now here i also uses on the condition that if form is submitting like user click on submit and then A/c to formState if it is submit so disable the btn */}
          {`${form.formState.isSubmitting ? 'submitting...' : `${type} event`}`}</Button>
      </form>
    </Form >
  )
}

export default EventForm