var express = require('express');
var router = express.Router({ mergeParams : true });
var fs = require('fs');
var path = require('path');
var url = require('url');
/* GET arfs page. */
router.get('/', function(req, res, next) {
    console.log(req.params);
    var dir = req.params.dir;
    files = fs.readdirSync(path.join(__dirname, `/../public/output/${dir}`));
    res.render('arf', { title: 'Arf Page' , dir: dir, files: files});
});

module.exports = router;


/*.map(function (file) {
        return path.join(p, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    })*/