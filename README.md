# MP-Captcha

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-purple.svg)](https://getbootstrap.com/)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](https://github.com/yourusername/mp-captcha)

[English](#english) | [Türkçe](#türkçe)

## Screenshots / Ekran Görüntüleri

### Light Theme / Açık Tema
![MP-Captcha Light Theme](https://i.ibb.co/27qRsxH/Ekran-g-r-nt-s-17-12-2024-174940-localhost.jpg)

### Dark Theme / Koyu Tema
![MP-Captcha Dark Theme](https://i.ibb.co/PzVY83s/Ekran-g-r-nt-s-17-12-2024-174959-localhost.jpg)

## English

### Overview
MP-Captcha is a powerful, modern, and user-friendly CAPTCHA solution designed to protect your web applications from automated bots and spam. Built with modern web standards and focusing on user experience, it provides a seamless integration process for developers while maintaining robust security.

### Key Features
- Simple and intuitive implementation
- Modern, customizable UI with Bootstrap 5
- Fully responsive design for all devices
- Enhanced security measures
- Lightweight and fast loading
- Multi-language support
- User-friendly interface
- Easy API integration

### Installation

#### Using CDN
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- MP-Captcha CSS -->
<link href="path/to/mp-captcha.css" rel="stylesheet">

<!-- MP-Captcha JavaScript -->
<script src="path/to/captcha.js"></script>
```

#### Using npm
```bash
npm install mp-captcha
```

### Quick Start

1. Add the CAPTCHA container to your HTML:
```html
<div id="mp-captcha"></div>
```

2. Initialize the CAPTCHA:
```javascript
const captcha = new MPCaptcha({
    container: 'mp-captcha',
    apiKey: 'YOUR_API_KEY'
});
```

3. Handle verification:
```javascript
captcha.onVerify(token => {
    console.log('Verification successful:', token);
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| theme | string | 'light' | Theme of the captcha ('light' or 'dark') |
| size | string | 'normal' | Size of the captcha ('normal' or 'compact') |
| callback | function | null | Callback function after verification |
| errorCallback | function | null | Callback function on error |

### API Reference

#### Methods
- `verify()`: Manually trigger verification
- `reset()`: Reset the captcha
- `getToken()`: Get the verification token
- `setTheme(theme)`: Change the captcha theme
- `destroy()`: Remove the captcha instance

#### Events
- `onLoad`: Fired when captcha is fully loaded
- `onVerify`: Fired on successful verification
- `onError`: Fired when an error occurs
- `onExpire`: Fired when the verification expires

### Contributing
Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Türkçe

### Genel Bakış
MP-Captcha, web uygulamalarınızı otomatik botlardan ve spam'den korumak için tasarlanmış güçlü, modern ve kullanıcı dostu bir CAPTCHA çözümüdür. Modern web standartlarıyla oluşturulmuş ve kullanıcı deneyimine odaklanarak, geliştiriciler için sorunsuz bir entegrasyon süreci sağlarken güçlü güvenliği korur.

### Temel Özellikler
- Basit ve sezgisel uygulama
- Bootstrap 5 ile modern, özelleştirilebilir arayüz
- Tüm cihazlar için tam responsive tasarım
- Gelişmiş güvenlik önlemleri
- Hafif ve hızlı yükleme
- Çoklu dil desteği
- Kullanıcı dostu arayüz
- Kolay API entegrasyonu

### Kurulum

#### CDN Kullanarak
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- MP-Captcha CSS -->
<link href="path/to/mp-captcha.css" rel="stylesheet">

<!-- MP-Captcha JavaScript -->
<script src="path/to/captcha.js"></script>
```

#### npm Kullanarak
```bash
npm install mp-captcha
```

### Hızlı Başlangıç

1. CAPTCHA container'ını HTML'inize ekleyin:
```html
<div id="mp-captcha"></div>
```

2. CAPTCHA'yı başlatın:
```javascript
const captcha = new MPCaptcha({
    container: 'mp-captcha',
    apiKey: 'API_ANAHTARINIZ'
});
```

3. Doğrulamayı işleyin:
```javascript
captcha.onVerify(token => {
    console.log('Doğrulama başarılı:', token);
});
```

### Yapılandırma Seçenekleri

| Seçenek | Tür | Varsayılan | Açıklama |
|---------|-----|------------|-----------|
| theme | string | 'light' | Captcha teması ('light' veya 'dark') |
| size | string | 'normal' | Captcha boyutu ('normal' veya 'compact') |
| callback | function | null | Doğrulama sonrası callback fonksiyonu |
| errorCallback | function | null | Hata durumunda callback fonksiyonu |

### API Referansı

#### Metodlar
- `verify()`: Manuel doğrulama tetikleme
- `reset()`: Captcha'yı sıfırlama
- `getToken()`: Doğrulama token'ını alma
- `setTheme(theme)`: Captcha temasını değiştirme
- `destroy()`: Captcha örneğini kaldırma

#### Olaylar
- `onLoad`: Captcha tam olarak yüklendiğinde tetiklenir
- `onVerify`: Başarılı doğrulamada tetiklenir
- `onError`: Hata oluştuğunda tetiklenir
- `onExpire`: Doğrulama süresi dolduğunda tetiklenir

### Katkıda Bulunma
Katkılarınızı bekliyoruz! Davranış kurallarımız ve pull request gönderme süreci hakkında detaylı bilgi için [Katkıda Bulunma Rehberi](CONTRIBUTING.md)'ni okuyun.

### Lisans
Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için [LİSANS](LICENSE) dosyasına bakın.
