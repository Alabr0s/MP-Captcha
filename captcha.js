class CaptchaHandler {
    constructor() {
        this.overlay = document.getElementById('captchaOverlay');
        this.grid = document.getElementById('captchaGrid');
        this.categorySpan = document.getElementById('captchaCategory');
        this.timerSpan = document.getElementById('captchaTimer');
        this.refreshBtn = document.getElementById('refreshCaptcha');
        this.closeBtn = document.getElementById('closeCaptcha');
        
        this.timer = null;
        this.timeLeft = 30;
        this.currentData = null;
        this.selectedImages = new Set();
        this.resolvePromise = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.refresh());
        this.closeBtn.addEventListener('click', () => {
            this.close();
            if (this.resolvePromise) {
                this.resolvePromise({ success: false });
            }
        });
    }

    async show() {
        this.overlay.style.display = 'flex';
        await this.refresh();
        
        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    }

    close() {
        this.overlay.style.display = 'none';
        this.clearTimer();
    }

    async refresh() {
        this.clearTimer();
        this.selectedImages.clear();
        
        try {
            // Mevcut script URL'ini al
            const scriptPath = document.currentScript ? document.currentScript.src : document.querySelector('script[src*="captcha.js"]').src;
            const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
            
            const response = await fetch(basePath + 'captcha.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=generate'
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const encodedData = await response.text();
            this.currentData = this.decode(encodedData);
            
            this.categorySpan.textContent = this.currentData.category;
            this.renderGrid();
            this.startTimer();
        } catch (error) {
            console.error('Captcha yenileme hatası:', error);
            this.showNotification('Captcha yüklenirken bir hata oluştu', false);
            if (this.resolvePromise) {
                this.resolvePromise({ success: false, error });
            }
        }
    }

    decode(data) {
        // Base64'ü düzelt ve çöz
        const reversed = data.split('').reverse().join('');
        const decoded = atob(reversed);
        
        // JSON olarak parse et
        return JSON.parse(decoded);
    }

    renderGrid() {
        this.grid.innerHTML = '';
        this.currentData.images.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = 'captcha-image';
            
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = `Captcha resmi ${index + 1}`;
            img.loading = 'eager';
            
            img.onerror = () => {
                img.src = 'data:image/svg+xml,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="#f0f0f0"/>
                        <text x="50" y="50" font-family="Arial" font-size="12" fill="#999" text-anchor="middle" dy=".3em">
                            Resim Yüklenemedi
                        </text>
                    </svg>
                `).trim();
            };
            
            div.appendChild(img);
            
            div.addEventListener('click', () => {
                if (div.classList.contains('selected')) {
                    div.classList.remove('selected');
                    this.selectedImages.delete(index);
                } else {
                    if (this.selectedImages.size < this.currentData.correct_count) {
                        div.classList.add('selected');
                        this.selectedImages.add(index);
                        
                        if (this.selectedImages.size === this.currentData.correct_count) {
                            this.verify();
                        }
                    }
                }
            });
            
            this.grid.appendChild(div);
        });
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.refresh();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        this.timerSpan.textContent = this.timeLeft;
    }

    verify() {
        const correctSelections = Array.from(this.selectedImages).every(index => 
            this.currentData.images[index].isCorrect
        );
        
        const allCorrectSelected = this.selectedImages.size === this.currentData.correct_count;
        
        if (correctSelections && allCorrectSelected) {
            this.showNotification('Doğrulama başarılı!', true);
            setTimeout(() => {
                this.close();
                if (this.resolvePromise) {
                    this.resolvePromise({ success: true });
                }
            }, 1000);
        } else {
            this.showNotification('Yanlış seçim, lütfen tekrar deneyin', false);
            setTimeout(() => this.refresh(), 1000);
        }
    }

    showNotification(message, success) {
        const notification = document.createElement('div');
        notification.className = `notification ${success ? 'success' : 'error'}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// CAPTCHA işleyicisini başlat
const captcha = new CaptchaHandler();

// Form için CAPTCHA kontrolü
function formCaptcha(form) {
    captcha.show().then(result => {
        if (result.success) {
            form.submit();
        }
    });
}

// Buton için CAPTCHA kontrolü
function buttonCaptcha(button, callback) {
    captcha.show().then(result => {
        if (result.success) {
            callback();
        }
    });
}

// Link için CAPTCHA kontrolü
function linkCaptcha(link, url) {
    captcha.show().then(result => {
        if (result.success) {
            window.location.href = url;
        }
    });
}
