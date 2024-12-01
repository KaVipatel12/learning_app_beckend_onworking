require("dotenv").config({path: "./.env" })
// Requiring all the modules 
const express = require("express")
const app = express(); 
const path = require('path');
const cookieParser = require("cookie-parser")
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cors = require("cors"); 
const connectDb = require("./Utils/db")
const PORT = process.env.PORT || 8000 


// Requiring all the router modules 
const authRouter = require("./Routers/authRouter")
const providerRouter = require("./Routers/providerRouter")
const studentRouter = require("./Routers/studentRouter")

// Requiring all the middleware modules 
const errorMiddleware = require("./Middlewares/errorMiddleware")

// Middlewares
app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: ['https://yourfrontenddomain.com'],  // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent
}));

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));


// Routers
app.use("/api/auth", authRouter)
app.use("/api/course", providerRouter)
app.use("/api", studentRouter)


app.use(errorMiddleware)
connectDb().then(()=>{
    app.listen( PORT,()=>{
        console.log("App is listened on the port 8000")
    })
})
