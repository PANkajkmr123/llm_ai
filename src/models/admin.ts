import { Schema, model } from 'mongoose';
const _ = require('underscore');


interface Admin {
  name: string;
  email:string;
  phoneNumber:string;
  password:string;
  token:string;
  role:string;
  isActive: boolean;
  isDelete: boolean;

}

const schema = new Schema<Admin>({
  name: { type: String, required: true },
  password: { type: String ,required: true },
  email:{type : String , required:true },
  phoneNumber :{type : String },
  token:{ type: String},
  role:{ type: String , default:"Admin"},
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
 
}, {
    timestamps: true,
    versionKey: false
});


const adminModel = model<Admin>('Admin', schema);
export = adminModel