var path = require('path');
var fs = require('fs');

var mkdirp = require('mkdirp');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var merge = require('merge2');

var tsProject = ts.createProject('src/tsconfig.json');

gulp.task('default', ['compile', 'test']);

gulp.task('clean', function() {
  gulp.src('lib').pipe(clean({force: true}));
})


gulp.task('views', ['compile'], function () {
  return gulp.src(['src/views/**/*'], {
    base: 'src'
  }).pipe(gulp.dest('lib'));
});


gulp.task('compile', ['clean'], function() {
  var tsResult = gulp.src('src/**/*.ts')
      .pipe(tsProject());

   return merge([
     tsResult.dts.pipe(gulp.dest('lib')),
     tsResult.js.pipe(gulp.dest('lib')),
   ])
})

gulp.task('build', ['views']);

function watcher(event) {
  var tsResult = gulp.src(event.path).pipe(tsProject());

  if (!event.path.endsWith(path.sep)) {
    var file = event.path;

    var relativePath = path.relative(path.join(__dirname, 'src'), path.dirname(event.path));
    var targetPath = path.join('lib', relativePath);
    var targetFile = path.join(__dirname, targetPath, path.basename(file));

    console.log(event.type, event.path, targetFile);

    if (path.extname(file) === '.ts') {
      console.log('here1');
      if (event.type === 'deleted') {
        var targetDir = path.join(__dirname, targetPath)
        var basename = path.basename(event.path, '.ts')
        var file = path.join(targetDir, basename + '.js');
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
        file = path.join(targetDir, basename + '.d.ts');
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } else {
        return merge([
          tsResult.dts.pipe(gulp.dest(targetPath)),
          tsResult.js.pipe(gulp.dest(targetPath)),
        ])
      }
    } else {
      console.log('here', targetFile);
      if (event.type === 'delete') {
        if (fs.existsSync(targetFile)) {
          fs.unlinkSync(targetFile);
        }
      } else {
        var targetDir = path.join(__dirname, targetPath);
        mkdirp.sync(path.dirname(targetDir));
        fs.createReadStream(file).pipe(fs.createWriteStream(targetFile));
      }
    }
  }
}

gulp.task('watch', ['build'], function(event) {
  // gulp.watch('src/**/*', watcher);

  // gulp.watch('src/**/*.ts', ['compile']);
  gulp.watch('src/**/*.html', function(event) {
    return gulp.src(['src/views/**/*'], {
      base: 'src'
    }).pipe(gulp.dest('lib'));
  });
  gulp.watch(['src/**/*.ts'], function (event) {
    var tsResult = gulp.src(event.path)
      .pipe(tsProject());

    var relativePath = path.relative(path.join(__dirname, 'src'), path.dirname(event.path));
    var targetPath = path.join('lib', relativePath);

    console.log("file " + event.type + ": " + event.path, targetPath);

    if(fs.lstatSync(event.path).isDirectory()) {
      if (event.type === 'added') {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath);
        }
        return;
      }
      if (event.type === 'deleted') {
        console.log('delete directory', event.path);
        gulp.src(targetPath).pipe(clean({force: true}));
        return;
      }
    }

    if (event.type === 'deleted') {
      var targetfile = path.join(__dirname, targetPath)
      var basename = path.basename(event.path, '.ts')
      var file = path.join(targetfile, basename + '.js');
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
      file = path.join(targetfile, basename + '.d.ts');
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } else {
      return merge([
        tsResult.dts.pipe(gulp.dest(targetPath)),
        tsResult.js.pipe(gulp.dest(targetPath)),
      ])
    }
  });
})

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

