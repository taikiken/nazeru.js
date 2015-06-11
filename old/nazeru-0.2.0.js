/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 15/06/11 - 16:37
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * for nazeru.js
 *
 * @build 2015-06-11 18:06:53
 * @version 0.2.0
 *
 * @module Nazeru
 */
( function ( window ) {

  "use strict";

  var
    document = window.document;

  window.Nazeru = ( function () {

    function Nazeru ( element, option ) {

      var
        threshold;

      if ( typeof option === "undefined" ) {
        // option undefined
        option = {
          threshold: 50,
          touchStart: null,
          touchMove: null,
          touchEnd: null
        };

      } else {

        threshold = option.threshold;

        if ( typeof threshold === "undefined" || !threshold || Object.prototype.toString.call( threshold ) !== '[object Number]' ) {

          option.threshold = 50;

        }

      }

      function touchStart ( event ) {

        console.log( "touchStart ", event );

      }

      Object.defineProperties(
        this,
        {

          "element": {
            value: element,
            enumerable: true
          },

          "option": {
            value: option,
            enumerable: true
          },

          "boundStart": {
            value: touchStart.bind( this )
          }

        }
      );
    }

    var p = Nazeru.prototype;
    p.constructor = Nazeru;

    p.init = function () {

      this.activate();

    };

    p.activate = function () {

      var
        option = this.option;

      if (
        typeof option.touchStart === "function" ||
        typeof option.touchMove === "function" ||
        typeof option.touchEnd === "function"
      ) {

        this.element.addEventListener( "touchstart", this.boundStart, false );

      }

    };


    return Nazeru;

  }() );

}( window ) );