import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import authController from '@controllers/user/auth';
import schemaValidator from '@utils/schemaValidator';
import { verifyAuthToken ,checkRole} from "@utils/authValidator";
import { registerAddressSchema } from "@validators/user"




// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    register: '/register',
    addressEdit:'/addressEdit',
    addressList:'/addressList',
    addressDelete:'/addressDelete',
 

} as const;

/**
 * Address register
 */
router.post(p.register,verifyAuthToken,checkRole(['user']), schemaValidator(registerAddressSchema), async (req: any, res: Response) => {
    const data = await authController.addressRegister(req.body ,req.user.id, req.headers);
    return res.status(CREATED).send({ data, code: CREATED});
});

/**
 * Address Edit
 */
router.put(p.addressEdit,verifyAuthToken,checkRole(['user']), schemaValidator(registerAddressSchema), async (req: any, res: Response) => {
    const data = await authController.addressEdit(req.body ,req.user.id, req.headers);
    return res.status(OK).send({ data, code: OK});
});

/**
 * Address List
 */
 router.get(p.addressList,verifyAuthToken,checkRole(['user']), async (req: any, res: Response) => {
    const data = await authController.addressList(req.query,req.user.id,req.headers);
    return res.status(OK).send({ data, code: OK});
});


/**
 * Address Delete
 */
router.delete(p.addressDelete,verifyAuthToken,checkRole(['user']), async (req: any, res: Response) => {
    const data = await authController.addressDelete(req.query,req.user.id,req.headers);
    return res.status(OK).send({ data, code: OK });
});



// Export default
export default router;
