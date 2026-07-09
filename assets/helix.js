/* Fondo decorativo de doble hélice, compartido por el menú y todos los quizzes. */
(function(){
  "use strict";
  var canvas = document.getElementById("helix");
  if(!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    canvas.style.width = w+"px"; canvas.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener("resize", resize);
  resize();

  function accentColor(){
    var v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    return v || "#3fc296";
  }

  function draw(t){
    ctx.clearRect(0,0,w,h);
    var col = accentColor();
    var amp = Math.min(120, w*0.12);
    var cx = w*0.82;
    var spacing = 34;
    ctx.lineWidth = 1;
    for(var y=-40; y<h+40; y+=spacing){
      var phase = (y/140) + (reduced?0:t*0.00035);
      var x1 = cx + Math.sin(phase)*amp;
      var x2 = cx + Math.sin(phase+Math.PI)*amp;
      var r1 = 2.4 + Math.cos(phase)*1.1;
      var r2 = 2.4 + Math.cos(phase+Math.PI)*1.1;

      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = col;
      ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x1,y,r1,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x2,y,r2,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if(reduced){
    draw(0);
  } else {
    function loop(t){ draw(t); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
  }
})();
