import { userModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { messages } from "@Custom_message";
const _ = require('lodash');


/**
 * user SignUp
 * 
 * @param user 
 * @returns 
 */
function signUp(user: any, header: any, deviceip: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { countryCode, phoneNumber, role } = user;
            let { devicetoken, devicetype, timezone, language, currentversion } = header;
            var message: any = messages(language);
            const users = await userModel.findOne({ countryCode: countryCode, phoneNumber: phoneNumber, role: role })
            if (users) {
                reject(new CustomError(message.accountAlreadyExist, StatusCodes.BAD_REQUEST))
            } else {
                const userData: any = await userModel.create(user)
                const token: string = jwt.sign({
                    id: userData._id,
                    role,
                    userId: userData._id
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
                const sessionObj = {
                    deviceType: devicetype,
                    deviceIp: deviceip,
                    timezone: timezone,
                    language: language,
                    currentVersion: currentversion,
                    deviceToken: devicetoken,
                    jwtToken: token,
                    userId: userData.id,
                    role: role
                }
                await userSessionModel.create(sessionObj)
                resolve({
                    token,
                    name: userData.name,
                    email: userData.email,
                    countryCode: userData.countryCode,
                    phoneNumber: userData.phoneNumber,
                    _id: userData._id,
                    message: message.signupSuccessful
                })
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(message.accountAlreadyExist, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

/**
 * user signIn.
 * @returns 
 */
function login(body: any, header: any, deviceip: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { phoneNumber, countryCode, role = "user" } = body;
            const { devicetoken, devicetype, timezone, language, currentversion } = header;
            var message: any = messages(language);
            const userData: any = await userModel.findOne({
                phoneNumber,
                countryCode,
                role
            })
            if (!userData) {
                reject(new CustomError(message.noSuchAccountExist, StatusCodes.BAD_REQUEST))
            } else if (!userData.isPhoneVerified) {
                if (role == 'vendor')
                    reject(new CustomError(message.accountUnverifiedAdmin, StatusCodes.UNAUTHORIZED))
                else
                    reject(new CustomError(message.accountUnverifiedAdmin, StatusCodes.UNAUTHORIZED))
            }
            if (userData.isActive == false) {
                reject(new CustomError(message.accountBlocked, StatusCodes.UNAUTHORIZED))
            }
            const refreshToken = jwt.sign({ id: userData.id, role: role, tokenType: 'refresh' }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1m' });
            const token: string = jwt.sign({
                id: userData.id,
                role,
                tokenType: 'access',
                refreshToken
            }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' })
           
            const sessionObj = {
                deviceType: devicetype,
                deviceIp: deviceip,
                timezone: timezone,
                language: language,
                currentVersion: currentversion,
                deviceToken: devicetoken,
                role: role,
                jwtToken: token,
                userId: userData.id,
                refreshToken: refreshToken
            }

            await userSessionModel.create(sessionObj)
            resolve({
                token,
                name: userData.name,
                image: userData?.image,
                email: userData.email,
                _id: userData._id,
                countryCode: userData.countryCode,
                phoneNumber: userData.phoneNumber,
                message: message.loginSuccessful,
                refreshToken: refreshToken

            })
        } catch (err) {
            reject(err)
        }
    });
}

/**
 * user Account verification
 * 
 * @param user 
 * @returns 
 */
function checkAccount(user: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { phoneNumber, countryCode, role } = user;
            const { language } = header;
            var message: any = messages(language);
            const userData: any = await userModel.findOne({
                phoneNumber,
                countryCode,
                role
            })
            if (!userData) {
                resolve({ isUser: false, message: message.noSuchAccountExist })
            } else {
                if (userData.isActive) {
                    resolve({ isUser: true, isVerified: userData.isPhoneVerified })
                } else {
                    reject(new CustomError(message.accountBlocked, StatusCodes.UNAUTHORIZED))
                }
            }
        } catch (err) {
            reject(err)
        }
    });
}


function logOut(headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = headers.authorization
            const { language } = headers;
            var message: any = messages(language);
            await userSessionModel.deleteOne({ jwtToken: token })
            resolve({ success: true, message: message.logOutSuccessful })
        } catch (err) {
            reject(err)
        }
    });
}

// Export default
export default {
    login,
    signUp,
    checkAccount,
    logOut
} as const;
