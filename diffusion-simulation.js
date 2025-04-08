// Diffusion Simulation JavaScript for Cognitive Cybernetics Website

// Global variables
let diffusionChart; // Chart.js instance
let diffusionModel = 'si'; // Default diffusion model
let infectionRate = 0.2; // Default infection rate
let recoveryRate = 0.1; // Default recovery rate
let initialInfected = 1; // Default initial infected count
let diffusionSimulationRunning = false; // Flag for simulation status
let diffusionData = []; // Simulation data
let timeSteps = 50; // Number of time steps to simulate

// Initialize the diffusion simulation
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('diffusion-chart')) return;
    
    console.log('Initializing diffusion simulation...');
    
    // Initialize diffusion chart
    initDiffusionChart();
    
    // Initialize diffusion controls
    initDiffusionControls();
});

// Initialize diffusion chart
function initDiffusionChart() {
    const ctx = document.getElementById('diffusion-chart');
    if (!ctx) return;
    
    diffusionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: timeSteps}, (_, i) => i + 1),
            datasets: [
                {
                    label: 'مستعد (S)',
                    data: [],
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'آلوده (I)',
                    data: [],
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'بهبودیافته (R)',
                    data: [],
                    borderColor: 'rgba(46, 204, 113, 1)',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'شبیه‌سازی انتشار اطلاعات در شبکه'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'گام زمانی'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'تعداد افراد'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Initialize diffusion controls
function initDiffusionControls() {
    // Diffusion model selector
    const diffusionModelSelect = document.getElementById('diffusion-model');
    if (diffusionModelSelect) {
        diffusionModelSelect.addEventListener('change', function() {
            diffusionModel = this.value;
        });
    }
    
    // Infection rate slider
    const infectionRateSlider = document.getElementById('infection-rate');
    if (infectionRateSlider) {
        infectionRateSlider.addEventListener('input', function() {
            infectionRate = parseFloat(this.value);
        });
    }
    
    // Recovery rate slider
    const recoveryRateSlider = document.getElementById('recovery-rate');
    if (recoveryRateSlider) {
        recoveryRateSlider.addEventListener('input', function() {
            recoveryRate = parseFloat(this.value);
        });
    }
    
    // Initial infected slider
    const initialInfectedSlider = document.getElementById('initial-infected');
    if (initialInfectedSlider) {
        initialInfectedSlider.addEventListener('input', function() {
            initialInfected = parseInt(this.value);
        });
    }
    
    // Run diffusion button
    const runDiffusionBtn = document.getElementById('run-diffusion');
    if (runDiffusionBtn) {
        runDiffusionBtn.addEventListener('click', function() {
            if (!diffusionSimulationRunning) {
                diffusionSimulationRunning = true;
                this.textContent = 'توقف شبیه‌سازی';
                runDiffusionSimulation();
            } else {
                diffusionSimulationRunning = false;
                this.textContent = 'اجرای شبیه‌سازی انتشار';
            }
        });
    }
    
    // Reset diffusion button
    const resetDiffusionBtn = document.getElementById('reset-diffusion');
    if (resetDiffusionBtn) {
        resetDiffusionBtn.addEventListener('click', resetDiffusionSimulation);
    }
}

// Run diffusion simulation
function runDiffusionSimulation() {
    if (!diffusionSimulationRunning || !diffusionChart) return;
    
    // Get total population from network visualization if available
    let totalPopulation = 100; // Default
    if (window.cy && window.cy.nodes) {
        totalPopulation = window.cy.nodes().length;
    }
    
    // Initialize simulation data
    if (diffusionData.length === 0) {
        // Initial state
        let susceptible = totalPopulation - initialInfected;
        let infected = initialInfected;
        let recovered = 0;
        
        diffusionData = [{
            susceptible: susceptible,
            infected: infected,
            recovered: recovered
        }];
        
        // Update chart with initial data
        updateDiffusionChart();
    }
    
    // Calculate next step
    const lastState = diffusionData[diffusionData.length - 1];
    let nextState = {};
    
    switch (diffusionModel) {
        case 'si': // Susceptible-Infected model
            // New infections: S * I * beta / N
            const newInfectionsSI = Math.round(lastState.susceptible * lastState.infected * infectionRate / totalPopulation);
            
            nextState = {
                susceptible: lastState.susceptible - newInfectionsSI,
                infected: lastState.infected + newInfectionsSI,
                recovered: 0
            };
            break;
            
        case 'sir': // Susceptible-Infected-Recovered model
            // New infections: S * I * beta / N
            const newInfectionsSIR = Math.round(lastState.susceptible * lastState.infected * infectionRate / totalPopulation);
            // New recoveries: I * gamma
            const newRecoveriesSIR = Math.round(lastState.infected * recoveryRate);
            
            nextState = {
                susceptible: lastState.susceptible - newInfectionsSIR,
                infected: lastState.infected + newInfectionsSIR - newRecoveriesSIR,
                recovered: lastState.recovered + newRecoveriesSIR
            };
            break;
            
        case 'sis': // Susceptible-Infected-Susceptible model
            // New infections: S * I * beta / N
            const newInfectionsSIS = Math.round(lastState.susceptible * lastState.infected * infectionRate / totalPopulation);
            // New recoveries (becoming susceptible again): I * gamma
            const newRecoveriesSIS = Math.round(lastState.infected * recoveryRate);
            
            nextState = {
                susceptible: lastState.susceptible - newInfectionsSIS + newRecoveriesSIS,
                infected: lastState.infected + newInfectionsSIS - newRecoveriesSIS,
                recovered: 0
            };
            break;
    }
    
    // Ensure values are non-negative
    nextState.susceptible = Math.max(0, nextState.susceptible);
    nextState.infected = Math.max(0, nextState.infected);
    nextState.recovered = Math.max(0, nextState.recovered);
    
    // Add to simulation data
    diffusionData.push(nextState);
    
    // Update chart
    updateDiffusionChart();
    
    // Continue simulation if not all steps are completed
    if (diffusionSimulationRunning && diffusionData.length < timeSteps) {
        setTimeout(runDiffusionSimulation, 200);
    } else {
        // End simulation
        diffusionSimulationRunning = false;
        const runDiffusionBtn = document.getElementById('run-diffusion');
        if (runDiffusionBtn) {
            runDiffusionBtn.textContent = 'اجرای شبیه‌سازی انتشار';
        }
    }
    
    // Update network visualization if available
    if (window.cy && window.cy.nodes) {
        updateNetworkWithDiffusionState(nextState);
    }
}

// Update diffusion chart
function updateDiffusionChart() {
    if (!diffusionChart) return;
    
    // Extract data series
    const susceptibleData = diffusionData.map(d => d.susceptible);
    const infectedData = diffusionData.map(d => d.infected);
    const recoveredData = diffusionData.map(d => d.recovered);
    
    // Update chart datasets
    diffusionChart.data.datasets[0].data = susceptibleData;
    diffusionChart.data.datasets[1].data = infectedData;
    diffusionChart.data.datasets[2].data = recoveredData;
    
    // Update chart
    diffusionChart.update();
}

// Reset diffusion simulation
function resetDiffusionSimulation() {
    diffusionSimulationRunning = false;
    
    const runDiffusionBtn = document.getElementById('run-diffusion');
    if (runDiffusionBtn) {
        runDiffusionBtn.textContent = 'اجرای شبیه‌سازی انتشار';
    }
    
    // Clear simulation data
    diffusionData = [];
    
    // Reset chart
    if (diffusionChart) {
        diffusionChart.data.datasets[0].data = [];
        diffusionChart.data.datasets[1].data = [];
        diffusionChart.data.datasets[2].data = [];
        diffusionChart.update();
    }
    
    // Reset network visualization if available
    if (window.cy && window.cy.nodes) {
        resetNetworkDiffusionState();
    }
}

// Update network visualization with diffusion state
function updateNetworkWithDiffusionState(state) {
    if (!window.cy) return;
    
    const nodes = window.cy.nodes();
    const totalNodes = nodes.length;
    
    // Calculate how many nodes should be in each state
    const infectedCount = Math.min(state.infected, totalNodes);
    const recoveredCount = Math.min(state.recovered, totalNodes - infectedCount);
    const susceptibleCount = totalNodes - infectedCount - recoveredCount;
    
    // Reset all nodes
    nodes.forEach(node => {
        node.removeData('diffusionState');
    });
    
    // Randomly assign states
    const shuffledNodes = nodes.toArray().sort(() => 0.5 - Math.random());
    
    // Assign infected state
    for (let i = 0; i < infectedCount; i++) {
        shuffledNodes[i].data('diffusionState', 'infected');
        shuffledNodes[i].style('background-color', '#e74c3c');
    }
    
    // Assign recovered state
    for (let i = infectedCount; i < infectedCount + recoveredCount; i++) {
        shuffledNodes[i].data('diffusionState', 'recovered');
        shuffledNodes[i].style('background-color', '#2ecc71');
    }
    
    // Assign susceptible state
    for (let i = infectedCount + recoveredCount; i < totalNodes; i++) {
        shuffledNodes[i].data('diffusionState', 'susceptible');
        shuffledNodes[i].style('background-color', '#3498db');
    }
}

// Reset network visualization diffusion state
function resetNetworkDiffusionState() {
    if (!window.cy) return;
    
    const nodes = window.cy.nodes();
    
    // Reset all nodes
    nodes.forEach(node => {
        node.removeData('diffusionState');
        node.style('background-color', '#3498db');
    });
}
