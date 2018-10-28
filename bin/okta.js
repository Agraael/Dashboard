const okta = require('@okta/okta-sdk-nodejs');
const env = require("./env");

const client = new okta.Client({
    orgUrl: env.ORG_URL,
    token: env.USER_PROFILE_TOKEN,
});

const middleware = async (req, res, next) => {
    if (req.userinfo) {
        try {
            req.user = await client.getUser(req.userinfo.sub)
        } catch (error) {
            console.log(error)
        }
    }

    next()
};

module.exports = { client, middleware };
