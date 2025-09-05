// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messageContainer = document.getElementById('messageContainer');
    const messageText = document.getElementById('messageText');

    // Load existing submissions from localStorage
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from opening in new tab
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Validate form data
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('❌ Invalid email format! Please use format: example@domain.com', 'error');
            // Highlight email field
            highlightField('email');
            return;
        }

        // Validate Indian phone format
        const phoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;
        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showMessage('❌ Invalid Indian phone number! Please use format: 9876543210, +91 9876543210, or 98765 43210', 'error');
            // Highlight phone field
            highlightField('phone');
            return;
        }

        // Store the submission
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        // Show success message
        showMessage('Thank you! Your message has been sent successfully.', 'success');

        // Reset the form
        contactForm.reset();

        // Log the submission (for development purposes)
        console.log('New submission:', formData);
        console.log('Total submissions:', submissions.length);
    });

    function showMessage(text, type) {
        messageText.textContent = text;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';

        // Auto-hide message after 5 seconds for success, 8 seconds for errors
        const hideTime = type === 'success' ? 5000 : 8000;
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, hideTime);
    }

    function highlightField(fieldId) {
        // Remove previous highlights
        document.querySelectorAll('.styled-input input, .styled-input textarea').forEach(field => {
            field.classList.remove('error-highlight');
        });
        
        // Add highlight to the specific field
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add('error-highlight');
            
            // Focus on the field
            field.focus();
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                field.classList.remove('error-highlight');
            }, 3000);
        }
    }

    // Optional: Display submission count (for admin purposes)
    function displaySubmissionCount() {
        const count = submissions.length;
        if (count > 0) {
            console.log(`Total contact form submissions: ${count}`);
        }
    }

    displaySubmissionCount();
    
    // Add real-time validation
    addRealTimeValidation();
});

function addRealTimeValidation() {
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    
    // Email validation on input
    emailField.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.classList.add('error-highlight');
        } else {
            this.classList.remove('error-highlight');
        }
    });
    
    // Phone validation on input (Indian format)
    phoneField.addEventListener('input', function() {
        const phone = this.value.replace(/[\s\-\(\)]/g, '');
        if (phone && !/^(\+91[\-\s]?)?[6789]\d{9}$/.test(phone)) {
            this.classList.add('error-highlight');
        } else {
            this.classList.remove('error-highlight');
        }
    });
    
    // Clear error highlighting when user starts typing
    emailField.addEventListener('focus', function() {
        this.classList.remove('error-highlight');
    });
    
    phoneField.addEventListener('focus', function() {
        this.classList.remove('error-highlight');
    });
}

// Function to export submissions (for admin purposes)
function exportSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
    if (submissions.length === 0) {
        alert('No submissions to export.');
        return;
    }

    const dataStr = JSON.stringify(submissions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `contact_submissions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Function to clear all submissions (for admin purposes)
function clearAllSubmissions() {
    if (confirm('Are you sure you want to clear all submissions? This action cannot be undone.')) {
        localStorage.removeItem('contactSubmissions');
        alert('All submissions have been cleared.');
        location.reload();
    }
} 