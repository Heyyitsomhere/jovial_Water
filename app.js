// Data loading and dynamic content generation

// Load JSON data
async function loadData() {
    try {
        const [productsData, testimonialsData, statsData, servicesData, newsData, companyData] = await Promise.all([
            fetch('data/products.json').then(r => r.json()),
            fetch('data/testimonials.json').then(r => r.json()),
            fetch('data/statistics.json').then(r => r.json()),
            fetch('data/services.json').then(r => r.json()),
            fetch('data/news.json').then(r => r.json()),
            fetch('data/company.json').then(r => r.json())
        ]);

        // Load company information
        loadCompanyInfo(companyData);
        
        // Load products
        loadProducts(productsData);
        
        // Load testimonials
        loadTestimonials(testimonialsData);
        
        // Load statistics
        loadStatistics(statsData);
        
        // Load services
        loadServices(servicesData);
        
        // Load news
        loadNews(newsData);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load company information
function loadCompanyInfo(data) {
    document.getElementById('founded-year').textContent = data.founded;
    document.getElementById('vision-text').textContent = data.vision;
    document.getElementById('mission-text').textContent = data.mission;
    document.getElementById('company-overview').textContent = data.overview;
    document.getElementById('address-delhi').textContent = data.contact.addressDelhi;
    document.getElementById('address-mumbai').textContent = data.contact.addressMumbai;
    document.getElementById('phone-number').textContent = data.contact.phone;
    document.getElementById('phone-secondary').textContent = data.contact.phoneSecondary;
    document.getElementById('email-address').textContent = data.contact.email;
    document.getElementById('footer-tagline').textContent = data.tagline;
    document.getElementById('footer-phone').textContent = data.contact.phone;
    document.getElementById('footer-email').textContent = data.contact.email;
}

// Load products
function loadProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <i class="fas ${product.icon}"></i>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
        </div>
    `).join('');
    
    // Load products into dropdown menu
    const productsDropdown = document.getElementById('products-dropdown');
    if (productsDropdown) {
        productsDropdown.innerHTML = products.map(product => `
            <li><a href="#products">${product.name}</a></li>
        `).join('');
    }
}

// Load testimonials
function loadTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    testimonialsGrid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <div class="testimonial-rating">
                ${'★'.repeat(testimonial.rating)}
            </div>
            <p class="testimonial-text">${testimonial.comment}</p>
            <div class="testimonial-author">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.position}, ${testimonial.company}</p>
            </div>
        </div>
    `).join('');
}

// Load statistics
function loadStatistics(stats) {
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${stats.totalProjects}+</div>
            <div class="stat-label">Projects</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.stpProjects}</div>
            <div class="stat-label">STP</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.etpProjects}</div>
            <div class="stat-label">ETP</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.roProjects}</div>
            <div class="stat-label">R.O</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.otherProjects}</div>
            <div class="stat-label">Others</div>
        </div>
    `;
}

// Load services
function loadServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <i class="fas ${service.icon}"></i>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

// Load news
function loadNews(news) {
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = news.map(item => `
        <div class="news-card">
            <div class="news-image">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="news-content">
                <div class="news-category">${item.category}</div>
                <h3>${item.title}</h3>
                <p>${item.excerpt}</p>
                <div class="news-date">
                    <i class="fas fa-calendar"></i> ${new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    `).join('');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
});


// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for sticky navbar
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Popup Modal Functions
let modalShown = false;
let scrollTimeout;

function showModal() {
    if (modalShown) return;
    modalShown = true;
    const modal = document.getElementById('popup-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const modal = document.getElementById('popup-modal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('popup-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Popup form handler
function handlePopupSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('popup-name').value,
        phone: document.getElementById('popup-phone').value,
        email: document.getElementById('popup-email').value,
        company: document.getElementById('popup-company').value,
        message: document.getElementById('popup-message').value,
        timestamp: new Date().toISOString()
    };
    
    // Console print
    console.log('=== Form Submission ===');
    console.log('Form Type: Popup Form (Expert Call Back Request)');
    console.log('Submitted Data:', formData);
    console.log('Formatted Data:', JSON.stringify(formData, null, 2));
    console.log('======================');
    
    alert('Thank you for your request! Our expert will call you back soon.');
    event.target.reset();
    closeModal();
}

// Show modal after delay (5 seconds)
let timeDelayShown = false;
setTimeout(() => {
    if (!modalShown) {
        showModal();
        timeDelayShown = true;
    }
}, 5000);

// Show modal when user scrolls down (after 30% of page)
function checkScrollPosition() {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercentage >= 30 && !modalShown) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!modalShown) {
                showModal();
            }
        }, 1000); // Show 1 second after reaching 30% scroll
    }
}

// Throttle scroll event
let scrollTimer;
window.addEventListener('scroll', () => {
    if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
            checkScrollPosition();
            scrollTimer = null;
        }, 100);
    }
});

// Hero Slider Functions
let currentSlide = 0;
const totalSlides = 3;

function changeHeroSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Auto-rotate hero slides every 5 seconds
let heroInterval;

function startHeroAutoSlide() {
    heroInterval = setInterval(() => {
        changeHeroSlide(1);
    }, 5000);
}

// Stop auto-slide on user interaction
function stopHeroAutoSlide() {
    clearInterval(heroInterval);
}

// Initialize hero slider
document.addEventListener('DOMContentLoaded', () => {
    const heroArrows = document.querySelectorAll('.hero-arrow');
    const heroDots = document.querySelectorAll('.hero-dot');
    
    heroArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            stopHeroAutoSlide();
            startHeroAutoSlide();
        });
    });
    
    heroDots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopHeroAutoSlide();
            startHeroAutoSlide();
        });
    });
    
    // Start auto-slide
    startHeroAutoSlide();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Prevent modal from showing immediately on page load
    // It will show after delay or scroll
});

