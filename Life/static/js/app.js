document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeOffIcon = document.getElementById('eye-off-icon');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    // Checklist items
    const critLength = document.getElementById('criteria-length');
    const critUpper = document.getElementById('criteria-uppercase');
    const critLower = document.getElementById('criteria-lowercase');
    const critNumber = document.getElementById('criteria-number');
    const critSpecial = document.getElementById('criteria-special');
    
    // API verification items
    const apiCheckBtn = document.getElementById('api-check-btn');
    const apiResultCard = document.getElementById('api-result-card');
    const apiJsonResponse = document.getElementById('api-json-response');

    // Toggle Password Visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.style.display = 'none';
            eyeOffIcon.style.display = 'block';
        } else {
            eyeIcon.style.display = 'block';
            eyeOffIcon.style.display = 'none';
        }
    });

    // Real-time analysis handler
    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;
        analyzePassword(val);
    });

    function analyzePassword(password) {
        if (!password) {
            // Empty state reset
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Enter a password';
            strengthText.className = 'strength-text color-empty';
            
            // Reset criteria list
            [critLength, critUpper, critLower, critNumber, critSpecial].forEach(el => {
                el.classList.remove('valid');
            });
            return;
        }

        // Validate each criterion
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update list styles
        toggleCritClass(critLength, checks.length);
        toggleCritClass(critUpper, checks.uppercase);
        toggleCritClass(critLower, checks.lowercase);
        toggleCritClass(critNumber, checks.number);
        toggleCritClass(critSpecial, checks.special);

        // Calculate score
        const score = Object.values(checks).filter(Boolean).length;
        
        // Update strength bar styling
        strengthBar.style.width = `${score * 20}%`;
        strengthBar.className = 'strength-bar'; // reset classes
        
        if (score <= 2) {
            strengthBar.classList.add('bg-danger');
            strengthText.textContent = score === 0 ? 'Very Weak' : 'Weak';
            strengthText.className = 'strength-text color-danger';
        } else if (score === 3) {
            strengthBar.classList.add('bg-warning');
            strengthText.textContent = 'Medium';
            strengthText.className = 'strength-text color-warning';
        } else if (score === 4) {
            strengthBar.classList.add('bg-success');
            strengthText.textContent = 'Strong';
            strengthText.className = 'strength-text color-success';
        } else if (score === 5) {
            strengthBar.classList.add('bg-ideal');
            strengthText.textContent = 'Very Strong';
            strengthText.className = 'strength-text color-ideal';
        }
    }

    function toggleCritClass(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }

    // Call server check API
    apiCheckBtn.addEventListener('click', async () => {
        const password = passwordInput.value;
        
        // Use an arbitrary string if input is empty
        const queryPassword = password ? password : "DefaultEmpty123!";
        
        try {
            apiCheckBtn.textContent = 'Verifying...';
            apiCheckBtn.disabled = true;

            const response = await fetch(`/check/${encodeURIComponent(queryPassword)}`);
            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }
            
            const data = await response.json();
            
            apiJsonResponse.textContent = JSON.stringify(data, null, 2);
            apiResultCard.style.display = 'block';
        } catch (error) {
            console.error('API validation failed:', error);
            apiJsonResponse.textContent = JSON.stringify({ error: error.message }, null, 2);
            apiResultCard.style.display = 'block';
        } finally {
            apiCheckBtn.textContent = 'Run Backend Check';
            apiCheckBtn.disabled = false;
        }
    });
});
