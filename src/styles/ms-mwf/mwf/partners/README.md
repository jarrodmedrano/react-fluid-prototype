# Partner configuration

## Config.json
* build - boolean for building this on partner-deploy
* layout - specifies layouts file, this should be "templates/layouts/base.hbs"
* mwf - boolean for including the mwf styles
* uhf - boolean for including the uhf styles
* ie8 - boolean for generating a separate stylesheet for ie8
* theme - object for containing various themes for the partner

example:
{
    "build": true,
    "layout": "templates/layouts/base.hbs",
    "mwf": true,
    "uhf": true,
    "ie8": false,
    "theme": {
        "default": true,
        "alt": false
    }
}

## base.hbs
* layout - use ./core/templates/layouts/base.hbs unless other base layout is required
* partner - partner name
* ticket - keep as false, this is used to replace with ticket numbers on staging-deploy eg. grunt staging-deploy --ticket=2340573
* ie8 - boolean for adding in the markup a generated css file for ie8
* theme-init - which theme this can default to when loading the pages
* theme-default - boolean for including a default theme
* theme-alt - boolean for including an alternative theme

example:
---
layout: ./core/templates/layouts/base.hbs
partner: example
ticket: false
ie8: false
theme-init: default
theme-default: true
theme-alt: false
---

## Folder structure

|--templates
|  |--components
|  |--modules
|  |--layouts
|     |--base.hbs
|--styles
|--images
|--fonts
|--config.json