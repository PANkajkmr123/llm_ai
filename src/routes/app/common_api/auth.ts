import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import commonAuthController from '@controllers/common_api/auth';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema, accountVerificationSchema, logInSchema } from "@validators/auth"
import { verifyAuthToken ,checkRole} from "@utils/authValidator";




// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/login',
    signUp: '/sign-up',
    check: '/check-account',
    logout: '/logout'

} as const;

/**
 * User SignUp
 */
router.post(p.signUp, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await commonAuthController.signUp(req.body , req.headers ,req.ip);
    return res.status(CREATED).send({ data, code: CREATED});
});

/**
 * Mark account Verified
 */
router.post(p.check, schemaValidator(accountVerificationSchema), async (req: Request, res: Response) => {
    const data = await commonAuthController.checkAccount(req.body , req.headers);
    return res.status(OK).send({ data, code: OK });
});

/**
 * User Login
 */
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await commonAuthController.login(req.body, req.headers, req.ip);
    return res.status(OK).send({ data, code: OK });
});

/**
 * User Logout
 */
 router.get(p.logout, async (req: Request, res: Response) => {
    const data = await commonAuthController.logOut(req.headers);
    return res.status(OK).send({ data, code: OK });
});
// Export default
export default router;
