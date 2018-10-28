const express = require('express');
const { startCase } = require('lodash');

const router = express.Router();

router.get('/', function (req, res, next) {

    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user,
        dashboard: 'true',
        google_sign : require('../bin/widgets/google').clientId
    })
});

module.exports = router;
