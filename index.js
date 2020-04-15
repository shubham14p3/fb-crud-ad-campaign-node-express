const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bizSdk = require('facebook-nodejs-business-sdk');
const apiKeys = require('./apikeys.json');
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const accessToken = apiKeys.access_token;
const accountId = apiKeys.ad_account_id;
const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;
const account = new AdAccount(accountId);
let campaigns;
