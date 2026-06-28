import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function Cabin3D({ language }: { language: 'fa' | 'en' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFa = language === 'fa';
  
  // Custom interaction states
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // 1. Scene Setup with elegant blue mountain gradient atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.015); // deep atmospheric blue-dark fog

    // 2. Camera Setup (cinematic viewing angle)
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 10);
    camera.lookAt(0, 1.8, 0);

    // 3. Renderer with high performance & alpha enabled for custom CSS gradient background
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Cool rim light (simulating the blue sky / moon glow)
    const moonLight = new THREE.DirectionalLight(0x60a5fa, 1.8);
    moonLight.position.set(-6, 10, -4);
    scene.add(moonLight);

    // 5. Build Procedural A-Frame Luxury Chalet (Matching User's Photo)
    const chaletGroup = new THREE.Group();
    scene.add(chaletGroup);

    // Materials
    const naturalWoodMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x925f38, // Warm natural timber brown
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.2,
    });

    const lightPineMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd9a05b, // Light pine accent boards
      roughness: 0.5,
    });

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x3f3f46, // Zinc stone slate
      roughness: 0.85,
    });

    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // Elegant white/stone balusters
      roughness: 0.6,
    });

    const skyReflectiveGlass = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa, // Sky blue reflective tint
      emissive: 0x1d4ed8, // Deep blue emissive
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.7,
      roughness: 0.05,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transmission: 0.2,
      thickness: 1.5,
    });

    const darkMetalRoofMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Elegant dark anthracite corrugated sheet metal
      roughness: 0.4,
      metalness: 0.8,
    });

    // A-Frame Dimensions Setup
    const chaletHeight = 5.6;
    const baseWidth = 4.4;
    const depth = 4.8;
    const halfWidth = baseWidth / 2;
    const theta = Math.atan2(halfWidth, chaletHeight); // slope angle relative to vertical axis
    const slopeLength = Math.sqrt(halfWidth * halfWidth + chaletHeight * chaletHeight);

    // A. Ground Concrete Platform
    const platformGeom = new THREE.BoxGeometry(5.2, 0.25, 5.2);
    const platform = new THREE.Mesh(platformGeom, stoneMaterial);
    platform.position.y = -0.125;
    chaletGroup.add(platform);

    // B. Steep A-Frame Triangular Glass Facade
    const glassShape = new THREE.Shape();
    glassShape.moveTo(-halfWidth + 0.05, 0);
    glassShape.lineTo(halfWidth - 0.05, 0);
    glassShape.lineTo(0, chaletHeight - 0.1);
    glassShape.closePath();

    const glassGeom = new THREE.ShapeGeometry(glassShape);
    const glassMesh = new THREE.Mesh(glassGeom, skyReflectiveGlass);
    glassMesh.position.set(0, 0, 1.8);
    chaletGroup.add(glassMesh);

    // C. Thick Outer Wooden A-Frame Structural Beams (The heavy front trim)
    const beamThickness = 0.15;
    const beamDepth = 0.3;
    const beamGeom = new THREE.BoxGeometry(beamThickness, slopeLength + 0.1, beamDepth);

    // Left outer sloped timber
    const leftBeam = new THREE.Mesh(beamGeom, naturalWoodMaterial);
    leftBeam.position.set(-halfWidth / 2, chaletHeight / 2, 1.95);
    leftBeam.rotation.z = -theta; // slanted inward to meet at apex
    chaletGroup.add(leftBeam);

    // Right outer sloped timber
    const rightBeam = new THREE.Mesh(beamGeom, naturalWoodMaterial);
    rightBeam.position.set(halfWidth / 2, chaletHeight / 2, 1.95);
    rightBeam.rotation.z = theta;
    chaletGroup.add(rightBeam);

    // Horizontal bottom log beam
    const bottomBeamGeom = new THREE.BoxGeometry(baseWidth + 0.2, 0.16, 0.32);
    const bottomBeam = new THREE.Mesh(bottomBeamGeom, naturalWoodMaterial);
    bottomBeam.position.set(0, 0.08, 1.96);
    chaletGroup.add(bottomBeam);

    // D. Dark Metal Corrugated Side Roof (Draped down both sloped sides)
    const roofThickness = 0.08;
    const roofOverhangFront = 0.4;
    const roofLengthTotal = depth + roofOverhangFront;
    const phi = Math.atan2(chaletHeight, halfWidth); // slope angle relative to horizontal axis

    const roofSideGeom = new THREE.BoxGeometry(slopeLength + 0.05, roofThickness, roofLengthTotal);
    
    // Normal offsets to place the roof perfectly flush on top of the structural A-frame
    const roofOffset = 0.06;
    const leftRoofX = -halfWidth / 2 - roofOffset * Math.sin(phi);
    const leftRoofY = chaletHeight / 2 + roofOffset * Math.cos(phi);
    
    const rightRoofX = halfWidth / 2 + roofOffset * Math.sin(phi);
    const rightRoofY = chaletHeight / 2 + roofOffset * Math.cos(phi);

    // Left Roof sloped sheet
    const leftRoof = new THREE.Mesh(roofSideGeom, darkMetalRoofMaterial);
    leftRoof.position.set(leftRoofX, leftRoofY, 1.9 - depth / 2 + roofOverhangFront / 2);
    leftRoof.rotation.z = phi;
    chaletGroup.add(leftRoof);

    // Right Roof sloped sheet
    const rightRoof = new THREE.Mesh(roofSideGeom, darkMetalRoofMaterial);
    rightRoof.position.set(rightRoofX, rightRoofY, 1.9 - depth / 2 + roofOverhangFront / 2);
    rightRoof.rotation.z = -phi;
    chaletGroup.add(rightRoof);

    // Corrugation Ribs (Parallel beams running along the sloped roof to add beautiful realistic depth)
    const ribCount = 8;
    const ribThickness = 0.03;
    const ribGeom = new THREE.BoxGeometry(slopeLength + 0.1, ribThickness * 2, 0.04);
    
    const ribOffset = roofOffset + 0.04; // sit on top of the roof sheet
    const leftRibX = -halfWidth / 2 - ribOffset * Math.sin(phi);
    const leftRibY = chaletHeight / 2 + ribOffset * Math.cos(phi);
    
    const rightRibX = halfWidth / 2 + ribOffset * Math.sin(phi);
    const rightRibY = chaletHeight / 2 + ribOffset * Math.cos(phi);

    for (let r = 0; r < ribCount; r++) {
      const zOffset = 1.95 - (r * (depth / (ribCount - 1)));
      
      const leftRib = new THREE.Mesh(ribGeom, darkMetalRoofMaterial);
      leftRib.position.set(leftRibX, leftRibY, zOffset);
      leftRib.rotation.z = phi;
      chaletGroup.add(leftRib);

      const rightRib = new THREE.Mesh(ribGeom, darkMetalRoofMaterial);
      rightRib.position.set(rightRibX, rightRibY, zOffset);
      rightRib.rotation.z = -phi;
      chaletGroup.add(rightRib);
    }

    // F. Upper level Wooden Balcony (Exactly matching the photo)
    const balconyY = 2.4; // positioned midway up the front triangle
    const balconyWidth = 2.3;
    const balconyDepth = 0.55;

    // Balcony timber base plate
    const balconyBaseGeom = new THREE.BoxGeometry(balconyWidth, 0.06, balconyDepth);
    const balconyBase = new THREE.Mesh(balconyBaseGeom, lightPineMaterial);
    balconyBase.position.set(0, balconyY, 1.8 + balconyDepth / 2);
    chaletGroup.add(balconyBase);

    // Balcony handrail
    const balconyRailGeom = new THREE.BoxGeometry(balconyWidth, 0.05, 0.05);
    const balconyRail = new THREE.Mesh(balconyRailGeom, naturalWoodMaterial);
    balconyRail.position.set(0, balconyY + 0.45, 1.8 + balconyDepth - 0.02);
    chaletGroup.add(balconyRail);

    // Balcony vertical posts (Traditional wooden balusters)
    const postCount = 10;
    const postGeom = new THREE.BoxGeometry(0.02, 0.44, 0.02);
    for (let p = 0; p < postCount; p++) {
      const px = -balconyWidth / 2 + 0.1 + (p * (balconyWidth - 0.2)) / (postCount - 1);
      const post = new THREE.Mesh(postGeom, naturalWoodMaterial);
      post.position.set(px, balconyY + 0.22, 1.8 + balconyDepth - 0.02);
      chaletGroup.add(post);
    }

    // G. Lower Level Deck Railing with Elegant White Stone Balusters (From the photo!)
    const lowerBalconyY = 0.0;
    const lowerWidth = 4.8;
    const lowerDepth = 1.0;

    // Stone handrail running along the front deck
    const lowerRailGeom = new THREE.BoxGeometry(lowerWidth, 0.06, 0.06);
    const lowerRail = new THREE.Mesh(lowerRailGeom, concreteMaterial);
    lowerRail.position.set(0, lowerBalconyY + 0.72, 2.5);
    chaletGroup.add(lowerRail);

    // Baluster posts (Sculpted cylindrical style)
    const balusterCount = 16;
    const balusterGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.68, 6);
    for (let b = 0; b < balusterCount; b++) {
      const bx = -lowerWidth / 2 + 0.15 + (b * (lowerWidth - 0.3)) / (balusterCount - 1);
      const baluster = new THREE.Mesh(balusterGeom, concreteMaterial);
      baluster.position.set(bx, lowerBalconyY + 0.36, 2.5);
      chaletGroup.add(baluster);
    }

    // H. Back wall of the chalet (Timber finish) - Perfect Triangle Shape matching the A-frame slope
    const backWallShape = new THREE.Shape();
    const backWallWidth = baseWidth - 0.12;
    const backWallHeight = chaletHeight - 0.15;
    backWallShape.moveTo(-backWallWidth / 2, 0);
    backWallShape.lineTo(backWallWidth / 2, 0);
    backWallShape.lineTo(0, backWallHeight);
    backWallShape.closePath();

    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: false,
    };
    const backWallGeom = new THREE.ExtrudeGeometry(backWallShape, extrudeSettings);
    const backWall = new THREE.Mesh(backWallGeom, naturalWoodMaterial);
    backWall.position.set(0, 0, 1.9 - depth);
    chaletGroup.add(backWall);

    // I. Majestic low-poly dark green pine trees on the side (Adding beautiful alpine setting)
    const treeGroupLeft = new THREE.Group();
    treeGroupLeft.position.set(-3.2, 0, 0.2);
    chaletGroup.add(treeGroupLeft);

    const treeGroupRight = new THREE.Group();
    treeGroupRight.position.set(3.4, 0, -0.5);
    chaletGroup.add(treeGroupRight);

    const buildPineTree = (group: THREE.Group, scale: number) => {
      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.1, 1.2, 5),
        new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 })
      );
      trunk.position.y = 0.6;
      group.add(trunk);

      // Conical levels of evergreen leaves
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x0f4c3a, roughness: 0.8 });
      for (let level = 0; level < 4; level++) {
        const leafGeom = new THREE.ConeGeometry(0.95 - level * 0.18, 1.1, 6);
        const leaves = new THREE.Mesh(leafGeom, foliageMat);
        leaves.position.y = 1.2 + level * 0.65;
        group.add(leaves);
      }
      group.scale.set(scale, scale, scale);
    };

    buildPineTree(treeGroupLeft, 1.25);
    buildPineTree(treeGroupRight, 1.4);

    // Calculate Bounding Box of the Chalet to scale it perfectly and prevent visual stretching or distortion
    const box = new THREE.Box3().setFromObject(chaletGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Scale the entire chalet group so that its height is exactly 4.5 units, preventing any visual stretching or distortion
    const desiredScaleHeight = 4.5;
    if (size.y > 0) {
      const scaleFactor = desiredScaleHeight / size.y;
      chaletGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // J. Ambient Sparkles / Magic Fireflies (floating gently around)
    const fireflyCount = 120;
    const fireflyGeometry = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflySpeeds: number[] = [];
    const fireflyPhases: number[] = [];

    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3] = (Math.random() - 0.5) * 16;
      fireflyPositions[i * 3 + 1] = Math.random() * 8;
      fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      fireflySpeeds.push(0.005 + Math.random() * 0.01);
      fireflyPhases.push(Math.random() * Math.PI * 2);
    }

    fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));

    // Custom Canvas Glowing Particle Texture
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const ctx = particleCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(253, 230, 138, 1)'); // Amber glowing core
      grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.4)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const glowTexture = new THREE.CanvasTexture(particleCanvas);

    const fireflyMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      depthWrite: false,
    });

    const fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial);
    scene.add(fireflies);

    // 6. Global Mouse Tracker (Active across the entire window for maximum immersion)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleWindowMouseMove = (event: MouseEvent) => {
      // Calculate normalized mouse coords (-1 to 1) for the full screen
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    // 7. Dynamic Chalet Position Offset Based on Screen Size
    // Centered across all screen sizes as requested by the user.
    const updateChaletLayout = () => {
      chaletGroup.position.set(0, -0.6, 0); // perfectly centered, slightly lowered
    };
    updateChaletLayout();

    // 8. Interactive Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth idle rotation if rotation is turned on
      if (isRotatingRef.current) {
        chaletGroup.rotation.y += 0.0025;
      }

      // Parallax mouse follow with smooth inertia dampening
      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;

      // Mild tilt and panning response to mouse
      chaletGroup.rotation.y += targetX * 0.006;
      chaletGroup.rotation.x = targetY * 0.08;

      // Animate magical amber fireflies floating gently around
      const posAttr = fireflies.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < fireflyCount; i++) {
        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        y += fireflySpeeds[i] + Math.sin(elapsed + fireflyPhases[i]) * 0.002;
        x += Math.sin(elapsed * 0.5 + fireflyPhases[i]) * 0.003;

        // recycle when reaching the top boundary
        if (y > 8.0) {
          y = 0.0;
          x = (Math.random() - 0.5) * 16;
          z = (Math.random() - 0.5) * 10;
        }

        posAttr.setX(i, x);
        posAttr.setY(i, y);
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Window Resize Event Listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      updateChaletLayout();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden bg-[#05060f]"
      id="cabin-3d-background-viewport"
    >
      {/* Absolute CSS dark blue glowing mountain sky gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#020308] via-[#060814] to-[#111827]/70" />
      
      {/* Bottom glowing warm light leaking up */}
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#f59e0b]/5 to-transparent mix-blend-screen pointer-events-none" />

      {/* Embedded 3D canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Tiny absolutely-positioned rotation controller in bottom margin (clickable through CSS tricks) */}
      <div className="absolute bottom-6 right-6 z-50 pointer-events-auto flex items-center gap-3">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="p-2 bg-black/60 border border-white/10 hover:border-amber-500/50 hover:bg-black/90 text-zinc-400 hover:text-amber-400 rounded-sm transition-all duration-300 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer shadow-lg shadow-black/40"
          title={isFa ? 'روشن/خاموش کردن چرخش سه‌بعدی کلبه' : 'Toggle 3D Chalet Auto-rotation'}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
          <span>
            {isFa ? (isRotating ? 'توقف چرخش پس‌زمینه' : 'شروع چرخش پس‌زمینه') : (isRotating ? 'Pause Ambient Rotate' : 'Resume Ambient Rotate')}
          </span>
        </button>
      </div>
    </div>
  );
}
