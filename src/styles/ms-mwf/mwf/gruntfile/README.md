# Shared Grunt Tasks
## generate-changelogs

__Description:__ Generate changelogs from changelog.json files in modules, components and core.

__Path:__ `staging/generate_changelogs_task.js`

__Dependencies:__

* `generateChangelog`

__Formatting:__
Version names:
Versions are arrays of objects which correspond to the version they are going in

Example: "v1.8.0": []

Changelog item:
A changelog item is an object existing inside of a version.
It corresponds to one line in the changelog, only have one object per ticket.

- The ticket-id should be a number
- The type should be one of:
    - "new" // new options to existing items
    - "changed"
    - "fixed" // bug fixes
    - "reported" // bugs reported
    - "components" // new components
    - "modules" // new modules
- The description should be one line without beginning capitalization and period at the end
- The internal boolean should be set to true if it is not intended for the CHANGELOG.md

Examples:

```
{
    "type": "fixed",
    "ticket-id": 7927320,
    "description": "fixes issue with Video play glyph toggle on autoplay"
}
```

```
{
    "type": "new",
    "ticket-id": 8927340,
    "internal": true,
    "description": "fixes internal issue on modx"
}
```

## schema-validate

__Description:__ Validates a specified component or module.

__Path:__ `staging/validate_schema_task.js`

__Options:__

* Must run `grunt copy:schema_refs` before running this task.
* Must include both the name of the component/module and whether it is a component or module.
* Hbs files in example/ folders are scraped for data 1 level deep. Therefore file data must ALWAYS be one level deep.
    - Example: `{{> code-example c-component-name-code-example.default }}`

__Example:__

`grunt schema-validate:action-trigger:component`

## schema-validate-all

__Description:__ Validates all components and modules in core.

__Path:__ `staging/validate_schema_all_task.js`

__Options:__

* Must run `grunt copy:schema_refs` before running this task.

__Example:__

`grunt schema-validate-all`

# Grunt Task Api documentation

## Staging

```
staging
```

__Description:__ Dependency build task designed to deploy local assets to MODX stage server. 

__Path:__ `staging_task.js`

__Dependencies:__

* `clean-dist-temp`,
* `curl`,
* `convert`,
* `mwf_faker:mdl`,
* `assemble:release_mdl`,
* `sass:mdl`,
* `copy:mdl`,
* `mwf_faker:staging`,
* `assemble:site_staging`,
* `sass:staging`,
* `postcss:temp`,
* `copy:staging`,
* `build-all-partners`,
* `build-core`,
* `cssmin:release`,   // minify css
* `uglify:mwf`,       // minify JS
* `copy:scripts`,     // temp/scripts to /dist/scripts
* `copy:release`, 
* `copy:release_partners`,
* `clean:release`,
* `zip:mwfScriptsPackage`,
* `clean:temp`,
* `notify:stagingBuilt`

```
staging-images
```

__Description:__ Dependency build task designed to deploy local image assets to MODX stage server. 

__Path:__ `staging_images_task.js`

__Dependencies:__

* `clean-dist-temp`,
* `copy:stagingImages`

```
$ grunt staging-deploy-images
```

__Description:__ Build task designed to deploy local image assets to MODX stage server. 

__Path:__ `staging_deploy_images_task.js`

__Dependencies:__

* `staging-images`,
* `sftp-deploy:dist`,
* `notify:stagingDeployedImages`

```
$ grunt staging-deploy
```

__Description:__ Build task designed to deploy local version of MWF dev to MODX stage server. 

__Path:__ `staging/staging_deploy_task.js`

__Dependencies:__

* `clean-dist-temp`,
* `staging`,
* `sftp-deploy:dist`,
* `notify:stagingDeployed`

```
staging-server
```

__Description:__ Stage server and watch task. 

__Path:__ `staging/staging_server_task.js`

__Dependencies:__

* `notify:stagingStarted`,
* `watch:staging`