const gulp = require("gulp");
const replace = require("gulp-replace");
const path = require("path");
const through = require("through2");

gulp.task("add-compiled-scripts-to-widget-html", async function () {
  let scripts = '';
  let styles = '';
  gulp
    .src(["dist/calopad-widget/{runtime,polyfills,scripts,main}.*.js", "dist/calopad-widget/styles.*.css"])
    .pipe(
      through.obj(function (file, enc, cb) {
        const basename = path.basename(file.path);
        if (basename.includes('.js')) {
          if (
            basename.includes("runtime") ||
            basename.includes("polyfills") ||
            basename.includes("main")
          ) {
            scripts += '<script src="' + basename + '" type="module"></script>';
          } else if (basename.includes("scripts")) {
            scripts += '<script src="' + basename + '" defer></script>';
          }
        } else if (basename.includes('.css')) {
          styles += '<link href="' + basename + '" rel="stylesheet">';
        }
        cb(null);
      })
    )
    .pipe(gulp.dest("dist/calopad-widget/temp/"))
    .on("end", function () {
      gulp
        .src(["dist/calopad-widget/widget.html"])
        .pipe(replace("<!-- dynamic styles block -->", styles))
        .pipe(replace("<!-- dynamic script block -->", scripts))
        .pipe(gulp.dest("dist/calopad-widget"));
    });
});
