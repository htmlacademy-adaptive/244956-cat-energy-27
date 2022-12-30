import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso() // min
    ]))
    .pipe(rename ('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML
export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('build'));
}

//Scripts

export const scripts = () => {
  return gulp.src('source/script.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

//Images
const optimizeImages = () => {
  return gulp.src('source/images/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/images'))
  }

  const copyImages = () => {
  return gulp.src('source/images/*.{png,jpg}')
  .pipe(gulp.dest('build/images'))
  }

  // WebP

const createWebp = () => {
  return gulp.src('source/images/*.{png,jpg}')
  .pipe(squoosh({
  webp: {}
  }))
  .pipe(gulp.dest('build/images'))
  }

  // SVG

const svg = () =>
gulp.src(['source/images/**/*.svg', '!source/images/favicons/*.svg', '!source/images/sprite.svg'])
.pipe(svgo())
.pipe(gulp.dest('build/images'));

const sprite = () => {
return gulp.src(['source/images/svg/*.svg'])
.pipe(svgo())
.pipe(svgstore({
inlineSvg: true
}))
.pipe(rename('sprite.svg'))
.pipe(gulp.dest('build/images'));
}

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/**/*.{woff2,woff}',
  'source/*.ico',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }

// Clean

const clean = () => {
return del("build");
 };

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
gulp.watch('source/less/**/*.less', gulp.series(styles));
gulp.watch('source/script.js', gulp.series(scripts));
gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  sprite,
  createWebp
  ),
  );

  // Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
  styles,
  html,
  scripts,
  svg,
  sprite,
  createWebp
  ),
  gulp.series(
  server,
  watcher
  ));

