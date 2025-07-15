// Configuration for Succinct Explorer API integration
export const config = {
    // Succinct Explorer API endpoint
    explorerAPI: {
        baseURL: 'https://explorer.succinct.xyz/api',
        proverAddress: '0x111de2f78767e45ebd1bd360b110728e5c79df47',
        // Production: Update this to your server's API endpoint
        proxyURL: window.location.hostname === 'localhost' 
            ? 'http://localhost:3002/api/explorer/latest-proof' 
            : '/api/explorer/latest-proof'
    },
    
    // Visualization settings
    visualization: {
        // Morphing animation duration (ms)
        morphDuration: 2000,
        
        // Proof fetch interval (ms)
        proofFetchInterval: 30000, // 30 seconds
        
        // Colors
        colors: {
            primary: 0x4a9eff,   // Succinct blue
            secondary: 0xff4a9e, // Pink accent
            accent: 0x4aff9e,    // Green for verified status
            background: 0x000000 // Black background
        }
    },
    
    // Development settings
    dev: {
        useMockData: false, // Set to true if scraper is not available
        logLevel: 'info'
    }
};

// API helper function
export async function fetchProofsFromExplorer(page = 1) {
    const { explorerAPI, dev } = config;
    
    if (dev.useMockData) {
        // Return mock data for development
        return generateMockProofs(1);
    }
    
    try {
        // Use our proxy endpoint
        const url = `${explorerAPI.proxyURL}/${explorerAPI.proverAddress}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        // Return as array since our display expects an array
        return data.proof ? [data.proof] : [];
        
    } catch (error) {
        console.error('Failed to fetch proofs:', error);
        // Fallback to mock data if API is not available
        console.log('Using mock data as fallback');
        return generateMockProofs(1);
    }
}

// Generate mock proofs for fallback
function generateMockProofs(count) {
    const programs = ['fibonacci', 'merkle_tree', 'ecdsa_verify', 'sha256', 'range_proof', 'zk_snark'];
    const proofs = [];
    
    for (let i = 0; i < count; i++) {
        proofs.push({
            id: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            timestamp: Date.now() - (i * 300000), // 5 minutes apart
            program: programs[Math.floor(Math.random() * programs.length)],
            cycles: Math.floor(Math.random() * 3000000) + 500000,
            duration: `${(Math.random() * 4 + 0.5).toFixed(1)}s`,
            status: 'verified',
            gasUsed: Math.floor(Math.random() * 150000) + 50000,
            prover: config.explorerAPI.proverAddress,
            blockNumber: 1234567 - (i * 10),
            txHash: `0x${Math.random().toString(16).substr(2, 64)}`
        });
    }
    
    return proofs;
}