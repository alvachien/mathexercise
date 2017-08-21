
var gulp = require('gulp'),
    notify = require('gulp-notify');

gulp.task('default', function() {
    // Copy the oidc file
    return gulp.src('node_modules/oidc-client/dist/oidc-client.min.js')
    .pipe(gulp.dest('src/assets/lib'))
    .pipe(notify({ message: 'Library copy task complete' }));
});
