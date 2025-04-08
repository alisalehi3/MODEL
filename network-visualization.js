// Network Visualization JavaScript for Cognitive Cybernetics Website

// Global variables
let cy; // Cytoscape instance
let network = {}; // Network data
let selectedNode = null; // Currently selected node
let simulationRunning = false; // Flag for simulation status
let nodeSizeScale = 20; // Default node size
let edgeWidthScale = 3; // Default edge width
let nodeCount = 30; // Default node count
let currentCentrality = 'degree'; // Default centrality measure
let currentLayout = 'cose'; // Default layout

// Initialize the network visualization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('network-visualization')) return;
    
    console.log('Initializing network visualization...');
    
    // Initialize Cytoscape
    initCytoscape();
    
    // Initialize controls
    initControls();
    
    // Initialize network statistics
    updateNetworkStats();
    
    // Initialize charts
    initCharts();
});

// Initialize Cytoscape
function initCytoscape() {
    // Generate initial network data
    generateNetworkData(nodeCount);
    
    // Initialize Cytoscape
    cy = cytoscape({
        container: document.getElementById('network-visualization'),
        elements: network.elements,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#3498db',
                    'label': 'data(label)',
                    'width': nodeSizeScale,
                    'height': nodeSizeScale,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': '12px',
                    'text-outline-width': 2,
                    'text-outline-color': '#3498db'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': edgeWidthScale,
                    'line-color': '#ccc',
                    'curve-style': 'bezier'
                }
            },
            {
                selector: ':selected',
                style: {
                    'background-color': '#e74c3c',
                    'text-outline-color': '#e74c3c',
                    'line-color': '#e74c3c'
                }
            }
        ],
        layout: {
            name: currentLayout,
            animate: true,
            padding: 30,
            nodeDimensionsIncludeLabels: true
        }
    });
    
    // Add panzoom
    cy.panzoom();
    
    // Add node selection event
    cy.on('tap', 'node', function(evt) {
        selectedNode = evt.target;
        updateNodeDetails(selectedNode);
    });
    
    cy.on('tap', function(evt) {
        if (evt.target === cy) {
            // Clicked on background
            selectedNode = null;
            clearNodeDetails();
        }
    });
}

// Generate network data
function generateNetworkData(count) {
    network = {
        elements: {
            nodes: [],
            edges: []
        }
    };
    
    // Generate nodes
    for (let i = 0; i < count; i++) {
        const consciousnessLevel = Math.random();
        network.elements.nodes.push({
            data: {
                id: 'n' + i,
                label: 'انسان ' + (i + 1),
                consciousnessLevel: consciousnessLevel,
                physiologicalState: Math.random(),
                personalityTraits: {
                    openness: Math.random(),
                    conscientiousness: Math.random(),
                    extraversion: Math.random(),
                    agreeableness: Math.random(),
                    neuroticism: Math.random()
                }
            }
        });
    }
    
    // Generate edges (connections between nodes)
    // Each node will connect to 1-5 other nodes
    for (let i = 0; i < count; i++) {
        const connections = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < connections; j++) {
            const target = Math.floor(Math.random() * count);
            if (i !== target) {
                network.elements.edges.push({
                    data: {
                        id: 'e' + i + '-' + target,
                        source: 'n' + i,
                        target: 'n' + target,
                        strength: Math.random(),
                        type: ['information', 'social', 'emotional'][Math.floor(Math.random() * 3)]
                    }
                });
            }
        }
    }
    
    // Calculate centrality measures
    calculateCentrality();
}

// Calculate centrality measures for all nodes
function calculateCentrality() {
    if (!cy) return;
    
    // Degree centrality
    const degreeCentrality = cy.elements().degreeCentrality({directed: false});
    
    // Betweenness centrality
    const betweennessCentrality = cy.elements().betweennessCentrality({directed: false});
    
    // Closeness centrality
    const closenessCentrality = cy.elements().closenessCentrality({directed: false});
    
    // Eigenvector centrality (approximation)
    const eigenvectorCentrality = cy.elements().degreeCentrality({directed: false}); // Simplified for demo
    
    // Store centrality values in node data
    cy.nodes().forEach(node => {
        node.data('degreeCentrality', degreeCentrality.degree(node));
        node.data('betweennessCentrality', betweennessCentrality.betweenness(node));
        node.data('closenessCentrality', closenessCentrality.closeness(node));
        node.data('eigenvectorCentrality', eigenvectorCentrality.degree(node)); // Simplified
    });
    
    // Update node sizes based on current centrality measure
    updateNodeSizes();
}

// Update node sizes based on centrality
function updateNodeSizes() {
    if (!cy) return;
    
    const centralityValues = cy.nodes().map(node => node.data(currentCentrality + 'Centrality'));
    const minCentrality = Math.min(...centralityValues);
    const maxCentrality = Math.max(...centralityValues);
    const range = maxCentrality - minCentrality;
    
    cy.nodes().forEach(node => {
        const centralityValue = node.data(currentCentrality + 'Centrality');
        const normalizedValue = range > 0 ? (centralityValue - minCentrality) / range : 0.5;
        const size = 10 + normalizedValue * nodeSizeScale;
        node.style('width', size);
        node.style('height', size);
    });
}

// Initialize controls
function initControls() {
    // Layout selector
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect) {
        layoutSelect.addEventListener('change', function() {
            currentLayout = this.value;
            applyLayout();
        });
    }
    
    // Centrality selector
    const centralitySelect = document.getElementById('centrality-select');
    if (centralitySelect) {
        centralitySelect.addEventListener('change', function() {
            currentCentrality = this.value;
            updateNodeSizes();
        });
    }
    
    // Node size slider
    const nodeSizeSlider = document.getElementById('node-size-slider');
    if (nodeSizeSlider) {
        nodeSizeSlider.addEventListener('input', function() {
            nodeSizeScale = parseInt(this.value);
            updateNodeSizes();
        });
    }
    
    // Edge width slider
    const edgeWidthSlider = document.getElementById('edge-width-slider');
    if (edgeWidthSlider) {
        edgeWidthSlider.addEventListener('input', function() {
            edgeWidthScale = parseInt(this.value);
            cy.edges().style('width', edgeWidthScale);
        });
    }
    
    // Node count slider
    const nodeCountSlider = document.getElementById('node-count-slider');
    if (nodeCountSlider) {
        nodeCountSlider.addEventListener('change', function() {
            nodeCount = parseInt(this.value);
            resetSimulation();
        });
    }
    
    // Run simulation button
    const runSimulationBtn = document.getElementById('run-simulation');
    if (runSimulationBtn) {
        runSimulationBtn.addEventListener('click', function() {
            if (!simulationRunning) {
                simulationRunning = true;
                this.textContent = 'توقف شبیه‌سازی';
                runSimulation();
            } else {
                simulationRunning = false;
                this.textContent = 'اجرای شبیه‌سازی';
            }
        });
    }
    
    // Reset simulation button
    const resetSimulationBtn = document.getElementById('reset-simulation');
    if (resetSimulationBtn) {
        resetSimulationBtn.addEventListener('click', resetSimulation);
    }
}

// Apply layout
function applyLayout() {
    if (!cy) return;
    
    const layout = cy.layout({
        name: currentLayout,
        animate: true,
        padding: 30,
        nodeDimensionsIncludeLabels: true
    });
    
    layout.run();
}

// Update node details
function updateNodeDetails(node) {
    if (!node) return;
    
    // Individual properties
    const individualDetails = document.getElementById('node-details-individual');
    if (individualDetails) {
        individualDetails.innerHTML = `
            <h6>شناسه: ${node.id()}</h6>
            <p>سطح آگاهی: ${(node.data('consciousnessLevel') * 100).toFixed(2)}%</p>
            <p>وضعیت فیزیولوژیکی: ${(node.data('physiologicalState') * 100).toFixed(2)}%</p>
            <h6>ویژگی‌های شخصیتی:</h6>
            <ul>
                <li>گشودگی: ${(node.data('personalityTraits').openness * 100).toFixed(2)}%</li>
                <li>وظیفه‌شناسی: ${(node.data('personalityTraits').conscientiousness * 100).toFixed(2)}%</li>
                <li>برون‌گرایی: ${(node.data('personalityTraits').extraversion * 100).toFixed(2)}%</li>
                <li>سازگاری: ${(node.data('personalityTraits').agreeableness * 100).toFixed(2)}%</li>
                <li>روان‌رنجوری: ${(node.data('personalityTraits').neuroticism * 100).toFixed(2)}%</li>
            </ul>
        `;
    }
    
    // Relational properties
    const relationalDetails = document.getElementById('node-details-relational');
    if (relationalDetails) {
        const connectedEdges = node.connectedEdges();
        const connectionCount = connectedEdges.length;
        
        let connectionTypes = {
            information: 0,
            social: 0,
            emotional: 0
        };
        
        connectedEdges.forEach(edge => {
            const type = edge.data('type');
            if (connectionTypes[type] !== undefined) {
                connectionTypes[type]++;
            }
        });
        
        relationalDetails.innerHTML = `
            <h6>تعداد ارتباطات: ${connectionCount}</h6>
            <h6>نوع ارتباطات:</h6>
            <ul>
                <li>اطلاعاتی: ${connectionTypes.information}</li>
                <li>اجتماعی: ${connectionTypes.social}</li>
                <li>عاطفی: ${connectionTypes.emotional}</li>
            </ul>
            <p>میانگین قدرت ارتباطات: ${calculateAverageConnectionStrength(node).toFixed(2)}</p>
        `;
    }
    
    // Centrality properties
    const centralityDetails = document.getElementById('node-details-centrality');
    if (centralityDetails) {
        centralityDetails.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>مرکزیت درجه:</h6>
                    <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: ${normalizeValue(node.data('degreeCentrality'), 'degreeCentrality')}%" 
                            aria-valuenow="${normalizeValue(node.data('degreeCentrality'), 'degreeCentrality')}" aria-valuemin="0" aria-valuemax="100">
                            ${normalizeValue(node.data('degreeCentrality'), 'degreeCentrality').toFixed(0)}%
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6>مرکزیت بینابینی:</h6>
                    <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: ${normalizeValue(node.data('betweennessCentrality'), 'betweennessCentrality')}%" 
                            aria-valuenow="${normalizeValue(node.data('betweennessCentrality'), 'betweennessCentrality')}" aria-valuemin="0" aria-valuemax="100">
                            ${normalizeValue(node.data('betweennessCentrality'), 'betweennessCentrality').toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <h6>مرکزیت نزدیکی:</h6>
                    <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: ${normalizeValue(node.data('closenessCentrality'), 'closenessCentrality')}%" 
                            aria-valuenow="${normalizeValue(node.data('closenessCentrality'), 'closenessCentrality')}" aria-valuemin="0" aria-valuemax="100">
                            ${normalizeValue(node.data('closenessCentrality'), 'closenessCentrality').toFixed(0)}%
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6>مرکزیت بردار ویژه:</h6>
                    <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: ${normalizeValue(node.data('eigenvectorCentrality'), 'eigenvectorCentrality')}%" 
                            aria-valuenow="${normalizeValue(node.data('eigenvectorCentrality'), 'eigenvectorCentrality')}" aria-valuemin="0" aria-valuemax="100">
                            ${normalizeValue(node.data('eigenvectorCentrality'), 'eigenvectorCentrality').toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Clear node details
function clearNodeDetails() {
    const individualDetails = document.getElementById('node-details-individual');
    const relationalDetails = document.getElementById('node-details-relational');
    const centralityDetails = document.getElementById('node-details-centrality');
    
    if (individualDetails) {
        individualDetails.innerHTML = '<p class="text-muted">لطفاً یک گره را از نمودار انتخاب کنید تا جزئیات آن نمایش داده شود.</p>';
    }
    
    if (relationalDetails) {
        relationalDetails.innerHTML = '<p class="text-muted">لطفاً یک گره را از نمودار انتخاب کنید تا جزئیات آن نمایش داده شود.</p>';
    }
    
    if (centralityDetails) {
        centralityDetails.innerHTML = '<p class="text-muted">لطفاً یک گره را از نمودار انتخاب کنید تا جزئیات آن نمایش داده شود.</p>';
    }
}

// Calculate average connection strength for a node
function calculateAverageConnectionStrength(node) {
    const connectedEdges = node.connectedEdges();
    if (connectedEdges.length === 0) return 0;
    
    let totalStrength = 0;
    connectedEdges.forEach(edge => {
        totalStrength += edge.data('strength');
    });
    
    return totalStrength / connectedEdges.length;
}

// Normalize value for display
function normalizeValue(value, property) {
    if (!cy) return 0;
    
    const values = cy.nodes().map(node => node.data(property));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    return range > 0 ? ((value - minValue) / range) * 100 : 50;
}

// Update network statistics
function updateNetworkStats() {
    if (!cy) return;
    
    // Node count
    const nodeCountElement = document.getElementById('stat-node-count');
    if (nodeCountElement) {
        nodeCountElement.textContent = cy.nodes().length;
    }
    
    // Edge count
    const edgeCountElement = document.getElementById('stat-edge-count');
    if (edgeCountElement) {
        edgeCountElement.textContent = cy.edges().length;
    }
    
   
(Content truncated due to size limit. Use line ranges to read in chunks)