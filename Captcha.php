<?php
class Captcha {
    private $categories;
    private $imagesPath;
    private $totalImages = 9; // Toplam resim sayısı
    private $correctImages = 3; // Doğru resim sayısı
    private $categoryTranslations = [
        'araba' => 'car',
        'bisiklet' => 'bicycle',
        'merdiven' => 'stairs'
    ];

    public function __construct() {
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
                        $images[] = '/images/' . $categoryName . '/' . $file;
                    }
                    $categories[$categoryName] = $images;
                }
            }
        }
        return $categories;
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

        return [
            'category' => $category,
            'images' => $all_images,
            'correct_count' => $this->correctImages
        ];
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
        $data = $captcha->generateCaptcha();
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
?>
