import { adminModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { messages } from "@Custom_message";


/**
 * Admin registration
 * 
 * @param admin 
 * @returns 
 */
function registerAdmin(admin: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language } = header;
            var message: any = messages(language);
            admin.email = (admin.email).toLowerCase()
            const adminData = await adminModel.findOne({ email: admin.email }).lean();
            if (adminData) {
                reject(new CustomError(message.adminWithSameEmail.replace('{{email}}', admin.email), StatusCodes.BAD_REQUEST))
            } else {
                const pass = bcrypt.hashSync(admin.password, 10);
                admin.password = pass
                const response = await adminModel.create(admin)
                resolve(response)
            }
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(message.adminWithSameEmail, StatusCodes.BAD_REQUEST))
            }
            reject(err)
        }
    });
}

// Admin Login 

function login(body: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = body;
            const { language } = header;
            const message: any = messages(language);
            const adminData: any = await adminModel.findOne({ email }, { name: 1, token: 1, email: 1, role: 1, password: 1 })
            if (!adminData) {
                reject(new CustomError(message.noSuchAccount, StatusCodes.NOT_FOUND))
            }
            var match = bcrypt.compareSync(password, adminData.password);
            if (match == false) {
                reject(new CustomError(message.WrongPassword, StatusCodes.BAD_REQUEST))
            } else {
                const token: string = jwt.sign({
                    id: adminData.id,
                    role: 'Admin'
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '10d' })
                adminData.set({ token: token });
                await adminData.save();
                adminData.password = undefined;
                adminData.updatedAt = undefined;
                resolve(adminData)
            }

        } catch (err) {
            reject(err)
        }
    });
}

//*********Change Password********* */

function changePassword(body: any, adminId: string, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { password, newPassword } = body;
            const { language } = header;
            const message: any = messages(language);
            const newPass = bcrypt.hashSync(newPassword, 10);
            const admin: any = await adminModel.findOne({ _id: adminId }, { _id: 1, password: 1 })
            if (!admin) {
                reject(new CustomError(message.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const isMatch = await bcrypt.compare(password, admin.password);
                if (isMatch) {
                    await adminModel.updateOne({ _id: admin._id }, { password: newPass }, { new: true })
                    resolve({ status: true })
                } else {
                    reject(new CustomError(message.incorrectOldPass, StatusCodes.BAD_REQUEST))
                }
            }

        } catch (err) {
            console.log(err)
            reject(err)
        }
    });
}





// Export default
export default {
    registerAdmin,
    login,
    changePassword


} as const;