(function () {
  'use strict';

  /* ============================================================
     3D Background — Three.js
     Wireframe Globe (right-of-centre) + full-width Particle Network
     prefers-reduced-motion: animation frozen (scene still renders)
  ============================================================ */

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Wait until THREE is available (CDN may load after this script) ── */
  function waitForThree(cb) {
    if (window.THREE) { cb(); return; }
    var t = setInterval(function () {
      if (window.THREE) { clearInterval(t); cb(); }
    }, 50);
  }

  waitForThree(function () {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var THREE = window.THREE;

    /* ── Renderer ─────────────────────────────────────────────── */
    var renderer = new THREE.WebGLRenderer({
      canvas:    canvas,
      antialias: true,
      alpha:     true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* ── Scene & Camera ───────────────────────────────────────── */
    var scene  = new THREE.Scene();
    var W      = window.innerWidth;
    var H      = window.innerHeight;
    var camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200);
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    renderer.setSize(W, H, false);

    /* ── Clock ────────────────────────────────────────────────── */
    var clock = new THREE.Clock();

    /* ═══════════════════════════════════════════════════════════
       GLOBE (right-of-centre)
    ═══════════════════════════════════════════════════════════ */
    var globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.3;
    globeGroup.position.set(4, 0.5, 0);
    scene.add(globeGroup);

    // Outer wireframe — teal
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.14 })
    ));

    // Inner wireframe — indigo
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.75, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.07 })
    ));

    // Equator ring — teal
    globeGroup.add(new THREE.Mesh(
      new THREE.TorusGeometry(2, 0.012, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.35 })
    ));

    // Tilted orbital ring — indigo
    var orbital = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.008, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.22 })
    );
    orbital.rotation.x = Math.PI / 4;
    orbital.rotation.z = Math.PI / 6;
    globeGroup.add(orbital);

    // 60 Fibonacci nodes on sphere surface
    var nodeCount = 60;
    var nPos = new Float32Array(nodeCount * 3);
    var golden = (1 + Math.sqrt(5)) / 2;
    for (var i = 0; i < nodeCount; i++) {
      var theta = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      var phi   = 2 * Math.PI * i / golden;
      nPos[i*3]   = 1.82 * Math.sin(theta) * Math.cos(phi);
      nPos[i*3+1] = 1.82 * Math.cos(theta);
      nPos[i*3+2] = 1.82 * Math.sin(theta) * Math.sin(phi);
    }
    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
    globeGroup.add(new THREE.Points(nodeGeo,
      new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.08, transparent: true, opacity: 0.8 })
    ));

    /* ═══════════════════════════════════════════════════════════
       PARTICLE NETWORK (full-width, centred)
    ═══════════════════════════════════════════════════════════ */
    var PC   = 140;          // particle count
    var DIST = 2.8;          // max connection distance
    var BX = 12, BY = 7, BZ = 5; // bounding box half-extents

    var pPos = new Float32Array(PC * 3);
    var pVel = new Float32Array(PC * 3);

    for (var i = 0; i < PC; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * BX * 2;
      pPos[i*3+1] = (Math.random() - 0.5) * BY * 2;
      pPos[i*3+2] = (Math.random() - 0.5) * BZ * 2;
      pVel[i*3]   = (Math.random() - 0.5) * 0.012;
      pVel[i*3+1] = (Math.random() - 0.5) * 0.008;
      pVel[i*3+2] = (Math.random() - 0.5) * 0.008;
    }

    // Dots
    var dotGeo = new THREE.BufferGeometry();
    var dotBuf = new Float32Array(PC * 3);
    for (var i = 0; i < PC * 3; i++) dotBuf[i] = pPos[i];
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotBuf, 3));
    dotGeo.getAttribute('position').setUsage(THREE.DynamicDrawUsage);
    scene.add(new THREE.Points(dotGeo,
      new THREE.PointsMaterial({ color: 0x0ea5e9, size: 0.05, transparent: true, opacity: 0.55 })
    ));

    // Lines — pre-allocate maximum possible segments
    var MAX_SEG  = PC * (PC - 1) / 2;
    var lPosBuf  = new Float32Array(MAX_SEG * 6);
    var lColBuf  = new Float32Array(MAX_SEG * 6);
    var lineGeo  = new THREE.BufferGeometry();
    var lPosAttr = new THREE.BufferAttribute(lPosBuf, 3);
    var lColAttr = new THREE.BufferAttribute(lColBuf, 3);
    lPosAttr.setUsage(THREE.DynamicDrawUsage);
    lColAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', lPosAttr);
    lineGeo.setAttribute('color',    lColAttr);
    var lineSegs = new THREE.LineSegments(lineGeo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 })
    );
    scene.add(lineSegs);

    // Reusable colour objects
    var cA = new THREE.Color(0x06b6d4); // cyan
    var cB = new THREE.Color(0x818cf8); // indigo
    var cT = new THREE.Color();

    /* ── Mouse parallax ───────────────────────────────────────── */
    var mX = 0, mY = 0;
    window.addEventListener('mousemove', function (e) {
      mX = (e.clientX / window.innerWidth)  * 2 - 1;
      mY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    /* ── Resize ───────────────────────────────────────────────── */
    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 150);
    }, { passive: true });

    /* ── Animate ──────────────────────────────────────────────── */
    var raf = null;

    function animate() {
      raf = requestAnimationFrame(animate);
      var delta = clock.getDelta();

      if (!REDUCED) {
        /* Globe */
        globeGroup.rotation.y += delta * 0.18;
        globeGroup.rotation.x = 0.3 + mY * 0.06;
        globeGroup.rotation.z = mX  * 0.04;

        /* Particles — move & bounce */
        for (var i = 0; i < PC; i++) {
          var x = i*3, y = x+1, z = x+2;
          pPos[x] += pVel[x]; pPos[y] += pVel[y]; pPos[z] += pVel[z];
          if (pPos[x] >  BX || pPos[x] < -BX) pVel[x] *= -1;
          if (pPos[y] >  BY || pPos[y] < -BY) pVel[y] *= -1;
          if (pPos[z] >  BZ || pPos[z] < -BZ) pVel[z] *= -1;
        }

        /* Upload dot positions */
        var dp = dotGeo.getAttribute('position');
        for (var i = 0; i < PC * 3; i++) dp.array[i] = pPos[i];
        dp.needsUpdate = true;

        /* Build line segments */
        var seg = 0;
        for (var i = 0; i < PC; i++) {
          for (var j = i + 1; j < PC; j++) {
            var ax = pPos[i*3], ay = pPos[i*3+1], az = pPos[i*3+2];
            var bx = pPos[j*3], by = pPos[j*3+1], bz = pPos[j*3+2];
            var dx = ax-bx, dy = ay-by, dz = az-bz;
            var d2 = dx*dx + dy*dy + dz*dz;
            if (d2 < DIST * DIST) {
              var t = Math.sqrt(d2) / DIST;
              cT.lerpColors(cA, cB, t);
              var b = seg * 6;
              lPosBuf[b]   = ax; lPosBuf[b+1] = ay; lPosBuf[b+2] = az;
              lPosBuf[b+3] = bx; lPosBuf[b+4] = by; lPosBuf[b+5] = bz;
              lColBuf[b]   = lColBuf[b+3] = cT.r;
              lColBuf[b+1] = lColBuf[b+4] = cT.g;
              lColBuf[b+2] = lColBuf[b+5] = cT.b;
              seg++;
            }
          }
        }
        lineGeo.setDrawRange(0, seg * 2);
        lPosAttr.needsUpdate = true;
        lColAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }

    /* Pause on hidden tab */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf); raf = null;
      } else {
        clock.getDelta();
        animate();
      }
    });

    animate();
  });

})();
