class AutoSound {
    constructor() {
        this.sounds = {
            click: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/3.mp3',
            alert: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Coda.ogg',
            success: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Greetings.ogg',
            error: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/8.ogg',
            notification: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/3.mp3'
        };
        
        this.originalAlert = null;
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
        this.overrideAlert();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.observeDOM();
            });
        } else {
            this.bindEvents();
            this.observeDOM();
        }
        
        this.initialized = true;
    }

    overrideAlert() {
        if (typeof window.alert === 'function') {
            this.originalAlert = window.alert;
            window.alert = (message) => {
                this.playSound('alert');
                if (this.originalAlert) {
                    this.originalAlert(message);
                }
            };
        }
    }

    playSound(soundType) {
        try {
            if (this.sounds[soundType]) {
                const audio = new Audio(this.sounds[soundType]);
                audio.volume = 0.5;
                audio.play().catch(e => {
                    console.log('تعذر تشغيل الصوت:', e);
                });
            }
        } catch (error) {
            console.log('خطأ في تشغيل الصوت:', error);
        }
    }

    showAlert(message, soundType = 'alert') {
        this.playSound(soundType);
        if (this.originalAlert) {
            this.originalAlert(message);
        } else {
            alert(message);
        }
    }

    showSuccessAlert(message) {
        this.showAlert(message, 'success');
    }

    showErrorAlert(message) {
        this.showAlert(message, 'error');
    }

    showNotificationAlert(message) {
        this.showAlert(message, 'notification');
    }

    bindEvents() {
        try {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                this.bindElement(button);
            });

            const links = document.querySelectorAll('a');
            links.forEach(link => {
                this.bindElement(link);
            });

            const inputs = document.querySelectorAll('input[type="button"], input[type="submit"]');
            inputs.forEach(input => {
                this.bindElement(input);
            });
        } catch (error) {
            console.log('خطأ في ربط الأحداث:', error);
        }
    }

    bindElement(element) {
        if (!element || element.hasAttribute('data-sound-bound')) return;
        
        try {
            element.setAttribute('data-sound-bound', 'true');
            
            const originalClick = element.onclick;
            element.onclick = (e) => {
                this.playSound('click');
                if (originalClick && typeof originalClick === 'function') {
                    return originalClick.call(element, e);
                }
            };

            element.addEventListener('click', (e) => {
                if (!element.onclick) {
                    this.playSound('click');
                }
            });
        } catch (error) {
            console.log('خطأ في ربط العنصر:', error);
        }
    }

    observeDOM() {
        try {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches) {
                                if (node.matches('button') || node.matches('a') || 
                                    node.matches('input[type="button"]') || node.matches('input[type="submit"]')) {
                                    this.bindElement(node);
                                }
                            }
                            
                            if (node.querySelectorAll) {
                                const elements = node.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
                                elements.forEach(el => {
                                    this.bindElement(el);
                                });
                            }
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.log('خطأ في مراقبة DOM:', error);
        }
    }
}

if (typeof window !== 'undefined') {
    window.autoSound = new AutoSound();
}
