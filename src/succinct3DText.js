import * as THREE from 'three';

// Create 3D Succinct text
export function createSuccinct3DText() {
    const group = new THREE.Group();
    
    // Material that matches Succinct's brand colors
    const material = new THREE.MeshPhongMaterial({
        color: 0x031124, // Dark blue from the Succinct logo
        emissive: 0x4a9eff, // Light blue emissive
        emissiveIntensity: 0.2,
        shininess: 100,
        specular: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    
    // Alternative material with gradient effect
    const materialAlt = new THREE.MeshPhongMaterial({
        color: 0xff00ff, // Magenta accent
        emissive: 0xff4a9e,
        emissiveIntensity: 0.15,
        shininess: 100,
        specular: 0xffffff,
        transparent: true,
        opacity: 0.9
    });
    
    // Letter dimensions
    const letterHeight = 2;
    const letterDepth = 0.6;
    const letterSpacing = 1.8;
    const letterWidth = 0.35; // Thickness of strokes
    
    // Helper function to create rounded box geometry
    const createRoundedBox = (width, height, depth) => {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        // Add some bevel by scaling edges
        geometry.scale(1, 1, 1);
        return geometry;
    };
    
    // Create each letter using box geometries with better proportions
    const letters = [];
    
    // S - More curved appearance using multiple segments
    const createS = () => {
        const s = new THREE.Group();
        
        // Top horizontal
        const top = new THREE.Mesh(
            createRoundedBox(1.4, letterWidth, letterDepth),
            material
        );
        top.position.set(0.1, 0.85, 0);
        s.add(top);
        
        // Middle horizontal
        const middle = new THREE.Mesh(
            createRoundedBox(1.2, letterWidth, letterDepth),
            material
        );
        middle.position.set(0, 0, 0);
        s.add(middle);
        
        // Bottom horizontal
        const bottom = new THREE.Mesh(
            createRoundedBox(1.4, letterWidth, letterDepth),
            material
        );
        bottom.position.set(-0.1, -0.85, 0);
        s.add(bottom);
        
        // Top left vertical
        const topLeft = new THREE.Mesh(
            createRoundedBox(letterWidth, 0.7, letterDepth),
            material
        );
        topLeft.position.set(-0.5, 0.425, 0);
        s.add(topLeft);
        
        // Bottom right vertical
        const bottomRight = new THREE.Mesh(
            createRoundedBox(letterWidth, 0.7, letterDepth),
            material
        );
        bottomRight.position.set(0.5, -0.425, 0);
        s.add(bottomRight);
        
        // Add corner pieces for smoother S shape
        const topCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.7, letterWidth * 0.7, letterDepth),
            material
        );
        topCorner.position.set(-0.35, 0.85, 0);
        topCorner.rotation.z = Math.PI / 4;
        s.add(topCorner);
        
        const bottomCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.7, letterWidth * 0.7, letterDepth),
            material
        );
        bottomCorner.position.set(0.35, -0.85, 0);
        bottomCorner.rotation.z = Math.PI / 4;
        s.add(bottomCorner);
        
        return s;
    };
    
    // U - Cleaner with better proportions
    const createU = () => {
        const u = new THREE.Group();
        
        // Left vertical
        const left = new THREE.Mesh(
            createRoundedBox(letterWidth, 1.7, letterDepth),
            material
        );
        left.position.set(-0.5, 0.15, 0);
        u.add(left);
        
        // Right vertical
        const right = new THREE.Mesh(
            createRoundedBox(letterWidth, 1.7, letterDepth),
            material
        );
        right.position.set(0.5, 0.15, 0);
        u.add(right);
        
        // Bottom with rounded corners
        const bottom = new THREE.Mesh(
            createRoundedBox(1.35, letterWidth, letterDepth),
            material
        );
        bottom.position.set(0, -0.85, 0);
        u.add(bottom);
        
        // Corner pieces for smooth U shape
        const leftCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.8, letterWidth * 0.8, letterDepth),
            material
        );
        leftCorner.position.set(-0.4, -0.75, 0);
        u.add(leftCorner);
        
        const rightCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.8, letterWidth * 0.8, letterDepth),
            material
        );
        rightCorner.position.set(0.4, -0.75, 0);
        u.add(rightCorner);
        
        return u;
    };
    
    // C - Clean arc shape
    const createC = () => {
        const c = new THREE.Group();
        
        // Top horizontal
        const top = new THREE.Mesh(
            createRoundedBox(1.2, letterWidth, letterDepth),
            material
        );
        top.position.set(0.1, 0.85, 0);
        c.add(top);
        
        // Bottom horizontal
        const bottom = new THREE.Mesh(
            createRoundedBox(1.2, letterWidth, letterDepth),
            material
        );
        bottom.position.set(0.1, -0.85, 0);
        c.add(bottom);
        
        // Left vertical
        const left = new THREE.Mesh(
            createRoundedBox(letterWidth, 2, letterDepth),
            material
        );
        left.position.set(-0.5, 0, 0);
        c.add(left);
        
        // Rounded corners
        const topCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.8, letterWidth * 0.8, letterDepth),
            material
        );
        topCorner.position.set(-0.4, 0.75, 0);
        c.add(topCorner);
        
        const bottomCorner = new THREE.Mesh(
            createRoundedBox(letterWidth * 0.8, letterWidth * 0.8, letterDepth),
            material
        );
        bottomCorner.position.set(-0.4, -0.75, 0);
        c.add(bottomCorner);
        
        return c;
    };
    
    // I - Simple vertical bar
    const createI = () => {
        const i = new THREE.Group();
        
        const vertical = new THREE.Mesh(
            createRoundedBox(letterWidth, 2, letterDepth),
            material
        );
        i.add(vertical);
        
        // Add small caps for style
        const topCap = new THREE.Mesh(
            createRoundedBox(letterWidth * 3, letterWidth * 0.8, letterDepth),
            material
        );
        topCap.position.set(0, 1, 0);
        i.add(topCap);
        
        const bottomCap = new THREE.Mesh(
            createRoundedBox(letterWidth * 3, letterWidth * 0.8, letterDepth),
            material
        );
        bottomCap.position.set(0, -1, 0);
        i.add(bottomCap);
        
        return i;
    };
    
    // N - Strong diagonal
    const createN = () => {
        const n = new THREE.Group();
        
        // Left vertical
        const left = new THREE.Mesh(
            createRoundedBox(letterWidth, 2, letterDepth),
            material
        );
        left.position.set(-0.5, 0, 0);
        n.add(left);
        
        // Right vertical
        const right = new THREE.Mesh(
            createRoundedBox(letterWidth, 2, letterDepth),
            material
        );
        right.position.set(0.5, 0, 0);
        n.add(right);
        
        // Diagonal - made thicker for better visibility
        const diagonal = new THREE.Mesh(
            createRoundedBox(letterWidth * 1.2, 2.3, letterDepth),
            material
        );
        diagonal.rotation.z = -Math.PI / 3.8;
        diagonal.position.set(0, 0, 0);
        n.add(diagonal);
        
        return n;
    };
    
    // T - Classic T shape
    const createT = () => {
        const t = new THREE.Group();
        
        // Top horizontal
        const top = new THREE.Mesh(
            createRoundedBox(1.5, letterWidth, letterDepth),
            material
        );
        top.position.set(0, 0.85, 0);
        t.add(top);
        
        // Vertical
        const vertical = new THREE.Mesh(
            createRoundedBox(letterWidth, 1.7, letterDepth),
            material
        );
        vertical.position.set(0, -0.15, 0);
        t.add(vertical);
        
        return t;
    };
    
    // Create and position letters with alternating materials
    const s1 = createS();
    s1.position.x = -letterSpacing * 3.5;
    letters.push(s1);
    
    const u = createU();
    u.position.x = -letterSpacing * 2.5;
    letters.push(u);
    
    const c1 = createC();
    c1.position.x = -letterSpacing * 1.5;
    // Use alternating material for visual interest
    c1.children.forEach(child => child.material = materialAlt);
    letters.push(c1);
    
    const c2 = createC();
    c2.position.x = -letterSpacing * 0.5;
    letters.push(c2);
    
    const i = createI();
    i.position.x = letterSpacing * 0.5;
    i.children.forEach(child => child.material = materialAlt);
    letters.push(i);
    
    const n = createN();
    n.position.x = letterSpacing * 1.5;
    letters.push(n);
    
    const c3 = createC();
    c3.position.x = letterSpacing * 2.5;
    c3.children.forEach(child => child.material = materialAlt);
    letters.push(c3);
    
    const t = createT();
    t.position.x = letterSpacing * 3.5;
    letters.push(t);
    
    // Add all letters to group
    letters.forEach((letter, index) => {
        // Add slight rotation animation offset
        letter.userData.animationOffset = index * 0.2;
        group.add(letter);
    });
    
    // Add glow effect using point lights
    const glowLight1 = new THREE.PointLight(0x4a9eff, 0.5, 3);
    glowLight1.position.set(0, 0, 1);
    group.add(glowLight1);
    
    const glowLight2 = new THREE.PointLight(0xff4a9e, 0.3, 3);
    glowLight2.position.set(0, 0, -1);
    group.add(glowLight2);
    
    // Scale to fit the scene better
    group.scale.multiplyScalar(0.4);
    
    // Add subtle animation capability
    group.userData.update = function(time) {
        // Subtle floating animation for each letter
        letters.forEach((letter, index) => {
            const offset = letter.userData.animationOffset;
            letter.position.y = Math.sin(time + offset) * 0.05;
            letter.rotation.y = Math.sin(time * 0.5 + offset) * 0.02;
        });
    };
    
    return group;
}