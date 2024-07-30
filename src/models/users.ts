import { Schema, model } from 'mongoose';


interface User {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  image: string;
  role: string;        // user , vendor , delivery_boy
  gender:string;       // Male , Female , Other
  dob:string;
  language:string;      // English to other
  lat:string;
  long:string;
  isPhoneVerified: boolean;
  isActive: boolean;
  isDelete: boolean;

}

const schema = new Schema<User>({
 
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String, required: true },
  countryCode: { type: String, required: true, default: '+91' },
  role: { type: String, required: true },
  gender: { type: String },   
  dob: { type: String},
  isPhoneVerified: { type: Boolean, default: true },
  image: { type: String },
  language: { type: String , default:"en"},
  lat: { type: String },
  long: { type: String },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
 
}, {
  timestamps: true,
  versionKey: false
});
schema.index({ email: 1 });
const userModel = model<User>('User', schema);
export = userModel
