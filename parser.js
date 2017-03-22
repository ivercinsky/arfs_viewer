var fs = require('fs-extra');
var path = require('path');
var parse = require('xml-parser');
var xml2js = require('xml2js');
var async = require('async');

var dirPath = process.env.ARFS_PATH + "/"; //provice here your path to dir
var outputPath = process.env.OUTPUT_PATH;
var globalFilesPath = [];

function parseArfs() {
    console.log("Parsing...");
    fs.readdir(dirPath, readDirectory);
}

function readDirectory(err, filesPath) {
    if (err) throw err;
    globalFilesPath = getFilePaths(dirPath, filesPath);
    async.map(globalFilesPath, readFile, processFiles);
}

function readFile(filePath, cb) {
    fs.readFile(filePath, 'utf8', cb);
}
function getFilePaths(dirPath, filesPath) {
    return filesPath.map(function(filePath){ //generating paths to file
        return dirPath + filePath;
    });   
}
function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
    return true;
    }
    //ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname, 0755);
}

/*
* Right now it only works for an specific arf. 
* We need to modify the extractData and groupByRecordId so that it works with no assumtions
*/
function processFiles(err, filesData) {
        var parsed = filesData.map((arf) => {
            return parse(arf);
        })
        var joined = globalFilesPath.map((file, index) => {
            return {fileName: file, data: extractData(parsed[index])};
        })

        var grouped = groupByRecordId(joined);
        writeArfs(grouped);
}

/*
* Right now it only works for an specific arf. 
* We need to modify the extractData and groupByRecordId so that it works with no assumtions
*/
function groupByRecordId(array) {
    var idsMap = new Map();
    array.map((arf) => {
        var recordId = arf.data.CodigoDeOperacion;
        if(idsMap.has(recordId)) {
            idsMap.get(recordId).push(arf);
        } else {
            idsMap.set(recordId, [arf]);
        }
    });
    return idsMap;
}

/*
* Right now it only works for an specific arf. 
* We need to modify the extractData and groupByRecordId so that it works with no assumtions
*/
function extractData(arf) {
    var props = new Object;
    arf.root.children[0].children[0].children.map((node) => {
        var key = node.name;
        var data = node.content;
        props[key]=data;
    })
    return props;
}
function writeArfs(arfsMap) {
    fs.removeSync(__dirname+'/'+outputPath);       
    ensureDirectoryExistence(__dirname+"/"+outputPath+"/a");            
    arfsMap.forEach((arfs, key) => {
        arfs.map((arf) => {
            var fileName = arf.fileName.split("/")[1].split(".")[0]+".xml";
            var savePath = __dirname+"/"+outputPath+"/"+key+"/"+fileName;
            ensureDirectoryExistence(savePath);
            fs.readFile(arf.fileName, 'utf8', function(err, result) {
                fs.writeFile(savePath, result, function(err) {
                    if(err) {
                        return console.log(err);
                    }            
                });
            });            
        });
    });
    console.log("Done!");
}


module.exports = {
    parse : parseArfs
}