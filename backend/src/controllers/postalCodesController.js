const mongoose = require("mongoose");
const PostalCode = require("../models/PostalCode"); // Asegúrate de que esta ruta apunte al modelo correcto
const getPostalCodes = async (req, res) => {
  const { estado, d_codigo, d_CP, municipio, colonia } = req.body; // Incluimos todas las claves posibles

  // Verificamos si el body contiene el campo `municipio` y usamos getAllColonias
  if (estado && municipio && colonia) {
    return await getAllCodigosPostales(req, res);
  }

  if (municipio && estado) {
    return await getAllColonias(req, res);
  }

  // Verificamos si el body contiene el campo `estado` y usamos getAllMunicipios
  if (estado) {
    return await getAllMunicipios(req, res);
  }

  // Si no se proporciona ningún campo válido, retornamos un error
  return res.status(400).json({
    success: false,
    message:
      "El body debe contener al menos 'municipio', 'estado', 'd_codigo', o 'd_CP'",
  });
};
const getAllMunicipios = async (req, res) => {
  const { estado } = req.body; // Obtenemos el estado desde el cuerpo de la solicitud
  console.log(estado);
  if (!estado) {
    return res.status(400).json({ error: "El estado es obligatorio" }); // Si no se proporciona estado, retornamos un error
  }

  try {
    // Buscamos los códigos postales para el estado proporcionado
    const postalCodes = await PostalCode.find({ d_estado: estado }).lean();

    if (postalCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron códigos postales para el estado: ${estado}`,
        data: [],
      });
    }
    const uniqueMunicipios = Array.from(
      new Set(postalCodes.map((item) => item.D_mnpio))
    ).map((municipio) => ({
      label: municipio,
      value: municipio,
    }));

    // Retornamos los códigos postales encontrados
    return res.status(200).json({
      success: true,
      message: `Códigos postales encontrados para el estado: ${estado}`,
      data: { municipios: uniqueMunicipios, colonias: [], codigosPostales: [] },
    });
  } catch (err) {
    console.error(
      "Error al intentar obtener los códigos postales:",
      err.message
    );
    return res
      .status(500)
      .json({ error: "Error interno al procesar la solicitud." });
  }
};

const getAllColonias = async (req, res) => {
  const { estado, municipio } = req.body; // Obtenemos el municipio desde el cuerpo de la solicitud
  if (!municipio) {
    return res.status(400).json({ error: "El municipio es obligatorio" }); // Si no se proporciona municipio, retornamos un error
  }

  try {
    // Buscamos los códigos postales para el municipio proporcionado
    const postalCodes = await PostalCode.find({
      d_estado: estado, // Filtro por estado
      D_mnpio: municipio, // Filtro adicional opcional
    }).lean();

    if (postalCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron códigos postales para el municipio: ${municipio}`,
        data: [],
      });
    }
    const uniqueMunicipios = Array.from(
      new Set(postalCodes.map((item) => item.D_mnpio))
    ).map((municipio) => ({
      label: municipio,
      value: municipio,
    }));
    const uniqueAsentamientos = Array.from(
      new Set(postalCodes.map((item) => item.d_asenta))
    ).map((asentamiento) => ({
      label: asentamiento,
      value: asentamiento,
    }));
    // Retornamos los códigos postales encontrados
    return res.status(200).json({
      success: true,
      message: `Códigos postales encontrados para el municipio: ${municipio}`,
      data: { municipios: uniqueMunicipios, colonias: uniqueAsentamientos },
    });
  } catch (err) {
    console.error(
      "Error al intentar obtener los códigos postales:",
      err.message
    );
    return res
      .status(500)
      .json({ error: "Error interno al procesar la solicitud." });
  }
};
const getAllCodigosPostales = async (req, res) => {
  const { estado, municipio, colonia } = req.body; // Obtenemos el municipio desde el cuerpo de la solicitud
  if (!colonia) {
    return res.status(400).json({ error: "El colonia es obligatorio" }); // Si no se proporciona colonia, retornamos un error
  }

  try {
    // Buscamos los códigos postales para el colonia proporcionado
    const postalCodes = await PostalCode.find({
      d_estado: estado, // Filtro por estado
      D_mnpio: municipio, // Filtro adicional opcional
      d_asenta: colonia,
    }).lean();

    if (postalCodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron códigos postales para el colonia: ${colonia}`,
        data: [],
      });
    }
    const uniqueMunicipios = Array.from(
      new Set(postalCodes.map((item) => item.D_mnpio))
    ).map((municipio) => ({
      label: municipio,
      value: municipio,
    }));
    const uniqueAsentamientos = Array.from(
      new Set(postalCodes.map((item) => item.d_asenta))
    ).map((asentamiento) => ({
      label: asentamiento,
      value: asentamiento,
    }));
    const uniqueCodigosPostales = Array.from(
      new Set(postalCodes.map((item) => item.d_codigo))
    ).map((codigoPostal) => ({
      label: codigoPostal,
      value: codigoPostal,
    }));
    // Retornamos los códigos postales encontrados
    return res.status(200).json({
      success: true,
      message: `Códigos postales encontrados para la colonia: ${colonia}`,
      data: {
        municipios: uniqueMunicipios,
        colonias: uniqueAsentamientos,
        codigosPostales: uniqueCodigosPostales,
      },
    });
  } catch (err) {
    console.error(
      "Error al intentar obtener los códigos postales:",
      err.message
    );
    return res
      .status(500)
      .json({ error: "Error interno al procesar la solicitud." });
  }
};
module.exports = {
  getPostalCodes,
};
