<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MP-Captcha Dokümantasyonu</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #3498db;
            --secondary-color: #2ecc71;
        }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            padding-top: 60px;
        }
        .navbar-brand {
            font-weight: 600;
            color: var(--primary-color) !important;
        }
        .sidebar {
            position: sticky;
            top: 80px;
            height: calc(100vh - 80px);
            overflow-y: auto;
            padding: 20px;
        }
        .sidebar .nav-link {
            color: #666;
            padding: 8px 15px;
            border-radius: 5px;
            margin-bottom: 5px;
        }
        .sidebar .nav-link:hover {
            background: #f8f9fa;
            color: var(--primary-color);
        }
        .sidebar .nav-link.active {
            background: var(--primary-color);
            color: white;
        }
        .main-content {
            padding: 30px;
        }
        .section {
            margin-bottom: 40px;
            padding-top: 60px;
            margin-top: -60px;
        }
        .code-block {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .example-block {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .btn-demo {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">MP-Captcha</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#baslangic">Başlangıç</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kurulum">Kurulum</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kullanim">Kullanım</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#ornekler">Örnekler</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="row">
            <div class="col-lg-3">
                <div class="sidebar">
                    <nav class="nav flex-column">
                        <a class="nav-link" href="#baslangic">Başlangıç</a>
                        <a class="nav-link" href="#kurulum">Kurulum</a>
                        <a class="nav-link" href="#kullanim">Kullanım</a>
                        <a class="nav-link" href="#form-ornegi">Form Örneği</a>
                        <a class="nav-link" href="#buton-ornegi">Buton Örneği</a>
                        <a class="nav-link" href="#link-ornegi">Link Örneği</a>
                        <a class="nav-link" href="#api">API Referansı</a>
                    </nav>
                </div>
            </div>
            <div class="col-lg-9 main-content">
                <section id="baslangic" class="section">
                    <h1>MP-Captcha Dokümantasyonu</h1>
                    <p class="lead">MP-Captcha, modern ve kullanıcı dostu bir resim seçme CAPTCHA sistemidir. Türkçe dil desteği ve kolay entegrasyon özellikleriyle projeleriniz için ideal bir çözümdür.</p>
                </section>

                <section id="kurulum" class="section">
                    <h2>Kurulum</h2>
                    <p>MP-Captcha'yı projenize eklemek için aşağıdaki dosyaları indirin ve projenize dahil edin:</p>
                    <button class="btn btn-primary btn-demo" onclick="buttonCaptcha(this, downloadFile)">İndir</button>

                    <div class="code-block">
                        <pre><code class="language-php">
require_once 'captcha.php';

// CSS ve JavaScript dosyalarını sayfanıza ekleyin
&lt;link rel="stylesheet" href="captcha.css"&gt;
&lt;script src="captcha.js"&gt;&lt;/script&gt;
                        </code></pre>
                    </div>
                </section>

                <section id="kullanim" class="section">
                    <h2>Kullanım</h2>
                    <p>MP-Captcha'yı kullanmak için önce bir Captcha nesnesi oluşturun:</p>
                    <div class="code-block">
                        <pre><code class="language-php">
$captcha = new Captcha();
$captcha->renderCaptcha();
                        </code></pre>
                    </div>
                </section>

                <section id="form-ornegi" class="section">
                    <h2>Form Örneği</h2>
                    <p>Form doğrulaması için MP-Captcha kullanımı:</p>
                    <div class="example-block">
                        <form id="demoForm" class="mb-4" onsubmit="return false;">
                            <div class="mb-3">
                                <label class="form-label">E-posta</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary" onclick="formCaptcha(this.form)">Gönder</button>
                        </form>
                        <div class="code-block">
                            <pre><code class="language-html">
&lt;form id="demoForm" onsubmit="return false;"&gt;
    &lt;input type="email" required&gt;
    &lt;button type="submit" onclick="formCaptcha(this.form)"&gt;
        Gönder
    &lt;/button&gt;
&lt;/form&gt;

&lt;script&gt;
function formCaptcha(form) {
    const captcha = new CaptchaHandler();
    captcha.show().then(result => {
        if (result.success) {
            form.submit();
        }
    });
}
&lt;/script&gt;
                            </code></pre>
                        </div>
                    </div>
                </section>

                <section id="buton-ornegi" class="section">
                    <h2>Buton Örneği</h2>
                    <p>Butona tıklandığında CAPTCHA gösterimi:</p>
                    <div class="example-block">
                        <button class="btn btn-primary btn-demo" onclick="buttonCaptcha(this, () => alert('İşlem başarılı!'))">CAPTCHA Göster</button>
                        <div class="code-block">
                            <pre><code class="language-html">
&lt;button onclick="buttonCaptcha(this, () => alert('İşlem başarılı!'))"&gt;
    CAPTCHA Göster
&lt;/button&gt;

&lt;script&gt;
function buttonCaptcha(button, callback) {
    button.disabled = true;
    const captcha = new CaptchaHandler();
    captcha.show().then(result => {
        if (result.success) {
            callback();
        }
    }).finally(() => {
        button.disabled = false;
    });
}
&lt;/script&gt;
                            </code></pre>
                        </div>
                    </div>
                </section>

                <section id="link-ornegi" class="section">
                    <h2>Link Örneği</h2>
                    <p>Link tıklamasında CAPTCHA doğrulaması:</p>
                    <div class="example-block">
                        <a href="#" class="btn btn-link btn-demo" onclick="linkCaptcha(this, 'https://example.com'); return false;">
                            Güvenli Linke Git
                        </a>
                        <div class="code-block">
                            <pre><code class="language-html">
&lt;a href="#" onclick="linkCaptcha(this, 'https://example.com'); return false;"&gt;
    Güvenli Linke Git
&lt;/a&gt;

&lt;script&gt;
function linkCaptcha(link, url) {
    link.style.pointerEvents = 'none';
    const captcha = new CaptchaHandler();
    captcha.show().then(result => {
        if (result.success) {
            window.location.href = url;
        }
    }).finally(() => {
        link.style.pointerEvents = 'auto';
    });
}
&lt;/script&gt;
                            </code></pre>
                        </div>
                    </div>
                </section>

                <section id="api" class="section">
                    <h2>API Referansı</h2>
                    <h3>Metodlar</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Metod</th>
                                <th>Açıklama</th>
                                <th>Parametreler</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>show()</td>
                                <td>CAPTCHA penceresini gösterir</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>close()</td>
                                <td>CAPTCHA penceresini kapatır</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>refresh()</td>
                                <td>CAPTCHA'yı yeniler</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Olaylar</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Olay</th>
                                <th>Açıklama</th>
                                <th>Callback Parametreleri</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>onSuccess</td>
                                <td>CAPTCHA başarıyla tamamlandığında</td>
                                <td>result: {success: true}</td>
                            </tr>
                            <tr>
                                <td>onError</td>
                                <td>CAPTCHA başarısız olduğunda</td>
                                <td>error: Error</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    </div>

    <?php
    require_once 'captcha.php';
    $captcha = new Captcha();
    $captcha->renderCaptcha();
    ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-php.min.js"></script>
    <script>
        // Aktif menü öğesini güncelle
        const updateActiveLink = () => {
            const sections = document.querySelectorAll('.section');
            const navLinks = document.querySelectorAll('.sidebar .nav-link');
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    const id = section.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // CAPTCHA fonksiyonları
        function formCaptcha(form) {
            const captcha = new CaptchaHandler();
            captcha.show().then(result => {
                if (result.success) {
                    form.submit();
                }
            });
        }

        function buttonCaptcha(button, callback) {
            button.disabled = true;
            const captcha = new CaptchaHandler();
            captcha.show().then(result => {
                if (result.success) {
                    callback();
                }
            }).finally(() => {
                button.disabled = false;
            });
        }

        function linkCaptcha(link, url) {
            link.style.pointerEvents = 'none';
            const captcha = new CaptchaHandler();
            captcha.show().then(result => {
                if (result.success) {
                    window.location.href = url;
                }
            }).finally(() => {
                link.style.pointerEvents = 'auto';
            });
        }
    </script>
    <script>
function buttonCaptcha(button, callback) {
    button.disabled = true;
    const captcha = new CaptchaHandler();
    captcha.show().then(result => {
        if (result.success) {
            callback();
        }
    }).finally(() => {
        button.disabled = false;
    });
}

function downloadFile() {
    const link = document.createElement('a');
    link.href = 'https://github.com/Alabr0s/MP-Captcha/archive/refs/heads/main.zip';
    link.download = 'MP-Captcha-main.zip';
    link.click();
}
</script>
</body>
</html>
