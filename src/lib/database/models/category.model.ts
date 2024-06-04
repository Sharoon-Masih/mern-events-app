import { Schema, model, models } from "mongoose";

export interface Icategory extends Document {
    _id: string,
    name: string
}
const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true }
})

const CategoryModel = models.Category || model("Category", CategorySchema)

export default CategoryModel