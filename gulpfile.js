"use strict";

const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps  = require('gulp-sourcemaps');

const pug = require('gulp-pug');
const data = require('gulp-data');
const fs = require('fs');

const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

const { series, parallel } = gulp

const html = () => {
    return gulp.src('src/*.pug')
        .pipe(data(function(file) {
            return JSON.parse(fs.readFileSync('./src/data/data.json'));
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
}

const styles = () => {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass())
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}

const scripts = () => {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
}

const images = () => {
    return gulp.src(['src/images/**/*.png', 'src/images/**/*.jpg', 'src/images/**/*.svg'])
        .pipe(gulp.dest('build/images'))
        .pipe(browserSync.stream());
}

const cleanBuild = () => {
    return gulp.src('build', {read: false})
        .pipe(clean());
}

const watch = () => {
    gulp.watch('src/*.pug', html)
    gulp.watch('src/styles/**/*.scss', styles)
    gulp.watch('src/js/**/*.js', scripts)
    gulp.watch('src/images/**/*.*', images)
}


const server = () => {
    browserSync.init({
        server: {
            baseDir: "build/"
        },
        port: 5000,
        open: true
    })
}


exports.dev = series(
    cleanBuild,
    parallel(html, styles, scripts, images),
    parallel(watch, server)
)
