const express = require ('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const methodOverride = require('method-override')

const postRouter = require("./routes/posts");
const Post = require('./models/post');

const rutita = require('path');


app.set("view engine", "ejs");


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use('/',postRouter)
app.use(cors());
app.use("/public", express.static(rutita.join(__dirname,'./public')))
app.use('/posts', require('./routes/posts'))

app.get("/", async (req, res) => {
    const posteos = await Post.find().sort({ createdAt: "desc" });
    res.render("index", { post: posteos });
})

//Initializations


//Settings
app.set('views',rutita.join(__dirname,'views'))















//MongoDB connection
mongoose
.connect(process.env.MONGODB_URI)
.then(()=> console.log('Conectado a Base de datos MONGODB Atlas'))
.catch((err)=> console.error(err));

//Listen
app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`))