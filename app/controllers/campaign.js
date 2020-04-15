const bizSdk = require("facebook-nodejs-business-sdk");
const apiKeys = require("../../apikeys.json");
const accessToken = apiKeys.access_token;
const accountId = apiKeys.ad_account_id;
const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;
const account = new AdAccount(accountId);

let campaigns;

exports.getAll = (req, res) => {
  let data = []; 
  account
    .read([AdAccount.Fields.name])
    .then(account => {
      return account.getCampaigns(
        [
          Campaign.Fields.name,
          Campaign.Fields.status,
          Campaign.Fields.objective,
          Campaign.Fields.special_ad_category
        ],
        { limit: 10 }
      ); 
    })
    .then(result => {
      campaigns = result;
      console.log(campaigns);
      campaigns.forEach(campaign => {
        data.push({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          objective: campaign.objective,
          category: campaign.special_ad_category
        });
      });
      res.status(200).json(data);
    })
    .catch(error =>
        res.status(400).json({
        status: error.status,
        message: error.message,
        code: error.response.error.code,
        error_subcode: error.response.error.error_subcode,
        fbtrace_id: error.response.error.error_fbtrace_id
      })
    );
};

exports.createCampaign = (req, res) => {
  if (req.query.name && req.query.objective && req.query.special_ad_category) {
    account
      .createCampaign([Campaign.Fields.Id], {
        [Campaign.Fields.name]: req.query.name, 
        [Campaign.Fields.status]: req.query.status,
        [Campaign.Fields.objective]: req.query.objective,
        [Campaign.Fields.special_ad_category]: req.query.special_ad_category
      })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error =>
        res.status(400).json({
          status: error.status,
          message: error.message,
          code: error.response.error.code,
          error_subcode: error.response.error.error_subcode,
          fbtrace_id: error.response.error.error_fbtrace_id
        })
      );
  } else {
    res.status(400).json({
      message:
        "Bad request, kindly visit Graph Marketing Api for more details."
    });
  }
};

exports.updateCampaign = (req, res) => {
  if (req.query.name && req.query.objective && req.query.special_ad_category) {
    new Campaign(req.params.id, {
      [Campaign.Fields.id]: req.params.id,
      [Campaign.Fields.name]: req.query.name,
      [Campaign.Fields.status]: req.query.status,
      [Campaign.Fields.objective]: req.query.objective,
      [Campaign.Fields.special_ad_category]: req.query.special_ad_category
    })
      .update()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(error =>
        res.status(400).json({
          status: error.status,
          message: error.message,
          code: error.response.error.code,
          error_subcode: error.response.error.error_subcode,
          fbtrace_id: error.response.error.error_fbtrace_id
        })
      );
  } else {
    res.status(400).json({
      message:
        "Bad request, kindly visit Graph Marketing Api for more details."
    });
  }
};

exports.deleteCampaign = (req, res) => {
  new Campaign(req.params.id)
    .delete()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error =>
     res.status(400).json({
        status: error.status,
        message: error.message,
        code: error.response.error.code,
        error_subcode: error.response.error.error_subcode,
        fbtrace_id: error.response.error.error_fbtrace_id
      })
    );
};
