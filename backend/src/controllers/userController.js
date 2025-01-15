const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      password,
      state,
      country,
      position,
      description,
      role,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      secondName,
      lastName,
      secondLastName,
      email,
      password: hashedPassword,
      state,
      country,
      position,
      description,
      role,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  const { image, userId, crop } = req.body;

  console.log("Recibiendo datos de imagen:", image);
  console.log("Recibiendo datos de recorte:", crop);

  if (!image || !userId) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // Actualizar el documento del usuario con la imagen recortada
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image }, // Guardar la imagen recortada como un buffer (o la ruta del archivo)
      { new: true }
    );

    res.status(200).json({
      message: "Imagen subida y recortada con éxito",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    res
      .status(500)
      .json({ error: "Error al procesar la imagen", message: error.message });
  }
};
