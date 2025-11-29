// Data loading and dynamic content generation

// Global variables
let companyData = null;

// Load JSON data
async function loadData() {
    try {
        const [productsData, testimonialsData, statsData, servicesData, newsData, industriesData, companyDataResponse] = await Promise.all([
            fetch('data/products.json').then(r => r.json()),
            fetch('data/testimonials.json').then(r => r.json()),
            fetch('data/statistics.json').then(r => r.json()),
            fetch('data/services.json').then(r => r.json()),
            fetch('data/news.json').then(r => r.json()),
            fetch('data/industries.json').then(r => r.json()),
            fetch('data/company.json').then(r => r.json())
        ]);

        // Load company information
        loadCompanyInfo(companyDataResponse);

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

        // Load industries
        loadIndustries(industriesData);

        // Initialize animations
        initAnimations();

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Helper to safely set text content
function safelySetText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Load company information
function loadCompanyInfo(data) {
    companyData = data; // Store globally for WhatsApp function
    safelySetText('founded-year', data.founded);
    safelySetText('vision-text', data.vision);
    safelySetText('mission-text', data.mission);
    safelySetText('company-overview', data.overview);
    safelySetText('address-delhi', data.contact.addressDelhi);
    safelySetText('address-mumbai', data.contact.addressMumbai);
    safelySetText('phone-number', data.contact.phone);
    safelySetText('phone-secondary', data.contact.phoneSecondary);
    safelySetText('email-address', data.contact.email);

    setTimeout(() => {
        safelySetText('footer-tagline', data.tagline);
        safelySetText('footer-phone', data.contact.phone);
        safelySetText('footer-email', data.contact.email);
    }, 100);
}

// Store products data globally
let productsData = [];

// Load products
function loadProducts(products) {
    productsData = products; // Store for modal use
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        // Check if we are on the home page (limit to 4 products) or products page (show all)
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');

        let productsToShow = products;
        if (isHomePage) {
            productsToShow = products.slice(0, 4);
        }

        productsGrid.innerHTML = productsToShow.map((product) => `
            <div class="product-card">
                <div class="product-icon-wrapper">
                    <i class="fas ${product.icon}"></i>
                </div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p>${product.description.substring(0, 100)}...</p>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-outline" onclick="openProductModal(${product.id})">Read More</button>
                        <button class="btn btn-sm btn-primary" onclick="showModal()">Free Quotation</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load products into dropdown menu - wait for header to render
    setTimeout(() => {
        const productsDropdown = document.getElementById('products-dropdown');
        if (productsDropdown) {
            productsDropdown.innerHTML = products.map(product => `
                <li><a href="products.html">${product.name}</a></li>
            `).join('');
        }
    }, 100);
}

// Product Modal Functions
let currentProductId = null;

function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    const modalIcon = document.getElementById('product-modal-icon');
    const modalTitle = document.getElementById('product-modal-title');
    const modalDesc = document.getElementById('product-modal-description');

    if (modalIcon) modalIcon.className = `fas ${product.icon}`;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalDesc) modalDesc.textContent = product.detailedDescription || product.description;

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    currentProductId = null;
}

// Close product modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (modal && e.target === modal) {
        closeProductModal();
    }
});

// PDF Functions
function getProductPDFPath(productId) {
    const pdfMap = {
        1: 'products/Sewage_treatment.pdf',
        2: 'products/Sewage_treatment.pdf',
        3: 'products/Sewage_treatment.pdf',
        4: 'products/Sewage_treatment.pdf',
        5: 'products/Sewage_treatment.pdf',
        6: 'products/Sewage_treatment.pdf',
        7: 'products/Sewage_treatment.pdf',
        8: 'products/Sewage_treatment.pdf'
    };
    return pdfMap[productId] || 'products/Sewage_treatment.pdf';
}

function getProductPDFName(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return 'Product-Catalog.pdf';
    return `${product.shortName || product.name.replace(/\s+/g, '-')}-Catalog.pdf`;
}

function viewProductPDF() {
    if (!currentProductId) return;

    const product = productsData.find(p => p.id === currentProductId);
    const pdfPath = getProductPDFPath(currentProductId);

    let pdfUrl;
    if (window.location.protocol === 'file:') {
        pdfUrl = pdfPath;
    } else {
        pdfUrl = new URL(pdfPath, window.location.origin).href;
    }

    const modalTitle = document.getElementById('pdf-modal-title');
    if (modalTitle) modalTitle.textContent = `${product.name} - Product Catalog`;

    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfError = document.getElementById('pdf-error-message');
    const pdfLoading = document.getElementById('pdf-loading');

    if (!pdfModal) return;

    if (pdfLoading) pdfLoading.style.display = 'flex';
    if (pdfError) pdfError.style.display = 'none';
    if (pdfViewer) pdfViewer.style.display = 'none';

    pdfModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    closeProductModal();

    if (pdfViewer) loadPDFInViewer(pdfUrl, pdfViewer, pdfLoading, pdfError);
}

function loadPDFInViewer(pdfUrl, pdfViewer, pdfLoading, pdfError) {
    pdfViewer.style.display = 'none';
    pdfViewer.src = pdfUrl + '#toolbar=1&navpanes=1&scrollbar=1';
    pdfViewer.style.display = 'block';

    setTimeout(() => {
        if (pdfLoading) pdfLoading.style.display = 'none';
    }, 500);
}

function openPDFInNewTab() {
    if (!currentProductId) return;
    const pdfPath = getProductPDFPath(currentProductId);
    let pdfUrl;
    if (window.location.protocol === 'file:') {
        pdfUrl = pdfPath;
    } else {
        pdfUrl = new URL(pdfPath, window.location.origin).href;
    }
    window.open(pdfUrl, '_blank');
}

function closePDFModal() {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfError = document.getElementById('pdf-error-message');
    const pdfLoading = document.getElementById('pdf-loading');

    if (pdfModal) pdfModal.classList.remove('show');
    if (pdfViewer) {
        pdfViewer.src = '';
        pdfViewer.style.display = 'none';
    }
    if (pdfError) pdfError.style.display = 'none';
    if (pdfLoading) pdfLoading.style.display = 'block';
    document.body.style.overflow = '';
}

function downloadProductPDF() {
    if (!currentProductId) return;
    const pdfPath = getProductPDFPath(currentProductId);
    const pdfName = getProductPDFName(currentProductId);

    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = pdfName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('click', (e) => {
    const pdfModal = document.getElementById('pdf-modal');
    if (pdfModal && e.target === pdfModal) {
        closePDFModal();
    }
});

// Load testimonials
function loadTestimonials(testimonials) {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (testimonialsGrid) {
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
}

// Load statistics with animation
function loadStatistics(stats) {
    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-item">
                <div class="stat-number" data-target="${stats.totalProjects}">0</div>
                <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" data-target="${stats.stpProjects}">0</div>
                <div class="stat-label">STP Installations</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" data-target="${stats.etpProjects}">0</div>
                <div class="stat-label">ETP Installations</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" data-target="${stats.roProjects}">0</div>
                <div class="stat-label">RO Plants</div>
            </div>
        `;

        // Trigger animation if already in view or wait for scroll
        observeStatistics();
    }
}

function observeStatistics() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    updateCounter();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// Load services
function loadServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid) {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card">
                <i class="fas ${service.icon}"></i>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
            </div>
        `).join('');
    }
}

// Load news
function loadNews(news) {
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
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
}

// Load Industries
function loadIndustries(industries) {
    const slider = document.getElementById('industries-slider');
    if (slider) {
        slider.innerHTML = industries.map(industry => `
            <div class="industry-card">
                <div class="industry-icon">
                    <i class="fas ${industry.icon}"></i>
                </div>
                <h3>${industry.name}</h3>
                <p>${industry.description}</p>
            </div>
        `).join('');
    }
}

// Industries Slider Logic
function scrollIndustries(direction) {
    const slider = document.getElementById('industries-slider');
    if (slider) {
        const scrollAmount = 300; // Width of card + gap
        slider.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const headerNav = document.querySelector('.header-nav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (headerNav) {
        headerNav.classList.toggle('show');
        if (navbarToggler) {
            navbarToggler.classList.toggle('collapsed');
        }
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.navbar-nav a').forEach(link => {
            link.addEventListener('click', () => {
                const headerNav = document.querySelector('.header-nav');
                const navbarToggler = document.querySelector('.navbar-toggler');
                if (headerNav) {
                    headerNav.classList.remove('show');
                }
                if (navbarToggler) {
                    navbarToggler.classList.add('collapsed');
                }
            });
        });

        // Handle dropdown toggles on mobile
        document.querySelectorAll('.has-child > a').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });
    }, 500);
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Popup Modal Functions
let modalShown = false;

function showModal() {
    if (modalShown) return;
    modalShown = true;
    const modal = document.getElementById('popup-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('popup-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('popup-modal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Popup form handler
function handlePopupSubmit(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('popup-name').value.trim(),
        phone: document.getElementById('popup-phone').value.trim(),
        email: document.getElementById('popup-email').value.trim(),
        company: document.getElementById('popup-company').value.trim(),
        message: document.getElementById('popup-message').value.trim(),
        timestamp: new Date().toISOString()
    };
    sendWhatsAppMessage(formData);
    alert('Thank you for your request! Opening WhatsApp to send your message...');
    event.target.reset();
    closeModal();
}

// WhatsApp Message Function
function sendWhatsAppMessage(formData) {
    let whatsappNumber = '918851165175';
    if (typeof companyData !== 'undefined' && companyData && companyData.contact && companyData.contact.whatsapp) {
        whatsappNumber = companyData.contact.whatsapp.replace(/\D/g, '');
    }
    const message = formatWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function formatWhatsAppMessage(formData) {
    let message = `Hello Jovial Water Engineering!\n\n`;
    message += `I would like to request an expert call back.\n\n`;
    message += `*Contact Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📱 Phone: ${formData.phone}\n`;
    message += `📧 Email: ${formData.email}\n`;
    if (formData.company) {
        message += `🏢 Company: ${formData.company}\n`;
    }
    if (formData.message) {
        message += `\n*Requirement/Message:*\n${formData.message}\n`;
    }
    return message;
}

// Hero Slider Logic
let currentSlide = 0;
let slides = [];
let dots = [];
let slideInterval;

function initHeroSlider() {
    slides = document.querySelectorAll('.hero-slide');
    dots = document.querySelectorAll('.hero-dot');

    if (slides.length === 0) return;

    startSlideInterval();
}

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function changeHeroSlide(direction) {
    clearInterval(slideInterval);
    showSlide(currentSlide + direction);
    startSlideInterval();
}

function goToSlide(index) {
    clearInterval(slideInterval);
    showSlide(index);
    startSlideInterval();
}

function startSlideInterval() {
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initHeroSlider();

    // Auto-show popup after 10 seconds (only once)
    // Auto-show popup after 10 seconds (only once) and ONLY on Home Page
    // Auto-show popup after 3 seconds (only once) and ONLY on Home Page
    setTimeout(() => {
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
        if (isHomePage) {
            showModal();
            // sessionStorage.setItem('popupShown', 'true'); // Commented out for verification
        }
    }, 3000);
});

function initAnimations() {
    // Add any other initialization logic here
}
