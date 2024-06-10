"use server"

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import CategoryModel, { Icategory } from "../database/models/category.model";
import { CreateCategoryParams } from "../types";
import { handleError } from "../utils";

export async function addNewCategory(category: CreateCategoryParams) {

    try {
        await connectToDb();
        const newCategory: Icategory = await CategoryModel.create({ name: category.categoryName })
        
        return JSON.parse(JSON.stringify(newCategory))

    }
    catch (error) {
        handleError(error)
    }
   

}
export async function fetchAllCategory() {

    try {
        await connectToDb();
        const newCategory: Icategory[] = await CategoryModel.find()
        
        return JSON.parse(JSON.stringify(newCategory))
         
    }
    catch (error) {
        handleError(error)
    }

}