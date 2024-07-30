import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import authController from '@controllers/admin/auth';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema ,loginSchema, changePasswordSchema} from "@validators/admin";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    register: '/signup',
    login: '/login',
    changePassword: '/change-password',
   
} as const;

/**
 * Login & SignUp  Admin
 */
router.post(p.register, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await authController.registerAdmin(req.body , req.headers);
    return res.status(CREATED).send({ data , code:CREATED });
});
//***********Login******** */
router.post(p.login,  schemaValidator(loginSchema), async (req: Request, res: Response) => {
    const data = await authController.login(req.body , req.headers);
      // const token: string = jwt.sign({
                //     id: user.id,
                //     role:user.role,
                //     tokenType: 'access'
                // }, process.env.JWT_SECRET_TOKEN, { expiresIn: '5m' })
                res.setHeader('accessToken', data.token);
                res.cookie('accessToken', data.token)
    return res.status(OK).send({data, code: OK})
});
//**********Change Password*********** */
router.post(p.changePassword, verifyAuthToken, checkRole(['Admin']), schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await authController.changePassword(req.body, req.user.id , req.headers);
    return res.status(OK).send({data, code: OK})
});



// Export default
export default router;
