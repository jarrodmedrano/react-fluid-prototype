'use strict';

/******
*
*    This is an ASSEMBLE helper.
*    When added to an assemble task, this leverages the assemble
*    API to create a inventory JSON file that can be used as needed. 
*
*
*    inventory: {
*        dest: "",
*        relativeDestination: "",
*        homepage: "",
*        fileName: ""
*    }
*
*
******/

const async = require('async');
const path = require('path');

module.exports = function(params, callback) {
    const assemble = params.assemble;
    const grunt = params.grunt;
    const pages = assemble.options.pages;
    let options = assemble.options.inventory || {};
    let inventory = {};
    let projectPackage = grunt.file.readJSON('package.json');

    options.homepage = options.homepage || projectPackage.homepage;
    options.dest = options.dest || path.dirname(pages[0].dest);
    options.fileName = options.fileName || 'inventory';
    options.buildFlag = options.buildFlag || 'indexedPage';

    inventory[options.fileName] = [];

    // Return the relative destination if the option is enabled
    const getExternalFilePath = function(relativeDestination, file) {
        if (relativeDestination === true) {
            relativeDestination = options.dest;
        }
        return (relativeDestination ? file.dest.replace(relativeDestination + "/", "") : file.dest);
    };

    const url = options.homepage;
    const relativeDestination = options.relativeDestination;

    async.forEach(pages, function(file, next) {
        if (file.data[options.buildFlag]) {
            let temp = {url: `${url}/${getExternalFilePath(relativeDestination, file)}`};

            if(file.data.title) {
                file.filename = file.data.title;
            } else if (file.filename === "index.html") {
                let name = (file.dirname).split('/');
                file.filename = name[name.length - 1];
            } else {
                file.filename = (file.filename).replace(file.ext, '');
            }

            temp.name = (file.filename).split('-').join(' ');

            inventory[options.fileName].push(temp);
            next();
        }
    }, callback());

    grunt.file.write(`${options.dest}/${options.fileName}.json`, JSON.stringify(inventory));
};

module.exports.options = {
    stage: 'render:pre:pages'
};
