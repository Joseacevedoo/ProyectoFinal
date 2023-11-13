const express = require('express');
const Fotos = require('../models/fotoperfil');
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

// Obtener todas las fotos
router.get('/', async (req, res) => {
  try {
    const fotos = await Fotos.find().sort({ createdAt: 'desc' });
    res.json(fotos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las fotos' });
  }
});

// Obtener una foto por ID
router.get('/:id', async (req, res) => {
  try {
    const foto = await Fotos.findById(req.params.id);
    if (!foto) {
      return res.status(404).json({ error: 'Foto no encontrada' });
    }
    res.json(foto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la foto' });
  }
});

// Crear una nueva foto
router.post('/newfoto', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    let nuevaFoto = new Fotos({
      nuevaFoto: result.secure_url,
      cloudinary_id: result.public_id,
    });
    nuevaFoto.save();
        res.redirect("/")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la foto' });
  }
});

// Actualizar una foto por ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let foto = await Fotos.findById(req.params.id);

    // Eliminar la imagen anterior de Cloudinary
    await cloudinary.uploader.destroy(foto.cloudinary_id);

    // Subir la nueva imagen a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Actualizar los campos del documento con los nuevos valores
    foto.image = result.secure_url;
    foto.cloudinary_id = result.public_id;

    // Guardar el documento actualizado en la base de datos
    await foto.save();

    res.json(foto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la foto' });
  }
});

// Eliminar una foto por ID
router.delete('/:id', async (req, res) => {
  try {
    const foto = await Fotos.findById(req.params.id);

    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(foto.cloudinary_id);

    // Eliminar el documento de la base de datos
    await foto.deleteOne();

    res.json({ message: 'Foto eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
});

module.exports = router;
