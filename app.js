class PitchDeck {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressFill = document.getElementById('progressFill');
        this.slideIndicators = document.getElementById('slideIndicators');
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.createIndicators();
        this.updateUI();
        this.attachEventListeners();
        this.animateCurrentSlide();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                this.nextSlide();
            }
        });

        // Add touch/swipe support
        this.addTouchSupport();
        
        // Animate charts when they come into view
        this.animateCharts();
    }

    createIndicators() {
        this.slideIndicators.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.slideIndicators.appendChild(indicator);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Add hover effects to cards
        this.addHoverEffects();
        
        // Add click effects to interactive elements
        this.addClickEffects();
    }

    addHoverEffects() {
        // Stat cards hover animation
        const statCards = document.querySelectorAll('.stat-card, .feature-card, .team-card, .market-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardEntry(card);
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'scale(1.1)';
                }
            });
            btn.addEventListener('mouseleave', () => {
                if (!btn.disabled) {
                    btn.style.transform = 'scale(1)';
                }
            });
        });
    }

    addClickEffects() {
        // Add ripple effect to clickable elements
        const clickables = document.querySelectorAll('.nav-btn, .indicator, .tier-card');
        clickables.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 107, 107, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 0) return;
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideIndex) {
        if (this.isAnimating || slideIndex === this.currentSlide || slideIndex < 0 || slideIndex >= this.totalSlides) return;
        
        this.isAnimating = true;
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Add active class to new slide
        this.currentSlide = slideIndex;
        this.slides[this.currentSlide].classList.add('active');
        
        this.updateUI();
        this.animateCurrentSlide();
        
        // Reset animation lock after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    updateUI() {
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    animateCurrentSlide() {
        const currentSlideElement = this.slides[this.currentSlide];
        const slideNumber = this.currentSlide + 1;
        
        // Trigger specific animations based on slide content
        switch (slideNumber) {
            case 1:
                this.animateTitleSlide(currentSlideElement);
                break;
            case 2:
                this.animateStatsSlide(currentSlideElement);
                break;
            case 4:
                this.animateMarketSlide(currentSlideElement);
                break;
            case 5:
                this.animateFeaturesSlide(currentSlideElement);
                break;
            case 8:
                this.animateChartsSlide(currentSlideElement);
                break;
            case 9:
                this.animateFundingSlide(currentSlideElement);
                break;
            default:
                this.animateGenericSlide(currentSlideElement);
        }
    }

    animateTitleSlide(slide) {
        const companyName = slide.querySelector('.company-name');
        const tagline = slide.querySelector('.tagline');
        const subtitle = slide.querySelector('.title-subtitle');
        
        setTimeout(() => {
            if (companyName) {
                companyName.style.animation = 'fadeInUp 1s ease-out';
            }
        }, 200);
        
        setTimeout(() => {
            if (tagline) {
                tagline.style.animation = 'fadeInUp 1s ease-out';
            }
        }, 600);
        
        setTimeout(() => {
            if (subtitle) {
                subtitle.style.animation = 'fadeInUp 1s ease-out';
            }
        }, 1000);
    }

    animateStatsSlide(slide) {
        const statCards = slide.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
                this.animateNumber(card.querySelector('.stat-number'));
            }, index * 200);
        });
    }

    animateMarketSlide(slide) {
        const marketCards = slide.querySelectorAll('.market-card');
        marketCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
                this.animateNumber(card.querySelector('.market-value'));
            }, index * 300);
        });
    }

    animateFeaturesSlide(slide) {
        const featureCards = slide.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 150);
        });
    }

    animateChartsSlide(slide) {
        const bars = slide.querySelectorAll('.bar-fill');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                const height = bar.style.height;
                bar.style.height = '0%';
                bar.style.transition = 'height 1s ease-out';
                setTimeout(() => {
                    bar.style.height = height;
                }, 100);
            }, index * 200);
        });
    }

    animateFundingSlide(slide) {
        const fundBars = slide.querySelectorAll('.fund-bar');
        fundBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                bar.style.transition = 'width 1s ease-out';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }, index * 300);
        });
        
        const fundingAmount = slide.querySelector('.funding-amount h3');
        if (fundingAmount) {
            this.animateNumber(fundingAmount);
        }
    }

    animateGenericSlide(slide) {
        const cards = slide.querySelectorAll('.card, .team-card, .roadmap-item, .tier-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
            }, index * 100);
        });
    }

    animateNumber(element) {
        if (!element) return;
        
        const text = element.textContent;
        const numbers = text.match(/[\d,]+/);
        if (!numbers) return;
        
        const finalNumber = parseInt(numbers[0].replace(/,/g, ''));
        let currentNumber = 0;
        const increment = finalNumber / 30;
        const duration = 1000;
        const stepTime = duration / 30;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            
            const formattedNumber = Math.floor(currentNumber).toLocaleString();
            element.textContent = text.replace(/[\d,]+/, formattedNumber);
        }, stepTime);
    }

    animateCardEntry(card) {
        if (card.style.animationName) return; // Already animated
        
        card.style.animation = 'cardPulse 0.3s ease-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 300);
    }

    animateCharts() {
        // Add chart animation styles
        if (!document.querySelector('#chart-animations')) {
            const style = document.createElement('style');
            style.id = 'chart-animations';
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes cardPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.5); }
                    50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8); }
                }
                
                .chart-bar:hover .bar-fill {
                    animation: glow 1s infinite;
                }
                
                .ai-icon {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1);
                        filter: brightness(1);
                    }
                    50% { 
                        transform: scale(1.05);
                        filter: brightness(1.2);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Method to handle auto-play (optional)
    startAutoPlay(interval = 5000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.goToSlide(0);
            }
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Method to add presentation mode
    enterPresentationMode() {
        document.documentElement.requestFullscreen?.();
        document.body.style.cursor = 'none';
        
        // Hide cursor after 3 seconds of inactivity
        let cursorTimeout;
        document.addEventListener('mousemove', () => {
            document.body.style.cursor = 'default';
            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => {
                document.body.style.cursor = 'none';
            }, 3000);
        });
    }

    exitPresentationMode() {
        document.exitFullscreen?.();
        document.body.style.cursor = 'default';
    }
}

// Initialize the pitch deck when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pitchDeck = new PitchDeck();
    
    // Add keyboard shortcuts for presentation mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11') {
            e.preventDefault();
            if (document.fullscreenElement) {
                pitchDeck.exitPresentationMode();
            } else {
                pitchDeck.enterPresentationMode();
            }
        }
        
        // ESC to exit presentation mode
        if (e.key === 'Escape' && document.fullscreenElement) {
            pitchDeck.exitPresentationMode();
        }
    });
    
    // Add scroll wheel navigation (optional)
    let scrollTimeout;
    document.addEventListener('wheel', (e) => {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
        }, 500);
        
        if (e.deltaY > 0) {
            pitchDeck.nextSlide();
        } else {
            pitchDeck.previousSlide();
        }
    });
    
    // Add context menu for additional options
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Could add a custom context menu here
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate any dynamic elements if needed
        pitchDeck.updateUI();
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    // Preload next slide for smoother transitions
    pitchDeck.slides.forEach((slide, index) => {
        if (index > 0) {
            slide.style.willChange = 'transform, opacity';
        }
    });
    
    // Add performance monitoring
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        });
    });
    observer.observe({ entryTypes: ['navigation'] });
    
    // Make pitchDeck globally accessible for debugging
    window.pitchDeck = pitchDeck;
});