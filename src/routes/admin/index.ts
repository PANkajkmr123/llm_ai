import { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';






// Export the base-router
const adminbaseRouter = Router();

// Setup routers
adminbaseRouter.use('/auth', authRouter)
adminbaseRouter.use('/user', userRouter)

// Export default.
export default adminbaseRouter;