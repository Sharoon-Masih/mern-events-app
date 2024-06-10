import { z } from "zod"

export const eventFormSchema = z.object({
    title: z.string().min(3, 'title must be of minimum 3 chars'),
    description: z.string().min(3, 'description must be of minimum 3 chars').max(400, 'description can be of maxmum 400 chars'),
    location: z.string().min(3, 'location must be of minimum 3 chars').max(400, 'location can be of maxmum 400 chars'),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url('its not a url')
})