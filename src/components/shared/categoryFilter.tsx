'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchAllCategory } from "@/lib/actions/category.actions"
import { Icategory } from "@/lib/database/models/category.model"
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


const CategoryFilter = () => {

    //to understand this blow functionality you can check search.tsx bcuz the same functionality is performed there with explanation.
    const [categories, Setcategories] = useState<Icategory[] | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const onSelectChange = (category: string) => {

        let newUrl = '';
        if (category && category !== "all") {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'category',
                value: category
            })
        }
        else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['query']
            })
        }

    if(category !== "all"){ //yeh iss lia kia hai taka agr category === all ka hogi toh phr yeh code nhi chlega kiu kay hum chahtay hain agr category "all" hojaye toh phr url dobara sa original form ma ajaye like agr iss tarah hai: www.evently.com/?category="Ai" toh jasa hi user "all" select kray Url will become like this: www.evently.com , toh jasa hi url iss tarah hoga wo all event ko database ma say fetch krlega kiu kay ab search param remove hogya Url may say.

        router.push(newUrl, { scroll: false })
        return
    }

    router.push('/',{scroll:false}) //agr uper wala code execute nhhi hoga toh phr yeh line chlegi or user original URl pa ajaga

    }
    useEffect(() => {
        const getAllCategories = async () => {
            const fetchedCategory: Icategory[] = await fetchAllCategory()
            fetchedCategory && Setcategories(fetchedCategory) //yeh iss lia kia hai taka categories srf tab hi update hon agar Db sa fetchedCategory ma koi data aya hai.
        }
        getAllCategories()
    }, [])
    return (
        <Select onValueChange={onSelectChange}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all" className="select-item">All</SelectItem>
               {!categories ? <SelectItem value="loading..." className="select-item ">loading...</SelectItem> : categories?.length !== 0 ? 
               categories?.map((item)=> <SelectItem value={item.name} className="select-item " key={item._id}>{item.name}</SelectItem>): <SelectItem value="No Category Found" className="select-item ">No Category Found</SelectItem>} 

            </SelectContent>
        </Select>

    )
}

export default CategoryFilter