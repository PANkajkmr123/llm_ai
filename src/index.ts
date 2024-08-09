import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import server from './server';
const { createServer } = require("http");
import swaggerDocs from './swagger'

// Constants
const serverStartMsg = 'Express server started on port: ',
port = (process.env.PORT || 3000);

const httpServer = createServer(server);
// Start server
httpServer.listen(port, () => {
    logger.info(serverStartMsg + port);
    swaggerDocs(server, port)
    console.log(serverStartMsg + port);
});

