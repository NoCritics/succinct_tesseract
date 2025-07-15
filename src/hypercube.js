import * as THREE from 'three';
import { createSuccinct3DText } from './succinct3DText.js';

// 4D Hypercube vertices generator
function generateHypercubeVertices() {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
        vertices.push({
            x: (i & 1) ? 1 : -1,
            y: (i & 2) ? 1 : -1,
            z: (i & 4) ? 1 : -1,
            w: (i & 8) ? 1 : -1
        });
    }
    return vertices;
}

// 4D to 3D projection
function project4Dto3D(vertex4D, angle) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const w = vertex4D.w * cosA - vertex4D.x * sinA;
    const x = vertex4D.w * sinA + vertex4D.x * cosA;
    
    const distance = 2;
    const projected = {
        x: x * distance / (distance - w),
        y: vertex4D.y * distance / (distance - w),
        z: vertex4D.z * distance / (distance - w)
    };
    
    return projected;
}

// Create hypercube geometry
export function createHypercube() {
    const group = new THREE.Group();
    const scale = 1.5;
    
    // Define edges of a 4D hypercube
    const edges = [
        [0,1], [2,3], [4,5], [6,7], [8,9], [10,11], [12,13], [14,15],
        [0,2], [1,3], [4,6], [5,7], [8,10], [9,11], [12,14], [13,15],
        [0,4], [1,5], [2,6], [3,7], [8,12], [9,13], [10,14], [11,15],
        [0,8], [1,9], [2,10], [3,11], [4,12], [5,13], [6,14], [7,15]
    ];
    
    // Create edge lines using BufferGeometry
    edges.forEach((edge, i) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6); // 2 vertices * 3 coordinates
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: i % 2 === 0 ? 0x4a9eff : 0xff4a9e,
            linewidth: 2,
            opacity: 0.8,
            transparent: true
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = { edge: edge };
        group.add(line);
    });
    
    // Create vertex spheres
    for (let i = 0; i < 16; i++) {
        const geometry = new THREE.SphereGeometry(0.08, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x4a9eff : 0xff4a9e,
            emissive: i % 2 === 0 ? 0x4a9eff : 0xff4a9e,
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.userData = { vertexIndex: i };
        group.add(sphere);
    }
    
    // Update function for 4D rotation
    group.userData.update = function(time) {
        const vertices4D = generateHypercubeVertices();
        const vertices3D = vertices4D.map(v => project4Dto3D(v, time * 0.5));
        
        // Update edge positions
        group.children.forEach(child => {
            if (child.userData.edge && child.geometry) {
                const edge = child.userData.edge;
                const v1 = vertices3D[edge[0]];
                const v2 = vertices3D[edge[1]];
                
                // Update line positions
                const positions = child.geometry.attributes.position.array;
                positions[0] = v1.x * scale;
                positions[1] = v1.y * scale;
                positions[2] = v1.z * scale;
                positions[3] = v2.x * scale;
                positions[4] = v2.y * scale;
                positions[5] = v2.z * scale;
                
                child.geometry.attributes.position.needsUpdate = true;
            } else if (child.userData.vertexIndex !== undefined) {
                const vertex = vertices3D[child.userData.vertexIndex];
                child.position.set(
                    vertex.x * scale,
                    vertex.y * scale,
                    vertex.z * scale
                );
            }
        });
    };
    
    return group;
}

// Create 3D Succinct logo (text)
export function createSuccinctLogo3D() {
    return createSuccinct3DText();
}

// Morphing function
export function morphBetweenShapes(shape1, shape2, progress) {
    // Simple opacity-based morphing
    shape1.children.forEach(child => {
        if (child.material) {
            child.material.opacity = 1 - progress;
            child.material.transparent = true;
        }
    });
    
    shape2.children.forEach(child => {
        if (child.material) {
            child.material.opacity = progress;
            child.material.transparent = true;
        }
    });
    
    // Scale morphing for smooth transition
    const scale1 = 1 - progress * 0.3;
    const scale2 = 0.7 + progress * 0.3;
    
    shape1.scale.setScalar(scale1);
    shape2.scale.setScalar(scale2);
    
    // Rotation offset for visual interest
    shape1.rotation.z = progress * Math.PI * 0.5;
    shape2.rotation.z = (1 - progress) * Math.PI * 0.5;
}