const { Dashboard } = require("../models");
const pathFind = require("../utils/path");
const { upsertCode } = require("../controllers/codeController");
const path = require("path");

exports.upsertDashboard = async (req, res) => {
  try {
    // Extract search parameters from the request body
    const { signedOff, entity } = req.body;
    const userId = signedOff?.user_id; // Ensuring exact key names
    const entityType = entity?.type;
    const entityName = entity?.attributes?.name;
    const hashUtil = req.context.utils.hash;
    let action, statusCode, message;
    const file = __filename;
    const method = "upsertDashboard";

    // Define filter criteria for upsert
    const filter = {
      "signedOff.user_id": userId,
      "entity.type": entityType,
      "entity.attributes.name": entityName,
    };

    // Validate required fields
    if (!userId || !entityType || !entityName) {
      message =
        "Missing required search parameters: signedOff.user, entity.type, or entity.attributes.name";
      return res.status(400).json({
        error: message,
      });
    }

    // FIND FIRST TO HELP TO DEFINE DATA
    const existingDashboard = await Dashboard.findOne(filter);

    // Upsert operation to update or create if document doesn't exist
    const updatedDashboard = await Dashboard.findOneAndUpdate(
      filter,
      req.body,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (existingDashboard) {
      action = "inserted";
      message = `Document was ${action}`;
      statusCode = 200;
    } else {
      action = "updated";
      statusCode = 201;
      message = `Document was ${action}`;
    }

    const newCodeId = await upsertCode(
      file,
      method,
      action,
      statusCode,
      message
    );
    const dataEncrypted = hashUtil.encrypt(updatedDashboard.toObject());
    res.status(statusCode).json({
      code: newCodeId,
      statusCode,
      data_response: dataEncrypted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findDashboard = async (req, res) => {
  try {
    // Extract search parameters from the request body
    const { signedOff, entity } = req.body;
    const userId = signedOff?.user_id; // Ensuring exact key names
    const entityType = entity?.type;
    const entityName = entity?.attributes?.name;
    let action, statusCode, message, dataEncrypted;
    const hashUtil = req.context.utils.hash;
    const file = __filename;
    const method = "findDashboard";

    // Define filter criteria for searching
    const filter = {
      "signedOff.user_id": userId,
      "entity.type": entityType,
      "entity.attributes.name": entityName,
    };

    // Validate required fields
    if (!userId || !entityType || !entityName) {
      return res.status(400).json({
        error:
          "Missing required search parameters: signedOff.user, entity.type, or entity.attributes.name",
      });
    }

    // Log filter for debugging purposes
    console.log("Filter criteria:", filter);

    // Find the document that matches the filter
    const dashboard = await Dashboard.findOne(filter);

    if (dashboard) {
      action = "found";
      message = `Document was ${action}`;
      statusCode = 200;
      dataEncrypted = hashUtil.encrypt(dashboard.toObject());
    } else {
      action = "not found (fallback)";
      message = `Document was ${action}`;
      const fallback = {
        entity: {
          type: "Panel",
          attributes: {
            name: "Dashboard",
          },
        },
        payload: {
          nodes: [],
          edges: [],
          viewport: {
            x: 1397.5,
            y: 190.6488037109375,
            zoom: 1,
          },
        },
      };
      statusCode = 200; // 200 we respond with fallback
      dataEncrypted = hashUtil.encrypt(fallback);
    }

    const newCodeId = await upsertCode(
      file,
      method,
      action,
      statusCode,
      message
    );
    res.status(statusCode).json({
      code: newCodeId,
      statusCode,
      data_response: dataEncrypted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
