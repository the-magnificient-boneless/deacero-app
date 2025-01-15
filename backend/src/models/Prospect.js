const mongoose = require("mongoose");

const ProspectSchema = new mongoose.Schema(
  {
    fechaRegistro: { type: Date, default: Date.now },
    nombres: { type: String, required: true },
    apellidoPaterno: { type: String, required: true },
    apellidoMaterno: { type: String, required: true },
    reclutador: {
      type: String,
      enum: ["Alexandra", "Oliverio", "Frida"],
      required: true,
    },
    procedencia: {
      type: String,
      enum: ["Facebook pagado", "Whatsapp", "Otro"],
      required: true,
    },
    estaRevisado: { type: Boolean, required: true },
    tipoPuesto: { type: Number, enum: [1, 2, 3] }, // 1: Elemento de seguridad, 2: LS, 3: Administrativo
    telefono: { type: String, match: /^[0-9]{10}$/, required: true },
    calle: { type: String, required: true },
    numeroExterior: { type: String, maxlength: 7, required: true },
    numeroInterior: { type: String, maxlength: 7 },
    colonia: { type: String, required: true },
    municipio: { type: String, required: true },
    pendiente: { type: Boolean },
    pendiente2: { type: String },
    canalComunicacion: {
      type: String,
      enum: ["Whatsapp", "Facebook", "Email"],
      required: true,
    },
    contestoLlamada: { type: Boolean },
    fechaSeguimiento: { type: Date },
    viewed: { type: Boolean, default: false },
  },
  { strict: false, timestamps: true }
);

module.exports = mongoose.model("Prospect", ProspectSchema);
