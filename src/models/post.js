const mongoose = require("mongoose");
const { marked } = require('marked');
const slugify = require('slugify'); 
const { JSDOM } = require("jsdom");
const createDOMPurify = require('dompurify');
const DOMPurify = createDOMPurify(new JSDOM().window);

const posteosSchema = new mongoose.Schema({
  nameUser: {
    type: String,
    //required: true
  },
  
  userAccount: {
    type: String,
  },
  publicationDescription:{
    type:String,
  },
  
  image: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  
  createdAt: {
    type:Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
},
  { versionKey: false }
);

posteosSchema.pre("validate", function (next) {
  if (this.nameUser) {
    this.slug = slugify(this.nameUser, { lower: true, strict: true })
  }

  if(this.publicationDescription){
    this.sanitizedHtml = DOMPurify.sanitize(marked(this.publicationDescription))
  }

  next();
})


module.exports = mongoose.model("Posteo", posteosSchema)