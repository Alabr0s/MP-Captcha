<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MP-Captcha - Modern ve Güvenli Captcha Çözümü</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #3498db;
            --secondary-color: #2ecc71;
            --dark-color: #2c3e50;
            --light-color: #ecf0f1;
        }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: var(--dark-color);
            background: #f8f9fa;
            padding-top: 76px;
        }
        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .navbar-brand {
            font-weight: 700;
            color: var(--primary-color) !important;
            font-size: 1.5rem;
        }
        .nav-link {
            font-weight: 500;
            color: var(--dark-color) !important;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem !important;
            border-radius: 25px;
            margin: 0 0.2rem;
        }
        .nav-link:hover {
            background: rgba(52, 152, 219, 0.1);
            color: var(--primary-color) !important;
        }
        .nav-link.active {
            background: var(--primary-color) !important;
            color: white !important;
        }
        .hero {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 4rem 0;
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="%23FFFFFF" fill-opacity="0.1" d="M0 0h200v200H0z"/></svg>');
            opacity: 0.1;
        }
        .hero h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .section {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .section h2 {
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .section h2::before {
            content: '';
            width: 4px;
            height: 24px;
            background: var(--primary-color);
            border-radius: 2px;
            display: inline-block;
        }
        .code-block {
            background: #f8f9fa;
            border-radius: 10px;
            margin: 1rem 0;
            overflow: hidden;
            border: 1px solid #e9ecef;
        }
        .example-block {
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: all 0.3s ease;
            background: #fff;
        }
        .example-block:hover {
            border-color: var(--primary-color);
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transform: translateY(-2px);
        }
        .example-block h4 {
            color: var(--dark-color);
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .btn-demo {
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .btn-demo:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .footer {
            background: var(--dark-color);
            color: white;
            padding: 2rem 0;
            margin-top: 4rem;
        }
        pre {
            margin: 0;
            border-radius: 10px;
        }
        code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">MP-Captcha</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">Ana Sayfa</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#kurulum">Kurulum</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#demos">Demolar</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#docs">Dökümanlar</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero" id="home">
        <div class="container text-center">
            <h1>MP-Captcha</h1>
            <p class="lead">Modern, Güvenli ve Kullanıcı Dostu Captcha Çözümü</p>
        </div>
    </div>

    <div class="container">
        <!-- Kurulum -->
        <section id="kurulum" class="section">
            <h2>Kurulum</h2>
            <p>MP-Captcha'yı projenize eklemek için aşağıdaki CDN bağlantısını kullanın:</p>
            <div class="code-block">
                <pre><code class="language-html">&lt;script src="https://devland.pw/Captcha/captcha.bundle.js"&gt;&lt;/script&gt;</code></pre>
            </div>
        </section>

        <!-- Demolar -->
        <section id="demos" class="section">
            <h2>Canlı Demolar</h2>
            
            <div class="example-block">
                <h4>Form Koruması</h4>
                <p>Formlarınızı otomatik gönderimlerden koruyun.</p>
                <form id="demoForm" class="mt-3">
                    <div class="mb-3">
                        <input type="text" class="form-control" placeholder="Kullanıcı adı">
                    </div>
                    <button type="submit" class="btn btn-primary btn-demo">Formu Gönder</button>
                </form>
            </div>

            <div class="example-block">
                <h4>Buton Koruması</h4>
                <p>Önemli butonlarınızı bot tıklamalarından koruyun.</p>
                <button id="demoButton" class="btn btn-success btn-demo">Butona Tıkla</button>
            </div>

            <div class="example-block">
                <h4>Link Koruması</h4>
                <p>Hassas linklerinizi güvence altına alın.</p>
                <a href="https://example.com" id="demoLink" class="btn btn-info btn-demo text-white">Güvenli Linke Git</a>
            </div>
        </section>

        <!-- Dökümanlar -->
        <section id="docs" class="section">
            <h2>Kod Örnekleri</h2>

            <h4>1. Form Koruması</h4>
            <div class="code-block">
                <pre><code class="language-javascript">// Form submit olayını dinle
document.getElementById('myForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const captcha = new CaptchaHandler();
    const result = await captcha.show();
    
    if (result.success) {
        this.submit(); // Captcha başarılı ise formu gönder
    }
});</code></pre>
            </div>

            <h4>2. Buton Koruması</h4>
            <div class="code-block">
                <pre><code class="language-javascript">// Buton tıklama olayını dinle
document.getElementById('myButton').addEventListener('click', async function(e) {
    e.preventDefault();
    const captcha = new CaptchaHandler();
    const result = await captcha.show();
    
    if (result.success) {
        // Captcha başarılı ise işlemi gerçekleştir
        console.log('İşlem başarılı!');
    }
});</code></pre>
            </div>

            <h4>3. Link Koruması</h4>
            <div class="code-block">
                <pre><code class="language-javascript">// Link tıklama olayını dinle
document.getElementById('myLink').addEventListener('click', async function(e) {
    e.preventDefault();
    const captcha = new CaptchaHandler();
    const result = await captcha.show();
    
    if (result.success) {
        window.location.href = this.href; // Captcha başarılı ise yönlendir
    }
});</code></pre>
            </div>
        </section>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container text-center">
            <p class="mb-0">MP-Captcha &copy; 2024 | Tüm hakları saklıdır.</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js"></script>
    <script src="https://devland.pw/Captcha/captcha.bundle.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });

            // Update active nav item on scroll
            window.addEventListener('scroll', function() {
                let current = '';
                document.querySelectorAll('section').forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= sectionTop - 100) {
                        current = section.getAttribute('id');
                    }
                });

                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === current) {
                        link.classList.add('active');
                    }
                });
            });

            // Form demo
            const demoForm = document.getElementById('demoForm');
            if (demoForm) {
                demoForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const captcha = new CaptchaHandler();
                    const result = await captcha.show();
                    if (result.success) {
                        alert('Form başarıyla doğrulandı!');
                    }
                });
            }

            // Buton demo
            const demoButton = document.getElementById('demoButton');
            if (demoButton) {
                demoButton.addEventListener('click', async function(e) {
                    e.preventDefault();
                    const captcha = new CaptchaHandler();
                    const result = await captcha.show();
                    if (result.success) {
                        alert('Buton tıklaması doğrulandı!');
                    }
                });
            }

            // Link demo
            const demoLink = document.getElementById('demoLink');
            if (demoLink) {
                demoLink.addEventListener('click', async function(e) {
                    e.preventDefault();
                    const captcha = new CaptchaHandler();
                    const result = await captcha.show();
                    if (result.success) {
                        alert('Link tıklaması doğrulandı!');
                    }
                });
            }
        });
    </script>
</body>
</html>
