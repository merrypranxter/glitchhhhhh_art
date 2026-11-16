const vertex = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
#define PI 3.14159265359
#define TAU 6.28318530718
uniform vec2 res;
uniform float time,colorTime,seed,seedHigh,complexity,scale,warp,split,scan,grain,glitch,rotation,symmetry,blend,block,pixel,vignette;
uniform float saturation,contrast,brightness,colorOffset,colorRepeat,colorAmount;
uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;
uniform bool bloom,posterize,mirror,invert;
uniform vec3 colors[8];uniform vec4 marks[32];uniform vec2 markShape[32];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed+seedHigh*7.83)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+3.4;a*=.5;}return v;}
mat2 rotate(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
vec3 palette(float t){float q=fract(t)*float(colorCount);int a=int(floor(q));vec3 c=colors[0],d=colors[0];for(int i=0;i<8;i++){if(i==a)c=colors[i];if(i==a+1)d=colors[i];}if(a==colorCount-1)d=colors[0];return mix(c,d,smoothstep(0.,1.,fract(q)));}
float field(vec2 p,int kind){float t=time*.3,f=0.;
if(kind==0){for(int i=0;i<5;i++){float n=float(i)+1.;p+=warp*.32*vec2(sin(p.y*n+t/n),cos(p.x*n-t/n));f+=sin(p.x*n+cos(p.y*n+t))/n;}f=f*.25+length(p)*.12;}
else if(kind==1){f=sin(length(p-vec2(sin(t),cos(t)))*12.)*sin(length(p+vec2(cos(t*.7),sin(t*.8)))*13.);f=f*.4+length(p)*.15;}
else if(kind==2){vec2 z=p*.5;for(int i=0;i<7;i++){z=abs(z)/clamp(dot(z,z),.2,2.)-vec2(.8+warp*.5,.65+sin(t)*.12);}f=length(z)*.25+atan(z.y,z.x)*.1;}
else if(kind==3){f=sin(p.x*(12.+complexity*20.)+t)*sin((p.x*cos(.4+t*.04)+p.y*sin(.4+t*.04))*20.)*.4+sin(length(p)*10.-t)*.2;}
else if(kind==4){vec2 b=floor(p*(8.+complexity*30.));f=hash(b+floor(t*3.))*.7+sin(b.x*.2+b.y*.3+t)*.3;}
else if(kind==5){float r=length(p);f=1./(r+.15)*.5+atan(p.y,p.x)*(.7+complexity)+sin(r*12.-t)*warp*.3;}
else if(kind==6){vec2 q=vec2(fbm(p+t*.14),fbm(p+vec2(4.3,7.1)-t*.12));vec2 r=vec2(fbm(p+q*4.*warp+vec2(1.7,9.2)+t*.13),fbm(p+q*4.*warp+vec2(8.3,2.8)-t*.11));f=fbm(p+r*(2.+warp*4.));}
else if(kind==7){vec2 z=p*(1.2+complexity*1.8),g=floor(z),q=fract(z);float first=8.,second=8.;for(int j=-1;j<=1;j++){for(int i=-1;i<=1;i++){vec2 o=vec2(float(i),float(j));vec2 h=vec2(hash(g+o),hash(g+o+19.));vec2 point=.5+.42*sin(TAU*h+t*(.3+warp));float d=length(o+point-q);if(d<first){second=first;first=d;}else second=min(second,d);}}f=(second-first)*.65+first*.35;}
else if(kind==8){float r=length(p),a=atan(p.y,p.x);float petals=3.+floor(complexity*9.);f=sin(r*(5.+warp*8.)-t)*.18+cos(a*petals+t*.7)*exp(-r*.23)*.2+sin(r*3.+a*2.+t)*.16;}
else if(kind==9){vec2 flow=p+warp*vec2(sin(p.y*.8+t*.4),cos(p.x*.6-t*.3));f=fbm(flow*.8+vec2(t*.12,-t*.08));f+=sin(p.x*.5+p.y*.3+t*.15)*.14;}
else if(kind==10){vec2 z=p+warp*.3*vec2(sin(p.y*3.+t),cos(p.x*3.-t));float x=sin(z.x*(8.+complexity*15.)+t),y=sin(z.y*(8.+complexity*15.)-t);f=mix(x*.17+y*.17,abs(x)-abs(y),.22)+step(0.,x*y)*.09;}
else {float a=atan(p.y,p.x),r=length(p);float n=3.+floor(complexity*7.);float wedge=cos(floor(.5+a/(TAU/n))*(TAU/n)-a)*r;f=sin(wedge*(5.+warp*9.)-t)*.18+sin(r*7.+t)*.12+floor(r*2.5)*.07;}
return f;}
float composed(vec2 p){float a=field(p,engine);if(blend<.001)return a;float b=field(rotate(.43)*p+vec2(.37,-.21),secondaryEngine);float c=b;if(blendMode==1)c=a*b*2.;if(blendMode==2)c=abs(a-b);return mix(a,c,blend);}
float phaseOf(float value,vec2 uv,float source){float bands=(2.+complexity*5.)*pow(2.,(colorRepeat-.5)*2.);float phase=value*bands+seed*.001+seedHigh*.017+colorTime*.04+colorOffset;
if(colorAmount>.0){float t=colorTime/12.;vec2 s=(uv-.5)*3.;float voice=0.;if(colorMode==0){voice=t+.55*s.x+.22*s.y+.2*sin(TAU*(t+s.y))+.1*sin(TAU*(2.*t+s.x));}else if(colorMode==1){voice=t+.25*s.x+.15*s.y+.24*sin(TAU*(t+.19*s.x+.17*s.y))+.12*sin(TAU*(2.*t+.38*s.x+.17*s.y)+1.7)+.07*sin(TAU*(3.*t+.57*s.x+.17*s.y)+3.4);}else{voice=t+atan(s.y,s.x)/TAU+.25*sin(length(s)*6.-t*TAU);}phase+=colorAmount*voice;}
phase+=source;if(posterize)phase=floor(phase*7.)/7.;return phase;}
void main(){vec2 uv=gl_FragCoord.xy/res;vec2 aspect=vec2(res.x/res.y,1.);vec2 sampleUV=uv;
if(pixel>.001){float cells=mix(600.,24.,pow(pixel,.65));sampleUV=(floor(uv*vec2(cells*aspect.x,cells))+.5)/vec2(cells*aspect.x,cells);}
vec2 p=(sampleUV-.5)*aspect*(2.+scale*5.);p=rotate(rotation)*p;
if(mirror)p.x=abs(p.x);if(symmetry>1.5){float wedge=TAU/floor(symmetry);float angle=mod(atan(p.y,p.x)+wedge*.5,wedge)-wedge*.5;p=length(p)*vec2(cos(angle),sin(angle));}
float band=floor(uv.y*90.);float tear=step(1.-glitch*.13,hash(vec2(band,floor(time*5.))));p.x+=tear*(hash(vec2(band,2.))-.5)*glitch*2.;
float blocks=step(1.-block*.32,hash(floor(uv*vec2(17.,24.))+floor(time*2.)));p+=blocks*block*vec2(hash(floor(uv*16.))-.5,hash(floor(uv*14.)+2.)-.5)*2.;
float source=0.;for(int i=0;i<32;i++){if(i<count){vec2 d=(uv-marks[i].xy)*aspect;float radius=max(markShape[i].x,.05);float influence=exp(-dot(d,d)/(radius*radius));float force=marks[i].z*influence;float a=markShape[i].y;vec2 local=rotate(a)*d;
if(marks[i].w<.5)p+=rotate(a)*vec2(sin(local.y*15.+time),cos(local.x*15.-time))*force;
else if(marks[i].w<1.5)p+=vec2(-d.y,d.x)*force*8.;else if(marks[i].w<2.5)p+=d*force*8.;else source+=force*(.5+.5*sin(2.*atan(d.y,d.x)+colorTime*.5+a));}}
float v=composed(p);vec3 col=palette(phaseOf(v,uv,source));float edge=pow(.5+.5*sin(v*(2.+complexity*5.)*TAU),18.);col*=.72+edge*.5;if(bloom)col+=edge*col*.24;
if(split>.001){col.r=mix(col.r,palette(phaseOf(composed(p+vec2(split*.09,0.)),uv,source)).r,split);col.b=mix(col.b,palette(phaseOf(composed(p-vec2(split*.09,0.)),uv,source)).b,split);}
col*=1.-scan*(.5+.5*sin(uv.y*900.))*.55;col+=(hash(floor(uv*1000.)+fract(time))-.5)*grain*.3;col=mix(col,col.brg,tear*.65);col=mix(col,col.gbr,blocks*block*.6);
float luma=dot(col,vec3(.2126,.7152,.0722));col=mix(vec3(luma),col,saturation*2.);col=(col-.5)*(.5+contrast)+.5;col*=.5+brightness;col*=1.-vignette*smoothstep(.15,.8,length((uv-.5)*aspect));if(invert)col=1.-col;
gl_FragColor=vec4(clamp(col,0.,1.),1.);}`;

export function createRenderer(canvas) {
  const options = {
    preserveDrawingBuffer: true,
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
  };
  const gl2 = canvas.getContext("webgl2", options),
    gl = gl2 || canvas.getContext("webgl", options);
  if (!gl)
    throw Error(
      "WebGL is unavailable. Enable hardware acceleration to use the studio.",
    );
  const programs = new Map();
  let active,
    fence = null;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw Error(error);
    }
    return shader;
  }
  function programFor(s) {
    const blended = s.blend > 0,
      key = `${s.engine}/${blended ? s.secondaryEngine : "off"}/${s.split > 0.1}`;
    if (programs.has(key)) {
      const cached = programs.get(key);
      programs.delete(key);
      programs.set(key, cached);
      return cached;
    }
    // Compile only the selected fields. Literal engine IDs let the driver eliminate
    // unused branches before GPU code generation; the equations are unchanged.
    let source = fragment.replace(
      "uniform int engine,secondaryEngine,blendMode,count,colorCount,colorMode;",
      `uniform int blendMode,count,colorCount,colorMode;\n#define engine ${s.engine}\n#define secondaryEngine ${s.secondaryEngine}`,
    );
    if (!blended)
      source = source.replace("if(blend<.001)return a;", "return a;");
    if (s.split <= 0.1) source = source.replace("if(split>.001)", "if(false)");
    const vs = gl2
      ? "#version 300 es\n" + vertex.replace("attribute vec2", "in vec2")
      : vertex;
    const fs = gl2
      ? "#version 300 es\n" +
        source
          .replace(
            "precision highp float;",
            "precision highp float;\nout vec4 fragColor;",
          )
          .replaceAll("gl_FragColor", "fragColor")
      : source;
    let vertexShader, fragmentShader, program;
    try {
      vertexShader = compile(gl.VERTEX_SHADER, vs);
      fragmentShader = compile(gl.FRAGMENT_SHADER, fs);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, "position");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(program));
      gl.detachShader(program, vertexShader);
      gl.detachShader(program, fragmentShader);
    } catch (e) {
      if (program) gl.deleteProgram(program);
      throw e;
    } finally {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    }
    const descriptor = { program, locations: new Map(), paletteKey: "" };
    programs.set(key, descriptor);
    if (programs.size > 6) {
      const oldest = programs.keys().next().value;
      gl.deleteProgram(programs.get(oldest).program);
      programs.delete(oldest);
    }
    return descriptor;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const loc = (key) => {
    if (!active.locations.has(key))
      active.locations.set(key, gl.getUniformLocation(active.program, key));
    return active.locations.get(key);
  };
  const colorBuffer = new Float32Array(24),
    marksBuffer = new Float32Array(128),
    shapeBuffer = new Float32Array(64);
  const maxSize = Math.min(
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    4096,
  );
  return {
    maxSize,
    readFrame(target) {
      gl.readPixels(
        0,
        0,
        canvas.width,
        canvas.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        target,
      );
    },
    ready() {
      if (gl.isContextLost()) return false;
      if (!fence) return true;
      const status = gl.clientWaitSync(fence, 0, 0);
      if (status === gl.TIMEOUT_EXPIRED) return false;
      gl.deleteSync(fence);
      fence = null;
      return true;
    },
    draw(s, timeline, width = canvas.width, height = canvas.height) {
      if (gl.isContextLost()) return false;
      width = Math.max(1, Math.round(width));
      height = Math.max(1, Math.round(height));
      if (width > maxSize || height > maxSize)
        throw Error(
          `This device supports exports up to ${maxSize}px per side.`,
        );
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      active = programFor(s);
      gl.viewport(0, 0, width, height);
      gl.useProgram(active.program);
      gl.uniform2f(loc("res"), width, height);
      gl.uniform1f(loc("time"), timeline.time);
      gl.uniform1f(loc("colorTime"), timeline.colorTime);
      gl.uniform1f(loc("seed"), s.seed % 1000000);
      gl.uniform1f(loc("seedHigh"), Math.floor(s.seed / 1000000));
      for (const k of [
        "complexity",
        "scale",
        "warp",
        "split",
        "scan",
        "grain",
        "glitch",
        "blend",
        "block",
        "pixel",
        "vignette",
        "saturation",
        "contrast",
        "brightness",
        "colorOffset",
        "colorRepeat",
        "colorAmount",
      ])
        gl.uniform1f(loc(k), s[k] / 100);
      gl.uniform1f(loc("rotation"), (s.rotation * Math.PI) / 180);
      gl.uniform1f(loc("symmetry"), s.symmetry);
      for (const k of ["bloom", "posterize", "mirror", "invert"])
        gl.uniform1i(loc(k), s[k] ? 1 : 0);
      gl.uniform1i(
        loc("blendMode"),
        ["Mix", "Multiply", "Difference"].indexOf(s.blendMode),
      );
      gl.uniform1i(
        loc("colorMode"),
        ["Traveling wave", "Color canon", "Phase vortex"].indexOf(s.colorMode),
      );
      gl.uniform1i(loc("colorCount"), s.colors.length);
      const key = s.colors.join("");
      if (key !== active.paletteKey) {
        active.paletteKey = key;
        for (let i = 0; i < 8; i++)
          for (let j = 0; j < 3; j++)
            colorBuffer[i * 3 + j] =
              parseInt(
                s.colors[i % s.colors.length].slice(1 + j * 2, 3 + j * 2),
                16,
              ) / 255;
        gl.uniform3fv(loc("colors[0]"), colorBuffer);
      }
      marksBuffer.fill(0);
      shapeBuffer.fill(0);
      s.marks.forEach((m, i) => {
        marksBuffer.set([m.x, m.y, m.power, m.mode], i * 4);
        shapeBuffer.set([m.radius, m.angle], i * 2);
      });
      gl.uniform4fv(loc("marks[0]"), marksBuffer);
      gl.uniform2fv(loc("markShape[0]"), shapeBuffer);
      gl.uniform1i(loc("count"), s.marks.length);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (gl2) {
        if (fence) gl.deleteSync(fence);
        fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
      }
      return true;
    },
    destroy(release = false) {
      if (fence) gl.deleteSync(fence);
      programs.forEach((p) => gl.deleteProgram(p.program));
      programs.clear();
      gl.deleteBuffer(buffer);
      if (release) gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
export function previewDimensions(
  width,
  height,
  quality = "Balanced",
  autoScale = 1,
) {
  const budget =
    { Eco: 320000, Balanced: 800000, Sharp: 1800000, Auto: 800000 }[quality] ||
    800000;
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2),
    factor =
      Math.min(dpr, Math.sqrt(budget / Math.max(1, width * height))) *
      (quality === "Auto" ? autoScale : 1);
  return {
    width: Math.max(1, Math.round(width * factor)),
    height: Math.max(1, Math.round(height * factor)),
  };
}
