class CaptchaHandler {
    constructor(options = {}) {
        // Script'in kendi konumunu al
        const scriptInfo = this.getScriptInfo();
        
        this.options = {
            endpoint: options.endpoint || scriptInfo.endpoint,
            containerID: options.containerID || 'body'
        };
        
        this.injectStyles();
        this.createElements();
        this.initializeElements();
        this.initializeEventListeners();
    }

    getScriptInfo() {
        const scripts = document.getElementsByTagName('script');
        let scriptSrc = '';
        
        // Önce script'imizi bul
        for (let script of scripts) {
            if (script.src.includes('captcha.bundle.js')) {
                scriptSrc = script.src;
                break;
            }
        }

        if (!scriptSrc) {
            console.warn('Captcha script bulunamadı, varsayılan konum kullanılıyor.');
            return {
                endpoint: '/captcha.php'
            };
        }

        try {
            // URL nesnesini oluştur
            const url = new URL(scriptSrc);
            
            // Script'in tam yolunu al
            const scriptPath = url.pathname;
            
            // Script'in bulunduğu klasörü bul
            const lastSlashIndex = scriptPath.lastIndexOf('/');
            const scriptDir = scriptPath.substring(0, lastSlashIndex + 1);
            
            // Endpoint yolunu oluştur
            const endpoint = scriptDir + 'captcha.php';
            
            return {
                endpoint: endpoint
            };
        } catch (error) {
            console.warn('Script yolu ayrıştırılamadı, varsayılan konum kullanılıyor.');
            return {
                endpoint: '/captcha.php'
            };
        }
    }

    injectStyles() {
        const styles = `
            .captcha-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }
            .captcha-popup {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 25px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                position: relative;
                animation: popupIn 0.4s ease-out;
            }
            .captcha-watermark {
                position: absolute;
                bottom: 15px;
                right: 20px;
                font-size: 1.2em;
                color: rgba(52, 152, 219, 0.3);
                font-weight: bold;
                pointer-events: none;
                font-family: Arial, sans-serif;
                letter-spacing: 1px;
            }
            @keyframes popupIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .captcha-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }
            .captcha-header h3 {
                margin: 0;
                font-size: 1.2em;
                color: #2c3e50;
                font-weight: 600;
            }
            .captcha-controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            #captchaTimer {
                font-size: 1.3em;
                font-weight: bold;
                color: #3498db;
                background: #f8f9fa;
                padding: 5px 12px;
                border-radius: 15px;
                min-width: 40px;
                text-align: center;
            }
            .close-btn, .refresh-btn {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                padding: 8px;
                color: #7f8c8d;
                transition: all 0.2s ease;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .close-btn:hover, .refresh-btn:hover {
                background: #f0f0f0;
                color: #2c3e50;
                transform: scale(1.1);
            }
            .captcha-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 20px;
            }
            .captcha-image {
                position: relative;
                aspect-ratio: 1;
                cursor: pointer;
                border-radius: 10px;
                overflow: hidden;
                transition: all 0.2s ease;
            }
            .captcha-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            .captcha-image:hover img {
                transform: scale(1.1);
            }
            .captcha-image.selected::after {
                content: 'âœ“';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2em;
                color: white;
                text-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .captcha-image.selected::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(52, 152, 219, 0.5);
            }
            .captcha-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 30px;
                border-radius: 30px;
                color: white;
                font-weight: 500;
                z-index: 1001;
                animation: notificationIn 0.3s ease-out;
            }
            @keyframes notificationIn {
                from { opacity: 0; transform: translate(-50%, 20px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
            .notification-success { background: #2ecc71; }
            .notification-error { background: #e74c3c; }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createElements() {
        const template = `
            <div id="captchaOverlay" class="captcha-overlay">
                <div class="captcha-popup">
                    <div class="captcha-header">
                        <h3>LÃ¼tfen <span id="captchaCategory"></span> olan resimleri seÃ§in</h3>
                        <div class="captcha-controls">
                            <span id="captchaTimer">30</span>
                            <button id="refreshCaptcha" class="refresh-btn">â†»</button>
                            <button id="closeCaptcha" class="close-btn">Ã—</button>
                        </div>
                    </div>
                    <div id="captchaGrid" class="captcha-grid"></div>
                    <div class="captcha-watermark">CAPTCHA</div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container.firstElementChild);
    }

    initializeElements() {
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
            const response = await fetch(this.options.endpoint, {
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
            console.error('Captcha yenileme hatasÄ±:', error);
            this.showNotification('Captcha yÃ¼klenirken bir hata oluÅŸtu', false);
            if (this.resolvePromise) {
                this.resolvePromise({ success: false, error });
            }
        }
    }

    decode(data) {
        const reversed = data.split('').reverse().join('');
        const decoded = atob(reversed);
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
                        <text x="50" y="50" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em" fill="#666">
                            Resim yÃ¼klenemedi
                        </text>
                    </svg>
                `);
            };
            
            div.appendChild(img);
            
            div.addEventListener('click', () => {
                if (this.selectedImages.has(index)) {
                    this.selectedImages.delete(index);
                    div.classList.remove('selected');
                } else {
                    this.selectedImages.add(index);
                    div.classList.add('selected');
                }
                
                if (this.selectedImages.size === 3) {
                    this.verify();
                }
            });
            
            this.grid.appendChild(div);
        });
    }

    showNotification(message, success = true) {
        const notification = document.createElement('div');
        notification.className = `captcha-notification notification-${success ? 'success' : 'error'}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.clearTimer();
                this.refresh();
            }
        }, 1000);
    }

    updateTimer() {
        this.timerSpan.textContent = this.timeLeft;
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async verify() {
        const selectedIndexes = Array.from(this.selectedImages);
        const selectedImages = selectedIndexes.map(index => this.currentData.images[index]);
        
        if (selectedImages.every(img => img.isCorrect)) {
            this.showNotification('DoÄŸrulama baÅŸarÄ±lÄ±!', true);
            this.close();
            if (this.resolvePromise) {
                this.resolvePromise({ success: true });
            }
        } else {
            this.showNotification('YanlÄ±ÅŸ seÃ§im, tekrar deneyin', false);
            await this.refresh();
        }
    }

    // Öğe denetleme koruması
    protectFromDevTools() {
        const protectElement = (element) => {
            const originalOuterHTML = element.outerHTML;
            const originalInnerHTML = element.innerHTML;
            
            // Öğenin değiştirilmesini izle
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Eğer öğe silinmiş veya değiştirilmişse
                        if (element.outerHTML !== originalOuterHTML || element.innerHTML !== originalInnerHTML) {
                            location.reload(); // Sayfayı yenile
                        }
                    }
                });
            });

            observer.observe(element, {
                attributes: true,
                childList: true,
                subtree: true
            });
        };

        // Captcha ile ilgili tüm öğeleri koru
        const captchaElements = document.querySelectorAll('.captcha-overlay, .captcha-popup, script[src*="captcha.bundle.js"]');
        captchaElements.forEach(protectElement);
    }
}

// Global fonksiyonları dışa aktar
window.CaptchaHandler = CaptchaHandler;

// Sayfa yüklendiğinde koruma fonksiyonlarını çalıştır
document.addEventListener('DOMContentLoaded', function() {
    const captchaHandler = new CaptchaHandler();
    captchaHandler.protectFromDevTools();
});