import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Box } from 'ogl';

type PrismProps = {
  animationType?: 'rotate' | 'float';
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
  className?: string;
};

/**
 * Lightweight OGL-based prism/diamond that can be used as a background element.
 * It renders to its own canvas and is positioned relative to its container.
 */
const Prism: React.FC<PrismProps> = ({
  animationType = 'rotate',
  timeScale = 0.6,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0.5,
  glow = 1,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.pointerEvents = 'none';

    const camera = new Camera(gl, { fov: 35 });
    camera.position.z = 10;

    const scene = new Transform();

    const geometry = new Box(gl, {
      width: baseWidth,
      height,
      depth: baseWidth * 0.5,
    });

    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec3 position;
        attribute vec3 normal;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        varying vec3 vNormal;
        uniform float uTime;
        uniform float uHue;
        uniform float uGlow;
        void main() {
          float l = normalize(vNormal).z * 0.5 + 0.5;
          float hue = mod(uHue + l * 60.0, 360.0);
          float sat = 0.8;
          float val = mix(0.4, 1.0, l);

          vec3 k = vec3(1.0, 2.0/3.0, 1.0/3.0);
          vec3 col = clamp(abs(mod(hue/60.0 + k, 2.0) - 1.0) - 1.0 + sat, 0.0, 1.0);
          col = val * mix(vec3(1.0), col, sat);

          float glow = smoothstep(0.0, 1.0, l) * uGlow * 0.4;
          gl_FragColor = vec4(col + glow, 0.28 + glow * 0.6);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uHue: { value: hueShift },
        uGlow: { value: glow },
      },
      transparent: true,
      cullFace: null,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.scale.set(scale, scale, scale * 0.7);
    mesh.setParent(scene);

    const resize = () => {
      const { width, height: h } = container.getBoundingClientRect();
      renderer.setSize(width, h);
      camera.perspective({ aspect: width / h });
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (t: number) => {
      const time = (t / 1000) * timeScale;
      mesh.rotation.y = time * (animationType === 'rotate' ? 0.6 : 0.2);
      mesh.rotation.x = Math.sin(time * 0.7) * 0.2;
      mesh.rotation.z = Math.sin(time * 0.5) * 0.1;
      mesh.position.y = Math.sin(time * 1.2) * (noise * 0.5);
      program.uniforms.uTime.value = time;
      program.uniforms.uHue.value = (hueShift + time * 60 * colorFrequency) % 360;

      renderer.render({ scene, camera });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      container.removeChild(gl.canvas);
    };
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default Prism;
