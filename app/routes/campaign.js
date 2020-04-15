module.exports = app => {
  const Campaign = require("../controllers/campaign.js");
  app.get("/campaign", Campaign.getAll);
  app.post("/campaign", Campaign.createCampaign);
  app.delete("/campaign/:id", Campaign.deleteCampaign);
  app.put("/campaign/:id", Campaign.updateCampaign);
};
