// script.js
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('.menu-toggle, .logo');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });

    // --- GSAP Hero Entrance Animation ---
    const tl = gsap.timeline();

    // Reveal the main title line by line
    tl.from(".hero-title .line", {
        y: 200,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
    })
    // Fade in the subtitle and navigation
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.6")
    .from(".site-nav", {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.8");

    // --- Organic Fluid Background ---
    const canvas = document.getElementById('fluid-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let time = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // The updated olive green brand colors
    const colors = [
        { r: 74, g: 93, b: 35 },   // Deep, grounded olive green
        { r: 138, g: 154, b: 91 },  // Muted sage/lighter olive
        { r: 181, g: 176, b: 139 }  // Warm, earthy khaki
    ];

    function drawFluid() {
        time += 0.005; // Speed of the fluid shift
        ctx.clearRect(0, 0, width, height);
        
        // Create soft, moving radial gradients
        colors.forEach((color, i) => {
            // Math.sin/cos creates the organic drifting motion
            const x = width / 2 + Math.sin(time + i) * (width / 3);
            const y = height / 2 + Math.cos(time + i * 2) * (height / 3);
            const radius = width * 0.6; // Large, soft blobs
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            ctx.globalCompositeOperation = 'screen'; // Blends the colors beautifully
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });
        
        requestAnimationFrame(drawFluid);
    }
    drawFluid();

    // --- Horizontal Scroll Section (ScrollTrigger) ---
    gsap.registerPlugin(ScrollTrigger);

    const pinContainer = document.querySelector(".pin-container");
    const panels = gsap.utils.toArray(".collab-panel");

    if (pinContainer && panels.length > 0) {
        gsap.to(panels, {
            xPercent: -100 * (panels.length - 1), // Slide panels to the left
            ease: "none", // Linear movement looks best for scrolling
            scrollTrigger: {
                trigger: ".collaborations-section",
                pin: true, // Locks the section in place vertically
                scrub: 1, // Smoothly ties the animation to the scrollbar
                end: () => "+=" + pinContainer.offsetWidth // Unpins when we've scrolled the full width
            }
        });
    }

    // Cursor interaction for horizontal section
    const collabSection = document.querySelector('.collaborations-section');
    if (collabSection) {
        collabSection.addEventListener('mouseenter', () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
        });
        collabSection.addEventListener('mouseleave', () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
        });
    }
});

// --- Ecosystem Counters Animation ---
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%", // Triggers when the number enters the bottom 20% of the screen
            onEnter: () => {
                // Animate from 0 to target value
                gsap.fromTo(counter, 
                    { innerText: 0 }, 
                    {
                        innerText: targetValue,
                        duration: 2,
                        ease: "power2.out",
                        snap: { innerText: 1 }, // Ensure whole numbers
                        onUpdate: function() {
                            counter.innerText = Math.ceil(this.targets()[0].innerText);
                        }
                    }
                );
            },
            once: true // Only animate once
        });
    });

    // --- Core Pillars Hover Logic ---
    const pillarRows = document.querySelectorAll('.pillar-row');
    const pillarBg = document.querySelector('.pillar-bg-reveal');
    const defaultBgColor = getComputedStyle(document.body).getPropertyValue('--bg-color');

    pillarRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            // Expand custom cursor
            cursor.classList.add('expand');
            
            // Set and reveal background image
            const bgImage = row.getAttribute('data-image');
            if(bgImage) {
                pillarBg.style.backgroundImage = bgImage;
                pillarBg.style.opacity = '0.3'; // Keep it subtle so text remains legible
            }
        });

        row.addEventListener('mouseleave', () => {
            // Shrink custom cursor
            cursor.classList.remove('expand');
            
            // Hide background image
            pillarBg.style.opacity = '0';
        });
    });

    // --- Maker Drawer Logic ---
    
    // 1. Define the content data (pulled from your PDF personas)
    const makersData = {
        jignesh: {
            name: "Jignesh Bhai",
            role: "Textile Artisan, Kutch",
            quote: `"This is my skill, but I want it to grow."`,
            bio: "Jignesh Bhai has practiced his craft for over 20 years. He has deep knowledge but limited exposure to design systems or urban markets. He is open to change, but wants his work to be respected, not altered blindly. He seeks fair and respectful collaboration opportunities and visibility beyond local markets."
        },
        pranav: {
            name: "Pranav Narayan",
            role: "Graphic Designer, Bengaluru",
            quote: `"Design needs context, not just style."`,
            bio: "Pranav works at a contemporary design studio and is constantly exploring ways to make his work feel more culturally rooted and original. He is tired of global aesthetics and wants deeper meaning in his practice. He looks to traditional craft as a source of depth, process, and authenticity."
        },
        Moopy: {
            name: "Moopy",
            role: "Architect, Bengaluru",
            quote: `"Everything I own should mean something."`,
            bio: "Kavya values well-designed spaces and objects. She buys less, but invests in pieces that have story, quality, and longevity. She sees craft as part of a refined lifestyle, not as décor, and values transparency in process and materials."
        }
    };

    const cards = document.querySelectorAll('.maker-card');
    const drawer = document.querySelector('.maker-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const closeBtn = document.querySelector('.close-drawer');

    // Drawer Elements to populate
    const dImg = document.getElementById('drawer-img');
    const dName = document.getElementById('drawer-name');
    const dRole = document.getElementById('drawer-role');
    const dMindset = document.getElementById('drawer-mindset');
    const dBio = document.getElementById('drawer-bio');

    // Open Drawer Event
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            const data = makersData[id];
            
            // Populate data
            dImg.src = card.querySelector('img').src;
            dName.innerText = data.name;
            dRole.innerText = data.role;
            dMindset.innerText = data.quote;
            dBio.innerText = data.bio;

            // Animate In
            overlay.classList.add('active');
            gsap.to(drawer, { x: "0%", duration: 0.6, ease: "power3.out" });
        });
        
        // Expand cursor on hover
        card.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        card.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });

    // Close Drawer Function
    const closeDrawer = () => {
        overlay.classList.remove('active');
        gsap.to(drawer, { x: "100%", duration: 0.5, ease: "power3.in" });
    };

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);