export type UserRole = "admin" | "client" | "super_admin" | "user";

export interface User {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    bio?: string;
    phone?: string;
    address?: string;
    sosialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
    };
    avatarUrl?: string;
    isActive?: string;
    __v?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthProps{
    username?: string;
    email: string;
    password: string;
    image?: string;
}