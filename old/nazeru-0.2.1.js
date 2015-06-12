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
 * @build 2015-06-12 17:41:19
 * @version 0.2.1
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
     * @param {Object} option {{ threshold: number, touchStart: function, touchMove: function, touchEnd: function, moveCanceled: function, endCanceled: function }}
     * @constructor
     */
    function Nazeru ( element, option ) {

      var
        boundStart = touchStart.bind( this),
        boundMove = touchMove.bind( this),
        boundEnd = touchEnd.bind( this),
        defaultThreshold = 50,
        threshold,
        isMove,
        isStart,
        isEnd,
        isCancelMove,
        isCancelEnd,
        isAny,
        startY,
        startTop,
        prevY,
        prevTop;

      function isNumber ( n ) {

        return Object.prototype.toString.call( n ) === '[object Number]';

      }

      if ( typeof option === "undefined" || option === null ) {
        // option undefined
        option = {
          threshold: defaultThreshold,
          touchStart: null,
          touchMove: null,
          touchEnd: null,
          moveCanceled: null,
          endCanceled: null
        };

      } else {

        threshold = option.threshold;

        // number check
        if ( !isNumber( threshold ) ) {

          option.threshold = defaultThreshold;

        }

      }

      // threshold set
      threshold = option.threshold;

      // 処理判定
      isStart = typeof option.touchStart === "function";
      isMove = typeof option.touchMove === "function";
      isEnd = typeof option.touchEnd === "function";
      isCancelMove = typeof option.moveCanceled === "function";
      isCancelEnd = typeof option.endCanceled === "function";

      isAny = isStart || isMove || isEnd || isCancelMove || isCancelEnd;

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

        if ( isMove || isCancelMove ) {

          element.addEventListener( "touchmove", boundMove, false );

        }

        if ( isEnd || isCancelEnd ) {

          element.addEventListener( "touchend", boundEnd, false );

        }

        startY = event.changedTouches[ 0 ].pageY;
        startTop = scrollTop();
        prevY = startY;
        prevTop = startTop;

        if ( isStart ) {

          event.y = startY;
          event.top = startTop;

          option.touchStart( event );

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

        event.y = y;
        event.top = top;
        event.movedY = prevY - y;
        event.movedTop = prevTop - top;

        prevY = y;
        prevTop = top;

        if ( _abs( y - prevY ) >= threshold || _abs( top - prevTop ) >= threshold ) {

          // なにもしない
          event.preventDefault();

          if ( isCancelMove ) {

            option.moveCanceled( event );

          }

        } else {

          if ( isMove ) {

            option.touchMove( event );

          }

        }

      }
      /**
       * element touchend event handler
       * @method touchEnd
       * @param {Event} event
       * @private
       */
      function touchEnd ( event ) {

        var
          y = event.changedTouches[ 0 ].pageY,
          top = scrollTop();

        event.y = y;
        event.top = top;
        event.movedY = startY - y;
        event.movedTop = startTop - top;

        element.removeEventListener( "touchmove", boundMove );
        element.removeEventListener( "touchend", boundEnd );

        if ( _abs( y - startY ) >= threshold || _abs( top - startTop ) >= threshold ) {

          // なにもしない

          if ( isCancelEnd ) {

            option.endCanceled( event );

          }

        } else {

          if ( isEnd ) {

            option.touchEnd( event );

          }

        }

      }

      // instance property
      Object.defineProperties(
        this,
        {

          /**
           * read only property, 列挙可, touchevent target Element
           * @property element
           * @type {{ value: Element }}
           * @readOnly
           */
          "element": {
            value: element,
            enumerable: true
          },
          /**
           * read only property, 列挙可, options
           * @property option
           * @type {{ threshold: number, touchStart: function, touchMove: function, touchEnd: function, moveCanceled: function, endCanceled: function }}
           * @readOnly
           */
          "option": {
            value: option,
            enumerable: true
          },
          /**
           * getter / setter threshold, require Number
           * @property threshold
           * @type {{get: Function, set: Function}}
           */
          "threshold": {
            get: function () {

              return threshold;

            },
            set: function ( n ) {

              if ( isNumber( n ) ) {

                threshold = n;
                option.threshold = n;

              } else {

                console.warn( "threshold is number require. " + n );

              }

            },
            enumerable: true
          },
          /**
           * read only property, 列挙可, toucheventを監視するか否かの真偽値
           * @property enable
           * @type {{value: Boolean}}
           * @private
           */
          "isAny": {
            value: isAny
          },
          /**
           * bound function, touchStart
           * @property boundStart
           * @type {{value: Function}}
           * @private
           */
          "boundStart": {
            value: boundStart
          },
          /**
           * bound function, touchMove
           * @property boundMove
           * @type {{value: Function}}
           * @private
           */
          "boundMove": {
            value: boundMove
          },
          /**
           * bound function, touchEnd
           * @property boundEnd
           * @type {{value: Function}}
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

    /**
     * @method init
     */
    p.init = function () {

      this.activate();

    };
    /**
     * @method activate
     */
    p.activate = function () {

      if ( this.isAny ) {

        this.element.addEventListener( "touchstart", this.boundStart, false );

      }

    };
    /**
     * @method abort
     */
    p.abort = function () {

      this.element.removeEventListener( "touchstart", this.boundStart );

    };

    return Nazeru;

  }() );

}( window ) );

/*=========================
 jQuery & Zepto Plugins
 ===========================*/
if (window.jQuery || window.Zepto) {
  (function ($) {
    'use strict';
    var
      Nazeru = window.Nazeru;

    $.fn.nazeru = function (params) {

      $(this).each( function (index,element) {

        var nazeru = new Nazeru(element, params);
        nazeru.init();
        $(this).data('nazeru', nazeru);
        //return nazeru;

      } );

      return this;

    };
  })(window.jQuery || window.Zepto);
}

// component
if (typeof(module) !== 'undefined')
{
  module.exports = window.Nazeru;
}

// requirejs support
if (typeof define === 'function' && define.amd) {
  define([], function () {
    'use strict';
    return window.Nazeru;
  });
}
