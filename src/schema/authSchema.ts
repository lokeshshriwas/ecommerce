import {z} from "zod"

export const SignUpSchema = z.object({
    email : z.string().email(),
    password : z.string().min(5),
})