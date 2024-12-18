class CaptchaHandler {
    constructor(options = {}) {
        // Script'in kendi konumunu al
        const scriptInfo = this.getScriptInfo();
        
        this.options = {
            endpoint: options.endpoint || scriptInfo.endpoint,
            containerID: options.containerID || 'body'
        };
        
        this.timers = new Map();
        this.currentCaptchaId = null;
        this.selectedImages = new Set();
        this.currentCategory = '';
        
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
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
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
            .captcha-image {
                position: relative;
                aspect-ratio: 1;
                cursor: pointer;
                border-radius: 10px;
                overflow: hidden;
                transition: all 0.2s ease;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .captcha-image::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(52, 152, 219, 0);
                transition: background-color 0.3s ease;
                pointer-events: none;
                z-index: 1;
            }
            .captcha-image.selected::after {
                background: rgba(52, 152, 219, 0.4);
            }
            .captcha-image.selected::before {
                content: '✓';
                position: absolute;
                top: 10px;
                right: 10px;
                color: white;
                font-size: 20px;
                z-index: 2;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            .captcha-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s ease;
                pointer-events: none;
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
                pointer-events: none;
            }
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 0.7;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            .captcha-image .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 2;
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
            .captcha-description {
                font-size: 1em;
                color: #666;
                margin-bottom: 10px;
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
                        <h3>Lütfen <span id="captchaCategory"></span> içeren resimleri seçin</h3>
                        <div class="captcha-controls">
                            <span id="captchaTimer">30</span>
                            <button id="refreshCaptcha" class="refresh-btn">⟳</button>
                            <button id="closeCaptcha" class="close-btn">🗙</button>
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
        this.overlay = document.createElement('div');
        this.overlay.className = 'captcha-overlay';
        this.overlay.innerHTML = `
            <div class="captcha-popup">
                <div class="captcha-header">
                    <div class="captcha-description">
                        Lütfen <span id="captchaCategory" style="font-weight: bold; color: #3498db;"></span> içeren resimleri seçin
                    </div>
                    <div class="captcha-controls">
                        <div id="captchaTimer">30</div>
                        <button class="refresh-btn">⟳</button>
                        <button class="close-btn">✕</button>
                    </div>
                </div>
                <div class="captcha-grid"></div>
                <div class="captcha-watermark">CAPTCHA</div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        
        this.popup = this.overlay.querySelector('.captcha-popup');
        this.grid = this.overlay.querySelector('.captcha-grid');
        this.timerDisplay = this.overlay.querySelector('#captchaTimer');
        this.categoryDisplay = this.overlay.querySelector('#captchaCategory');
        this.refreshBtn = this.overlay.querySelector('.refresh-btn');
        this.closeBtn = this.overlay.querySelector('.close-btn');
    }

    initializeEventListeners() {
        this.refreshBtn.addEventListener('click', () => this.refreshCaptcha());
        this.closeBtn.addEventListener('click', () => {
            this.close();
            if (this.resolvePromise) {
                this.resolvePromise({ success: false });
            }
        });
    }

    async show() {
        this.overlay.style.display = 'flex';
        await this.refreshCaptcha();
        
        return new Promise(resolve => {
            this.resolvePromise = resolve;
        });
    }

    close() {
        this.overlay.style.display = 'none';
        this.clearTimer();
    }

    decode(data) {
        try {
            // Ters çevrilmiş base64'ü düzelt
            const reversed = data.split('').reverse().join('');
            // Base64'ü çöz
            const decoded = atob(reversed);
            // JSON parse
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Decode error:', error);
            throw new Error('Invalid response format');
        }
    }

    async refreshCaptcha() {
        try {
            // Seçimleri sıfırla
            this.selectedImages.clear();
            this.grid.innerHTML = '';
            
            const response = await fetch(this.options.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'action=generate'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const rawText = await response.text();
            let cleanText = rawText.trim();
            cleanText = cleanText.replace(/[^A-Za-z0-9+/=]/g, '');
            
            try {
                const reversed = cleanText.split('').reverse().join('');
                const decoded = atob(reversed);
                const data = JSON.parse(decoded);

                if (!data || !data.images || !Array.isArray(data.images)) {
                    throw new Error('Invalid data structure');
                }

                this.currentCaptchaId = Date.now();
                
                // Kategoriyi göster
                this.currentCategory = data.category || '';
                if (this.categoryDisplay) {
                    this.categoryDisplay.textContent = this.currentCategory;
                }

                // Resimleri sakla
                this.currentImages = data.images;
                
                // Resimleri yükle
                data.images.forEach((image, index) => {
                    const imageUrl = image.url || image;
                    const isCorrect = image.isCorrect || false;
                    
                    const div = document.createElement('div');
                    div.className = 'captcha-image';
                    
                    const img = new Image();
                    img.loading = 'eager';
                    img.draggable = false;
                    img.oncontextmenu = () => false;
                    
                    // Resim koruma özellikleri
                    const protectImage = (element) => {
                        element.addEventListener('contextmenu', e => e.preventDefault());
                        element.addEventListener('dragstart', e => e.preventDefault());
                        element.addEventListener('drop', e => e.preventDefault());
                        element.addEventListener('copy', e => e.preventDefault());
                        element.addEventListener('cut', e => e.preventDefault());
                        element.addEventListener('paste', e => e.preventDefault());
                        element.addEventListener('mousedown', e => {
                            if (e.button === 2) e.preventDefault();
                        });
                        element.addEventListener('keydown', e => {
                            if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
                                e.preventDefault();
                            }
                        });
                    };

                    protectImage(div);
                    protectImage(img);
                    
                    img.onload = () => {
                        div.classList.add('loaded');
                    };
                    
                    img.onerror = () => {
                        console.error('Resim yüklenemedi:', imageUrl);
                        div.classList.add('error');
                        img.src = 'data:image/svg+xml,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                                <rect width="100" height="100" fill="#f0f0f0"/>
                                <text x="50" y="50" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em" fill="#666">
                                    Resim yüklenemedi
                                </text>
                            </svg>
                        `);
                    };
                    
                    img.src = imageUrl;
                    div.appendChild(img);
                    
                    // Tıklama efekti
                    const createRipple = (event) => {
                        const ripple = document.createElement('div');
                        const rect = div.getBoundingClientRect();
                        
                        ripple.className = 'ripple';
                        ripple.style.left = `${event.clientX - rect.left}px`;
                        ripple.style.top = `${event.clientY - rect.top}px`;
                        ripple.style.width = ripple.style.height = '40px';
                        ripple.style.marginLeft = ripple.style.marginTop = '-20px';
                        
                        div.appendChild(ripple);
                        
                        ripple.addEventListener('animationend', () => {
                            ripple.remove();
                        });
                    };

                    div.addEventListener('click', async (e) => {
                        e.preventDefault();
                        createRipple(e);
                        
                        const wasSelected = div.classList.contains('selected');
                        
                        if (!wasSelected) {
                            if (this.selectedImages.size >= 3) {
                                this.showNotification('En fazla 3 resim seçebilirsiniz', 'error');
                                return;
                            }
                            div.classList.add('selected');
                            this.selectedImages.add(index);
                        } else {
                            div.classList.remove('selected');
                            this.selectedImages.delete(index);
                        }

                        if (this.selectedImages.size === 3) {
                            await this.verify();
                        }
                    });
                    
                    this.grid.appendChild(div);
                });
                
                // Yeni zamanlayıcıyı başlat
                this.startTimer(this.currentCaptchaId);
                
            } catch (parseError) {
                console.error('Parse error:', parseError, 'Raw text:', rawText);
                throw new Error('Invalid response format');
            }
            
        } catch (error) {
            console.error('Captcha yenileme hatası:', error);
            this.showNotification('Captcha yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
        }
    }

    async verify() {
        const selectedElements = Array.from(this.grid.querySelectorAll('.captcha-image.selected'));
        const selectedIndexes = selectedElements.map(el => 
            Array.from(this.grid.children).indexOf(el)
        );

        if (selectedIndexes.length !== 3) {
            this.showNotification('Lütfen 3 resim seçin', 'error');
            return;
        }

        const allCorrect = selectedIndexes.every(index => 
            this.currentImages[index].isCorrect
        );

        if (allCorrect) {
            this.showNotification('Doğrulama başarılı!', 'success');
            setTimeout(() => {
                this.close();
                if (this.resolvePromise) {
                    this.resolvePromise({ success: true });
                }
            }, 1000);
        } else {
            this.showNotification('Yanlış seçim, tekrar deneyin', 'error');
            await this.refreshCaptcha();
        }
    }

    startTimer(captchaId) {
        // Önceki zamanlayıcıyı temizle
        if (this.timers.has(captchaId)) {
            clearInterval(this.timers.get(captchaId).interval);
        }

        const timerData = {
            timeLeft: 30,
            interval: setInterval(() => {
                if (this.currentCaptchaId !== captchaId) {
                    clearInterval(timerData.interval);
                    return;
                }

                timerData.timeLeft = Math.max(0, timerData.timeLeft - 1);
                
                if (this.timerDisplay) {
                    this.timerDisplay.textContent = timerData.timeLeft;
                }

                if (timerData.timeLeft === 0) {
                    clearInterval(timerData.interval);
                    this.refreshCaptcha();
                }
            }, 1000)
        };

        this.timers.set(captchaId, timerData);
        
        if (this.timerDisplay) {
            this.timerDisplay.textContent = timerData.timeLeft;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `captcha-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    clearTimer() {
        if (this.timers.has(this.currentCaptchaId)) {
            clearInterval(this.timers.get(this.currentCaptchaId).interval);
            this.timers.delete(this.currentCaptchaId);
        }
    }
}

// Global fonksiyonları dışa aktar
window.CaptchaHandler = CaptchaHandler;

// Sayfa yüklendiğinde koruma fonksiyonlarını çalıştır
document.addEventListener('DOMContentLoaded', function() {
    const captchaHandler = new CaptchaHandler();
    captchaHandler.protectFromDevTools();
});
