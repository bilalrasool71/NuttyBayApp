import { Island } from "./Island";
import { Role } from "./roles";

export interface User {
    userId?:number;
    email?:string;
    password?:string;
    firstName?:string;
    lastName?:string;
    phoneNumber?:string;
    mobileNumber?:string;
    roleId?:number;
    role?:Role;
    organizationId?:number;
    islandId?:number;
    island?:Island
    organization?:Organization;
}

export interface Organization{
    organizationId:number;
    organizationName:string;
    organizationDescription:string;
}
