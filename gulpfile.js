const gulp = require("gulp");
const pathNode = require("path");
const { src, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const minify = require("gulp-minify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const fileinclude = require("gulp-file-include");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const del = require("del");
const exec = require("gulp-run");
const browserSync = require("browser-sync").create();
const fs = require("fs");

const path = {
  build: {
    css: "build/css/",
    js: "build/js/",
    html: "build/",
    img: "build/img/",
    fonts: "build/fonts/",
    libs: "build/libs/",
  },
  src: {
    css: "./src/css/**/*.scss",
    js: "./src/js/**/*.js",
    html: "./src/*.html",
    img: "./src/img/*",
    fonts: "./src/fonts/*",
    libs: "./src/libs/**/*.*",
  },
  watch: {
    css: "./src/css/**/*.scss",
    js: "./src/js/**/**/*.js",
    html: "./src/**/*.html",
    img: "./src/img/**/*.*",
    fonts: "./src/fonts/**/*.*",
    libs: "./src/libs/**/*.*",
  },
};

// compile html files

function compileHtml() {
  return src(path.src.html)
    .pipe(
      fileinclude({
        // fileinclude vasitesiyle src/template icinde olan html dosyalarimiz istediyimiz html fayllarina include edilir ve bir fayl seklinde build klasorune atilir
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(path.build.html));
}

// compile libs
function compileLibs() {
  return src(path.src.libs).pipe(gulp.dest(path.build.libs));
}

// compile css files
function compileCss() {
  return src(path.src.css)
    .pipe(sass())
    .pipe(
      autoprefixer({
        // autoprefixer vasitesiyle cssde istifade edilen prefixleri ozu avtomatik olaraq bizim css kodlarina daxil edir
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        compatibility: "ie8",
      })
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest(path.build.css));
}

// compile js files

function compileJs() {
  return src(path.src.js)
    .pipe(concat("main.js")) // concat vasitesiyle butun js fayllari bir fayl seklinde birlesdirilir  ve  build klasorune atilir
    .pipe(
      babel({
        presets: ["@babel/env"],
        plugins: ["@babel/plugin-proposal-class-properties"],
      })
    )
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest(path.build.js));
}

// compile images and minify images

function imageCompile() {
  return src(path.src.img)
    .pipe(
      imagemin({
        use: [imageminMozjpeg()],
      })
    ) // imagemin vasitesiyle src/img icinde olan butun sekiller resize edilerey olcusu kicildilir
    .pipe(gulp.dest(path.build.img));
}

// fonts compile
function fontCompile(event) {
  return src(path.src.fonts).pipe(gulp.dest(path.build.fonts)); // src/fonts icinde olan butun fontlar build/fonts klasorune atilir
}

// watch my task

function liveServer() {
  browserSync.init({
    server: "build",
    port: 8800,
    ui: {
      port: 7700,
    },
  });
}

const watcher = watch(
  [
    path.src.css,
    path.src.html,
    path.watch.html,
    path.src.js,
    path.src.img,
    path.src.fonts,
    path.src.libs,
  ], // burada istifade edilen fayllarin yolu verilir
  { interval: 100 }, // setInterval task
  parallel(
    compileHtml,
    compileCss,
    compileJs,
    imageCompile,
    fontCompile,
    compileLibs
  )
); // parallel function vasitesiyle butun functionlar parallel olaraq calisir

watcher.on("unlink", function (path, stats) {
  let deletedHtml = path.split("/")[0].split("\\")[
    path.split("/")[0].split("\\").length - 1
  ]; // html faylarinin silinib silinmediyi src icinde kontrol edilir

  let deletedFont = path.split("/")[0].split("\\")[
    path.split("/")[0].split("\\").length - 1
  ];

  let deletedImg = path.split("/")[0].split("\\")[
    path.split("/")[0].split("\\").length - 1
  ];

  (async () => {
    const deletedFilePaths = await del([
      "build/" + deletedHtml,
      "build/fonts/" + deletedFont,
      "build/img/" + deletedImg,
      "!src/template/*.html",
    ]);
  })();
});

watcher.on("change", browserSync.reload);

const directoryPath = pathNode.join(__dirname, "./src/css");

let allCssFiles = [];

watcher.on("change", async function () {
  allCssFiles = [];
  fs.readdir(directoryPath, function (err, files) {
    files.forEach(function (file, i) {
      if (file !== "main.scss") {
        fs.readdir(directoryPath + "/" + file, function (error, splitFiles) {
          splitFiles.forEach(function (replaceFile, index) {
            let rep = replaceFile.replace(".scss", `"`);
            let replaceAll =
              "@import" + ` "` + "./" + file + "/" + rep.replace("_", "") + ";";
            allCssFiles.push(replaceAll);
          });
        });
      }
    });
  });

  fs.readFile("./src/css/main.scss", "utf8", function (err, data) {
    fs.writeFile(
      "./src/css/main.scss",
      allCssFiles.join("").toString(),
      function (err, result) {}
    );
  });
});

exports.default = compileHtml;

exports.default = fontCompile;

exports.default = compileCss;

exports.default = compileJs;

exports.default = imageCompile;

exports.default = compileLibs;

exports.default = series(
  parallel(
    compileHtml,
    compileCss,
    compileJs,
    imageCompile,
    fontCompile,
    compileLibs,
    liveServer
  )
);
