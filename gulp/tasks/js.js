/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2015/04/21 - 14:51
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
/*jslint node: true */
/*jslint -W079 */
"use strict";

// setting
var setting = require( '../setting.js' );

// gulp / gulp-load-plugins
var gulp = setting.gulp;
var $ = setting.$;

// module
var $$ = setting.module;

var del = $$.del;
var runSequence = $$.runSequence;

// directory
var dir = setting.dir;
var example = dir.example;

// package
var pkg = setting.pkg;
var version = setting.version;

// css prefix
var AUTO_PREFIX_BROWSERS = setting.AUTO_PREFIX_BROWSERS;

// replace task patterns
var patterns = setting.patterns;

// ------------------------------------------------------
// server
var browserSync = $$.browserSync;
var reload = $$.reload;

// ------------------------------------------------------
// tasks
// ------------------------------------------------------

// move libs -> old
gulp.task( 'js-copy', function () {

  return gulp.src( dir.libs + '/*' )
    .pipe( gulp.dest( dir.old ) )
    .pipe( $.size( { title: '*** js-copy ***' } ) );

} );

// delete libs files
gulp.task( 'js-clean', function () {

  del(
    [
      dir.libs + '/*'
    ],
    {
      base: process.cwd(),
      dot: true,
      force: true
    },
    function (err, deletedFiles) {
      console.log('files deleted:' + deletedFiles.length + "\n" + deletedFiles.join("\n"));
    } );

} );

// copy -> delete
gulp.task( 'js-move', function () {

  runSequence(

    'js-copy',
    'js-clean'

  );
} );



// Lint JavaScript
gulp.task('js-hint', function () {
  return gulp.src( [
    dir.src + '/**/*.js'
  ] )
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// minify JavaScript
gulp.task('js-min', function () {
  return gulp.src( [
    dir.src + '/**/*.js'
  ] )
    .pipe( $.plumber() )
    .pipe( $.replaceTask( { patterns: patterns } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.rename( function ( path ) {

      path.basename = path.basename + '-' + version;

    } ) )
    .pipe( gulp.dest( dir.libs ) )
    // minify
    .pipe( $.uglify( { preserveComments: 'some' } ) )
    .pipe( $.rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.rename( function ( path ) {
      console.log( "path", path );
      path.basename = path.basename.replace( '-' + version, '' );
    }) )
    // minified libName.min
    .pipe( gulp.dest( dir.libs ) )
    .pipe( $.size( { title: '*** js-min ***' } ) );
});

// api
gulp.task( 'js-api', function () {

  return gulp.src( dir.src + '/*.js' )
    .pipe( $.yuidoc() )
    .pipe( gulp.dest( dir.docs ) );

} );

// -----------------------------------------------------------
// build
gulp.task( 'build', function () {

  runSequence(

    'js-hint',
    'js-move',
    [
      'js-min',
      'js-api'
    ]

  );

} );