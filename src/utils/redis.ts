const redis = require("redis");
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
//redis client
const redisClient = redis.createClient({ 
  host: host,
  port: port,
 });
 //redis function to connect
 const connect=() => {
  try{
    redisClient.on("error", (error:any) => console.error(`Ups : ${error}`));
    redisClient.connect().then(()=>{
      console.log(`Connected resdis on ${port} port`)
    })
  }
  catch(err){
   console.log("Error connecting Redis client",err)
  };
}
//calling connect function
connect()

// Export
export=redisClient

