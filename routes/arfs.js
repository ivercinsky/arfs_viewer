var express = require('express');
var router = express.Router({ mergeParams : true });
var fs = require('fs');
var path = require('path');
/* GET arfs page. */
router.get('/', function(req, res, next) {
    files = fs.readdirSync(path.join(__dirname, "/../public/output/"));    
    res.render('arfs', { title: 'Arfs Page' , files: files});
});

module.exports = router;


/*.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    })*/