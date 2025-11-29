class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!-- Top Contact Bar -->
        <div class="top-bar">
            <div class="top-bar-container">
                <div class="top-bar-left">
                    <a href="mailto:support@jovial_water.co.in">
                        <i class="fas fa-envelope"></i> support@jovial_water.co.in
                    </a>
                </div>
                <div class="top-bar-right">
                    <a href="tel:+918851165175">
                        <i class="fas fa-phone"></i> +91 8851165175
                    </a>
                    <a href="tel:01144463328">
                        <i class="fas fa-phone-alt"></i> 011-44463328
                    </a>
                </div>
            </div>
        </div>

        <!-- Navigation Bar -->
        <nav class="navbar">
            <div class="nav-container container clearfix">
                <div class="logo-header">
                    <div class="logo-header-inner logo-header-one">
                        <a href="index.html" class="logo" style="text-decoration: none;">
                            <i class="fas fa-tint"></i>
                            <span>Jovial Water Engineering</span>
                        </a>
                    </div>
                </div>
                
                <!-- NAV Toggle Button -->
                <button id="mobile-side-drawer" data-target=".header-nav" data-toggle="collapse" type="button" class="navbar-toggler collapsed" onclick="toggleMobileMenu()">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar icon-bar-first"></span>
                    <span class="icon-bar icon-bar-two"></span>
                    <span class="icon-bar icon-bar-three"></span>
                </button>
                
                <!-- MAIN Nav -->
                <div class="nav-animation header-nav navbar-collapse collapse d-flex justify-content-center">
                    <ul class="nav navbar-nav nav-links">
                        <li><a href="index.html">Home</a></li>
                        <li class="has-child dropdown">
                            <a href="about.html">About Us</a>
                            <div class="fa fa-angle-right submenu-toogle"></div>
                            <ul class="sub-menu dropdown-menu">
                                <li><a href="about.html#overview">Company Overview</a></li>
                                <li><a href="about.html#mission">Our Mission</a></li>
                                <li><a href="about.html#vision">Our Vision</a></li>
                            </ul>
                        </li>
                        <li class="has-child dropdown">
                            <a href="products.html">Our Products</a>
                            <div class="fa fa-angle-right submenu-toogle"></div>
                            <ul class="sub-menu dropdown-menu" id="products-dropdown">
                                <!-- Loaded dynamically -->
                            </ul>
                        </li>
                        <li class="has-child dropdown">
                            <a href="services.html">Services</a>
                            <div class="fa fa-angle-right submenu-toogle"></div>
                            <ul class="sub-menu dropdown-menu">
                                <!-- Services submenu items can be added here -->
                            </ul>
                        </li>
                        <li><a href="industries.html">Industries We Serve</a></li>
                        <li><a href="career.html">Career</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

        // Highlight active link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = this.querySelectorAll('.navbar-nav a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Check if page has hero section and adjust navbar
        const hasHero = document.querySelector('.hero-section');
        if (!hasHero) {
            const navbar = this.querySelector('.navbar');
            if (navbar) {
                navbar.style.position = 'sticky';
                navbar.style.top = '0';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                
                // Update logo and links color
                const logo = this.querySelector('.logo');
                if (logo) logo.style.color = 'var(--primary-color)';
                
                const navLinks = this.querySelectorAll('.navbar-nav a');
                navLinks.forEach(link => {
                    link.style.color = 'var(--text-dark)';
                });

                // Update toggle button color
                const toggler = this.querySelector('.navbar-toggler');
                if (toggler) {
                    const iconBars = toggler.querySelectorAll('.icon-bar');
                    iconBars.forEach(bar => {
                        bar.style.backgroundColor = 'var(--primary-color)';
                    });
                }
            }
        }
    }
}

customElements.define('app-header', Header);
