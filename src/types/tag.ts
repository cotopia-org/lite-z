import {UserMinimalType} from "@/types/user";

export type TagType = {
    id: number
    created_at: null | string
    members: UserMinimalType[]
    title: string
}
