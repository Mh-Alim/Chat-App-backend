import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

interface IUser {
    name: string,
    email: string,
    password: string,
    comparePassword: (pass: string) => Promise<boolean>,
    getJwtToken : () => string
}

const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
},{timestamps : true});


userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (password: string):Promise<boolean> {
    console.log(password);
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getJwtToken =  function() {
    let token:string =  jwt.sign({id : this._id}, process.env.JWT_SECRET|| "", { expiresIn: '7d' });
    return token;
}
const User = model<IUser>("user", userSchema);

export default User;