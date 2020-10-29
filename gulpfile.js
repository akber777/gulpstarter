const gulp = require('gulp');
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
livereload = require('gulp-livereload');

var path = {
    build: {
        css: 'build/css/',
        js: 'build/js/',
        html: 'build/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        libs: 'build/libs/'
    },
    src: {
        css: './src/css/**/*.scss',
        js: './src/js/**/*.js',
        html: './src/*.html',
        img: './src/img/*',
        fonts: './src/fonts/*',
        libs: './src/libs/**/*.*'
    },
    watch: {
        css: './src/css/**/*.scss',
        js: './src/js/**/**/*.js',
        html: './src/**/*.html',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*',
        libs: './src/libs/**/*.*'
    },
};






// compile html files

function compileHtml() {
    return src(path.src.html)
        .pipe(fileinclude({ // fileinclude vasitesiyle src/template icinde olan html dosyalarimiz istediyimiz html fayllarina include edilir ve bir fayl seklinde build klasorune atilir
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(livereload())

}


// compile libs

function compileLibs() {
    return src(path.src.libs)
        .pipe(gulp.dest(path.build.libs))
}

// compile css files

function compileCss() {
    return src(path.src.css)
        .pipe(sass())
        .pipe(autoprefixer({ // autoprefixer vasitesiyle cssde istifade edilen prefixleri ozu avtomatik olaraq bizim css kodlarina daxil edir
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(livereload())

}

// compile js files

function compileJs() {
    return src(path.src.js)
        .pipe(concat('main.js')) // concat vasitesiyle butun js fayllari bir fayl seklinde birlesdirilir  ve  build klasorune atilir 
        .pipe(babel({
            presets: ['@babel/env'],
            "plugins": ["@babel/plugin-proposal-class-properties"]
        }))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(livereload());
}

// compile images and minify images

function imageCompile() {
    return src(path.src.img)
        .pipe(imagemin({
            use: [
                imageminMozjpeg()
            ]
        })) // imagemin vasitesiyle src/img icinde olan butun sekiller resize edilerey olcusu kicildilir
        .pipe(gulp.dest(path.build.img))
        .pipe(livereload())
}

// fonts compile
function fontCompile() {
    return src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts)) // src/fonts icinde olan butun fontlar build/fonts klasorune atilir
        .pipe(livereload())
}


function liveReload() {
    return livereload.listen();

}

// watch my task

function watchTask() {

    liveReload();

    watch(
        [path.src.css, path.src.html, path.watch.html, path.src.js, path.src.img, path.src.fonts, path.src.libs], // burada istifade edilen fayllarin yolu verilir
        { interval: 100 }, // setInterval task
        parallel(compileHtml, compileCss, compileJs, imageCompile, fontCompile, compileLibs)); // parallel function vasitesiyle butun functionlar parallel olaraq calisir
}


exports.default = compileHtml;

exports.default = fontCompile;

exports.default = compileCss;

exports.default = compileJs;

exports.default = imageCompile;

exports.default = compileLibs;

exports.default = liveReload;







exports.default = series(
    parallel(compileHtml, compileCss, compileJs, imageCompile, fontCompile, compileLibs),
    watchTask
);
