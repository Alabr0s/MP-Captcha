<?php
class Captcha {
    private $categories;
    private $imagesPath;
    private $baseUrl;
    private $totalImages = 9; // Toplam resim sayısı
    private $correctImages = 3; // Doğru resim sayısı
    private $categoryTranslations = [
        'araba' => 'car',
        'bisiklet' => 'bicycle',
        'merdiven' => 'stairs'
    ];

    public function __construct() {
        // Dinamik olarak base URL'i al
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'];
        $scriptPath = dirname($_SERVER['SCRIPT_NAME']);
        $this->baseUrl = $protocol . $host . $scriptPath;
        
        $this->imagesPath = __DIR__ . '/images';
        $this->categories = $this->scanImageCategories();
    }

    private function scanImageCategories() {
        $categories = [];
        if (is_dir($this->imagesPath)) {
            $dirs = array_filter(glob($this->imagesPath . '/*'), 'is_dir');
            foreach ($dirs as $dir) {
                $categoryName = basename($dir);
                $files = scandir($dir);
                $images = [];
                
                // Remove . and ..
                $files = array_diff($files, array('.', '..'));
                
                if (!empty($files)) {
                    foreach ($files as $index => $file) {
                        // Tam URL oluştur
                        $images[] = $this->baseUrl . '/images/' . $categoryName . '/' . $file;
                    }
                    $categories[$categoryName] = $images;
                }
            }
        }
        return $categories;
    }

    private function encode($data) {
        // Veriyi JSON'a çevir ve base64 ile kodla
        $json = json_encode($data);
        $encoded = base64_encode($json);
        
        // Base64'ü ters çevir
        return strrev($encoded);
    }

    public function generateCaptcha() {
        if (empty($this->categories)) {
            throw new Exception('Resim kategorileri bulunamadı');
        }

        // Doğru kategoriden 3 resim seçimi
        $category = array_rand($this->categories);
        $availableImages = $this->categories[$category];
        
        if (count($availableImages) < $this->correctImages) {
            throw new Exception('Kategoride yeterli resim yok: ' . $category);
        }

        // Doğru kategoriden 3 resim seç
        shuffle($availableImages);
        $correct_images = array_slice($availableImages, 0, $this->correctImages);
        
        // Diğer kategorilerden 6 resim seç
        $incorrect_images = [];
        $other_categories = array_diff_key($this->categories, [$category => []]);
        
        // Tüm diğer kategorilerin resimlerini bir dizide topla
        $all_other_images = [];
        foreach ($other_categories as $other_cat => $other_images) {
            $all_other_images = array_merge($all_other_images, $other_images);
        }
        
        // Karıştır ve 6 tanesini seç
        shuffle($all_other_images);
        $incorrect_images = array_slice($all_other_images, 0, $this->totalImages - $this->correctImages);

        // Tüm resimleri birleştir
        $all_images = [];
        foreach ($correct_images as $img) {
            $all_images[] = [
                'url' => $img,
                'isCorrect' => true
            ];
        }
        foreach ($incorrect_images as $img) {
            $all_images[] = [
                'url' => $img,
                'isCorrect' => false
            ];
        }

        // Son kez karıştır
        shuffle($all_images);

        $data = [
            'category' => $category,
            'images' => $all_images,
            'correct_count' => $this->correctImages
        ];

        // Veriyi şifrele
        return $this->encode($data);
    }

    public function renderCaptcha() {
        ?>
        <link rel="stylesheet" href="captcha.css">
        <div id="captchaOverlay" class="captcha-overlay">
            <div class="captcha-popup">
                <div class="captcha-header">
                    <h3>Lütfen tüm <span id="captchaCategory"></span> resimlerini seçin</h3>
                    <div class="captcha-controls">
                        <span id="captchaTimer">30</span>
                        <button id="refreshCaptcha" class="refresh-btn" title="Yenile">↻</button>
                        <button id="closeCaptcha" class="close-btn" title="Kapat">×</button>
                    </div>
                </div>
                <div class="captcha-grid" id="captchaGrid"></div>
                <div class="captcha-watermark">MP-Captcha</div>
            </div>
        </div>
        <script src="captcha.js"></script>
        <?php
    }
}

// AJAX isteklerini işle
if (isset($_POST['action']) && $_POST['action'] === 'generate') {
    try {
        $captcha = new Captcha();
        $encoded_data = $captcha->generateCaptcha();
        header('Content-Type: text/plain; charset=utf-8');
        echo $encoded_data;
    } catch (Exception $e) {
        http_response_code(500);
        echo $captcha->encode(['error' => $e->getMessage()]);
    }
    exit;
}
?>
