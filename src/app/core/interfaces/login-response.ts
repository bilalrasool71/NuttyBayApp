import { User } from "./user";

export interface LoginResponse {
    isAuthenticated:boolean;
    token:string;
    user:User
}
