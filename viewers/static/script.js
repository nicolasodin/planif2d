var dragndrop = (function() {
  var myX = '',
      myY = '',
      movableImg = '';

  function resetZ() {
    // sets every image to a z-index of 5
    $('img').each(function(){
      $(this).css("z-index", "5");
    });
  }

  function moveStart(e) {
    // the target is the movable image
    movableImg = e.target;
    // offsetX and offsetY are relative to the parent container
    // sets variables myX and myY 
    // if element's offsetX is undefined, set it to layerX
    // otherwise, set it to offsetX
    myX = e.offsetX === undefined ? e.layerX : e.offsetX;
    myY = e.offsetY === undefined ? e.layerY : e.offsetY;
    // call the reset function and reset z-index of all images to 5
    resetZ();
    // set the z-index of the target element to 10
    $(movableImg).css("z-index", "10");
  }

  function moveDragOver(e) {
    e.preventDefault();
  }

  function moveDrop(e) {
    e.preventDefault();
    // set the positioning of movableImg (top/left)
    $(movableImg).css("left", e.pageX - myX + "px")
    $(movableImg).css("top", e.pageY - myY + "px")
  }

  function touchStart(e) {
    e.preventDefault();
    movableImg = e.target;
    var touch = e.touches[0];
    var moveOffsetX = movableImg.offsetLeft - touch.pageX;
    var moveOffsetY = movableImg.offsetTop - touch.pageY;
    // call the reset function and reset z-index of all images to 5
    resetZ();
    // set the z-index of the target element to 10
    $(movableImg).css("z-index", "10");

    $(movableImg).event('touchmove', function() {
      var positionX = touch.pageX + moveOffsetX;
      var positionY = touch.pageY + moveOffsetY;
      // set the positioning of movableImg (top/left)
      $(movableImg).css("left", positionX + "px")
      $(movableImg).css("top", positionY + "px")
    }, false);
  } 

  // element.addEventListener(event, function, useCapture)
  // $('body').bind("dragstart", function(){
  //   moveStart();
  // }, false)
 document.querySelector('body').addEventListener('dragstart', moveStart, false);
  document.querySelector('body').addEventListener('dragover', moveDragOver, false);
  document.querySelector('body').addEventListener('drop', moveDrop, false);
  document.querySelector('body').addEventListener('touchstart', touchStart, false);

})();