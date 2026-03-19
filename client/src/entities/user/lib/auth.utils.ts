import {  User, UserRole } from "../types/user.types";

export const hasRole = (user: User | null, role: UserRole):boolean => {
    if(!user) return false;
    return user.role === role;
}

export const isAdmin = (user: User | null):boolean => {
    return hasRole(user, "admin") || hasRole(user, "super_admin");
}

export const isSuperAdmin = (user: User | null):boolean => {
    return hasRole(user, "super_admin");
}

export const isClient = (user: User | null):boolean => {
    return hasRole(user, "client");
}

export const getRoleNames = (role: UserRole):string => {
    switch(role){
        case "admin":
            return "Admin";
        case "super_admin":
            return "Administrator";
        case "client":
            return "Client";
        default:
            return "Unknown";
    }
}

export const getAvailableRoles = ():{ role: UserRole, label: string }[] => {
    return [
        { role: "admin", label: "Admin" },
        { role: "client", label: "Client" },
    ]
}