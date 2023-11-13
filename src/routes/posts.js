const express = require('express');
const Post = require('../models/post');
const router = express.Router()
const cloudinary = require("../utils/cloudinary")
const upload = require( "../utils/multer")

router.get('/new', (req, res) => {
    res.render("new", { post: new Post() })
})


//Filtrar Usuario
router.get('/user', async (req, res) => {
    try {
        const nameUser = req.query.nameUser;
        const posts = await Post.find({ nameUser: nameUser });

        res.render('userPosts', { posts: posts, searchedUser: nameUser });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});


router.get("/edit/:id", async(req, res)=>{
    const post = await Post.findById(req.params.id);
    res.render("edit", {post: post})
})



router.post('/new', upload.single("image"), async (req, res) => {
    

    try{
        const result = await cloudinary.uploader.upload(req.file.path);

        let post = new Post({
            nameUser: req.body.nameUser,
            userAccount: req.body.userAccount,
            publicationDescription: req.body.publicationDescription,
            
            image: result.secure_url,
            cloudinary_id: result.public_id
        });

        // Guardamos en DB
        post.save();
        res.redirect("/")


    }catch(err){
        console.log(err);
    }
    
})

router.put("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        // Eliminar la imagen anterior de Cloudinary
        await cloudinary.uploader.destroy(post.cloudinary_id);

        // Subir la nueva imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Actualiza solo los campos que han cambiado
        post.nameUser = req.body.nameUser || post.nameUser;
        post.userAccount = req.body.userAccount || post.userAccount;
        post.publicationDescription = req.body.publicationDescription || post.publicationDescription;
        post.image = result.secure_url;
        post.cloudinary_id = result.public_id;

        // Guarda los cambios en la base de datos
        await post.save();

        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});



/*router.put('/edit/:id', async (req, res, next) => {
    try {
        req.post = await Post.findById(req.params.id)
        next()
    } catch (err) {
        console.log(err)
    }
},
savePostAndRedirect("edit")
)*/


router.delete("/:id", async(req, res)=>{
    try{
        let post = await Post.findById(req.params.id);

        await cloudinary.uploader.destroy(post.cloudinary_id);

        await post.deleteOne();

        res.redirect("/")
    }catch (err) {
        console.log(err)
    }
})

/*function savePostAndRedirect(path) {
    return async (req, res) => {
        let post = req.post;
        post.nameUser = req.body.nameUser;
        post.userAccount = req.body.userAccount;
        post.publicationDescription = req.body.publicationDescription;
        

        try {
            // Guardamos en DB
            post = await post.save();
            res.redirect(`/${post.slug}`)
        }catch(e){
            res.render(`/${path}`, {post: post})
        }
    }

}*/


module.exports = router;