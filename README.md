# nazeru.js
JavaScript, touchevent helper

Elementへtoucheventを設定します。  
いきなりtoucheventを発火しないようにtouchmove（スクロール）を可能にします。  
依存ファイルはありません。

# HTML
    <a href="#" id="touch-example">example</a>
    
# JavaScript
    function touchEnd ( event ) {
    
        event.stopPropagation();
        event.preventDefault();
        
        // something do
    
    }
    
    var nazeru = new Nazeru( document.getElementId( "touch-example", { touchEnd: touchEnd } ) );
    nazeru.init();

# jQuery
jQuery plugin としても使用可能です。

    $( "#touch-example" ).nazeru( { touchEnd: touchEnd } );
    
# API

- threshold  
Number  
50(px)  
Y方向移動許容距離  
50px 以内の移動（スクロール）は touchevent を発火


- touchStart  
Function  
touchstart callback function
 

- touchMove  
Function  
touchmove callback function  
threshold 指定距離未満移動した時に呼び出される


- touchEnd  
Function
touchend callback function  
threshold 指定距離未満移動した時に呼び出される


- moveCanceled  
Function
touchmove callback function  
threshold 指定距離以上を移動した時に呼び出される


- endCanceled  
Function
touchend callback function  
threshold 指定距離以上を移動した時に呼び出される
