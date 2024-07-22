
export interface IUser  {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    token: string;
    profilePic: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;  
    createdAt: Date; 
    updatedAt: Date; 
}