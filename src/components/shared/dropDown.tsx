"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Icategory } from "@/lib/database/models/category.model"
import { startTransition, useEffect } from "react" //this startTransition func is similar to useTransition but we can use it anywhere bcuz its a func not hook, like we can use it in server component as well.
import React, { useState } from 'react'
import { Input } from "../ui/input"
import { addNewCategory, fetchAllCategory } from "@/lib/actions/category.actions"
import { CreateCategoryParams } from "@/lib/types"
import { Ievents } from "@/lib/database/models/event.model"
type DropDownProp = {
    value?: string,
    onChangeHandler: (value: string) => void,
    event?: Ievents,
    type?: "update" | "create"
}
const DropDown = ({ value, onChangeHandler}: DropDownProp) => {

    const [categories, Setcategories] = useState<Icategory[] | null>(null)
    const [NewCategory, setNewCategory] = useState('')
    // console.log(value);
    const handleAddClick = async () => {
        const NewCategoryAdded: Icategory = await addNewCategory({ categoryName: NewCategory }) //basically iss func ma ho yeh rha hai kay jab be continue pa click hoga toh jo be category user na likhi hogi input ma wo "addNewCategory" walay server action ka through save hojayegi but as we know that kay UI pa instant changes nhi ayegay bcuz humara jo data hai wo Db sa aa raha hai or useEffect ma aa raha hai toh useEffect ko srf hum ek first time hi render krwayega bar bar nhi render krwayega kiu kay wo direct Db sa query kr rha hai toh agr let say hum usko dependency ma yeh kehdetay hna kay jab jab handleAddClick call ho tab tab useEffect be chley toh wo UI pa toh thk show hoga iska ilawa Db sa be wo tab hi query krega jab handleAdClick occur hoga but agr let say user nay 4 category add ki toh mtlb kay 4 dafa direct Db pa request jayegi and uska dusra msla yeh be hai kay sometimes Db ma data itna jldi store be nhi hota time be lag jata hai toh let say agr apnay useEffect ka through datafetch kr rhay on every change toh agr incase waha new data abhi store nhi hua ya etc, toh tab be issue ayega that;s we have done some work to overcome this problem.

       categories !== null && Setcategories((prev) => [...prev as [], NewCategoryAdded]) //now yaha par hum yeh kia kay UI pa instant changes lanay kay liya without sending any request to Db or etc, direct Setcategories func ko call kia or usme yeh kaha kay jo be prev value basic wo ek array hi hai toh agay humna yeh kaha kay ek new array return kia or usme jo prev array tha na usko "..." operator ka through spread krdia kay jitni be elements hon prev array ma wo toh return ho or uska sth jo NewCategory add ki hai wo be sth hi return hojay , So then iss tarah UI ma instant changes be ajaga or wo new category Db ma b store hojagi.


    }
    useEffect(() => {
        const getAllCategories = async () => {
            const fetchedCategory: Icategory[] = await fetchAllCategory()
            fetchedCategory && Setcategories(fetchedCategory) //yeh iss lia kia hai taka categories srf tab hi update hon agar Db sa fetchedCategory ma koi data aya hai.
        }
        getAllCategories()
    }, [])
    return (
        <Select onValueChange={(val) => onChangeHandler(val)} value={value}>
            <SelectTrigger className="w-[180px] select-field text-grey-500">
                <SelectValue placeholder={`${!categories ? "loading..." : categories.length > 0 ? 'Category' : 'Empty list'}`} />
            </SelectTrigger>
            <SelectContent>
                {!categories ? "loading..." : categories.length > 0 && categories.map((category) => <SelectItem value={category._id} key={category._id} className="select-item p-regular-14">{category.name}</SelectItem>)} {/*yaha basic flow iss tarah sa chal rha hai kay jab humari dropdown list appear hoti hna toh usme hum jo be category select krtay hain uski jo be _id hoti hna wo 'value' prop may save hojati hai jo humna "SelectItem" ma pass krwaya hai, or phr flow iss tarah sa hota haka jasay hi "value" prop ko value milti hai toh jo main component hna <Select/> ka usme "onValueChange" event hna wo occur hota hai toh jasa hi wo occur hota hai usme jo humna onChangeHandler callBack func dia hai jo basically ek value argument receive krta hai toh wo jo value yaha sa milti hai wo onChangeHandler ko as a argument mil jati hai or wo uski base pa jo evetForm ma "categoryId" field hai uski value change krdeta hai or wo value Db ma jakay store hojati hai.*/}
                <AlertDialog>
                    <AlertDialogTrigger className="p-medium-14 rounded-sm flex w-full py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">Add New Category</AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>New Category</AlertDialogTitle>
                            <AlertDialogDescription>
                                <Input className="input-field mt-3" type="text" onChange={(e) => { setNewCategory(e.target.value) }} />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { startTransition(() => handleAddClick()) }}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </SelectContent>
        </Select>

    )
}

export default DropDown