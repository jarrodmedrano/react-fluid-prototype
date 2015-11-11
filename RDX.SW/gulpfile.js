var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    concat = require("gulp-concat"),
    rename = require('gulp-rename');

gulp.task('watch', function () {
    gulp.watch('css/**/*.less', ['less']);
});

gulp.task('less', function () {

    return gulp.src('css/**/*.less')
        .pipe(less().on('error', function (err) {
            console.log(err);
        }))
        .pipe(cssmin().on('error', function(err) {
            console.log(err);
        }))
        .pipe(concat('styles.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['less', 'watch']);
