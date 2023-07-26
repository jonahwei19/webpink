module.exports = function startAnimation(frag) {
  const canvas = document.createElement('canvas');
  const sandbox = new GlslCanvas(canvas);

  document.getElementById("hero").appendChild(canvas);

  sandbox.load(frag);
  sandbox.setUniform("seed", Math.random());

  const sizer = function () {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const dpi = window.devicePixelRatio;
    const s = Math.max(ww, wh);
    
    canvas.width = s * dpi;
    canvas.height = s * dpi;
    canvas.style.width = s + 'px';
    canvas.style.height = s + 'px';
  }

  sizer();

  window.addEventListener('resize', sizer);
}
