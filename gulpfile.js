
const { series, src, dest } = require('gulp');
const { notify } = require('gulp-notify');

function oidc_lib() {
    // Copy the oidc file
    return src('node_modules/oidc-client/dist/oidc-client.min.js')
    .pipe(dest('src/assets/lib/oidc-client'));
    // .pipe(notify({ message: 'OIDC Library copy task complete' }));
}

function mathjax_lib() {
    // Copy the mathjax file
    return src(['node_modules/mathjax/config/**/*.*',
        'node_modules/mathjax/extensions/*.*',
        'node_modules/mathjax/fonts/**/.*',
        'node_modules/mathjax/jax/**/*.*',
        'node_modules/mathjax/localization/en/*.*',
        'node_modules/mathjax/localization/ja/*.*',
        'node_modules/mathjax/localization/zh-*/*.*',
        'node_modules/mathjax/MathJax.js'
        ], {base: './node_modules/mathjax'})
    .pipe(dest('src/assets/lib/MathJax'));
    // .pipe(notify({ message: 'Mathjax Library copy task complete' }));
}

// gulp.series(['oidc-lib', 'mathjax-lib']);

exports.default = series(oidc_lib, mathjax_lib);

