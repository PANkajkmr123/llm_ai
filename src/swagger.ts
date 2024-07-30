import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const path = require('path');


const options:any = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test project API',    // Project Name
      description: 'Example of project API ',  // Project description
      version: '1.0.0',      // Version of api
      contact: {
        name: "Pankaj Kumar", // your name
        email: "pankaj.2021.co", // your email
        url: "tecorb.com", // your website
      },
    },
    
  },
  apis: [
    './src/routes/admin/user.ts',
    // './src/routes/category.ts',
    // './src/routes/explore.ts',
    // Add more routes as needed
  ],
 }

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app:any, port:any) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  app.get('/docs.json', (req:any, res:any) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  console.info(`Docs available at http://localhost:${port}/docs`)
}

export default swaggerDocs ;

