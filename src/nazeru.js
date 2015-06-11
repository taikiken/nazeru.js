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
 * @build @@buildTime
 * @version @@version
 *
 * @module Nazeru
 */
( function ( window ) {

  "use strict";

  var
    document = window.document;

  window.Nazeru = ( function () {
    var
      /**
       * document.documentElement (<html>)
       * @property _element
       * @static
       * @type {Element}
       * @private
       */
      _element = document.documentElement,
      _abs = Math.abs;

    /**
     * @class Nazeru
     * @param {Element} element
     * @param {Object} option {{ threshold: number, touchStart: function, touchMove: function, touchEnd: function }}
     * @constructor
     */
    function Nazeru ( element, option ) {

      var
        boudnStart = touchStart.bind( this),
        boudnMove = touchMove.bind( this),
        boudnEnd = touchEnd.bind( this),
        threshold,
        move,
        enable,
        startY,
        startTop;

      if ( typeof option === "undefined" ) {
        // option undefined
        option = {
          threshold: 50,
          touchStart: null,
          touchMove: null,
          touchEnd: null
        };

        threshold = 50;

      } else {

        threshold = option.threshold;

        if ( typeof threshold === "undefined" || !threshold || Object.prototype.toString.call( threshold ) !== '[object Number]' ) {

          option.threshold = 50;

        }

      }

      move = typeof option.touchMove === "function";

      enable = typeof option.touchStart === "function" ||
        move ||
        typeof option.touchEnd === "function";

      function scrollTop () {

        // http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
        return ( window.pageYOffset || _element.scrollTop)  - ( _element.clientTop || 0 );

      }

      /**
       * element touchstart event handler
       * @method touchStart
       * @param {Event} event
       * @private
       */
      function touchStart ( event ) {

        console.log( "touchStart ", event );
        if ( move ) {

          element.addEventListener( "touchmove", boudnMove, false )

        }
        if ( enable ) {

          element.addEventListener( "touchend", boudnEnd, false )

          startY = event.changedTouches[ 0 ].pageY;
          startTop = scrollTop();

        }

      }
      /**
       * element touchmove event handler
       * @method touchMove
       * @param {Event} event
       * @private
       */
      function touchMove ( event ) {

        var
          y = event.changedTouches[ 0 ].pageY,
          top = scrollTop();

        if ( _abs( y - startY ) >= threshold || _abs( top - startTop ) >= threshold ) {

          // なにもしない
          event.preventDefault();

        }

      }
      /**
       * element touchend event handler
       * @method touchEnd
       * @param {Event} event
       * @private
       */
      function touchEnd ( event ) {

        element.removeEventListener( "touchmove", boudnMove );
        element.removeEventListener( "touchend", boundEnd );

      }

      Object.defineProperties(
        this,
        {

          /**
           * @property element
           * @type {Element}
           * @readOnly
           */
          "element": {
            value: element,
            enumerable: true
          },
          /**
           * @property option
           * @type {{ threshold: number, touchStart: function, touchMove: function, touchEnd: function }}
           * @readOnly
           */
          "option": {
            value: option,
            enumerable: true
          },
          /**
           * toucheventを監視するか否かの真偽値
           * @property enable
           * @type {boolean}
           * @readOnly
           */
          "enable": {
            value: enable,
            enumerable: true
          },
          /**
           * @property boundStart
           * @type {function}
           * @private
           */
          "boundStart": {
            value: boudnStart
          },
          /**
           * @property boundMove
           * @type {function}
           * @private
           */
          "boundMove": {
            value: boudnMove
          },
          /**
           * @property boundEnd
           * @type {function}
           * @private
           */
          "boundEnd": {
            value: boundEnd
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

      if ( this.enable ) {

        this.element.addEventListener( "touchstart", this.boundStart, false );

      }

    };

    p.abort = function () {

      this.element.removeEventListener( "touchstart", this.boundStart );

    };

    //p.scrollTop = function () {
    //
    //  // http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
    //  return ( window.pageYOffset || _element.scrollTop)  - ( _element.clientTop || 0 );
    //
    //};


    return Nazeru;

  }() );

}( window ) );