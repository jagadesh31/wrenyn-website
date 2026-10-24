type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
type Mote = { u: number; y: number; v: number; r: number; p: number; s: number };

// [x, z, height, spreadX, spreadZ] in world units; the camera looks down +z.
const PEAKS = [
  [0.6, 3.5, 0.78, 0.7, 0.62], [1.7, 4.5, 1.02, 0.95, 0.8], [2.7, 3.3, 0.72, 0.75, 0.7],
  [-0.3, 2.9, 0.34, 0.62, 0.5], [1.15, 2.25, 0.36, 0.65, 0.42], [-1.4, 4.4, 0.3, 0.85, 0.7],
  [3.5, 5.7, 0.98, 1.15, 1], [0.3, 5.9, 0.58, 1.05, 0.8], [2.1, 2.7, 0.44, 0.62, 0.45],
];
const NP = PEAKS.length;
const MOTES = 90;

const DEFS = `#define Z0 1.5\n#define Z1 7.5\n#define NL 200.0\n#define NP ${NP}\n`;
const SKY = `uniform float uPulse;uniform vec3 uGlow;
vec3 sky(){float r=length(gl_FragCoord.xy-uGlow.xy)/uGlow.z;float a=uPulse*.2*pow(1.-clamp(r,0.,1.),3.);
return mix(vec3(.1255,.1373,.1333),vec3(.776,.953,.42),a);}
`;
const TERRAIN_VS = `${DEFS}
attribute vec2 aP;
uniform vec2 uRes;uniform float uF,uHZ,uCX,uCY,uT,uFW,uMob,uSweep;
uniform vec4 uPK[NP];uniform float uA[NP];
varying float vL,vX,vI,vFog;
float hgt(float X,float Z){
  float h=0.;
  for(int i=0;i<NP;i++){vec4 p=uPK[i];vec2 d=vec2((X-p.x)/p.z,(Z-p.y)/p.w);h+=uA[i]*exp(-dot(d,d));}
  h+=h*(.18*sin(X*3.1+Z*1.4)*sin(Z*2.6-X*1.9+1.2)+.05*(1.-abs(sin(X*4.3+Z*.8+.6))));
  h+=.045*sin(X*2.1+Z*1.7-uT*.9)+.022*sin(X*4.9-Z*3.2+uT*1.3)+.011*sin(X*9.5+Z*6.-uT*2.1);
  if(uMob<.5)h*=.22+.78*smoothstep(.18,.6,.5+X*uFW/Z);
  return h;
}
void main(){
  float z=1./(1./Z1+(1./Z0-1./Z1)*aP.y);
  float X=uCX+(aP.x-.5)*uRes.x*z/uF;
  float h=hgt(X,z),e=.015;
  float hx=(hgt(X+e,z)-hgt(X-e,z))/(2.*e),hz=(hgt(X,z+e)-hgt(X,z-e))/(2.*e);
  float dd=dot(normalize(vec3(-hx,1.,-hz)),normalize(vec3(.74,.6,.3)));
  float u=clamp(aP.x,0.,1.),q=(u-uSweep)/.16,band=exp(-q*q);
  float fog=1.-smoothstep(3.2,Z1+.3,z);
  float I=pow(smoothstep(.45,.95,dd),1.2)*(uMob>.5?1.:.5+.7*u)*(.75+.9*band);
  vI=min(1.,(I+.3*band*smoothstep(.2,.8,h))*fog);
  vFog=fog;vL=aP.y*NL;vX=X;
  float sy=uHZ+(uCY-h)*uF/z;
  gl_Position=vec4(aP.x*2.-1.,1.-sy/uRes.y*2.,(z-Z0)/(Z1-Z0)*2.-1.,1.);
}`;
const TERRAIN_FS = `uniform float uTf,uD;
varying float vL,vX,vI,vFog;
void main(){
  vec3 lime=vec3(.776,.953,.42);
  // MSAA can shade pixels just outside a triangle, extrapolating varyings past their range.
  float I=clamp(vI,0.,1.),fog=clamp(vFog,0.,1.);
  float w=max(fwidth(vL),1e-4),px=abs(fract(vL+.5)-.5)/w;
  float dens=clamp(1.6-w*uD*2.4,0.,1.),lw=(.55+.6*I)*uD;
  // Where lines are packed tighter than a pixel, show their average coverage instead of dark gaps.
  float line=mix(clamp(lw*w*1.2,0.,.7),1.-smoothstep(lw-.5,lw+.6,px),dens);
  vec3 col=mix(vec3(.106,.118,.114),vec3(.3,.42,.16),I*.9);
  col=mix(col,mix(vec3(.34,.38,.355),lime,I),line*(.4+.6*I));
  col+=lime*I*I*.35*exp(-px/uD*.7)*dens;
  // Derivatives must stay outside branches, so dotted rows are selected with a multiplier.
  float li=floor(vL+.5),dc=vX*43.-uTf*4.+li*.37;
  float dx=abs(fract(dc)-.5)/max(fwidth(vX)*43.,1e-4);
  float r=length(vec2(dx,px))/uD;
  float g=pow(I,1.1)*(.6+.4*sin(li*12.9+floor(dc)*1.7+uTf*3.))*step(mod(li,3.),.5);
  col+=vec3(.86,1.,.6)*(1.-smoothstep(.7,1.8,r))*g+lime*exp(-r*.45)*.3*g;
  gl_FragColor=vec4(mix(sky(),col,.45+.55*fog),1.);
}`;
const SKY_VS = "attribute vec2 aQ;void main(){gl_Position=vec4(aQ,0.,1.);}";
const MOTE_VS = `attribute vec4 aM;uniform vec2 uRes;uniform float uD;varying float vA;
void main(){gl_Position=vec4(aM.x/uRes.x*2.-1.,1.-aM.y/uRes.y*2.,0.,1.);gl_PointSize=aM.w*uD;vA=aM.z;}`;
const MOTE_FS = `varying float vA;void main(){float r=length(gl_PointCoord-.5)*2.;float k=1.-smoothstep(0.,1.,r);
gl_FragColor=vec4(vec3(.776,.953,.42)*vA*k*k,1.);}`;

function sm(a: number, b: number, v: number) {
  v = (v - a) / (b - a);
  v = v < 0 ? 0 : v > 1 ? 1 : v;
  return v * v * (3 - 2 * v);
}

function resetMote(m: Mote, anywhere: boolean) {
  m.u = Math.random();
  m.y = anywhere ? 0.2 + Math.random() * 0.85 : 1.04;
  m.v = 0.012 + Math.random() * 0.035;
  m.r = 0.6 + Math.random() * 1.5;
  m.p = Math.random() * 6.283;
  m.s = 0.35 + Math.random() * 0.65;
  return m;
}

export function startHills(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext("webgl", { antialias: true, alpha: false, powerPreference: "high-performance" });
  if (!gl) return () => {};
  const g = gl;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const amp = new Float32Array(NP);
  const peakVec = new Float32Array(NP * 4);
  PEAKS.forEach((p, i) => peakVec.set([p[0], p[1], p[3], p[4]], i * 4));
  const motes: Mote[] = Array.from({ length: MOTES }, () => resetMote({} as Mote, true));
  const moteBuf = new Float32Array(MOTES * 4);

  let W = 0, H = 0, D = 1, F = 1, HZ = 0, mob = false, nIdx = 0, meshKey = "";
  let t = 0, last = 0, camX = 0, camY = 0.9, raf = 0;
  let TR: Prog, SK: Prog, MO: Prog;
  let bufs: { mesh: WebGLBuffer; idx: WebGLBuffer; quad: WebGLBuffer; motes: WebGLBuffer };

  function fragHead() {
    const deriv = g.getExtension("OES_standard_derivatives")
      ? "#extension GL_OES_standard_derivatives : enable\n"
      : "#define fwidth(x) (0.5)\n";
    return deriv + "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n";
  }
  function shader(type: number, src: string) {
    const s = g.createShader(type)!;
    g.shaderSource(s, src);
    g.compileShader(s);
    if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) ?? "shader error");
    return s;
  }
  function program(vs: string, fs: string, attr: string): Prog {
    const p = g.createProgram()!;
    g.attachShader(p, shader(g.VERTEX_SHADER, vs));
    g.attachShader(p, shader(g.FRAGMENT_SHADER, fs));
    g.bindAttribLocation(p, 0, attr);
    g.linkProgram(p);
    if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) ?? "link error");
    const u: Prog["u"] = {};
    const count = g.getProgramParameter(p, g.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const name = g.getActiveUniform(p, i)!.name.replace(/\[0\]$/, "");
      u[name] = g.getUniformLocation(p, name);
    }
    return { p, u };
  }
  function init() {
    const head = fragHead();
    TR = program(TERRAIN_VS, head + SKY + TERRAIN_FS, "aP");
    SK = program(SKY_VS, head + SKY + "void main(){gl_FragColor=vec4(sky(),1.);}", "aQ");
    MO = program(MOTE_VS, head + MOTE_FS, "aM");
    bufs = { mesh: g.createBuffer()!, idx: g.createBuffer()!, quad: g.createBuffer()!, motes: g.createBuffer()! };
    g.bindBuffer(g.ARRAY_BUFFER, bufs.quad);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    meshKey = "";
  }
  function buildMesh(cols: number, rows: number) {
    const key = `${cols}x${rows}`;
    if (key === meshKey) return;
    meshKey = key;
    const v = new Float32Array((cols + 1) * (rows + 1) * 2);
    const idx = new Uint16Array(cols * rows * 6);
    let k = 0;
    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= cols; i++) { v[k++] = -0.02 + (1.04 * i) / cols; v[k++] = j / rows; }
    k = 0;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const a = j * (cols + 1) + i, b = a + cols + 1;
        idx[k++] = a; idx[k++] = b; idx[k++] = a + 1; idx[k++] = a + 1; idx[k++] = b; idx[k++] = b + 1;
      }
    g.bindBuffer(g.ARRAY_BUFFER, bufs.mesh);
    g.bufferData(g.ARRAY_BUFFER, v, g.STATIC_DRAW);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, bufs.idx);
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, idx, g.STATIC_DRAW);
    nIdx = idx.length;
  }
  function size() {
    const r = canvas.getBoundingClientRect();
    D = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * D);
    canvas.height = Math.round(H * D);
    mob = W < 700;
    F = mob ? Math.max(W * 1.15, H * 0.62) : Math.max(W * 0.9, H * 1.1);
    HZ = H * (mob ? 0.6 : 0.4);
    buildMesh(mob ? 160 : 240, mob ? 160 : 200);
    g.useProgram(TR.p);
    g.uniform2f(TR.u.uRes, W, H);
    g.uniform1f(TR.u.uF, F);
    g.uniform1f(TR.u.uHZ, HZ);
    g.uniform1f(TR.u.uFW, F / W);
    g.uniform1f(TR.u.uMob, mob ? 1 : 0);
    g.uniform1f(TR.u.uD, D);
    g.uniform4fv(TR.u.uPK, peakVec);
    g.useProgram(MO.p);
    g.uniform2f(MO.u.uRes, W, H);
    g.uniform1f(MO.u.uD, D);
    if (reduce) draw();
  }
  function draw() {
    const pulse = 0.82 + 0.18 * Math.sin(t * 0.8);
    const gx = W * (mob ? 0.78 : 0.86), gy = H * (mob ? 0.45 : 0.2), gr = Math.max(W, H) * 0.62;
    g.viewport(0, 0, canvas.width, canvas.height);
    g.disable(g.BLEND);
    g.disable(g.DEPTH_TEST);

    g.useProgram(SK.p);
    g.uniform1f(SK.u.uPulse, pulse);
    g.uniform3f(SK.u.uGlow, gx * D, (H - gy) * D, gr * D);
    g.bindBuffer(g.ARRAY_BUFFER, bufs.quad);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);

    g.enable(g.DEPTH_TEST);
    g.depthFunc(g.LESS);
    g.clear(g.DEPTH_BUFFER_BIT);
    g.useProgram(TR.p);
    for (let i = 0; i < NP; i++) amp[i] = PEAKS[i][2] * (1 + 0.08 * Math.sin(t * 0.45 + i * 1.7));
    g.uniform1fv(TR.u.uA, amp);
    g.uniform1f(TR.u.uT, t);
    g.uniform1f(TR.u.uTf, t);
    g.uniform1f(TR.u.uCX, camX);
    g.uniform1f(TR.u.uCY, camY);
    g.uniform1f(TR.u.uSweep, ((t * 0.1) % 1.7) - 0.35);
    g.uniform1f(TR.u.uPulse, pulse);
    g.uniform3f(TR.u.uGlow, gx * D, (H - gy) * D, gr * D);
    g.bindBuffer(g.ARRAY_BUFFER, bufs.mesh);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, bufs.idx);
    g.drawElements(g.TRIANGLES, nIdx, g.UNSIGNED_SHORT, 0);

    g.disable(g.DEPTH_TEST);
    g.enable(g.BLEND);
    g.blendFunc(g.ONE, g.ONE);
    motes.forEach((m, i) => {
      const a = sm(1.04, 0.85, m.y) * sm(0.18, 0.45, m.y) * (0.35 + 0.65 * Math.sin(t * 1.8 + m.p) ** 2) * m.s;
      moteBuf[i * 4] = (mob ? m.u : 0.3 + m.u * 0.7) * W + Math.sin(t * 0.6 + m.p) * 14;
      moteBuf[i * 4 + 1] = m.y * H;
      moteBuf[i * 4 + 2] = a;
      moteBuf[i * 4 + 3] = m.r * 4 + 3;
    });
    g.useProgram(MO.p);
    g.bindBuffer(g.ARRAY_BUFFER, bufs.motes);
    g.bufferData(g.ARRAY_BUFFER, moteBuf, g.DYNAMIC_DRAW);
    g.vertexAttribPointer(0, 4, g.FLOAT, false, 0, 0);
    g.drawArrays(g.POINTS, 0, MOTES);
  }
  function loop(ts: number) {
    const dt = Math.min((ts - last) / 1000 || 0, 0.05);
    last = ts;
    t += dt;
    camX = 0.12 * Math.sin(t * 0.07);
    camY = 0.9 + 0.04 * Math.sin(t * 0.13);
    for (const m of motes) { m.y -= m.v * dt; if (m.y < 0.18) resetMote(m, false); }
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() {
    init();
    size();
    cancelAnimationFrame(raf);
    if (reduce) { t = 6; draw(); } else raf = requestAnimationFrame(loop);
  }

  const onLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); };
  const onResize = () => size();
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", start);
  window.addEventListener("resize", onResize);
  start();

  return () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("webglcontextlost", onLost);
    canvas.removeEventListener("webglcontextrestored", start);
    window.removeEventListener("resize", onResize);
  };
}
