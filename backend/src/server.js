import express from "express"
import cookieParser from "cookie-parser"

const app = express()


// Configuration of app : -

// to accept data in json format
app.use(
    express.json()
)

// to accept data from URL: -
app.use(express.urlencoded({ extended: true }))

// to store the assets
app.use(express.static("public"))

// to perform CRUD operation on cookies: -
app.use(cookieParser())


/* 
*
* routes from routes folder
*
*
*/
export { app };