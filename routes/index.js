var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile('../public/index.html', function(error, data)
    {
        res.writeHead(200, {'Content-type':'text/html'});
        res.end(data);
    });
});

module.exports = router;
