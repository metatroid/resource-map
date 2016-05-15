var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

//build app js
gulp.task('js', function(){
  return gulp.src(['js/app/map.js', 'js/app/components/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'))
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('js'));
});

//compile libs+app js
gulp.task('jsall', ['js'], function(){
  gulp.src(['js/libs/angular.js', 'js/libs/angular-ui-router.js', 'js/libs/angular-animate.js', 'js/libs/angular-aria.js', 'js/libs/angular-cookies.js', 'js/libs/angular-material.js', 'js/libs/mapbox.js', 'js/libs/flickity.pkgd.js', 'js/libs/modernizr-custom.js', 'js/app.js'])
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('../assets/js'))
    .pipe($.rename('main.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('../assets/js'));
});

//sass
gulp.task('sass', function(){
  gulp.src('sass/main.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('../assets/css'));
});

//html
gulp.task('html', function(){
  gulp.src('haml/**/*.html.haml')
    .pipe($.haml({ext: ''}))
    .pipe($.prettify())
    .pipe(gulp.dest('html'))
    .pipe($.copy('../', {prefix: 1}));
});
//php
gulp.task('php', function(){
  gulp.src('haml/**/*.php.haml')
    .pipe($.haml({ext: ''}))
    .pipe($.prettify())
    .pipe(gulp.dest('php'))
    .pipe($.copy('../', {prefix: 1}));
});

//img optimization
gulp.task('img', function(){
  gulp.src('img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}]
    }))
    .pipe(gulp.dest('../assets/img'))
});

gulp.task('default', ['js', 'jsall', 'sass', 'html', 'php', 'img'], function(){
  gulp.watch('js/app/**/*.js', ['js', 'jsall']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('haml/**/*.haml', ['html', 'php']);
  gulp.watch('img/**/*', ['img']);
});