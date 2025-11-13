class AutoSound {
    constructor() {
        this.sounds = {
            click: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/3.mp3',
            alert: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Coda.ogg',
            success: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/Greetings.ogg',
            error: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/8.ogg',
            notification: 'https://github.com/mr-x111/js-library-collection/raw/refs/heads/main/3.mp3'
        };
        
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;
        
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

    playSound(soundType) {
        try {
            if (this.sounds[soundType]) {
                const audio = new Audio(this.sounds[soundType]);
                audio.volume = 0.5;
                audio.play().catch(() => {});
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    showAlert(message, soundType = 'alert') {
        // تشغيل الصوت أولاً ثم فتح الـ Alert
        const soundPlayed = this.playSound(soundType);
        
        // استخدام setTimeout لتأخير الـ Alert قليلاً حتى يبدأ الصوت
        setTimeout(() => {
            alert(message);
        }, 100);
        
        return soundPlayed;
    }

    showSuccessAlert(message) {
        return this.showAlert(message, 'success');
    }

    showErrorAlert(message) {
        return this.showAlert(message, 'error');
    }

    showNotificationAlert(message) {
        return this.showAlert(message, 'notification');
    }

    bindEvents() {
        try {
            document.querySelectorAll('button').forEach(button => {
                this.bindElement(button);
            });

            document.querySelectorAll('a').forEach(link => {
                this.bindElement(link);
            });

            document.querySelectorAll('input[type="button"], input[type="submit"]').forEach(input => {
                this.bindElement(input);
            });
        } catch (error) {}
    }

    bindElement(element) {
        if (!element || element.hasAttribute('data-sound-bound')) return;
        
        try {
            element.setAttribute('data-sound-bound', 'true');
            
            element.addEventListener('click', () => {
                this.playSound('click');
            });
        } catch (error) {}
    }

    observeDOM() {
        try {
            const observer = new MutationObserver(() => {
                this.bindEvents();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {}
    }
}

if (typeof window !== 'undefined') {
    window.autoSound = new AutoSound();
}
