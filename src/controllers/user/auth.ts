import { userModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { messages } from "@Custom_message";
const _ = require('lodash');

/**
 * user address
 * 
 * @param user 
 * @returns 
 */
function addressRegister(body: any, userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { type = "home", addressLine1, addressLine2, addressLine3, lat, long, landmark } = body;
            const { language ,timezone} = header;
            var message: any = messages(language);
            const typeLower = type.toLowerCase().trim();
            const addData = await userModel.findOne({ userId: userId, type: typeLower })
            if (addData) {
                reject(new CustomError(message.addressTypeUse.replace('{{type}}', typeLower), StatusCodes.BAD_REQUEST))
            } else {
                body.userId = userId
                body.type = typeLower
                const addressData: any = await userModel.create(body)
                if (typeLower === "home") {
                    await userModel.findOneAndUpdate(
                        { _id: userId },
                        { $set: { lat: lat, long: long } },
                    )
                }
                resolve({ message: message.success })
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



function addressEdit(body: any, userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { type , addressLine1, addressLine2, addressLine3, lat, long, landmark ,addressId} = body;
            const { language ,timezone} = header;
            var message: any = messages(language);
            const typeLower = type.toLowerCase().trim();
            const addData:any = await userModel.findOne({ _id: addressId, userId: userId })
            if (!addData) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                if(addData.type !== typeLower){
                    const userAdd:any = await userModel.findOne({ userId: userId ,type:type})
                    if(userAdd){
                    reject(new CustomError(message.addressTypeUse.replace('{{type}}', typeLower), StatusCodes.BAD_REQUEST))
                    }else{
                        body.type = typeLower
                        const addressDatas: any = await userModel.updateOne({ _id: addData._id }, body, { new: true });
                         if (typeLower === "home") {
                             await userModel.findOneAndUpdate(
                                 { _id: userId },
                                 { $set: { lat: lat, long: long } },
                             )
                         }
                         resolve({ message: message.success })
                    }
                }else{
                    body.type = typeLower
                    const addressData: any = await userModel.updateOne({ _id: addData._id }, body, { new: true });
                     if (typeLower === "home") {
                         await userModel.findOneAndUpdate(
                             { _id: userId },
                             { $set: { lat: lat, long: long } },
                         )
                     }
                     resolve({ message: message.success })
                }
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

//****Address List****/

function addressList(query: any ,userId:any, header:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            const { page = 1, pageSize = 10, search, fromDate, toDate } = query;
            let condition: any = {
                isDelete: false, userId: userId
            }
            if (search && search != '' && fromDate && toDate) {
                condition = {
                    ...condition,
                    $or: [
                        { type: { $regex: search, $options: 'i' } },
                        { addressLine1: { $regex: search, $options: 'i' } },
                        { addressLine2: { $regex: search, $options: 'i' } },

                    ],
                    createdAt: { $gte: fromDate, $lte: toDate }
                }
            } else if (fromDate && toDate) {
                condition = {
                    ...condition,
                   createdAt: { $gte: fromDate, $lte: toDate }
                }
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { type: { $regex: search, $options: 'i' } },
                        { addressLine1: { $regex: search, $options: 'i' } },
                        { addressLine2: { $regex: search, $options: 'i' } },
                    ]
                }
            }
           
           const response: any = await userModel.find(condition,{addressLine1:1,addressLine2:1,addressLine3:1,landmark:1,type:1,lat:1,long:1}).skip(Number(page - 1) * Number(pageSize))
                .limit(Number(pageSize)).sort({ createdAt: -1 })
            const Total = await userModel.count(condition)

            if (!response) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve({ response, Total })
            }
        } catch (err) {
            reject(err)

        }
    });
}


function addressDelete(query: any, userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { addressId} = query;
            const { language } = header;
            var message: any = messages(language);
             const addData:any = await userModel.findOne({ _id: addressId, userId: userId })
            if (!addData) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const addressData: any = await userModel.deleteOne({ _id: addData._id });
               resolve({ message: message.success })
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



// Export default
export default {
    addressRegister,
    addressEdit,
    addressList,
    addressDelete
} as const;
