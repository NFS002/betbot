
var appendStatus = function( text ) {
    var placeHolder = 0;
    var textAdder = setInterval( function(){
    document.getElementById("text").innerHTML += text.charAt( placeHolder );
    if (++placeHolder == text.length){
        clearInterval(textAdder);
    }
 }, 100);
}
