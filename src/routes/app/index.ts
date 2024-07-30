import { Router } from 'express';
import commonRoute from './common_api';
import userRoute from './user';




// Export the base-router
const baseRouter = Router();

// Setup routers

baseRouter.use('/common', commonRoute)
baseRouter.use('/user', userRoute)


// Export default.
export default baseRouter;
