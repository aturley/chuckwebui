function drawCircles(ctx, circles) {
  for (i = 0; i < circles.length; i++) {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    var x = circles[i].x;
    var y = circles[i].y;
    ctx.arc(x, y, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}

function drawCircle(ctx, x, y) {
  ctx.fillStyle = "#FF0000";
  ctx.beginPath();
  ctx.arc(x, y, 50, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function drawRect(ctx, x, y) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x, y, 100, 100);
}

function Touch(x, y) {
  this.x = x;
  this.y = y;
}

function doTouch(ctx, touchEvt) {
  // ctx.clearRect(0,0,400,600);
  var touches = new Array(touchEvt.touches.length);
  for (i = 0; i < touchEvt.touches.length; i++) {
    touches[i] = new Touch(touchEvt.touches[i].pageX, touchEvt.touches[i].pageY);
    // drawCircle(ctx, touchEvt.touches[i].pageX, touchEvt.touches[i].pageY)
    // drawRect(ctx, touchEvt.touches[i].pageX, touchEvt.touches[i].pageY)
  }
  drawCircles(ctx, touches);
}


function touchEvt(evt) {
  evt.preventDefault();
  doTouch(getCanvasContext(), evt);
}

function doMouse(ctx, evt){
  drawRect(ctx, evt.pageX, evt.pageY);
}

function mouseEvt(evt) {
  doMouse(getCanvasContext(), evt);
}
