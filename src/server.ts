import { app } from "./app.js";
import http from "http";
import dotenv from 'dotenv';
dotenv.config();

function main() {
  try {
    const server = http.createServer(app);
    server.listen(process.env.PORT || 3000);
    console.log("Server running on port 3000");
  } catch (error) {
    console.log(error); 
  }
}

main();