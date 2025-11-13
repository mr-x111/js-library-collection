class AutoSound {
    constructor() {
        this.sounds = {
            click: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/3.mp3',
            alert: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Coda.ogg',
            success: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Greetings.ogg',
            error: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/8.ogg'
        };
        
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.observeDOM();
        });
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.bindEvents.bind(this));
        } else {
            this.bindEvents();
        }
        
        this.initialized = true;
    }

    playSound(soundType) {
        try {
            const audio = new Audio(this.sounds[soundType]);
            audio.volume = 0.5;
            audio.play().catch(e => {
                console.log('تعذر تشغيل الصوت:', e);
            });
        } catch (error) {
            console.log('خطأ في تشغيل الصوت:', error);
        }
    }

    bindEvents() {
        // ربط الأزرار
        document.querySelectorAll('button').forEach(button => {
            this.bindElement(button);
        });

        // ربط الروابط
        document.querySelectorAll('a').forEach(link => {
            this.bindElement(link);
        });

        // ربط inputs
        document.querySelectorAll('input[type="button"], input[type="submit"]').forEach(input => {
            this.bindElement(input);
        });
    }

    bindElement(element) {
        if (element.hasAttribute('data-sound-bound')) return;
        
        element.setAttribute('data-sound-bound', 'true');
        
        const originalClick = element.onclick;
        element.onclick = (e) => {
            this.playSound('click');
            if (originalClick) originalClick.call(element, e);
        };

        element.addEventListener('click', (e) => {
            if (!element.onclick || element.onclick.toString().includes('native')) {
                this.playSound('click');
            }
        }, true);
    }

    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.matches && (node.matches('button') || node.matches('a') || 
                            node.matches('input[type="button"]') || node.matches('input[type="submit"]'))) {
                            this.bindElement(node);
                        }
                        
                        if (node.querySelectorAll) {
                            node.querySelectorAll('button, a, input[type="button"], input[type="submit"]').forEach(el => {
                                this.bindElement(el);
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// تشغيل المكتبة تلقائياً
if (typeof window !== 'undefined') {
    window.autoSound = new AutoSound();
}
