const tiltSettings = {
    max: 100,
    perspective: 1500,
    scale: 1.2
  };
  
  const cards = document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => mouseMove(e, card));
    card.addEventListener("mouseleave", (e) => mouseLeave(e, card));
  });
  
  function mouseMove(event, card) {
    const cardWidth = card.getBoundingClientRect().width;
    const cardHeight = card.getBoundingClientRect().height;
    const centerX = card.getBoundingClientRect().left + cardWidth / 2;
    const centerY = card.getBoundingClientRect().top + cardHeight / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const rotateX = (mouseY / cardHeight / 2) * tiltSettings.max;
    const rotateY = (mouseX / cardWidth / 2) * tiltSettings.max * -1;
  
    console.log(centerX, centerY);
  
    card.style.transform = `perspective(${tiltSettings.perspective}px)
                              rotatex(${rotateX}deg)
                              rotatey(${rotateY}deg)
                              scale3d(${tiltSettings.scale}, ${tiltSettings.scale}, ${tiltSettings.scale})`;
  }
  
  function mouseLeave(event, card) {
    card.style.transform = "";
  }

  window.onload = function() {
    Particles.init({
      selector: '.background',
      sizeVariations: 30,
      color: [
        'da181846', 'rgba(105,62,19)', 'rgba(180,135,54)'
      ]
    });
  };

  var Particles=function(t,i){"use strict";function e(t,i){return Object.keys(i).forEach(function(e){t[e]=i[e]}),t}function r(t){var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return i?{r:parseInt(i[1],16),g:parseInt(i[2],16),b:parseInt(i[3],16)}:null}var s,a,n,o,h;return s=function(){this.storage=[],this.defaults={maxParticles:100,sizeVariations:3,speed:.5,color:"#000000",minDistance:120,connectParticles:!1},this.init=function(s){if(t.addEventListener("resize",this.resize.bind(this),!1),void 0===s||!s.selector)return console.warn("particles.js: No selector is specified! Check https://github.com/marcbruederlin/particles.js#options"),!1;h=e(this.defaults,s),h.color=r(h.color),n=i.querySelector(h.selector),o=n.getContext("2d"),n.width=t.innerWidth,n.height=t.innerHeight;for(var c=h.maxParticles;c--;)this.storage.push(new a);this.animate()},this.animate=function(){this.draw(),t.requestAnimFrame(this.animate.bind(this))},this.draw=function(){o.clearRect(0,0,n.width,n.height);for(var t=this.storage.length;t--;){var i=this.storage[t];i.draw()}this.update()},this.update=function(){for(var t=this.storage.length;t--;){var i=this.storage[t];if(i.x+=i.vx,i.y+=i.vy,i.x+i.radius>n.width?i.x=i.radius:i.x-i.radius<0&&(i.x=n.width-i.radius),i.y+i.radius>n.height?i.y=i.radius:i.y-i.radius<0&&(i.y=n.height-i.radius),h.connectParticles)for(var e=t+1;e<this.storage.length;e++){var r=this.storage[e];this.distance(i,r)}}},this.distance=function(t,i){var e,r=t.x-i.x,s=t.y-i.y;e=Math.sqrt(r*r+s*s),e<=h.minDistance&&(o.beginPath(),o.strokeStyle="rgba("+h.color.r+", "+h.color.g+", "+h.color.b+", "+(1.2-e/h.minDistance)+")",o.moveTo(t.x,t.y),o.lineTo(i.x,i.y),o.stroke(),o.closePath())},this.resize=function(){n.width=t.innerWidth,n.height=t.innerHeight,this.draw()}},a=function(){this.x=Math.random()*n.width,this.y=Math.random()*n.height,this.vx=Math.random()*h.speed*2-h.speed,this.vy=Math.random()*h.speed*2-h.speed,this.radius=Math.random()*Math.random()*h.sizeVariations,this.draw=function(){o.fillStyle="rgb("+h.color.r+", "+h.color.g+", "+h.color.b+")",o.beginPath(),o.arc(this.x,this.y,this.radius,0,2*Math.PI,!1),o.fill()},this.draw()},t.requestAnimFrame=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||function(i){t.setTimeout(i,1e3/60)}}(),new s}(window,document);

setTimeout(function(){
  var options = {
          selector: '#myCanvas',
          color: '#ffffff',
          connectParticles: true,
          minDistance: 80,
          sizeVariations: 3
        };
  Particles.init( options );
}, 1000);


