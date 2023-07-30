const srcDir = 'assets/src'
const distDir = 'D:/Code/Github/SimsMod/bootstrap_admin/static/bootstrap_admin'
const devDir = 'assets/dev'

const path = {
  dist: distDir,
  src: srcDir,
  dev: devDir,
  src_scss: srcDir + '/scss',
  src_js: srcDir + '/js',
  dev_vendor: devDir + '/vendor',
  dist_vendor: distDir+'/vendor',
  dist_js: distDir+'/js',
  dist_css: distDir+'/css',
  dev_js: devDir + '/js',
  dev_css: devDir + '/css',
};

const gulp = require('gulp'),
  rollup = require('gulp-rollup'),
  betterRollup = require('gulp-better-rollup'),
  del = require('del'),
  rename = require('gulp-rename'),
  glob = require('glob'),
  sass = require('gulp-sass')(require('sass')),
  plumber = require('gulp-plumber'),
  sassUnicode = require('gulp-sass-unicode'),
  globImport = require('rollup-plugin-glob-import'),
  minify = require('gulp-minify'),
  concat = require('gulp-concat'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  packageJSON = require('./package.json'),
  webpack = require('webpack-stream');

const env = ['dev', 'dist'];

let tasks = [];
tasks['dev'] = [];
tasks['dist'] = [];

// Sass compiling
clean();
moveVendors();
copyAndMergeSCSS('theme', 'argon-dashboard.scss');
//copyAndMergeSCSS('datatables', 'datatables.scss');
buildJS('argon-dashboard', 'argon-dashboard', path.src_js + '/argon-dashboard.js');
//buildJS('datatables', 'datatables', path.src_js + '/datatables.js');
buildJS('bootstrap_admin', 'bootstrap_admin', path.src_js + '/django-admin.js');
copyFiles('fonts');
copyFiles('img');

function copyFiles(name) {
  env.forEach((env_name) => {
    tasks[env_name].push(name + ':' + env_name);
    const destinationPath = env_name === 'dist' ? path.dist : path.dev;

    gulp.task(name + ':' + env_name, () =>
      gulp.src(`${path.src}/${name}/**/*`).pipe(gulp.dest(`${destinationPath}/${name}`))
    );
  });
}

function copyAndMergeSCSS(taskname, file) {
  env.forEach((env_name) => {
    tasks[env_name].push(taskname + ':expanded:' + env_name);
    tasks[env_name].push(taskname + ':minified:' + env_name);

    const options = { outputStyle: env_name === 'dist' ? 'compressed' : 'expanded', quietDeps: true, precision: 10 };

    gulp.task(`${taskname}:expanded:${env_name}`, () =>
      gulp
        .src(`${path.src_scss}/${file}`)
        .pipe(sass.sync(options).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulp.dest(path[`${env_name}_css`]))
    );

    gulp.task(`${taskname}:minified:${env_name}`, () =>
      gulp
        .src(`${path.src_scss}/${file}`)
        .pipe(plumber())
        .pipe(sass().on('error', (err) => {
          sass.logError(err);
          this.emit('end');
        }))
        .pipe(sassUnicode())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(minify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path[`${env_name}_css`]))
    );
  });
}

// JS compiling and minification
function buildJS(taskname, outputFileName, filePattern = `${path.src_js}/**/*.js`) {
  env.forEach((env_name) => {
    tasks[env_name].push(`${taskname}:minified:${env_name}`);

    gulp.task(`${taskname}:minified:${env_name}`, () =>
      gulp.src(filePattern)
        .pipe(babel({ presets: ['@babel/preset-env']}))
        .pipe(
          webpack({
            mode: 'production',
            entry: './'+filePattern,
            output: {
              filename: `${outputFileName}.js`,
            },
            module: {
              rules: [
                {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                    },
                  },
                },
              ],
            },
        }))
        .pipe(concat(`${outputFileName}.min.js`))
        .pipe(uglify({ output: { comments: /^!|@version/i } }))
        .pipe(gulp.dest(path[`${env_name}_js`]))
     );
  });
}

// Move vendor css and js files from node_modules to dist folder
// based on the list in package.json dependencies
function moveVendors() {
  env.forEach((env_name) => {
    gulp.task('vendor:' + env_name, () => {
      const dependencies = Object.keys(packageJSON.dependencies);
      const vendor = dependencies.map((key) => key + '/**/*');

      return gulp.src(vendor, { cwd: 'node_modules', base: './node_modules' }).pipe(gulp.dest(path[env_name + '_vendor']));
    });
  });
}

// Clean certain files/folders from dist directory. Runs before compilation of new files. See 'default' task at the most bottom of this file
function clean() {
  env.forEach((env_name) => {
    gulp.task('clean:' + env_name, () => del(path[env_name], { force: true }));
  });
}


// Default task - the dependent tasks will run in parallell / excluding Docs and Components compilation
gulp.task('default', gulp.series('clean:dev', 'clean:dist', 'vendor:dev', 'vendor:dist', gulp.parallel(tasks['dev'], tasks['dist'])));
gulp.task('dev', gulp.series('clean:dev', 'vendor:dev', gulp.parallel(tasks['dev'])));
gulp.task('dist', gulp.series('clean:dist', 'vendor:dist', gulp.parallel(tasks['dist'])));