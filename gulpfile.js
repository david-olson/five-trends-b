// 5 Trends B Test Gulpfile 
// Author: Dave Olson
// Last Edited: 02.15.17 @ 5.14PM

// Project Config

var project = 'fiveTrendsB',
    bower = './bower_components',
    build = '../build_fiveTrendsB',
    buildInclude = [
        '**/*.php',
        '**/*.html',
        '**/*.css',
        '**/*.js',
        '**/*.svg',
        '**/*.mp4',
        '**/*.ogv',
        '**/*.webm',
        '**/*.mp3',
        '**/*.ttf',
        '**/*.otf',
        '**/*.eot',
        '**/*.woff',
        '**/*.woff2',
        // exclude files and folders
        '!.gitignore',
        '!.git/**/*',
        '!./**/.DS_Store',
        '!node_modules/**/*',
        '!assets/bower_components/**/*',
        '!style.css.map',
        '!assets/js/custom/*',
        '!assets/css/patrials/*'
    ];

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-uglifycss'),
    filter = require('gulp-filter'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    runSequence = require('gulp-run-sequence'),
    sass = require('gulp-sass'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    ignore = require('gulp-ignore'),
    rimraf = require('gulp-rimraf'),
    zip = require('gulp-zip'),
    plumber = require('gulp-plumber'),
    cache = require('gulp-cache'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('browser-sync', function () {
    var files = [
       '**/*.html',
       '**/*.{png,jpg,gif}'
   ];
    browserSync.init(files, {
        server: './',
        injectChanges: true
    });
});

/**
 * Styles
 *
 * Looking at src/sass and compiling the files into Expanded format, Autoprefixing and sending the files to the build folder
 *
 * Sass output styles: https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
 */

gulp.task('styles', function () {
    gulp.src('./assets/css/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compact',
            precision: 10
        }))
        .pipe(sourcemaps.write({
            includeContent: false
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(autoprefixer('last 3 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('.'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./'))
        .pipe(filter('**/*.css'))
        .pipe(reload({
            stream: true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss({
            maxLineLen: 80
        }))
        .pipe(gulp.dest('./'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'Styles task complete',
            onLast: true
        }))
});

gulp.task('minifyVendors', function() {
    gulp.src(['./assets/css/vendor/*.css', bower + '**/*.css'])
        .pipe(concat('vendors.css'))
        .pipe(minifycss({
            maxLineLen: 80
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./assets/css/'));
});

/**
 * Scripts: Vendors
 *
 * Look at src/js and concatenate those files, send them to assets/js where we then minimize the concatenated file.
 */

gulp.task('vendorsJs', function() {
    return gulp.src(['./assets/js/vendor/**/*.js', bower + '**/*.js'])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest('./assets/js'))
        .pipe(rename({
            basename: "vendors",
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify({
            message: 'Vendor scripts task complete',
            onLast: true
        }));
});

/**
 * Scripts: Custom
 *
 * Look at src/js and concatenate those files, send them to assets/js where we then minimize the concatenated file.
 */

gulp.task('scriptsJs', function() {
    return gulp.src('./assets/js/custom/*.js')
        .pipe(concat('custom.js'))
        .pipe(gulp.dest('./assets/js'))
        .pipe(rename({
            basename: 'custom',
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify({
            message: 'Custom scripts task complete',
            onLast: true
        }))
});

/**
 * Images
 *
 * Look at src/images, optimize the images and send them to the appropriate place
 */

gulp.task('images', function() {
    //Only add newer images to the pipe
    return gulp.src(['./assets/img/raw/**/*.{png,jpg,gif}'])
        .pipe(newer('./assets/img/'))
        .pipe(rimraf({
            force: true
        }))
        .pipe(imagemin({
            optimizationLevel: 6,
            progressive: false,
            interlaced: false
        }))
        .pipe(gulp.dest('./assets/img/'))
        .pipe(notify({
            message: 'Images task complete',
            onLast: true
        }))
});

/**
 * Clean gulp cache
 */
gulp.task('clear', function() {
    cache.clearAll();
});

/**
 * Clean tasks for zip
 *
 * Being a little overzealous, but we're cleaning out the build folder, codekit-cache directory and annoying DS_Store files and Also
 * clearing out unoptimized image files in zip as those will have been moved and optimized
 */
gulp.task('cleanup', function() {
    return gulp.src(['./assets/bower_components', '**/.sass-cache', '**/.DS_Store'], {
            read: false
        })
        .pipe(ignore('node_modules/**'))
        .pipe(rimraf({
            force: true
        }))
});
gulp.task('cleanupFinal', function() {
    return gulp.src(['./assets/bower_components', '**/.sass-cache', '**/.DS_Store'], {
            read: false
        })
        .pipe(ignore('node_modules/**'))
        .pipe(rimraf({
            force: true
        }))
});

/**
 * Build task that moves essential theme files for production-ready sites
 *
 * buildFiles copies all the files in buildInclude to build folder - check variable values at the top
 * buildImages copies all the images from img folder in assets while ignoring images inside raw folder if any
 */
gulp.task('buildFiles', function() {
    return gulp.src(buildInclude)
        .pipe(gulp.dest(build))
        .pipe(notify({
            message: 'Copy from buildFiles is complete',
            onLast: true
        }))
});

/**
 * Build Images
 *
 * Look at src/images, optimize the images and send them to the appropriate place
 */
gulp.task('buildImages', function() {
    return gulp.src(['assets/img/**/*', '!assets/images/raw/**'])
        .pipe(gulp.dest(build + 'assets/img/'))
        .pipe(plugins.notify({
            message: 'Images copied to build folder',
            onLast: true
        }))
});

/**
 * Zipping build directory for distribution
 *
 * Taking the build folder, which has been cleaned, containing optimized files and zipping it up to send out as an installable theme
 */
gulp.task('buildZip', function() {
    return gulp.src(build + '/**/')
        .pipe(zip(project + '.zip'))
        .pipe(gulp.dest('../'))
        .pipe(notify({
            message: 'Zip task complete',
            onLast: true
        }));
});

// ==== TASKS ==== //
/**
 * Gulp Default Task
 *
 * Compiles styles, fires-up browser sync, watches js and php files. Note browser sync task watches php files
 *
 */

gulp.task('build', function(cb) {
    runSequence('styles', 'minifyVendors', 'cleanup', 'vendorsJs', 'scriptsJs', 'buildFiles', 'buildImages', 'buildZip', 'cleanupFinal', cb);
});

//watch task
gulp.task('default', ['styles', 'minifyVendors', 'vendorsJs', 'scriptsJs', 'images', 'browser-sync'], function() {
    gulp.watch('./assets/img/raw/**/*', ['images']);
    gulp.watch('./assets/css/**/*.scss', ['styles']);
    gulp.watch('./assets/js/**/*.js', ['scriptsJs', browserSync.reload]);
});