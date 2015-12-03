var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    concat = require("gulp-concat"),
    rename = require('gulp-rename');
    browserSync = require('browser-sync').create();

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['less'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('less', function () {
    return gulp.src('src/less/package/package.less')
        .pipe(sourcemaps.init())
        .pipe(less().on('error', function (err) {
            console.log(err);
        }))
        .pipe(cssmin().on('error', function(err) {
            console.log(err);
        }))
        .pipe(concat('styles.css'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['less', 'watch']);