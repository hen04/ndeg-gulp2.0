"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const pug = require('gulp-pug');
const data = require('gulp-data');

const fs = require('fs');

const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const squoosh = require('gulp-libsquoosh');

const del = require('del');
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
	return  gulp.src("src/styles/**/*.scss")
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass({
			quietDeps: true
		}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest("build/css"))
		.pipe(browserSync.stream());
}

const scripts = () => {
	return gulp.src('src/js/**/*.js')
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.stream());
}

const fonts = () => {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts/'))
		.pipe(browserSync.stream());
}

const images = () => {
	return gulp.src("src/images/**/*.+(png|jpg|gif|svg)")
		.pipe(gulp.dest("build/images/"))
		.pipe(browserSync.stream());
}

const imagesProd = () => {
	return gulp.src("src/images/**/*.+(png|jpg|gif|svg)")
		.pipe(squoosh())
		.pipe(gulp.dest("build/images/"))
		.pipe(browserSync.stream());
}

const cleanBuild = () => {
	return del('build/**', {force:true});
}

const watcher = () => {
	gulp.watch('src/**/*.pug', html)
	gulp.watch('src/styles/**/*.scss', styles)
	gulp.watch('src/js/**/*.js', scripts)
	gulp.watch('src/fonts/*.*', fonts)
	gulp.watch('src/images/**/*.*', images)
}


const server = () => {
	browserSync.init({
		server: {
			baseDir: "build/"
		},
		port: 3000,
		open: true
	})
}

exports.dev = series(
	parallel(html, styles,  scripts, fonts, images),
	parallel(watcher, server)
)

exports.prod = series(
	cleanBuild,
	parallel(html, styles,  scripts, fonts, imagesProd),
)
