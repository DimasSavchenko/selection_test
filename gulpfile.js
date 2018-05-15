var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    browser      = require('browser-sync'),
    sourcemaps   = require('gulp-sourcemaps'),
    iconfont     = require('gulp-iconfont'),
    consolidate  = require('gulp-consolidate'),
    imagemin     = require('gulp-imagemin');


gulp.task('sass', function () {
  return gulp.src('assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browser.stream({match: '**/*.css'}));
});

gulp.task('js', function() {
	return gulp.src('assets/js/app.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(browser.reload({stream: true}));
});

gulp.task('imagemin', function () {
    gulp.src('assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});


// Starts a BrowerSync instance
gulp.task('serve', ['sass', 'js'], function(){
  browser.init({
        server: {
            baseDir: "./"
        }
    });
});


// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['serve', 'imagemin'], function() {    
  gulp.watch(['assets/scss/**/*.scss'], ['sass']);  
  gulp.watch(['assets/js/**/*.js'], ['js']);
  gulp.watch('./**/*.html').on('change', browser.reload);
});


// Font generator
gulp.task("build:icons", function() {
    return gulp.src(["./assets/icons/*.svg"]) //path to svg icons
      .pipe(iconfont({
        fontName: "iconsfont", 
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true
      }))
      .on("glyphs", (glyphs) => {

        gulp.src("./assets/icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "iconsfont",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("./assets/scss/icons")); //generated scss files with classes
      })
      .pipe(gulp.dest("./dist/fonts/")); //icon font destination
});