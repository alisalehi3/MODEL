// Biocybernetic Loop JavaScript for Cognitive Cybernetics Website

// Global variables
let biocyberneticChart; // Chart.js instance
let biocyberneticData = []; // Simulation data
let biocyberneticSimulationRunning = false; // Flag for simulation status
let timeSteps = 100; // Number of time steps to simulate
let samplingRate = 10; // Hz
let attentionThreshold = 0.6; // Default attention threshold
let relaxationThreshold = 0.4; // Default relaxation threshold
let adaptationRate = 0.05; // Default adaptation rate

// Initialize the biocybernetic loop simulation
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('biocybernetic-chart')) return;
    
    console.log('Initializing biocybernetic loop simulation...');
    
    // Initialize biocybernetic chart
    initBiocyberneticChart();
    
    // Initialize biocybernetic controls
    initBiocyberneticControls();
});

// Initialize biocybernetic chart
function initBiocyberneticChart() {
    const ctx = document.getElementById('biocybernetic-chart');
    if (!ctx) return;
    
    biocyberneticChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: timeSteps}, (_, i) => i / samplingRate),
            datasets: [
                {
                    label: 'سطح آگاهی',
                    data: [],
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'آستانه توجه',
                    data: [],
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0,
                    yAxisID: 'y'
                },
                {
                    label: 'آستانه آرامش',
                    data: [],
                    borderColor: 'rgba(46, 204, 113, 1)',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0,
                    yAxisID: 'y'
                },
                {
                    label: 'پاسخ سیستم',
                    data: [],
                    borderColor: 'rgba(155, 89, 182, 1)',
                    backgroundColor: 'rgba(155, 89, 182, 0.2)',
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'شبیه‌سازی حلقه بیوسایبرنتیک'
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
                        text: 'زمان (ثانیه)'
                    }
                },
                y: {
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'سطح آگاهی'
                    },
                    min: 0,
                    max: 1
                },
                y1: {
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'پاسخ سیستم'
                    },
                    min: -1,
                    max: 1,
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Initialize biocybernetic controls
function initBiocyberneticControls() {
    // Attention threshold slider
    const attentionThresholdSlider = document.getElementById('attention-threshold');
    if (attentionThresholdSlider) {
        attentionThresholdSlider.addEventListener('input', function() {
            attentionThreshold = parseFloat(this.value);
            updateThresholdLines();
        });
    }
    
    // Relaxation threshold slider
    const relaxationThresholdSlider = document.getElementById('relaxation-threshold');
    if (relaxationThresholdSlider) {
        relaxationThresholdSlider.addEventListener('input', function() {
            relaxationThreshold = parseFloat(this.value);
            updateThresholdLines();
        });
    }
    
    // Adaptation rate slider
    const adaptationRateSlider = document.getElementById('adaptation-rate');
    if (adaptationRateSlider) {
        adaptationRateSlider.addEventListener('input', function() {
            adaptationRate = parseFloat(this.value);
        });
    }
    
    // Run biocybernetic loop button
    const runBiocyberneticBtn = document.getElementById('run-biocybernetic');
    if (runBiocyberneticBtn) {
        runBiocyberneticBtn.addEventListener('click', function() {
            if (!biocyberneticSimulationRunning) {
                biocyberneticSimulationRunning = true;
                this.textContent = 'توقف شبیه‌سازی';
                runBiocyberneticSimulation();
            } else {
                biocyberneticSimulationRunning = false;
                this.textContent = 'اجرای شبیه‌سازی حلقه بیوسایبرنتیک';
            }
        });
    }
    
    // Reset biocybernetic loop button
    const resetBiocyberneticBtn = document.getElementById('reset-biocybernetic');
    if (resetBiocyberneticBtn) {
        resetBiocyberneticBtn.addEventListener('click', resetBiocyberneticSimulation);
    }
}

// Update threshold lines
function updateThresholdLines() {
    if (!biocyberneticChart) return;
    
    const attentionLine = Array(timeSteps).fill(attentionThreshold);
    const relaxationLine = Array(timeSteps).fill(relaxationThreshold);
    
    biocyberneticChart.data.datasets[1].data = attentionLine;
    biocyberneticChart.data.datasets[2].data = relaxationLine;
    
    biocyberneticChart.update();
}

// Run biocybernetic simulation
function runBiocyberneticSimulation() {
    if (!biocyberneticSimulationRunning || !biocyberneticChart) return;
    
    // Initialize simulation data if empty
    if (biocyberneticData.length === 0) {
        // Initial state
        biocyberneticData = [];
        
        // Generate consciousness level data with some realistic patterns
        let consciousnessLevel = 0.5; // Start at medium level
        let systemResponse = 0;
        
        for (let i = 0; i < timeSteps; i++) {
            // Add some natural variation with sine waves of different frequencies
            const naturalVariation = 
                0.1 * Math.sin(i / 10) + 
                0.05 * Math.sin(i / 5) + 
                0.02 * Math.sin(i / 2);
            
            // Add some random noise
            const noise = 0.03 * (Math.random() - 0.5);
            
            // Calculate new consciousness level with constraints
            consciousnessLevel += naturalVariation + noise;
            
            // Apply system response feedback
            if (consciousnessLevel > attentionThreshold) {
                // System tries to calm the user down
                systemResponse = -adaptationRate * (consciousnessLevel - attentionThreshold);
            } else if (consciousnessLevel < relaxationThreshold) {
                // System tries to increase arousal
                systemResponse = adaptationRate * (relaxationThreshold - consciousnessLevel);
            } else {
                // Neutral zone - gradually return to neutral
                systemResponse *= 0.9;
            }
            
            // Apply system response effect with some delay
            if (i > 5) {
                consciousnessLevel += biocyberneticData[i-5].systemResponse;
            }
            
            // Ensure consciousness level stays within bounds
            consciousnessLevel = Math.max(0, Math.min(1, consciousnessLevel));
            
            biocyberneticData.push({
                consciousnessLevel: consciousnessLevel,
                systemResponse: systemResponse
            });
        }
        
        // Update chart with full simulation data
        updateBiocyberneticChart();
        
        // End simulation
        biocyberneticSimulationRunning = false;
        const runBiocyberneticBtn = document.getElementById('run-biocybernetic');
        if (runBiocyberneticBtn) {
            runBiocyberneticBtn.textContent = 'اجرای شبیه‌سازی حلقه بیوسایبرنتیک';
        }
    }
}

// Update biocybernetic chart
function updateBiocyberneticChart() {
    if (!biocyberneticChart) return;
    
    // Extract data series
    const consciousnessData = biocyberneticData.map(d => d.consciousnessLevel);
    const systemResponseData = biocyberneticData.map(d => d.systemResponse);
    
    // Update chart datasets
    biocyberneticChart.data.datasets[0].data = consciousnessData;
    biocyberneticChart.data.datasets[3].data = systemResponseData;
    
    // Update threshold lines
    updateThresholdLines();
    
    // Update chart
    biocyberneticChart.update();
    
    // Update UI feedback
    updateUIFeedback();
}

// Update UI feedback based on simulation results
function updateUIFeedback() {
    const feedbackElement = document.getElementById('biocybernetic-feedback');
    if (!feedbackElement || biocyberneticData.length === 0) return;
    
    // Calculate average consciousness level
    const avgConsciousness = biocyberneticData.reduce((sum, d) => sum + d.consciousnessLevel, 0) / biocyberneticData.length;
    
    // Calculate time spent above attention threshold
    const timeAboveThreshold = biocyberneticData.filter(d => d.consciousnessLevel > attentionThreshold).length / biocyberneticData.length;
    
    // Calculate time spent below relaxation threshold
    const timeBelowThreshold = biocyberneticData.filter(d => d.consciousnessLevel < relaxationThreshold).length / biocyberneticData.length;
    
    // Calculate system response effectiveness
    const initialVariance = calculateVariance(biocyberneticData.slice(0, 20).map(d => d.consciousnessLevel));
    const finalVariance = calculateVariance(biocyberneticData.slice(-20).map(d => d.consciousnessLevel));
    const varianceReduction = (initialVariance - finalVariance) / initialVariance;
    
    // Generate feedback
    let feedback = `<h5>نتایج شبیه‌سازی حلقه بیوسایبرنتیک:</h5>`;
    feedback += `<p>میانگین سطح آگاهی: ${(avgConsciousness * 100).toFixed(1)}%</p>`;
    feedback += `<p>زمان بالاتر از آستانه توجه: ${(timeAboveThreshold * 100).toFixed(1)}%</p>`;
    feedback += `<p>زمان پایین‌تر از آستانه آرامش: ${(timeBelowThreshold * 100).toFixed(1)}%</p>`;
    
    if (varianceReduction > 0) {
        feedback += `<p class="text-success">اثربخشی پاسخ سیستم: ${(varianceReduction * 100).toFixed(1)}% کاهش در نوسانات</p>`;
    } else {
        feedback += `<p class="text-danger">اثربخشی پاسخ سیستم: ${(varianceReduction * 100).toFixed(1)}% (افزایش در نوسانات)</p>`;
    }
    
    // Add recommendation
    feedback += `<h5>توصیه‌ها:</h5>`;
    if (timeAboveThreshold > 0.3) {
        feedback += `<p>آستانه توجه بالاتری را امتحان کنید تا پاسخ‌های سیستم زودتر فعال شوند.</p>`;
    }
    if (timeBelowThreshold > 0.3) {
        feedback += `<p>آستانه آرامش پایین‌تری را امتحان کنید تا از تحریک بیش از حد جلوگیری شود.</p>`;
    }
    if (Math.abs(varianceReduction) < 0.1) {
        feedback += `<p>نرخ انطباق بالاتری را امتحان کنید تا اثربخشی سیستم افزایش یابد.</p>`;
    } else if (varianceReduction < -0.1) {
        feedback += `<p>نرخ انطباق پایین‌تری را امتحان کنید تا از نوسانات بیش از حد جلوگیری شود.</p>`;
    }
    
    feedbackElement.innerHTML = feedback;
}

// Calculate variance of an array
function calculateVariance(array) {
    const mean = array.reduce((sum, val) => sum + val, 0) / array.length;
    return array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length;
}

// Reset biocybernetic simulation
function resetBiocyberneticSimulation() {
    biocyberneticSimulationRunning = false;
    
    const runBiocyberneticBtn = document.getElementById('run-biocybernetic');
    if (runBiocyberneticBtn) {
        runBiocyberneticBtn.textContent = 'اجرای شبیه‌سازی حلقه بیوسایبرنتیک';
    }
    
    // Clear simulation data
    biocyberneticData = [];
    
    // Reset chart
    if (biocyberneticChart) {
        biocyberneticChart.data.datasets[0].data = [];
        biocyberneticChart.data.datasets[3].data = [];
        updateThresholdLines();
        biocyberneticChart.update();
    }
    
    // Clear feedback
    const feedbackElement = document.getElementById('biocybernetic-feedback');
    if (feedbackElement) {
        feedbackElement.innerHTML = '<p class="text-muted">اجرای شبیه‌سازی را برای مشاهده نتایج و بازخورد آغاز کنید.</p>';
    }
}
