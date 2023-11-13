const mongoose = require("mongoose");


const fotosSchema = new mongoose.Schema({
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

},
  { versionKey: false }
);


module.exports = mongoose.model("Fotos", fotosSchema)