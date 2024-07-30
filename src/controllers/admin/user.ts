import { userModel } from '@models/index';
import mongoose from 'mongoose';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { messages } from "@Custom_message";
//import redisClient from '@utils/redis';
import { v4 as uuidv4 } from 'uuid';

const expirationSeconds = 60;
const expirationDay = 3600;

/**
 * User register 
 * 
 * @param body 
 * @returns 
 */

//***********Add User*********//
function addUser(body: any, file: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language, timezone } = header;
            var message: any = messages(language);
            const userData: any = await userModel.findOne({ email: body.email });
            if (userData) {
                reject(new CustomError(message.userExist, StatusCodes.BAD_REQUEST))
            } else {
                if (file) {
                    body = {
                        ...body,
                        image: file.path
                    }
                }
                const userObj = await userModel.create(body);
                resolve(userObj)

            }
        } catch (err) {
            reject(err)
        }
    });
}
//  //***********Add User*********//
// function addUser(body: any, file: any, header: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { language, timezone } = header;
//             var message: any = messages(language);
//             const ruserData = await redisClient.get(`email:${body.email}`);
//             if (ruserData != null) {
//                 reject(new CustomError(message.userExist, StatusCodes.BAD_REQUEST))
//             } else {
//                 const userData: any = await userModel.findOne({ email: body.email });
//                 if (userData) {
//                     // assign the key and store in cache
//                     const cacheKey = `user:${userData._id}`;
//                     await redisClient.set(cacheKey, JSON.stringify(userData), {
//                         EX: expirationSeconds,
//                         NX: true
//                     });
//                     const uEmail = userData.email
//                     await redisClient.set(`email:${uEmail}`, JSON.stringify(uEmail), {
//                         EX: expirationDay,
//                         NX: true
//                     });
//                     reject(new CustomError(message.userExist, StatusCodes.BAD_REQUEST))
//                 } else {
//                     if (file) {
//                         body = {
//                             ...body,
//                             image: file.path
//                         }
//                     }
//                     const userObj = await userModel.create(body);
//                     body.type = 'add'

//                 }
//             }
//         } catch (err) {
//             reject(err)
//         }
//     });
// }


function editUser(body: any, file: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            var id = new mongoose.Types.ObjectId(body.userId)
            const userData: any = await userModel.findOne({ _id: id });
            if (!userData) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                if (file) {
                    body = {
                        ...body,
                        image: file.path
                    }
                }
                const userObj = await userModel.updateOne({ _id: id }, body, { new: true });
                // redisClient.del(`user:${userData._id}`)
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}

//****Users List****/

function getUsers(body: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            const { page = 1, pageSize = 10, search, fromDate, toDate } = body;
            let condition: any = {
                isDelete: false, role: "user"
            }
            if (search && search != '' && fromDate && toDate) {
                condition = {
                    ...condition,
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },

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
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                    ]
                }
            }
            const userCounts: any = await userModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: "$_id" },
                        objectId: { $toObjectId: "$_id" }
                    }
                },
                { $match: { role: "user", isDelete: false } },
                { $sort: { createdAt: -1 } }

            ])

            const response: any = await userModel.find(condition).skip(Number(page - 1) * Number(pageSize))
                .limit(Number(pageSize)).sort({ createdAt: -1 })
            const Total = await userModel.count(condition)

            if (!response) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve({ response, Total, userCounts })
            }
        } catch (err) {
            reject(err)

        }
    });
}





//****User Detail By Id*****/

function userProfile(userId: string, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            const response = await userModel.findOne({ "_id": userId })
            if (!response) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
            reject(err)

        }
    });
}

//***** Delete *****/

function deleteUser(body: any, userId: Object, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            const { userId } = body
            const userData: any = await userModel.findOne({ _id: userId });
            if (!userData) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const editdata = {
                    ...body,
                    isDelete: true
                }
                const userObj = await userModel.updateOne({ _id: userId }, editdata, { new: true });
                //redisClient.del(`user:${userData._id}`)
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}

//*********User Status Change****** */

function statusUser(body: any, userId: string, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            const { status, userId } = body
            const userData: any = await userModel.findOne({ _id: userId });
            if (!userData) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const editdata = {
                    ...body,
                    isActive: status
                }
                const userObj = await userModel.updateOne({ _id: userId }, editdata, { new: true });
                // redisClient.del(`user:${userData._id}`)
                resolve(userObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}




//****User List for Excel data Export *****/

function userExcelList(query: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            let condition: any = {
                isDelete: false,
                type: query.role
            }
            let response1 = await userModel.find(condition, { name: 1, email: 1, countryCode: 1, phoneNumber: 1, image: 1 }).sort({ createdAt: -1 })
            let response = response1.map(user => {
                return {
                    name: user.name ? user.name : "N/A", email: user.email ? user.email : "N/A", countryCode: user.countryCode ? user.countryCode : "N/A", phoneNumber: user.phoneNumber ? user.phoneNumber : "N/A", image: user.image,
                }
            })
            if (!response) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response)
            }
        } catch (err) {
            reject(err)

        }
    });
}


//****Users View Profile Data****/

function getUsersView(userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            let condition: any = {
                _id: new mongoose.Types.ObjectId(userId),
                role: "user"
            }
            const response: any = await userModel.aggregate([
                {
                    $addFields: {
                        id: { $toString: "$_id" },
                        objectId: { $toObjectId: "$_id" }
                    }
                },
                { $match: condition },
                {
                    $project: {
                        name: 1, email: 1, phoneNumber: 1, image: 1
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            if (!response) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve(response[0])
            }
        } catch (err) {
            reject(err)

        }
    });
}




// Export default
export default {
    addUser,
    editUser,
    getUsers,
    userProfile,
    statusUser,
    deleteUser,
    userExcelList,
    getUsersView,

} as const;
