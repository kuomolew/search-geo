var gulp = require("gulp");
var sass = require("gulp-sass");
let autoprefixer = require('gulp-autoprefixer');
let cssbeautify = require('gulp-cssbeautify');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var fileinclude = require('gulp-file-include');

gulp.task("compile", () => {
  return gulp.src("./dev/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('autoprefix', function () {
  return gulp.src('./src/css/*.css')
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 version'],
          cascade: true
      }))
      .pipe(gulp.dest((file) => {
        return file.base;
      }));
});

gulp.task('beautify', function() {
  return gulp.src('./src/css/*.css')
      .pipe(cssbeautify())
      .pipe(gulp.dest('./src/css/'));
});

gulp.task('img', function() {
  var imageMinification = gulp.src('dev/img/uncompressed/*')
  .pipe(imagemin())
  return imageMinification.pipe(gulp.dest('./src/img/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('./src/img/spryte/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.css',
    imgPath: './src/icons/sprite.png',
  }));
  return spriteData.img.pipe(gulp.dest('./src/img/icons/')),
         spriteData.css.pipe(gulp.dest('./dev/scss/'));
});

gulp.task('html', function () {
  var htmlCompile = gulp.src('./dev/html/*.html').pipe(fileinclude({
    prefix: '@@',
  }));
  return htmlCompile.pipe(gulp.dest('./src/'));
});

gulp.task('watch', function() {
  gulp.watch('./dev/scss/*.scss', gulp.series('compile', 'autoprefix', 'beautify'));
	gulp.watch('./dev/html/**/*.html', gulp.parallel('html'));
});

gulp.task("default", gulp.series('compile', 'beautify'));