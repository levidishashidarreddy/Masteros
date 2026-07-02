import React, { useEffect, useRef } from 'react';

const ShaderBackground = ({ type = 'landing' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsLandingSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
          vec2 uv = v_texCoord;
          vec3 color1 = vec3(0.015, 0.015, 0.02); // Deep Outpero black
          vec3 color2 = vec3(0.02, 0.02, 0.025); 
          vec3 accent = vec3(0.55, 0.36, 0.96); // Purple/indigo accent (#8B5CF6)
          
          float n = noise(uv + u_time * 0.05);
          float glow = smoothstep(0.4, 0.6, sin(uv.x * 1.5 + u_time * 0.1) * cos(uv.y * 1.5 + u_time * 0.05) * 0.5 + 0.5);
          
          vec3 finalColor = mix(color1, color2, uv.y);
          finalColor += accent * glow * 0.015; // Very subtle ambient purple glow (reduced from 0.06)
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fsAuthSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
          vec2 uv = v_texCoord;
          vec3 color1 = vec3(0.015, 0.015, 0.02); 
          vec3 color2 = vec3(0.02, 0.02, 0.025); 
          vec3 accent = vec3(0.39, 0.4, 0.95); // Indigo accent (#6366F1)
          
          // Slow faint drifting glow
          float glow = smoothstep(0.3, 0.7, sin(uv.x * 1.2 + u_time * 0.05) * cos(uv.y * 1.2 + u_time * 0.02) * 0.5 + 0.5);
          
          // Subtle moving "lines" interference
          float lines = step(0.998, sin(uv.y * 80.0 + u_time * 0.05));
          
          vec3 finalColor = mix(color1, color2, uv.y);
          finalColor += accent * glow * 0.02; // Very subtle ambient indigo glow (reduced from 0.07)
          finalColor += accent * lines * 0.008;
          
          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const fsSource = type === 'auth' ? fsAuthSource : fsLandingSource;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking program:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = 1.0 - (e.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const syncSize = () => {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    const render = (time) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTimeLoc) gl.uniform1f(uTimeLoc, time * 0.001);
      if (uResolutionLoc) gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      if (uMouseLoc) gl.uniform2f(uMouseLoc, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 block opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ShaderBackground;
