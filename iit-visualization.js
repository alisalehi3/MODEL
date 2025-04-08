// Integrated Information Theory Visualization JavaScript for Cognitive Cybernetics Website

// Global variables
let iitChart; // Chart.js instance
let iitData = []; // Simulation data
let iitSimulationRunning = false; // Flag for simulation status
let nodeCount = 5; // Default node count
let connectionDensity = 0.6; // Default connection density
let integrationLevel = 0.7; // Default integration level
let timeSteps = 20; // Number of time steps to simulate

// Initialize the IIT visualization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('iit-chart')) return;
    
    console.log('Initializing IIT visualization...');
    
    // Initialize IIT chart
    initIITChart();
    
    // Initialize IIT controls
    initIITControls();
});

// Initialize IIT chart
function initIITChart() {
    const ctx = document.getElementById('iit-chart');
    if (!ctx) return;
    
    iitChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['اطلاعات', 'یکپارچگی', 'تمایز', 'ساختار', 'پویایی'],
            datasets: [{
                label: 'Φ (فی) - میزان آگاهی',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'نظریه اطلاعات یکپارچه (IIT)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue;
                        }
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 1
                }
            }
        }
    });
}

// Initialize IIT controls
function initIITControls() {
    // Node count slider
    const nodeCountSlider = document.getElementById('iit-node-count');
    if (nodeCountSlider) {
        nodeCountSlider.addEventListener('input', function() {
            nodeCount = parseInt(this.value);
        });
    }
    
    // Connection density slider
    const connectionDensitySlider = document.getElementById('iit-connection-density');
    if (connectionDensitySlider) {
        connectionDensitySlider.addEventListener('input', function() {
            connectionDensity = parseFloat(this.value);
        });
    }
    
    // Integration level slider
    const integrationLevelSlider = document.getElementById('iit-integration-level');
    if (integrationLevelSlider) {
        integrationLevelSlider.addEventListener('input', function() {
            integrationLevel = parseFloat(this.value);
        });
    }
    
    // Run IIT button
    const runIITBtn = document.getElementById('run-iit');
    if (runIITBtn) {
        runIITBtn.addEventListener('click', function() {
            if (!iitSimulationRunning) {
                iitSimulationRunning = true;
                this.textContent = 'توقف شبیه‌سازی';
                runIITSimulation();
            } else {
                iitSimulationRunning = false;
                this.textContent = 'اجرای شبیه‌سازی IIT';
            }
        });
    }
    
    // Reset IIT button
    const resetIITBtn = document.getElementById('reset-iit');
    if (resetIITBtn) {
        resetIITBtn.addEventListener('click', resetIITSimulation);
    }
}

// Run IIT simulation
function runIITSimulation() {
    if (!iitSimulationRunning || !iitChart) return;
    
    // Generate network based on parameters
    const network = generateIITNetwork();
    
    // Calculate IIT metrics
    const iitMetrics = calculateIITMetrics(network);
    
    // Update chart with IIT metrics
    updateIITChart(iitMetrics);
    
    // Update phi value display
    updatePhiValue(iitMetrics);
    
    // Generate explanation
    generateIITExplanation(iitMetrics, network);
    
    // End simulation
    iitSimulationRunning = false;
    const runIITBtn = document.getElementById('run-iit');
    if (runIITBtn) {
        runIITBtn.textContent = 'اجرای شبیه‌سازی IIT';
    }
}

// Generate IIT network
function generateIITNetwork() {
    // Create nodes
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: i,
            state: Math.random() > 0.5 ? 1 : 0,
            connections: []
        });
    }
    
    // Create connections based on density
    const maxConnections = nodeCount * (nodeCount - 1);
    const targetConnections = Math.floor(maxConnections * connectionDensity);
    let currentConnections = 0;
    
    while (currentConnections < targetConnections) {
        const source = Math.floor(Math.random() * nodeCount);
        const target = Math.floor(Math.random() * nodeCount);
        
        // Avoid self-connections and duplicates
        if (source !== target && !nodes[source].connections.includes(target)) {
            nodes[source].connections.push(target);
            currentConnections++;
        }
    }
    
    // Apply integration level
    // Higher integration means more shared connections
    if (integrationLevel > 0.5) {
        // Create some common connections that many nodes share
        const commonTargets = [];
        const commonTargetCount = Math.floor(nodeCount * (integrationLevel - 0.5) * 2);
        
        for (let i = 0; i < commonTargetCount; i++) {
            commonTargets.push(Math.floor(Math.random() * nodeCount));
        }
        
        // Add common targets to nodes that don't already have them
        for (let i = 0; i < nodeCount; i++) {
            for (const target of commonTargets) {
                if (i !== target && !nodes[i].connections.includes(target)) {
                    nodes[i].connections.push(target);
                }
            }
        }
    }
    
    return nodes;
}

// Calculate IIT metrics
function calculateIITMetrics(network) {
    // This is a simplified approximation of IIT calculations
    
    // Information: How much the system constrains its possible states
    // Higher node count and connection density increase information
    const information = Math.min(1, (nodeCount / 10) * Math.sqrt(connectionDensity));
    
    // Integration: How much the system functions as a unified whole
    // Directly influenced by the integration level parameter
    const integration = integrationLevel;
    
    // Differentiation: How many different states the system can distinguish
    // Higher with more nodes but lower with very high integration (less independence)
    const differentiation = Math.min(1, (nodeCount / 10) * (1 - Math.pow(integrationLevel - 0.5, 2) * 2));
    
    // Structure: How organized the connections are
    // Higher with balanced connection patterns
    const structure = Math.min(1, connectionDensity * (1 - Math.abs(connectionDensity - 0.6) * 1.5));
    
    // Dynamics: How the system evolves over time
    // Higher with moderate connection density
    const dynamics = Math.min(1, 1 - Math.abs(connectionDensity - 0.5) * 2);
    
    // Calculate Phi (Φ) - the integrated information
    // This is a simplified approximation
    const phi = (information * 0.2 + integration * 0.3 + differentiation * 0.2 + structure * 0.15 + dynamics * 0.15) * 
                Math.min(1, nodeCount / 7) * // Scale based on system size
                (1 - Math.abs(connectionDensity - 0.6)); // Optimal at moderate density
    
    return {
        information,
        integration,
        differentiation,
        structure,
        dynamics,
        phi
    };
}

// Update IIT chart
function updateIITChart(metrics) {
    if (!iitChart) return;
    
    iitChart.data.datasets[0].data = [
        metrics.information,
        metrics.integration,
        metrics.differentiation,
        metrics.structure,
        metrics.dynamics
    ];
    
    iitChart.update();
}

// Update Phi value display
function updatePhiValue(metrics) {
    const phiValueElement = document.getElementById('phi-value');
    if (phiValueElement) {
        phiValueElement.textContent = metrics.phi.toFixed(3);
        
        // Update color based on phi value
        if (metrics.phi < 0.3) {
            phiValueElement.className = 'text-danger';
        } else if (metrics.phi < 0.6) {
            phiValueElement.className = 'text-warning';
        } else {
            phiValueElement.className = 'text-success';
        }
    }
    
    // Update consciousness level description
    const consciousnessLevelElement = document.getElementById('consciousness-level');
    if (consciousnessLevelElement) {
        let level = '';
        if (metrics.phi < 0.2) {
            level = 'بسیار پایین (مشابه خواب عمیق)';
        } else if (metrics.phi < 0.4) {
            level = 'پایین (مشابه خواب REM)';
        } else if (metrics.phi < 0.6) {
            level = 'متوسط (مشابه هوشیاری پایه)';
        } else if (metrics.phi < 0.8) {
            level = 'بالا (مشابه هوشیاری کامل)';
        } else {
            level = 'بسیار بالا (مشابه تجربیات شدید)';
        }
        consciousnessLevelElement.textContent = level;
    }
}

// Generate IIT explanation
function generateIITExplanation(metrics, network) {
    const explanationElement = document.getElementById('iit-explanation');
    if (!explanationElement) return;
    
    let explanation = '<h5>تحلیل نظریه اطلاعات یکپارچه:</h5>';
    
    // Information analysis
    explanation += '<p><strong>اطلاعات:</strong> ';
    if (metrics.information < 0.3) {
        explanation += 'سیستم اطلاعات کمی را محدود می‌کند، که نشان‌دهنده تعداد کم حالت‌های ممکن است.';
    } else if (metrics.information < 0.7) {
        explanation += 'سیستم مقدار متوسطی از اطلاعات را محدود می‌کند، که نشان‌دهنده تعادل خوبی بین نظم و پیچیدگی است.';
    } else {
        explanation += 'سیستم مقدار زیادی از اطلاعات را محدود می‌کند، که نشان‌دهنده پیچیدگی بالا است.';
    }
    explanation += '</p>';
    
    // Integration analysis
    explanation += '<p><strong>یکپارچگی:</strong> ';
    if (metrics.integration < 0.3) {
        explanation += 'سیستم یکپارچگی کمی دارد، که نشان‌دهنده استقلال زیاد بین اجزا است.';
    } else if (metrics.integration < 0.7) {
        explanation += 'سیستم یکپارچگی متوسطی دارد، که نشان‌دهنده تعادل خوبی بین استقلال و وابستگی اجزا است.';
    } else {
        explanation += 'سیستم یکپارچگی بالایی دارد، که نشان‌دهنده وابستگی قوی بین اجزا است.';
    }
    explanation += '</p>';
    
    // Differentiation analysis
    explanation += '<p><strong>تمایز:</strong> ';
    if (metrics.differentiation < 0.3) {
        explanation += 'سیستم تمایز کمی دارد، که نشان‌دهنده توانایی محدود در تشخیص حالت‌های مختلف است.';
    } else if (metrics.differentiation < 0.7) {
        explanation += 'سیستم تمایز متوسطی دارد، که نشان‌دهنده توانایی خوب در تشخیص حالت‌های مختلف است.';
    } else {
        explanation += 'سیستم تمایز بالایی دارد، که نشان‌دهنده توانایی عالی در تشخیص حالت‌های مختلف است.';
    }
    explanation += '</p>';
    
    // Overall Phi analysis
    explanation += '<p><strong>Φ (فی):</strong> ';
    if (metrics.phi < 0.3) {
        explanation += 'مقدار پایین Φ نشان‌دهنده سطح پایین آگاهی است. این سیستم احتمالاً آگاهی محدودی دارد.';
    } else if (metrics.phi < 0.6) {
        explanation += 'مقدار متوسط Φ نشان‌دهنده سطح متوسط آگاهی است. این سیستم می‌تواند تجربیات آگاهانه‌ای داشته باشد.';
    } else {
        explanation += 'مقدار بالای Φ نشان‌دهنده سطح بالای آگاهی است. این سیستم احتمالاً تجربیات آگاهانه غنی و پیچیده‌ای دارد.';
    }
    explanation += '</p>';
    
    // Recommendations
    explanation += '<h5>توصیه‌ها برای افزایش Φ:</h5><ul>';
    
    if (nodeCount < 5) {
        explanation += '<li>افزایش تعداد گره‌ها برای ایجاد پیچیدگی بیشتر</li>';
    }
    
    if (connectionDensity < 0.4) {
        explanation += '<li>افزایش تراکم اتصالات برای بهبود یکپارچگی</li>';
    } else if (connectionDensity > 0.8) {
        explanation += '<li>کاهش تراکم اتصالات برای افزایش تمایز</li>';
    }
    
    if (integrationLevel < 0.5) {
        explanation += '<li>افزایش سطح یکپارچگی برای بهبود ارتباط بین اجزا</li>';
    } else if (integrationLevel > 0.8) {
        explanation += '<li>کاهش سطح یکپارچگی برای افزایش استقلال اجزا</li>';
    }
    
    explanation += '</ul>';
    
    explanationElement.innerHTML = explanation;
}

// Reset IIT simulation
function resetIITSimulation() {
    iitSimulationRunning = false;
    
    const runIITBtn = document.getElementById('run-iit');
    if (runIITBtn) {
        runIITBtn.textContent = 'اجرای شبیه‌سازی IIT';
    }
    
    // Reset chart
    if (iitChart) {
        iitChart.data.datasets[0].data = [0, 0, 0, 0, 0];
        iitChart.update();
    }
    
    // Reset phi value
    const phiValueElement = document.getElementById('phi-value');
    if (phiValueElement) {
        phiValueElement.textContent = '0.000';
        phiValueElement.className = 'text-danger';
    }
    
    // Reset consciousness level
    const consciousnessLevelElement = document.getElementById('consciousness-level');
    if (consciousnessLevelElement) {
        consciousnessLevelElement.textContent = 'بسیار پایین (مشابه خواب عمیق)';
    }
    
    // Reset explanation
    const explanationElement = document.getElementById('iit-explanation');
    if (explanationElement) {
        explanationElement.innerHTML = '<p class="text-muted">اجرای شبیه‌سازی را برای مشاهده تحلیل آغاز کنید.</p>';
    }
}
