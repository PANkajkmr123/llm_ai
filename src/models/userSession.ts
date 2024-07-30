import { Schema, model } from 'mongoose';

interface userSession {
  deviceType: string;
  deviceIp:string;
  timezone: string;
  language: string;
  currentVersion: string;
  deviceToken: string;
  role: String;
  isActive: boolean,
  isDelete:boolean,
  jwtToken:String,
  refreshToken:String;
  userId: String
}

const schema = new Schema<userSession>({
  deviceType: { type: String },
  deviceIp: { type: String },
  timezone: { type: String },
  language: { type: String, default: "en" },
  currentVersion: { type: String, default: '1.0.1' },
  deviceToken: { type: String },
  role: { type: String },
  isActive: { type: Boolean, default: true },
  jwtToken:{ type: String} ,
  refreshToken:{ type: String} ,
  userId: { type: String} ,
  isDelete: { type: Boolean, default: false },
},
{
    timestamps: true,
    versionKey: false
});
schema.index({ jwtToken: 1 });
schema.index({ refreshToken: 1 });
const userSessionModel = model<userSession>('userSessions', schema);
export = userSessionModel