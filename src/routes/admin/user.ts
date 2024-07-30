import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userController from '@controllers/admin/user';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema} from "@validators/auth";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';



// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add: '/add',
    update: '/edit',
    userlist: '/list',
    Detail: '/detail/:id',
    delete: '/delete',
    status: '/status/:id',
    userExceldata: '/user-excelData',
    userView: '/userview/:id',


} as const;


/**
 * @openapi
 * /admin/user:
 *  get:
 *     tags:
 *     - Admin User
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 */

//**** Add****/
// upload.single('image'),
router.post(p.add, schemaValidator(signUpSchema),async (req: any, res: Response) => {
    const data = await userController.addUser(req.body, req.file, req.headers);
    return res.status(CREATED).send({ data, code: CREATED })
});
//**** Edit****/
router.put(p.update, verifyAuthToken, upload.single('image'), checkRole(["Admin"]), async (req: any, res: Response) => {
    const data = await userController.editUser(req.body, req.file, req.headers);
    return res.status(OK).send({ data, code: OK })
});
//**** User List****/
router.get(p.userlist, verifyAuthToken, checkRole(["Admin"]), async (req: Request, res: Response) => {
    const data = await userController.getUsers(req.query, req.headers);
    return res.status(OK).send({ data, code: OK })
});

//*****User Detail**** */
router.get(p.Detail, verifyAuthToken, checkRole(["Admin"]), async (req: Request, res: Response) => {
    const data = await userController.userProfile(req.params.id, req.headers);
    return res.status(OK).send({ data, code: OK })
})

//******** delete********* */

router.post(p.delete, verifyAuthToken, checkRole(["Admin"]), async (req: Request, res: Response) => {
    const data = await userController.deleteUser(req.body, req.params.id, req.headers);
    return res.status(OK).send({ data, code: OK })
});

//******** User Status change**** */
router.put(p.status, verifyAuthToken, checkRole(["Admin"]), async (req: Request, res: Response) => {
    const data = await userController.statusUser(req.body, req.params.id, req.headers);
    return res.status(OK).send({ data, code: OK })
});

//**** User  Excel data****/
router.get(p.userExceldata, async (req: Request, res: Response) => {
    const data = await userController.userExcelList(req.query, req.headers);
    return res.status(OK).send({ data, code: OK })
});

//**** User  View Profile data****/
router.get(p.userView, verifyAuthToken, checkRole(["Admin"]), async (req: Request, res: Response) => {
    const data = await userController.getUsersView(req.params.id, req.headers);
    return res.status(OK).send({ data, code: OK })
});



// Export default
export default router;
