let selectedGender = null;
let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];

// Gender selection
document.getElementById('male-btn').addEventListener('click', function() {
    selectedGender = 'male';
    this.classList.add('active');
    document.getElementById('female-btn').classList.remove('active');
});

document.getElementById('female-btn').addEventListener('click', function() {
    selectedGender = 'female';
    this.classList.add('active');
    document.getElementById('male-btn').classList.remove('active');
});

// Calculate BMI
document.getElementById('calculateBtn').addEventListener('click', calculateBMI);

function calculateBMI() {
    const heightValue = parseFloat(document.getElementById('height').value);
    const heightUnit = document.getElementById('height-unit').value;
    const weightValue = parseFloat(document.getElementById('weight').value);
    const weightUnit = document.getElementById('weight-unit').value;
    
    if (!heightValue || !weightValue) {
        alert('Please enter both height and weight!');
        return;
    }
    
    // Convert height to meters
    let heightInMeters;
    switch(heightUnit) {
        case 'cm':
            heightInMeters = heightValue / 100;
            break;
        case 'm':
            heightInMeters = heightValue;
            break;
        case 'ft':
            heightInMeters = heightValue * 0.3048;
            break;
        case 'in':
            heightInMeters = heightValue * 0.0254;
            break;
        default:
            heightInMeters = heightValue / 100;
    }
    
    // Convert weight to kg
    let weightInKg;
    switch(weightUnit) {
        case 'kg':
            weightInKg = weightValue;
            break;
        case 'lbs':
            weightInKg = weightValue * 0.453592;
            break;
        case 'st':
            weightInKg = weightValue * 6.35029;
            break;
        default:
            weightInKg = weightValue;
    }
    
    // Calculate BMI
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    displayResults(bmi, heightInMeters, weightInKg, weightUnit);
    
    // Save to history
    saveBMIHistory(bmi);
}

function displayResults(bmi, height, weight, weightUnit) {
    const bmiRounded = bmi.toFixed(1);
    
    // Get category and color
    let category, color, advice, range;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3498db';
        range = 'BMI < 18.5';
        advice = 'You are underweight. Consider consulting with a nutritionist to develop a healthy weight gain plan. Focus on nutrient-dense foods and strength training exercises.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        color = '#2ecc71';
        range = 'BMI 18.5 - 24.9';
        advice = 'Great! You are at a healthy weight. Maintain your current lifestyle with balanced nutrition and regular physical activity.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#f39c12';
        range = 'BMI 25.0 - 29.9';
        advice = 'You are overweight. Consider adopting a healthier diet and increasing physical activity. Small lifestyle changes can make a big difference.';
    } else if (bmi >= 30 && bmi < 35) {
        category = 'Obese (Class I)';
        color = '#e74c3c';
        range = 'BMI 30.0 - 34.9';
        advice = 'You are in the obese category. It\'s recommended to consult with healthcare professionals to develop a weight management plan. Focus on gradual, sustainable changes.';
    } else {
        category = 'Obese (Class II/III)';
        color = '#c0392b';
        range = 'BMI ≥ 35.0';
        advice = 'You are in a high-risk obesity category. Please consult with healthcare professionals immediately for a comprehensive health assessment and personalized treatment plan.';
    }
    
    // Display results
    document.getElementById('bmiNumber').textContent = bmiRounded;
    document.getElementById('bmiNumber').style.color = color;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiCategory').style.color = color;
    document.getElementById('bmiRange').textContent = range;
    
    // Update gauge pointer
    const pointer = document.getElementById('bmiPointer');
    let percentage = 0;
    
    if (bmi < 18.5) {
        percentage = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        percentage = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi < 30) {
        percentage = 50 + ((bmi - 25) / 5) * 25;
    } else if (bmi < 40) {
        percentage = 75 + ((bmi - 30) / 10) * 25;
    } else {
        percentage = 100;
    }
    
    pointer.style.left = `${Math.min(percentage, 100)}%`;
    
    // Health advice
    document.getElementById('healthAdvice').innerHTML = `
        <h3>💡 Health Advice</h3>
        <p>${advice}</p>
    `;
    
    // Ideal weight range
    const heightInM = height;
    const minWeightKg = (18.5 * heightInM * heightInM);
    const maxWeightKg = (24.9 * heightInM * heightInM);
    
    let weightDisplay;
    // Display in the user's selected unit
    if (weightUnit === 'lbs') {
        const minLbs = (minWeightKg * 2.20462).toFixed(1);
        const maxLbs = (maxWeightKg * 2.20462).toFixed(1);
        weightDisplay = `${minLbs} - ${maxLbs} lbs`;
    } else if (weightUnit === 'st') {
        const minSt = (minWeightKg / 6.35029).toFixed(1);
        const maxSt = (maxWeightKg / 6.35029).toFixed(1);
        weightDisplay = `${minSt} - ${maxSt} stone`;
    } else {
        weightDisplay = `${minWeightKg.toFixed(1)} - ${maxWeightKg.toFixed(1)} kg`;
    }
    
    document.getElementById('idealWeight').innerHTML = `
        <h3>🎯 Your Ideal Weight Range</h3>
        <p>Based on your height, a healthy weight range is <strong>${weightDisplay}</strong></p>
    `;
    
    // Show results
    document.getElementById('resultSection').classList.add('show');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveBMIHistory(bmi) {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    bmiHistory.unshift({
        bmi: bmi.toFixed(1),
        date: date,
        time: time
    });
    
    // Keep only last 10 entries
    if (bmiHistory.length > 10) {
        bmiHistory = bmiHistory.slice(0, 10);
    }
    
    localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
    displayHistory();
}

function displayHistory() {
    if (bmiHistory.length === 0) {
        document.getElementById('historySection').classList.remove('show');
        return;
    }
    
    document.getElementById('historySection').classList.add('show');
    
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    bmiHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        let category, color;
        const bmi = parseFloat(item.bmi);
        
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3498db';
        } else if (bmi < 25) {
            category = 'Normal';
            color = '#2ecc71';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f39c12';
        } else {
            category = 'Obese';
            color = '#e74c3c';
        }
        
        div.innerHTML = `
            <div>
                <div class="history-bmi" style="color: ${color}">${item.bmi}</div>
                <div style="color: #999; font-size: 0.9rem;">${category}</div>
            </div>
            <div class="history-date">${item.date} ${item.time}</div>
        `;
        
        historyList.appendChild(div);
    });
}

document.getElementById('clearHistory').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your BMI history?')) {
        bmiHistory = [];
        localStorage.removeItem('bmiHistory');
        displayHistory();
    }
});

// Load history on page load
displayHistory();

// Allow Enter key to calculate
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBMI();
        }
    });
});
