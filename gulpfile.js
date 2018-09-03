const gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del')
;

const src = 'src/',         // Source Directory
      dist = 'dist/',       // Build Directory
      scripts = [src + 'js/file1.js', src + 'js/file2.js'];

/**
 * SCSS Task
 */
gulp.task('scss', function () {
    return gulp.src(src + 'scss/**/*.scss')
        .pipe(sourcemaps.init())                                            // Initialize the source maps
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Compile SCSS to CSS, minify the CSS and output any errors on the console
        .pipe(postcss([autoprefixer()]))                                    // Add browser prefixes to CSS. Note: make sure that you have the list "browserslist" on the package.json
        .pipe(sourcemaps.write('./'))                                       // Generate the source map
        .pipe(gulp.dest(dist + 'assets/css'))                               // Output the CSS file to the destination folder
        .pipe(reload({stream: true}));                                      // Reload Page
});

/**
 * JavaScript Tasks
 */
gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe(eslint())                         // Start ESLint
        .pipe(eslint.format())                  // Format ESLint results and print them to the console
        .pipe(sourcemaps.init())                // Initialize the source maps
        .pipe(babel({presets: ['@babel/env']})) // Compile JavaScript to ES5
        .pipe(uglify())                         // Compress the JS file
        .pipe(concat('main.js'))                // Concat all the js files into one (app.js)
        .pipe(sourcemaps.write('./'))           // Generate source map
        .pipe(gulp.dest(dist + 'assets/js'))    // Output the JS file to the destination folder
        .pipe(reload({stream: true}));          // Reload Page
});

/**
 * Browser Sync Task
 */
gulp.task('browser-sync', function(done){
    browserSync({
        server: dist
    });
    done();
});

/**
 * Watch Task
 */
gulp.task('watch', function() {
    gulp.watch(scripts, gulp.series('scripts'));
    gulp.watch(src + 'scss/**/*.scss', gulp.series('scss'));
});

/**
 * Clean Task
 */
gulp.task('clean', function(done) {
    del([dist + 'assets/css', dist + 'assets/js']);
    done();
});

/**
 * Default Task
 */
gulp.task('default', gulp.series('clean', gulp.parallel('scss', 'scripts'), 'browser-sync', 'watch'));

/**
 * Production Task
 */
gulp.task('production', gulp.series('clean', gulp.parallel('scss', 'scripts')));