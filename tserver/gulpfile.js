var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var merge = require('merge2');

var tsProject = ts.createProject('src/tsconfig.json');

gulp.task('default', ['compile', 'test']);

gulp.task('compile', function() {
  var tsResult = gulp.src('src/**/*.ts')
      .pipe(tsProject());

   return merge([
     tsResult.dts.pipe(gulp.dest('lib')),
     tsResult.js.pipe(gulp.dest('lib')),
   ])
})

gulp.task('watch', ['compile'], function() {
  gulp.watch('src/**/*.ts', ['compile']);
})

gulp.task('clean', function() {
  gulp.src('lib').pipe(clean({force: true}));
})

gulp.task('build', ['clean', 'compile']);

gulp.task('test', function() {
  return gulp.src(['test/**/*.ts'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      require: ['ts-node/register', 'should']
    }));
})

gulp.task('test:watch', function() {
  return gulp.watch(['src/**', 'test/**'], ['test']);
})

