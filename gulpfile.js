const gulp = require('gulp');
const less = require('gulp-less');
const webpack = require('webpack-stream');
const livereload = require('gulp-livereload');

gulp.task('css', function(){
  return gulp.src('resources/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('build/css'))
    .pipe(livereload());
});

gulp.task('watch', () => {
	livereload.listen();
	gulp.watch('resources/less/*.less', ['css']);
})


gulp.task('default', [ 'css' ]);
