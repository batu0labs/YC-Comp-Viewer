# YC Atlas

Y Combinator şirketlerini keşfetmek, aramak ve filtrelemek için hazırlanmış modern bir şirket dizini.

Uygulama, şirket verilerini [Y Combinator open data API](https://yc-oss.github.io/api/companies/all.json) üzerinden alır. Büyük şirket listelerinde performansı korumak için yalnızca görünür ve görünür alana yakın kartları DOM’a render eder.

## Özellikler

- Y Combinator şirketlerini kart görünümünde listeleme
- Şirket adı, açıklama, sektör, şehir ve etiketlerde arama
- Sektöre göre filtreleme
- Batch'e göre filtreleme
- Bölgeye göre filtreleme
- Şirket durumuna göre filtreleme
- İsme veya batch'e göre sıralama
- Şirket web sitelerine doğrudan bağlantı
- Şirket logosu desteği
- Responsive tasarım
- Liste sanallaştırma ile büyük veri kümelerinde düşük DOM yükü
- Kart satırlarının gerçek yüksekliğini ölçen dinamik sanallaştırma
- Ekran genişliğine göre otomatik grid sütun hesabı
- Türkçe ve İngilizce arayüz seçeneği
- Açık/koyu tema seçeneği
- Dil ve tema tercihlerinin tarayıcıda saklanması
- API erişilemediğinde fallback demo verisi
- API yükleme zaman aşımına karşı hata yönetimi

## Teknolojiler

- React
- Vite
- JavaScript
- CSS
- Lucide React
- TanStack React Virtual

## Gereksinimler

- Node.js 18 veya üzeri
- npm

## Kurulum

Projeyi klonlayın:

```bash
git clone https://github.com/kullanici-adiniz/yc-comp-viewer.git
cd yc-comp-viewer
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulama varsayılan olarak şu adreste çalışır:

```text
http://localhost:5173
```

## Production build

Production çıktısı oluşturmak için:

```bash
npm run build
```

Oluşturulan production build'ini yerel olarak önizlemek için:

```bash
npm run preview
```

## Kullanım

- Üst menüdeki `TR / EN` seçicisiyle arayüz dilini değiştirebilirsiniz.
- Ay/güneş düğmesiyle açık ve koyu tema arasında geçiş yapabilirsiniz.
- Arama, filtreleme ve sıralama sanallaştırılmış şirket grid’iyle birlikte çalışır.
- Liste sanallaştırması sayfa kaydırmasını kullanır; kartların sabit yüksekliğe sahip olduğu varsayılmaz.

## Veri kaynağı

Şirket verileri istemci tarafında aşağıdaki endpoint'ten yüklenir:

```text
https://yc-oss.github.io/api/companies/all.json
```

API erişilemediğinde uygulama boş kalmaz; arayüzü test edebilmek için örnek şirket verilerini gösterir.

## Proje yapısı

```text
yc-comp-viewer/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```

Sanallaştırılmış grid uygulaması `src/main.jsx` içindeki `VirtualizedCompanyGrid` bileşeninde, tema ve responsive stiller ise `src/styles.css` içinde bulunur.

## Doğrulama

Production build kontrolü:

```bash
npm run build
```

Build başarıyla tamamlanmalıdır. Canlı veriyle yapılan kontrolde binlerce şirket yüklenmesine rağmen yalnızca görünür alana yakın kartların DOM’da tutulduğu, arama/filtreleme/sıralamanın ve dil/tema geçişlerinin çalıştığı doğrulanmıştır.

## GitHub Pages ile yayınlama

Projeyi GitHub Pages üzerinde yayınlamak için Vite'ın production build'ini oluşturup `dist` klasörünü yayınlayabilirsiniz. Alternatif olarak GitHub Actions ile otomatik deployment yapılandırılabilir.

Vite'ın GitHub Pages üzerinde proje alt yolu ile çalışması gerekiyorsa `vite.config.js` içerisinde repository adını `base` olarak tanımlayın.

Örnek:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/yc-comp-viewer/'
});
```

## Lisans

Bu proje kişisel ve eğitim amaçlı hazırlanmıştır. Şirket verileri Y Combinator open data kaynağından alınmaktadır.
