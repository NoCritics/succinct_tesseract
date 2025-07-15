import * as THREE from 'three';
import { createHypercube, createSuccinctLogo3D, morphBetweenShapes } from './hypercube.js';
import { ProofDisplay } from './proofDisplay.js';

// Global variables
let scene, camera, renderer;
let mainGroup;
let mouseX = 0, mouseY = 0;
let previousMouseX = 0, previousMouseY = 0;
let isDragging = false;
let rotationVelocityX = 0, rotationVelocityY = 0;
let isMorphing = false;
let morphProgress = 0;
let morphDirection = 1;
let proofDisplay;

// Shape objects
let hypercubeGroup, logoGroup;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5, 20);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Main group for rotation
    mainGroup = new THREE.Group();
    scene.add(mainGroup);
    
    // Create shapes
    hypercubeGroup = createHypercube();
    logoGroup = createSuccinctLogo3D();
    logoGroup.visible = false;
    
    mainGroup.add(hypercubeGroup);
    mainGroup.add(logoGroup);
    
    // Lighting
    setupLighting();
    
    // Post-processing effects
    addPostProcessing();
    
    // Initialize proof display
    proofDisplay = new ProofDisplay();
    proofDisplay.startFetching();
    
    // Set initial button text
    document.getElementById('morphToggle').textContent = 'Morph to Text';
    
    // Event listeners
    setupEventListeners();
    
    // Hide loading
    document.getElementById('loading').style.display = 'none';
    document.getElementById('proofDisplay').style.display = 'block';
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Key light (blue)
    const keyLight = new THREE.PointLight(0x4a9eff, 2, 20);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);
    
    // Fill light (pink)
    const fillLight = new THREE.PointLight(0xff4a9e, 1.5, 20);
    fillLight.position.set(-5, -5, 5);
    scene.add(fillLight);
    
    // Rim light (white)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);
}

function addPostProcessing() {
    // Add a subtle glow effect using emissive materials
    const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.02,
        side: THREE.BackSide
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    mainGroup.add(glowSphere);
}

function setupEventListeners() {
    // Mouse events for drag rotation
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    // Touch events for mobile
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    
    // Mouse wheel
    document.addEventListener('wheel', onMouseWheel);
    
    // Keyboard
    document.addEventListener('keydown', onKeyDown);
    
    // Morph button
    document.getElementById('morphToggle').addEventListener('click', toggleMorph);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
}

function onMouseDown(event) {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
    renderer.domElement.style.cursor = 'grabbing';
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    if (isDragging) {
        const deltaX = mouseX - previousMouseX;
        const deltaY = mouseY - previousMouseY;
        
        rotationVelocityY = deltaX * 0.01;
        rotationVelocityX = deltaY * 0.01;
        
        previousMouseX = mouseX;
        previousMouseY = mouseY;
    }
}

function onMouseUp() {
    isDragging = false;
    renderer.domElement.style.cursor = 'grab';
}

function onTouchStart(event) {
    if (event.touches.length === 1) {
        isDragging = true;
        previousMouseX = event.touches[0].clientX;
        previousMouseY = event.touches[0].clientY;
    }
}

function onTouchMove(event) {
    if (event.touches.length === 1 && isDragging) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
        
        const deltaX = mouseX - previousMouseX;
        const deltaY = mouseY - previousMouseY;
        
        rotationVelocityY = deltaX * 0.01;
        rotationVelocityX = deltaY * 0.01;
        
        previousMouseX = mouseX;
        previousMouseY = mouseY;
        
        event.preventDefault();
    }
}

function onTouchEnd() {
    isDragging = false;
}

function onMouseWheel(event) {
    camera.position.z += event.deltaY * 0.01;
    camera.position.z = Math.max(2, Math.min(10, camera.position.z));
}

function onKeyDown(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        toggleMorph();
    }
}

function toggleMorph() {
    isMorphing = true;
    morphDirection *= -1;
    
    // Update button text based on direction
    const button = document.getElementById('morphToggle');
    if (morphDirection > 0) {
        button.textContent = 'Morph to Text';
    } else {
        button.textContent = 'Morph to Hypercube';
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Apply rotation with momentum
    if (!isDragging) {
        // Apply friction when not dragging
        rotationVelocityX *= 0.95;
        rotationVelocityY *= 0.95;
        
        // Auto-rotation when idle
        if (Math.abs(rotationVelocityX) < 0.001 && Math.abs(rotationVelocityY) < 0.001) {
            mainGroup.rotation.x += 0.001;
            mainGroup.rotation.y += 0.002;
        }
    }
    
    // Apply rotation
    mainGroup.rotation.x += rotationVelocityX;
    mainGroup.rotation.y += rotationVelocityY;
    
    // Morphing animation
    if (isMorphing) {
        morphProgress += morphDirection * 0.02;
        
        if (morphProgress >= 1) {
            morphProgress = 1;
            isMorphing = false;
            hypercubeGroup.visible = false;
            logoGroup.visible = true;
        } else if (morphProgress <= 0) {
            morphProgress = 0;
            isMorphing = false;
            hypercubeGroup.visible = true;
            logoGroup.visible = false;
        } else {
            hypercubeGroup.visible = true;
            logoGroup.visible = true;
            morphBetweenShapes(hypercubeGroup, logoGroup, morphProgress);
        }
    }
    
    // Update hypercube if visible and not morphing
    if (hypercubeGroup.visible && !isMorphing && morphProgress === 0) {
        updateHypercube(hypercubeGroup, time);
    }
    
    // Update 3D text if visible and not morphing
    if (logoGroup.visible && !isMorphing && morphProgress === 1) {
        logoGroup.userData.update?.(time);
    }
    
    renderer.render(scene, camera);
}

function updateHypercube(group, time) {
    // Update 4D rotation for hypercube
    group.userData.update?.(time);
}

// Initialize and start
init();
animate();