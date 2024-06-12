import { Schema, model, models,Document } from "mongoose";

export interface Icategory extends Document {
    _id: string,
    name: string
}
const CategorySchema = new Schema({
    name: { type: String, required: true,  }
})

const CategoryModel = models.Category || model("Category", CategorySchema)

export default CategoryModel;