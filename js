// Global variables
let currentStep = 1;
let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let voiceData = {};
let quizData = {};
let brainprintData = {};

// Initialize 3D Brain Visualization
function initBrainVisualization() {
    const canvas = document.getElementById('brain-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);

    // Create brain geometry
    const brainGeometry = new THREE.SphereGeometry(2, 32, 32);
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });
    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    scene.add(brain);

    // Add neural network lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff6b6b });
    
    const points = [];
    for (let i = 0; i < 100; i++) {
        points.push(
            Math.random() * 6 - 3,
            Math.random() * 6 - 3,
            Math.random() * 6 - 3
        );
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const lines = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(lines);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 8;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        brain.rotation.x += 0.005;
        brain.rotation.y += 0.01;
        lines.rotation.x += 0.003;
        lines.rotation.y += 0.007;
        renderer.render(scene, camera);
    }
    animate();
}

// Assessment Functions
function startAssessment() {
    document.getElementById('assessment-section').style.display = 'block';
    document.getElementById('assessment-section').scrollIntoView({ behavior: 'smooth' });
}

function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            processVoiceData(audioBlob);
        };

        mediaRecorder.start();
        isRecording = true;
        
        document.getElementById('recordBtn').classList.add('recording');
        document.getElementById('recordBtn').innerHTML = '⏹️';
        document.getElementById('record-status').textContent = 'Recording... Click to stop';
        document.getElementById('waveform').style.display = 'flex';
        
        generateWaveform();
        
        // Auto-stop after 30 seconds
        setTimeout(() => {
            if (isRecording) stopRecording();
        }, 30000);

    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to continue with voice analysis.');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        document.getElementById('recordBtn').classList.remove('recording');
        document.getElementById('recordBtn').innerHTML = '🎤';
        document.getElementById('record-status').textContent = 'Processing your voice...';
        
        // Stop all audio tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

function generateWaveform() {
    const waveform = document.getElementById('waveform');
    waveform.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        bar.style.height = Math.random() * 60 + 20 + 'px';
        waveform.appendChild(bar);
        
        if (isRecording) {
            setInterval(() => {
                if (isRecording) {
                    bar.style.height = Math.random() * 60 + 20 + 'px';
                }
            }, 200 + Math.random() * 300);
        }
    }
}

function processVoiceData(audioBlob) {
    // Simulate voice analysis
    setTimeout(() => {
        voiceData = {
            pitch_mean: 180 + Math.random() * 40,
            energy_level: 0.3 + Math.random() * 0.4,
            speech_rate: 3 + Math.random() * 2,
            confidence: 70 + Math.random() * 25,
            clarity: 80 + Math.random() * 15
        };
        
        document.getElementById('record-status').textContent = 'Voice analysis complete!';
        setTimeout(() => nextStep(), 1500);
    }, 2000);
}

function loadQuiz() {
    const questions = [
        {
            question: "When solving a complex problem, I prefer to:",
            options: [
                "Break it down into smaller, logical steps",
                "Look for creative, unconventional solutions", 
                "Discuss it with others to get different perspectives",
                "Use my gut feeling and past experience"
            ]
        },
        {
            question: "In a team meeting, I typically:",
            options: [
                "Take charge and guide the discussion",
                "Listen carefully and ask thoughtful questions",
                "Generate new ideas and possibilities",
                "Focus on practical implementation details"
            ]
        },
        {
            question: "When learning something new, I learn best by:",
            options: [
                "Reading detailed explanations and theory",
                "Hands-on practice and experimentation",
                "Visual diagrams and flowcharts",
                "Listening to lectures or discussions"
            ]
        }
    ];

    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        const qBlock = document.createElement("div");
        qBlock.className = "quiz-question";
        qBlock.innerHTML = `<h4>${q.question}</h4>` + q.options.map(opt => `
            <label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>
        `).join("");
        container.appendChild(qBlock);
    });
}

function processVoiceData(audioBlob) {
    // Simulate voice analysis
    setTimeout(() => {
        voiceData = {
            pitch_mean: 180 + Math.random() * 40,
            energy_level: 0.3 + Math.random() * 0.4,
            speech_rate: 3 + Math.random() * 2,
            confidence: 70 + Math.random() * 25,
            clarity: 80 + Math.random() * 15
        };
        
        document.getElementById('record-status').textContent = 'Voice analysis complete!';
        setTimeout(() => nextStep(), 1500); // <--- perfect placement
    }, 2000);
}



function generateBrainprint() {
    setTimeout(() => {
        console.log("Brainprint generated:", voiceData, quizData);
        document.getElementById('brainprint-step').innerHTML = `
            <h3> Brainprint Generated</h3>
            <p>We’ve analyzed your thinking patterns based on your voice and quiz responses.</p>
        `;
        nextStep();
    }, 2000);
}

function submitQuiz() {
    // Collect answers (optional — for future brainprint use)
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach((q, i) => {
        const selected = q.querySelector('input[type="radio"]:checked');
        quizData[`q${i}`] = selected ? selected.value : null;
    });

    // Optional: Validate all questions are answered
    if (Object.values(quizData).includes(null)) {
        alert("Please answer all the questions before submitting.");
        return;
    }

    // Move to next step
    nextStep();
}


function runMatchmaking() {
    setTimeout(() => {
        document.getElementById('matchmaking-step').innerHTML = `
            <h3> Smart Matchmaking</h3>
            <p>We’re finding people with similar brainprints and collaboration preferences...</p>
        `;
        nextStep();
    }, 1500);
}

function showProfiling() {
    setTimeout(() => {
        document.getElementById('profiling-step').innerHTML = `
            <h3> Dynamic Profiling</h3>
            <p>Here’s a visual summary of your cognitive profile and strengths.</p>
        `;
        nextStep();
    }, 1500);
}

function showProjectMatches() {
    document.getElementById('projects-step').innerHTML = `
        <h3> Project Matching</h3>
        <p>Based on everything we learned, here are some ideal projects for you!</p>
    `;
}

function nextStep() {
    const steps = [
        'voice-step',
        'quiz-step',
        'brainprint-step',
        'results-step',
        'matchmaking-step',
        'profiling-step',
        'project-step'
    ];

    if (currentStep < steps.length) {
        // Hide current step
        document.getElementById(steps[currentStep - 1]).style.display = 'none';

        // Show next step
        document.getElementById(steps[currentStep]).style.display = 'block';

        // Update step indicator if it exists
        const stepIndicator = document.getElementById(`step-${currentStep + 1}`);
        if (stepIndicator) stepIndicator.classList.add('active');

        // Run logic for that specific step
        switch (steps[currentStep]) {
            case 'quiz-step':
                loadQuiz();
                break;
            case 'brainprint-step':
                setTimeout(() => nextStep(), 3000);
                break;
            case 'results-step':
                document.getElementById('brainprint-display').innerHTML = `<h3 style="text-align:center;">🎯 Brainprint Created!</h3>`;
                setTimeout(() => nextStep(), 2000);
                break;
            case 'matchmaking-step':
                setTimeout(() => nextStep(), 2500);
                break;
            case 'profiling-step':
                setTimeout(() => nextStep(), 2500);
                break;
            case 'project-step':
                document.getElementById('project-step').innerHTML += `<p style="text-align:center;">🚀 You're ready to collaborate!</p>`;
                break;
        }

        currentStep++;
    }
}
