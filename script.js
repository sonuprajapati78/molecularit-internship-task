document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize AOS ---
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // --- Sticky Header & Scroll Effects ---
    const header = document.querySelector('.header');
    const scrollBar = document.getElementById('scrollBar');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Sticky Header
        if (scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = 'none';
            header.style.height = '80px';
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + "%";

        // Back to Top Visibility
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        // Active Navigation Highlighting
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']')?.classList.remove('active');
            }
        });
    });

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + (target === 10000 ? '+' : '');
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for Statistics
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Simple animation for hamburger manually if needed, or use CSS class
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // --- Countdown Timer (24 Hour Recurring) ---
    function startCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0); // Next midnight

        const diff = tomorrow - now;

        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update Hero Timer (Check if elements exist)
        const hHours = document.getElementById('h-hours');
        if (hHours) {
            hHours.innerText = hours.toString().padStart(2, '0');
            document.getElementById('h-minutes').innerText = minutes.toString().padStart(2, '0');
            document.getElementById('h-seconds').innerText = seconds.toString().padStart(2, '0');
        }
    }

    setInterval(startCountdown, 1000);
    startCountdown(); // Init immediately

    // --- File Upload Preview ---
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileUpload');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');
    const uploadSubmit = document.getElementById('uploadSubmit');

    // Click to upload
    dropArea.addEventListener('click', () => fileInput.click());

    // Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('dragover', () => {
        dropArea.style.backgroundColor = 'rgba(8, 119, 217, 0.15)';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = 'rgba(8, 119, 217, 0.05)';
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            fileName.innerText = file.name;
            dropArea.classList.add('hidden');
            filePreview.classList.remove('hidden');
            filePreview.style.display = 'flex'; // Ensure flex display
            uploadSubmit.disabled = false;
        }
    }

    removeFileBtn.addEventListener('click', () => {
        fileInput.value = '';
        dropArea.classList.remove('hidden');
        filePreview.classList.add('hidden');
        filePreview.style.display = 'none';
        uploadSubmit.disabled = true;
    });

    // Mock Upload Submission
    uploadSubmit.addEventListener('click', () => {
        const originalText = uploadSubmit.innerText;
        uploadSubmit.innerText = 'Uploading...';
        uploadSubmit.disabled = true;

        setTimeout(() => {
            uploadSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Upload Successful!';
            uploadSubmit.style.backgroundColor = 'green';
            setTimeout(() => {
                uploadSubmit.innerText = originalText;
                uploadSubmit.style.backgroundColor = '';
                uploadSubmit.disabled = false;
                removeFileBtn.click(); // Reset
                alert("Prescription uploaded! We will call you shortly.");
            }, 2000);
        }, 1500);
    });

    // --- Lead Form Validation & Submit ---
    const leadForm = document.getElementById('leadForm');
    const formMessage = document.getElementById('formMessage');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = leadForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Booking...';
        btn.disabled = true;

        // Mock Submission
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Booked Successfully';
            btn.style.backgroundColor = 'green';
            formMessage.innerText = 'Thank you! Your appointment is confirmed. Check your email.';
            formMessage.className = 'form-message success-msg';

            leadForm.reset();

            // Reset UI
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
                formMessage.innerText = '';
                formMessage.className = 'form-message';
            }, 3000);
        }, 1500);
    });

    // --- Dashboard OTP Simulator ---
    const step1 = document.getElementById('login-step-1');
    const step2 = document.getElementById('login-step-2');
    const success = document.getElementById('login-success');
    const otpForm1 = document.getElementById('otp-form-step-1');
    const otpForm2 = document.getElementById('otp-form-step-2');
    const backBtn = document.getElementById('back-to-step-1');
    const displayPhone = document.getElementById('display-phone');
    const otpInputs = document.querySelectorAll('.otp-input');

    if (otpForm1) {
        otpForm1.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('login-phone').value;
            displayPhone.innerText = phone;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            // Auto focus first OTP input
            if (otpInputs[0]) otpInputs[0].focus();
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }

    if (otpForm2) {
        otpForm2.addEventListener('submit', (e) => {
            e.preventDefault();
            step2.classList.add('hidden');
            success.classList.remove('hidden');
        });
    }

    // OTP Input auto-tab logic
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    }

});

