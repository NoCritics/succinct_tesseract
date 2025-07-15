// ProofDisplay class to fetch and display the latest ZK proof from Succinct Explorer
import { config, fetchProofsFromExplorer } from './config.js';

export class ProofDisplay {
    constructor() {
        this.proofContainer = document.getElementById('proofDisplay');
        this.proofIdElement = this.proofContainer.querySelector('.proof-id');
        this.proofDetailsElement = this.proofContainer.querySelector('.proof-details');
        this.latestProof = null;
        this.isLoading = false;
    }
    
    async fetchProofs() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        try {
            // Fetch proofs using the configured API or mock data
            const proofs = await fetchProofsFromExplorer();
            
            // Get the latest proof (first one, assuming sorted by timestamp)
            if (proofs.length > 0) {
                const newLatestProof = proofs[0];
                
                // Only update display if we have a new proof
                if (!this.latestProof || this.latestProof.id !== newLatestProof.id) {
                    this.latestProof = newLatestProof;
                    this.displayProof();
                }
            }
            
        } catch (error) {
            console.error('Error fetching proofs:', error);
            this.proofIdElement.textContent = 'Error loading proof';
        } finally {
            this.isLoading = false;
        }
    }
    
    displayProof() {
        if (!this.latestProof) return;
        
        const proof = this.latestProof;
        
        // Animate update
        this.proofContainer.style.opacity = '0';
        this.proofContainer.style.transform = 'translateX(-50%) translateY(20px)';
        
        setTimeout(() => {
            // Format timestamp
            const timestamp = new Date(proof.timestamp);
            const timeAgo = this.getTimeAgo(timestamp);
            
            // Update content
            this.proofIdElement.innerHTML = `Latest Proof: <span style="color: #fff">${proof.id}</span>`;
            this.proofDetailsElement.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <div style="opacity: 0.6; font-size: 12px;">Program</div>
                        <div style="font-family: monospace; color: #4a9eff;">${proof.program}</div>
                    </div>
                    <div>
                        <div style="opacity: 0.6; font-size: 12px;">Cycles</div>
                        <div>${this.formatCycles(proof.cycles)}</div>
                    </div>
                    <div>
                        <div style="opacity: 0.6; font-size: 12px;">Duration</div>
                        <div>${proof.duration}</div>
                    </div>
                    <div>
                        <div style="opacity: 0.6; font-size: 12px;">Status</div>
                        <div style="color: #4aff9e;">✓ ${proof.status}</div>
                    </div>
                </div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="opacity: 0.6; font-size: 12px;">Submitted ${timeAgo}</div>
                    <div style="opacity: 0.4; font-size: 11px; margin-top: 4px;">
                        Prover: <a href="https://explorer.succinct.xyz/prover/${config.explorerAPI.proverAddress}" 
                                   target="_blank" 
                                   style="color: #4a9eff; text-decoration: none; border-bottom: 1px dotted #4a9eff;">
                            ${config.explorerAPI.proverAddress.slice(0, 8)}...${config.explorerAPI.proverAddress.slice(-6)}
                        </a>
                    </div>
                </div>
            `;
            
            // Animate in
            this.proofContainer.style.opacity = '1';
            this.proofContainer.style.transform = 'translateX(-50%) translateY(0)';
        }, 300);
    }
    
    formatCycles(cycles) {
        if (cycles >= 1000000) {
            return (cycles / 1000000).toFixed(1) + 'M';
        } else if (cycles >= 1000) {
            return (cycles / 1000).toFixed(1) + 'K';
        }
        return cycles.toString();
    }
    
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    }
    
    startFetching() {
        // Initial fetch
        this.fetchProofs();
        
        // Fetch new proofs periodically
        setInterval(() => {
            this.fetchProofs();
        }, config.visualization.proofFetchInterval);
    }
}