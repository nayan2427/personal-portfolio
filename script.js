document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LOADER DISMISSAL WITH SMOOTH FADE
    // ==========================================
    const loader = document.getElementById("loader");
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }, 300);
    }

    // ==========================================
    // 2. TYPING EFFECT (Synced to Full-Stack Profile)
    // ==========================================
    const titles = ["Software Engineer", "Full-Stack Java Developer", "Django Framework Architect", "Founder & Tech Lead"];
    let titleIndex = 0;
    let charIndex = 0;
    const typingElement = document.getElementById("typing");

    function typeEffect() {
        if (!typingElement) return;
        if (charIndex < titles[titleIndex].length) {
            typingElement.textContent += titles[titleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 90); 
        } else {
            setTimeout(eraseEffect, 1800); 
        }
    }

    function eraseEffect() {
        if (!typingElement) return;
        if (typingElement.textContent.length > 0) {
            typingElement.textContent = typingElement.textContent.slice(0, -1);
            setTimeout(eraseEffect, 40); 
        } else {
            titleIndex = (titleIndex + 1) % titles.length;
            charIndex = 0;
            setTimeout(typeEffect, 400); 
        }
    }
    if(typingElement) typeEffect();

    // ==========================================
    // 3. PERSISTENT THEME TOGGLE (DARK / LIGHT)
    // ==========================================
    const themeBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme") || 
                       (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (themeBtn) {
        const icon = themeBtn.querySelector("i");
        if (icon) icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
        
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const targetTheme = currentTheme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", targetTheme);
            localStorage.setItem("portfolio-theme", targetTheme);
            if (icon) icon.className = targetTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
        });
    }

    // ==========================================
    // 4. MOBILE DRAWER NAVIGATION INTERACTION
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        navItems.forEach(item => {
            item.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    // ==========================================
    // 5. MEMORY-OPTIMIZED SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });
    reveals.forEach(section => revealObserver.observe(section));

    // ==========================================
    // 6. SCROLL INDICATOR & BACK TO TOP BUTTON
    // ==========================================
    const progressBar = document.getElementById("progress-bar");
    const topBtn = document.getElementById("topBtn");

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (progressBar && scrollHeight > 0) {
            progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        }
        if (topBtn) {
            topBtn.style.display = scrollTop > 500 ? "flex" : "none";
        }
    }, { passive: true });

    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================
    // 7. HIGH-PERFORMANCE FORM HANDLING & UX STATES
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const submitBtn = this.querySelector(".submit-btn");

            if (!name || !email || !message) {
                showFormStatus("Please fill out all fields before sending.", "error");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFormStatus("Please provide a valid email structure.", "error");
                return;
            }

            submitBtn.disabled = true;
            const origBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>`;

            setTimeout(() => {
                showFormStatus('<i class="fas fa-check-circle status-icon"></i><div>Message Sent Successfully!<br><span style="font-size:0.9rem; font-weight:400; opacity:0.8;">Thank you, I will get back to you shortly.</span></div>', "success");
                this.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnContent;
                }, 2000);
            }, 1500);
        });
    }

    function showFormStatus(htmlMessage, type) {
        if (!formStatus) return;
        formStatus.innerHTML = htmlMessage;
        formStatus.className = type === "success" ? "form-status-success" : "form-status-error";
        
        setTimeout(() => {
            formStatus.className = "form-status-hide";
            setTimeout(() => { formStatus.innerHTML = ""; }, 400);
        }, type === "success" ? 3500 : 2500);
    }

    // ==========================================
    // 8. VANILLA 3D TILT EFFECT FOR CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll(".glass");
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardX = e.clientX - cardRect.left;
            const cardY = e.clientY - cardRect.top;
            
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const tiltX = ((centerY - cardY) / centerY) * 12;
            const tiltY = ((cardX - centerX) / centerX) * 12;
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ==========================================
    // 9. HIGH-PERFORMANCE GLOBAL 3D MATRIX BACKGROUND
    // ==========================================
    (function initGlobal3DMatrix() {
        const canvas = document.querySelector('#webgl-matrix-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 300;

        const particleCount = 250;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 600;
            positions[i + 1] = (Math.random() - 0.5) * 600;
            positions[i + 2] = (Math.random() - 0.5) * 600;

            velocities.push({
                x: (Math.random() - 0.5) * 0.3,
                y: (Math.random() - 0.5) * 0.3,
                z: (Math.random() - 0.5) * 0.3
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x4f46e5, 
            size: 2.5,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        window.addEventListener('mousemove', (e) => {
            mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
            mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();
        
        function animateFrame() {
            requestAnimationFrame(animateFrame);

            const currentPositions = geometry.attributes.position.array;
            let velIndex = 0;
            for (let i = 0; i < particleCount * 3; i += 3) {
                currentPositions[i] += velocities[velIndex].x;
                currentPositions[i + 1] += velocities[velIndex].y;
                currentPositions[i + 2] += velocities[velIndex].z;

                if (Math.abs(currentPositions[i]) > 300) velocities[velIndex].x *= -1;
                if (Math.abs(currentPositions[i + 1]) > 300) velocities[velIndex].y *= -1;
                if (Math.abs(currentPositions[i + 2]) > 300) velocities[velIndex].z *= -1;

                velIndex++;
            }
            geometry.attributes.position.needsUpdate = true;

            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            particleSystem.rotation.y = mouse.x * 0.8 + clock.getElapsedTime() * 0.02;
            particleSystem.rotation.x = -mouse.y * 0.8 + window.pageYOffset * 0.0005; 

            renderer.render(scene, camera);
        }
        animateFrame();
    })();
});