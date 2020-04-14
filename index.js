const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bizSdk = require('facebook-nodejs-business-sdk');
const apiKeys = require('./apikeys.json');

// init express
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// init Facebook business sdk
const accessToken = apiKeys.access_token;
const accountId = apiKeys.ad_account_id;
const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;
const account = new AdAccount(accountId);
let campaigns;

// Read
app.get('/campaign', (req, res) => {
    let data = []; // for storing data from foreach
    account
        .read([AdAccount.Fields.name])
        .then(account => {
            return account.getCampaigns(
                [
                    Campaign.Fields.name,
                    Campaign.Fields.status,
                    Campaign.Fields.objective,
                    Campaign.Fields.special_ad_category,
                ],
                { limit: 10 },
            ); // add more fileds in array if you want to fetch those fileds details
        })
        .then(result => {
            campaigns = result;
            // if you want to check all the fields available uncomment this. It will useful for adding more fields
            //console.log(campaigns);
            campaigns.forEach(campaign => {
                data.push({
                    id: campaign.id,
                    name: campaign.name,
                    status: campaign.status,
                    objective: campaign.objective,
                    category: campaign.special_ad_category,
                });
            });
            res.status(200).json(data);
        })
        .catch(error =>
            // Send full error message response for debugging
            res.status(400).json({
                status: error.status,
                message: error.message,
                code: error.response.error.code,
                error_subcode: error.response.error.error_subcode,
                fbtrace_id: error.response.error.error_fbtrace_id,
            }),
        );
});

//create
app.post('/campaign', (req, res) => {
    // Require name objective special_ad_category

    if (
        req.query.name &&
        req.query.objective &&
        req.query.special_ad_category
    ) {
        account
            .createCampaign([Campaign.Fields.Id], {
                [Campaign.Fields.name]: req.query.name, // Each object contains a fields map with a list of fields supported on that object.
                [Campaign.Fields.status]: req.query.status,
                [Campaign.Fields.objective]: req.query.objective,
                [Campaign.Fields.special_ad_category]:
                    req.query.special_ad_category,
            })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(error =>
                // Send full error message response for debugging
                res.status(400).json({
                    status: error.status,
                    message: error.message,
                    code: error.response.error.code,
                    error_subcode: error.response.error.error_subcode,
                    fbtrace_id: error.response.error.error_fbtrace_id,
                }),
            );
    } else {
        res.status(400).json({
            message:
                'Bad request make sure name, objective and special_ad_category are available ',
        });
    }
});

// update
app.put('/campaign/:id', (req, res) => {
    if (
        req.query.name &&
        req.query.objective &&
        req.query.special_ad_category
    ) {
        new Campaign(req.params.id, {
            [Campaign.Fields.id]: req.params.id,
            [Campaign.Fields.name]: req.query.name,
            [Campaign.Fields.status]: req.query.status,
            [Campaign.Fields.objective]: req.query.objective,
            [Campaign.Fields.special_ad_category]:
                req.query.special_ad_category,
        })
            .update()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(error =>
                // Send full error message response for debugging
                res.status(400).json({
                    status: error.status,
                    message: error.message,
                    code: error.response.error.code,
                    error_subcode: error.response.error.error_subcode,
                    fbtrace_id: error.response.error.error_fbtrace_id,
                }),
            );
    } else {
        res.status(400).json({
            message:
                'Bad request make sure name, objective and special_ad_category are available ',
        });
    }
});

// delete
app.delete('/campaign/:id', (req, res) => {
    new Campaign(req.params.id)
        .delete()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error =>
            // Send full error message response for debugging
            res.status(400).json({
                status: error.status,
                message: error.message,
                code: error.response.error.code,
                error_subcode: error.response.error.error_subcode,
                fbtrace_id: error.response.error.error_fbtrace_id,
            }),
        );
});

app.get('/', (req, res) => res.json({ message: 'NPM Succesfully Started, This is the first Local host' }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
