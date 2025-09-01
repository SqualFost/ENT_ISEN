import {supabase } from "../db";

export class UserService {
    static userId: any;
    
    static async createUser(nom:string){
        const { data, error } = await supabase
            .from('users')
            .insert([{ nom: nom }])
            .select();

        if (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }

        this.userId = data[0].id;
        console.log(`User created with ID: ${this.userId}`);
        return data;
    }
    static async getUserId(user : string) {
        if (this.userId) {
            return this.userId;
        }
        else {
             const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('nom', user)

        if (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
        this.userId = data[0].id;
        console.log(`User ID retrieved: ${this.userId}`);
        return this.userId;
    }
}
}
let userService = new UserService();
UserService.createUser("anthony.coulais")