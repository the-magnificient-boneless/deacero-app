const { Prospect } = require("../models");

exports.createProspect = async (req, res) => {
  try {
    const { nombres, apellidoPaterno, apellidoMaterno } = req.body; // Destructure relevant fields

    const newProspect = new Prospect(req.body);
    await newProspect.save();

    // Get all not viewed prospects (new prospects)
    const notViewedProspects = await Prospect.find({ viewed: false }).sort({
      fechaRegistro: -1,
    });

    // Emit event to all connected clients
    req.io.emit("entityCreated", {
      message: `${nombres} ${apellidoPaterno} ${apellidoMaterno}, se ha postulado.`, // Construct the message
      prospect: newProspect,
      newProspects: notViewedProspects, // Include new prospects
    });

    res.status(201).json(newProspect);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProspect = async (req, res) => {
  try {
    const updatedProspect = await Prospect.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProspect);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all prospects
exports.getAllProspects = async (req, res) => {
  try {
    const prospects = await Prospect.find().sort({ fechaRegistro: -1 }); // Retrieve all prospects from the DB
    //const prospects = await Prospect.find(); // Retrieve all prospects from the DB
    res.status(200).json(prospects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
