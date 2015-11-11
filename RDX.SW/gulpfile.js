var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-cssmin'),
    concat = require("gulp-concat"),
    rename = require('gulp-rename');

gulp.task('watch', function () {
    gulp.watch('src/less/**/*.less', ['less']);
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
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['less', 'watch']);