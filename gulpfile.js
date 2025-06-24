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
const del = require("del");
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


let isUpdating = false;
let updateTimeout = null;

// compile html files
function compileHtml() {
  return src(path.src.html)
    .pipe(
      fileinclude({
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
    .pipe(concat("main.js"))
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
    )
    .pipe(gulp.dest(path.build.img));
}

// fonts compile
function fontCompile(event) {
  return src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
}


function updateScssImports() {
  if (isUpdating) return;

  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  updateTimeout = setTimeout(() => {
    isUpdating = true;

    const directoryPath = pathNode.join(__dirname, "./src/css");
    let allCssFiles = [];

    try {
      const files = fs.readdirSync(directoryPath);

      files.forEach(function (file) {
        if (file !== "main.scss" && fs.statSync(pathNode.join(directoryPath, file)).isDirectory()) {
          const subFiles = fs.readdirSync(pathNode.join(directoryPath, file));

          subFiles.forEach(function (replaceFile) {
            if (replaceFile.endsWith('.scss')) {
              let rep = replaceFile.replace(".scss", "");
              let replaceAll = `@import "./${file}/${rep.replace("_", "")}";\n`;
              allCssFiles.push(replaceAll);
            }
          });
        }
      });


      const currentContent = fs.readFileSync("./src/css/main.scss", "utf8");
      const newContent = allCssFiles.join("");


      if (currentContent !== newContent) {
        fs.writeFileSync("./src/css/main.scss", newContent);
      }

    } catch (error) {
      console.error("SCSS imports güncellenirken hata:", error);
    }

    setTimeout(() => {
      isUpdating = false;
    }, 500);

  }, 300); // 300ms debounce
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


function watchFiles() {

  watch([path.src.html, path.watch.html], { interval: 300 }, series(compileHtml))
    .on('change', browserSync.reload);


  watch([path.src.css, '!./src/css/main.scss'], { interval: 300 }, series(updateScssImports, compileCss))
    .on('change', browserSync.reload);


  watch('./src/css/main.scss', { interval: 300 }, series(compileCss))
    .on('change', browserSync.reload);


  watch(path.src.js, { interval: 300 }, series(compileJs))
    .on('change', browserSync.reload);


  watch(path.src.img, { interval: 300 }, series(imageCompile))
    .on('change', browserSync.reload);

  watch(path.src.fonts, { interval: 300 }, series(fontCompile))
    .on('change', browserSync.reload);

  watch(path.src.libs, { interval: 300 }, series(compileLibs))
    .on('change', browserSync.reload);
}


function handleFileDelete() {
  const watcher = watch([
    path.src.html,
    path.src.img,
    path.src.fonts
  ], { interval: 300 });

  watcher.on("unlink", function (filePath, stats) {
    const pathParts = filePath.split(pathNode.sep);
    const fileName = pathParts[pathParts.length - 1];

    (async () => {
      try {
        await del([
          `build/**/${fileName}`,
          `!src/template/*.html`,
        ]);
        console.log(`Silindi: ${fileName}`);
      } catch (error) {
        console.error("Dosya silinirken hata:", error);
      }
    })();
  });
}

// Main build task
const buildTask = parallel(
  compileHtml,
  compileCss,
  compileJs,
  imageCompile,
  fontCompile,
  compileLibs
);

// Development task
const devTask = series(
  buildTask,
  parallel(liveServer, watchFiles, handleFileDelete)
);

// Export tasks
exports.build = buildTask;
exports.dev = devTask;
exports.default = devTask;
exports.html = compileHtml;
exports.css = compileCss;
exports.js = compileJs;
exports.img = imageCompile;
exports.fonts = fontCompile;
exports.libs = compileLibs;
