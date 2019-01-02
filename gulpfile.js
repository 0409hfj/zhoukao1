var gulp = require("gulp");
var sass = require("gulp-sass");
var yscss = require("gulp-clean-css");
var ysjs = require("gulp-uglify");
var server = require("gulp-webserver");
var path = require("path");
var url = require("url");
var fs = require("fs");
gulp.task("minscss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(yscss()) //压缩css
        .pipe(gulp.dest("./src/css/"))
})

gulp.task("build", function() {
    return gulp.src("./src/js/*.js")
        .pipe(ysjs()) //压缩js
        .pipe(gulp.dest("./src/dest/"))
})

gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("minscss"))
})
gulp.task("server", function() {
    return gulp.src('src')
        .pipe(server({
            port: 3000,
            open: true,
            livereload: true,
            fallback: 'index.html',
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === "/favicon.ico") {
                    res.end("")
                    return;
                }
                pathname = pathname === "/" ? "index.html" : pathname;
                res.end(fs.readFileSync(path.join(__dirname, "src", pathname)));
            }
        }))
})

gulp.task("default", gulp.series("minscss", "build", "server", "watch"))