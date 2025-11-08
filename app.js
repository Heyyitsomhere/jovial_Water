// Data loading and dynamic content generation

// Global variables
let companyData = null;

// Load JSON data
async function loadData() {
    try {
        const [productsData, testimonialsData, statsData, servicesData, newsData, companyDataResponse] = await Promise.all([
            fetch('data/products.json').then(r => r.json()),
            fetch('data/testimonials.json').then(r => r.json()),
            fetch('data/statistics.json').then(r => r.json()),
            fetch('data/services.json').then(r => r.json()),
            fetch('data/news.json').then(r => r.json()),
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
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load company information
function loadCompanyInfo(data) {
    companyData = data; // Store globally for WhatsApp function
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

// Store products data globally
let productsData = [];

// Load products
function loadProducts(products) {
    productsData = products; // Store for modal use
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" onclick="openProductModal(${product.id})" style="cursor: pointer;">
            <i class="fas ${product.icon}"></i>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-card-overlay">
                <span class="product-card-link">Click for Details <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    `).join('');
    
    // Load products into dropdown menu
    const productsDropdown = document.getElementById('products-dropdown');
    if (productsDropdown) {
        productsDropdown.innerHTML = products.map(product => `
            <li><a href="#products" onclick="openProductModal(${product.id}); return false;">${product.name}</a></li>
        `).join('');
    }
}

// Product Modal Functions
let currentProductId = null;

function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    currentProductId = productId;
    document.getElementById('product-modal-icon').className = `fas ${product.icon}`;
    document.getElementById('product-modal-title').textContent = product.name;
    document.getElementById('product-modal-description').textContent = product.detailedDescription || product.description;
    
    const modal = document.getElementById('product-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    currentProductId = null;
}

// Close product modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('product-modal');
    if (e.target === modal) {
        closeProductModal();
    }
});

// PDF Functions
function getProductPDFPath(productId) {
    // Map product IDs to PDF file names
    const pdfMap = {
        1: 'products/Sewage_treatment.pdf', // STP - Using actual PDF file
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
    
    // Get absolute URL - handle both file:// and http:// protocols
    let pdfUrl;
    if (window.location.protocol === 'file:') {
        // For file:// protocol, use relative path
        pdfUrl = pdfPath;
    } else {
        // For http:// or https://, create absolute URL
        pdfUrl = new URL(pdfPath, window.location.origin).href;
    }
    
    document.getElementById('pdf-modal-title').textContent = `${product.name} - Product Catalog`;
    
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfError = document.getElementById('pdf-error-message');
    const pdfLoading = document.getElementById('pdf-loading');
    
    // Show loading, hide error and viewer
    pdfLoading.style.display = 'flex';
    pdfError.style.display = 'none';
    pdfViewer.style.display = 'none';
    
    pdfModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close product modal when opening PDF viewer
    closeProductModal();
    
    // Console log for tracking
    console.log('=== PDF View ===');
    console.log('Product:', product.name);
    console.log('PDF Path:', pdfPath);
    console.log('PDF URL:', pdfUrl);
    console.log('Protocol:', window.location.protocol);
    console.log('Origin:', window.location.origin);
    console.log('================');
    
    // Try to load PDF
    loadPDFInViewer(pdfUrl, pdfViewer, pdfLoading, pdfError);
}

function loadPDFInViewer(pdfUrl, pdfViewer, pdfLoading, pdfError) {
    const pdfEmbed = document.getElementById('pdf-embed');
    const pdfObject = document.getElementById('pdf-object');
    
    // Hide all viewers initially
    pdfViewer.style.display = 'none';
    pdfEmbed.style.display = 'none';
    pdfObject.style.display = 'none';
    
    // Method 1: Try iframe (most compatible)
    pdfViewer.src = pdfUrl + '#toolbar=1&navpanes=1&scrollbar=1';
    pdfViewer.style.display = 'block';
    
    // Hide loading after a short delay (PDF should start loading)
    setTimeout(() => {
        pdfLoading.style.display = 'none';
        // Keep iframe visible - it should load the PDF
        console.log('PDF viewer initialized');
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
    console.log('Opening PDF in new tab:', pdfUrl);
}

function closePDFModal() {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfError = document.getElementById('pdf-error-message');
    const pdfLoading = document.getElementById('pdf-loading');
    
    pdfModal.classList.remove('show');
    pdfViewer.src = '';
    pdfViewer.style.display = 'none';
    pdfError.style.display = 'none';
    pdfLoading.style.display = 'block';
    document.body.style.overflow = '';
}

function downloadProductPDF() {
    if (!currentProductId) return;
    
    const product = productsData.find(p => p.id === currentProductId);
    const pdfPath = getProductPDFPath(currentProductId);
    const pdfName = getProductPDFName(currentProductId);
    
    // Use local PDF file path
    const pdfUrl = pdfPath;
    
    // Create a temporary link to download the PDF
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Console log for tracking
    console.log('=== PDF Download ===');
    console.log('Product:', product.name);
    console.log('PDF Name:', pdfName);
    console.log('PDF Path:', pdfPath);
    console.log('PDF URL:', pdfUrl);
    console.log('===================');
}

// Close PDF modal when clicking outside
document.addEventListener('click', (e) => {
    const pdfModal = document.getElementById('pdf-modal');
    if (e.target === pdfModal) {
        closePDFModal();
    }
});

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
        name: document.getElementById('popup-name').value.trim(),
        phone: document.getElementById('popup-phone').value.trim(),
        email: document.getElementById('popup-email').value.trim(),
        company: document.getElementById('popup-company').value.trim(),
        message: document.getElementById('popup-message').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Console print
    console.log('=== Form Submission ===');
    console.log('Form Type: Popup Form (Expert Call Back Request)');
    console.log('Submitted Data:', formData);
    console.log('Formatted Data:', JSON.stringify(formData, null, 2));
    console.log('======================');
    
    // Send WhatsApp message
    sendWhatsAppMessage(formData);
    
    // Show success message
    alert('Thank you for your request! Opening WhatsApp to send your message...');
    event.target.reset();
    closeModal();
}

// WhatsApp Message Function
function sendWhatsAppMessage(formData) {
    // Get WhatsApp number from company data (remove spaces and special characters)
    // Format: Country code + number (e.g., 918851165175 for +91 8851165175)
    let whatsappNumber = '918851165175'; // Default number from company data
    
    // Try to get from company data if loaded
    if (typeof companyData !== 'undefined' && companyData.contact && companyData.contact.whatsapp) {
        whatsappNumber = companyData.contact.whatsapp.replace(/\D/g, ''); // Remove non-digits
    }
    
    // Format the message
    const message = formatWhatsAppMessage(formData);
    
    // Create WhatsApp URL
    // Format: https://wa.me/PHONENUMBER?text=MESSAGE
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
    
    // Console log
    console.log('=== WhatsApp Message ===');
    console.log('Phone Number:', whatsappNumber);
    console.log('Message:', message);
    console.log('WhatsApp URL:', whatsappUrl);
    console.log('=======================');
}

// Format WhatsApp message
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
    
    message += `\n---\n`;
    message += `Submitted via Website Form`;
    message += `\nTime: ${new Date().toLocaleString()}`;
    
    return message;
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

