"use strict"
require('../helpers/pathUpdates')();
var grunt = require('grunt');

// Replace MWF tokens in the CSS during the copy processes.
// And deal with content that has @import url('renamed file').
function contentReplacement (content, srcpath) {
    // Add the version Banner into the CSS
    // and, deal with poorly named blessed files.
    // Note: if we ever get to the state of having 2 blessed files, we'll need to deal with that.
    content = content.replace('%versionBanner%', grunt.config.get('versionBanner')).
                      replace('.min-blessed1', '-blessed1.min');
    
    return grunt.option('release')
                ? content.replace(/(-ltr-)|(-rtl-)/, '-')
                : content;
};

module.exports = {
    cdncss: {
        files: [
            {
                expand: true,
                flatten: true,
                cwd: "dist/css",
                src: "*.*",
                dest: "dist/ttl/long/css"
            },
            {
                expand: true,
                flatten: true,
                cwd: "core/styles/localization",
                src: "localization.json",
                dest: "dist/ttl/short"
            }
        ]
    },
    cdnfonts: {
        files: [{
            expand: true,
            flatten: true,
            cwd: "core/fonts/",
            src: "**/*.*",
            dest: "dist/ttl/long/fonts"
        }]
    },
    cdnpartnerstatics: {
        files: [
            {
                expand: true,
                cwd: 'partners/manifests/long/' + grunt.option('deployPartnerStatics'),
                src: "**/*",
                dest: "dist/ttl/long/"
            }
        ]
    },
    cdnmanifests: {
        files: [
            {
                expand: true,
                cwd: 'partners/manifests/short',
                src: "**/*.json",
                dest: "dist/ttl/short/"
            }
        ]
    },
    cdnscripts: {
        files: [
            {
                expand: true,
                flatten: true,
                cwd: 'dist/scripts/',
                src: "{mwf,mwf-auto-init,mwf-with-mocks,uhf}/bundle/**/*.js",
                dest: "dist/ttl/long/scripts"
            }
        ]
    },
    core: {
        files: [
            {
                expand: true,
                cwd: "core/",
                src: "templates/{components,modules}/**/test/{images,videos}/*.*",
                dest: "dist/core/",
                rename: removeTestFromPath
            }
        ]
    },
    css: {
        files: [
            {
                expand: true,
                cwd: 'temp/css/',
                src: "**/*.css",
                dest: "dist/css",
                rename: function (dest, src) {
                    var path = require('path');
                    var name = grunt.option('release')
                        ? path.join(dest, src.replace(/(ltr-)|(rtl-)/, ''))
                        : path.join(dest, src);

                    // deal with poorly named minified blessed files
                    return name.replace('.min-blessed1', '-blessed1.min');
                }
            }
        ],
        options: {
            process: function(content, srcpath) { return contentReplacement(content, srcpath) }
        }
    },
    devToolBar: {
        files: [
            {
                src: "core/scripts/test/dev-toolbar.js",
                dest: "dist/scripts/dev-toolbar.js"
            }
        ]
    },
    fixturesCss: {
        expand: true,
        files: [{
            expand: true,
            cwd: 'temp/css/',
            src: "**/*.css",
            dest: "js-test-files/fixtures/css/"
        }]
    },
    fixturesFonts: {
        expand: true,
        files: [{
            expand: true,
            cwd: 'core/fonts/',
            src: "**/*.*",
            dest: "js-test-files/fixtures/fonts/"
        }]
    },
    fixturesHtml: {
        files: [
            {
                expand: true,
                flatten: true,
                cwd: 'dist/core/',
                src: [
                    'templates/{components,modules}/**/fixtures/*.html',
                    'scripts/**/fixtures/*.html'
                ],
                dest: 'js-test-files/fixtures/'
            }
        ]
    },
    fonts: {
        files: [
            {
                expand: true,
                flatten: true,
                cwd: "core/fonts/",
                src: "**/*.*",
                dest: "dist/fonts"
            },
        ]
    },
    images: {
        files: [
            {
                expand: true,
                cwd: "core/images/",
                src: "**/*.*",
                dest: "dist/images"
            },
        ]
    },
    mdl: {
        files: [
            {
                expand: true,
                cwd: 'partners/MDL/',
                src: "templates/{components,modules,pages}/**/{fonts,images,videos}/*.*",
                dest: "dist/partners/MDL/"
            }
        ]
    },
    partner: {
        files: [
            {
                expand: true,
                cwd: "partners/<%= partner %>/",
                src: [
                    "templates/{components,modules,pages}/**/{assets,fonts,images,resources,videos}/*.*",
                    "node_modules/**/*.*"
                ],
                dest: "dist/partners/<%= partner %>/",
                rename: removeTestFromPath
            }
        ]
    },
    postcss: {
        files: [
            {
                expand: true,
                flatten: true,
                src: 'temp/css/{ie8,ie9,default}/*.css',
                dest: 'temp/css'
            }
        ]
    },
    release: {
        files: [
            {
                expand: true,
                cwd: 'dist/core/',
                src: '**/*.*',
                dest: 'dist/releases/core/',
                rename: removeTestFromPath
            },
            {
                expand: true,
                cwd: 'core/',
                src: '**/schema/*.json',
                dest: 'dist/releases/core/'
            }
        ]
    },
    release_partners: {
        files: [
            {
                expand: true,
                cwd: 'dist/partners/',
                src: '**/*.*',
                dest: "dist/releases/partners/"
            },
            {
                expand: true,
                cwd: 'partners/',
                src: '**/{fonts,images,resources,videos}/*.*',
                dest: "dist/releases/partners/"
            }
        ]
    },
    schema_refs: {
        files: [
            {
                expand: true,
                flatten: false,
                cwd: 'core/templates',
                src: '{components,modules}/**/schema/**/*.json',
                dest: 'temp/schema/references/refs'
            }
        ]
    },
    scripts: {
        files: [
            {
                expand: true,
                cwd: 'temp/scripts/',
                src: '**/*.js',
                dest: 'dist/scripts'
            },
            {
                expand: true,
                cwd: 'core/scripts/vendor/',
                src: '*.js',
                dest: 'dist/scripts/vendor'
            },
        ]
    },
    staging: {
        files: [
            {
                expand: true,
                cwd: 'partners/modx/scripts',
                src: "**/*",
                dest: "dist/local/scripts"
            },
            {
                expand: true,
                cwd: 'temp/local',
                src: '**/*',
                dest: 'dist/local'
            },
            {
                expand: true,
                cwd: 'core/scripts/vendor',
                src: '*.js',
                dest: 'dist/local/scripts/vendor'
            },
            {
                expand: true,
                cwd: 'partners/modx/videos',
                src: "**/*",
                dest: "dist/videos"
            }
        ]
    },
    stagingImage: {
        files: [{
            expand: true,
            cwd: 'partners/modx/images',
            src: "**/*",
            dest: "dist/images"
        }]
    },
    uhf_images_for_cdn: {
        files: [
            {
                expand: true,
                cwd: 'partners/uhf/images',
                src: '**/*.*',
                dest: 'dist/images/'
            }
        ]
    },
    vendor: {
        files: [
            {
                src: 'node_modules/picturefill/dist/picturefill.min.js',
                dest: 'core/scripts/vendor/picturefill.min.js'
            },
            {
                src: 'node_modules/normalize.css/normalize.css',
                dest: 'core/styles/_normalize.scss'
            }
        ]
    }
}
