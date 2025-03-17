// Function to login and show success
function login() {
    const username = document.getElementById('username').value;
    const loginCode = document.getElementById('loginCode').value;

    // Validate login code
    if (username === '' || loginCode !== '123456') {
        Swal.fire('Error', 'Please enter valid details', 'error').then(() => {
            // Clear the password input field
            document.getElementById('loginCode').value = '';
        });
        return;
    }

    // Success Alert
    Swal.fire('Congratulations', 'Login successful!', 'success').then(() => {
        // Hide Hero Section
        document.getElementById('hero').style.display = 'none';

        // Show Navbar and Content
        document.getElementById('navbar').style.display = 'flex';
        document.getElementById('content').style.display = 'block';

        // Scroll to the top of the page
        window.scrollTo(0, 0); // This will scroll the page to the top
    });
}

// Function to logout and show only Hero Section & Footer
function logout() {
    // Hide Navbar and Content
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('content').style.display = 'none';

    // Show Hero Section
    document.getElementById('hero').style.display = 'flex';

    // Clear the password input field
    document.getElementById('loginCode').value = '';

    // Reload the page
    window.location.reload(); 
}

// Smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

window.onload = function () {
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('content').style.display = 'none';
};

// Function to toggle FAQ answers
function toggleFAQ(selected) {
    // Close any open FAQs except the one being clicked
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== selected.parentElement) {
            item.classList.remove('active');
            item.querySelector('.faq-answer-wrapper').style.maxHeight = "0px";
            item.querySelector('.toggle-icon').textContent = '+';
        }
    });

    // Toggle the clicked FAQ
    let faqItem = selected.parentElement;
    let answerWrapper = faqItem.querySelector('.faq-answer-wrapper');
    let icon = faqItem.querySelector('.toggle-icon');

    if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
        answerWrapper.style.maxHeight = "0px";
        icon.textContent = '+';
    } else {
        faqItem.classList.add('active');
        answerWrapper.style.maxHeight = answerWrapper.scrollHeight + "px"; // FIX: Ensures full height expansion
        icon.textContent = '-';
    }
}






