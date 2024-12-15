import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import fileInclude from 'gulp-file-include';
import imagemin from 'gulp-imagemin';
import { deleteSync } from 'del';
import htmlmin from 'gulp-htmlmin';
import rename from 'gulp-rename';
import modRewrite from 'connect-modrewrite';

const sass = gulpSass(dartSass);
const bs = browserSync.create();

const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file'
};

// Очистка
gulp.task('clean', (done) => {
  deleteSync(['dist']);
  done();
});

// Скрипты (если нужно)
// gulp.task('scripts', () => {
//   return gulp.src('src/js/**/*.js')
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(concat('app.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/js'))
//     .pipe(browserSync.stream());
// });
gulp.task('scripts', function () {
	return gulp
		.src("src/js/**/*.js")
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream());
});

// Стили
gulp.task('styles', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
});

// HTML
gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
});

// Изображения
gulp.task('images', () => {
  return gulp.src('src/img/**/*', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// Иконки
gulp.task('icons', () => {
	return gulp
		.src("src/icons/**/*")
		.pipe(gulp.dest("dist/icons"))
		.pipe(browserSync.stream());
});

// Fonts
gulp.task('fonts', () => {
	return gulp
		.src("src/fonts/**/*", { encoding: false })
		.pipe(gulp.dest("dist/fonts"))
		.pipe(browserSync.stream());
});

// Запуск браузера с middleware для установки заголовков
gulp.task('serve', gulp.series('fonts', () => {
  bs.init({
    server: {
      baseDir: './dist',
      middleware: [
        modRewrite([
          '^/fonts/(.*)\\.(ttf)$ /fonts/$1.ttf [L]'
        ]),
        (req, res, next) => {
          if (req.url.endsWith('.ttf')) {
            res.setHeader('Content-Type', 'application/x-font-ttf');
          }
          next();
        }
      ]
    }
  });
  gulp.watch('src/js/**/*.js', gulp.series('scripts')); // если скрипты нужны
  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/img/**/*', gulp.series('images')).on('change', bs.reload);
  gulp.watch('src/fonts/**/*', gulp.series('fonts')).on('all', bs.reload);
  gulp.watch('src/icons/**/*', gulp.series('icons')).on('all', bs.reload);
}));

// Основная задача
gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('styles', 'html', 'images', 'scripts', 'icons', 'fonts'), 
    'serve'
  ));
