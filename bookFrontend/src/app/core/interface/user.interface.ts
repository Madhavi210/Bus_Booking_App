
export interface IUser  {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    token: string;
    profilePic: string;
    createdAt: Date; 
    updatedAt: Date; 
}