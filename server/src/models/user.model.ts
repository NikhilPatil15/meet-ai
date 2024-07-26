import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends mongoose.Document{
    userName:string,
    fullName:string,
    email:string,
    password:any,
    role:string,
    refreshToken:any,
    generateAccessToken():string,
    generateRefreshToken():string,
    isPasswordCorrect (password:any):Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["host", "participant", "guest"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  /* Encrypting the password using hash method */
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password: any):Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function ():string {
  return jwt.sign({
    id: this._id,
    userName: this.userName,
    email: this.email,
  },
  process.env.ACCESS_TOKEN_SECRET as string
  ,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
);
};

userSchema.methods.generateRefreshToken = function():string{
    return jwt.sign({
        id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET as string
      ,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );
}

export const User:Model<IUser>  = mongoose.model<IUser>('User',userSchema)