// include gulp
var gulp = require('gulp'); 

// include plug-ins
var jshint = require('gulp-jshint');

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./routes/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Watch for changes 
gulp.task('watch', function() {
	gulp.watch('./routes/*.js', ['jshint']);
});

gulp.task('default', ['jshint']);