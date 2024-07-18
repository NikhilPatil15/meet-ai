import dotenv from "dotenv"
import { app } from "./server.js"

// Configuration: -
// to use env variables: -
dotenv.config({
    path: "./.env"
})

/*
*
* Database connection function
*
*/

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running at port : ${port} http://localhost:${port}/`))

// to test the server
app.get("/", (req, res)=>{
    res.send("hello this is for testing purpose")
})