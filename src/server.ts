import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import apiRouter from './routes/app';
import logger from 'jet-logger';
import { CustomError } from '@utils/errors';
import adminRoutesFE from './routes/admin-panel';
import adminRoutesBE from './routes/admin/index';
//import '@utils/redis'
import { connect, disconnect } from '@utils/database';
import '@models/index';
import fs from 'fs'
const cors = require("cors")
import { rateLimit } from 'express-rate-limit'
const apiLimiter = rateLimit({
  //  windowMs: 1 * 60 * 1000, // 1 minutes
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  limit: 10, // Limit each IP to 5 requests per `window` (here, per day)
  message: 'Your free per day limit exceeded. Please try again after 24 hours.',
  // message: `Too many requests from this IP . Please try again later in ${1} minute`,

})
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
const FormData = require('form-data');
import axios from 'axios';
// Constants
const app = express();

//Connect DB
connect();





/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(apiLimiter);  // when you want make limit for perticular time of  a user
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "append,delete,entries,foreach,get,has,keys,set,values,Authorization");
  next();
});

app.use(cors());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api/v1', apiRouter);



// Admin api router
app.use('/api/v1/admin', adminRoutesBE);

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
  logger.err(err, true);
  const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
  return res.status(status).json({
    error: err.message,
    message: err.message,
    code: status
  });
});

/***********************************************************************************
 *                         API route file upload
 **********************************************************************************/
const baseUrlPython = process.env.baseUrlPython
app.post('/uploads', uploads.single('file'), async (req: any, res: any) => {
  const instance = axios.create({
    maxBodyLength: Infinity, // or a specific value in bytes
  });
  if (!req.file) {
    if (req.body.question && req.body.question != null && req.body.question != '' && req.body.file_id && req.body.file_id != null && req.body.file_id != '') {
      const response = await instance.post(`${baseUrlPython}/document_chat/document_chat`, req.body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     return res.status(200).json(response.data);
    } else {
      return res.status(400).send('No file uploaded.');
    }

  }
  const types = req.body.type
  const formData = new FormData();
  formData.append('file', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });
  if (req.file.mimetype === 'application/pdf' && types != 'chat') {
    const response = await instance.post(`${baseUrlPython}/document-for-summary/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    return res.status(200).send(response.data);
  } else if (req.file.mimetype.startsWith('audio/')) {
    const response = await instance.post(`${baseUrlPython}/audio/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    res.send(response.data);
  } else if (req.file.mimetype.startsWith('video/')) {
    const response = await instance.post(`${baseUrlPython}/video/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    res.send(response.data);
  } else if (req.file.mimetype === 'application/pdf' && types === 'chat') {
     const response = await instance.post(`${baseUrlPython}/document_chat/document_chat`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });
    return res.status(200).send(response.data);
  }else {
    return res.status(400).send('File format not supported.');
  }


});
import upload from '@utils/multer'
apiRouter.post('/upload', upload.single('image'), async (req: any, res: Response) => {
  if (req.file) {
    return res.status(StatusCodes.OK).send({ data: { url: req.file.path }, code: StatusCodes.OK, message: 'File uploaded.' })
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Error in file upload',
      message: 'Error in file upload',
      code: StatusCodes.BAD_REQUEST
    })
  }
});
apiRouter.post('/multi-upload', upload.array('image', 10), async (req: any, res: Response) => {
  if (req.files) {
    const urls = req.files.map((it: any) => it.path)
    return res.status(StatusCodes.OK).send({ data: { url: urls }, code: StatusCodes.OK, message: 'Files uploaded.' })
  }
  else
    res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Error in file upload',
      message: 'Error in file upload',
      code: StatusCodes.BAD_REQUEST
    })
});



/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set views dir
const adminViewsDir = path.join(__dirname, 'public/admin/');

app.set('views', [adminViewsDir]);

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Serve admin panel files
app.use('/admin', adminRoutesFE)





// Export here and start in a diff file (for testing).
export default app;