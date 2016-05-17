const gulp = require('gulp');
const tslint = require('gulp-tslint');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
const spawn = require('child_process').spawn;

let node;

gulp.task('lint', function() {
    return gulp.src('src/**/*.ts').pipe(tslint({}))
        .pipe(tslint.report({
            summarizeFailureOutput: true
        }));
});

gulp.task('clean', function() {
    return gulp.src('build/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('set-dev-node-env', function() {
    process.env.NODE_ENV = 'development';
    process.env.MONGO_HOST = '104.199.151.20';
    return;
});

gulp.task('script', function(cb) {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build"));
    cb();
});

gulp.task('build', ['lint', 'clean', 'script']);

gulp.task('server', ['script', 'set-dev-node-env'], function() {
    if (node) { node.kill(); }
    node = spawn('node', ['./build/server.js'], { stdio: 'inherit' });
    node.on('close', function(code) {
        if (code === 8) {
            console.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['server']);
});

gulp.task('default', ['build', 'server', 'watch']);