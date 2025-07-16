const fs = require('fs');
const path = require('path');

// Helper to ensure folder exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// 1. app/store/[merchantId]/
ensureDir('app/store/[merchantId]');

// 2. data/
ensureDir('data');

// 3. public/logos/ and public/products/
ensureDir('public/logos');
ensureDir('public/products');

// 4. merchants.json (basic template)
const merchantsJson = {
  "alpha": {
    "name": "Alpha Goods",
    "themeColor": "#1976d2",
    "logo": "/logos/alpha.png",
    "products": [
      {
        "id": "1",
        "name": "Alpha Shirt",
        "desc": "Premium cotton T-shirt",
        "price": 25,
        "img": "/products/alpha-shirt.png"
      },
      {
        "id": "2",
        "name": "Alpha Mug",
        "desc": "Ceramic mug",
        "price": 15,
        "img": "/products/alpha-mug.png"
      }
    ]
  },
  "beta": {
    "name": "Beta Supplies",
    "themeColor": "#43a047",
    "logo": "/logos/beta.png",
    "products": [
      {
        "id": "1",
        "name": "Beta Notebook",
        "desc": "Eco-friendly notebook",
        "price": 10,
        "img": "/products/beta-notebook.png"
      }
    ]
  }
};

const merchantsPath = path.join('data', 'merchants.json');
if (!fs.existsSync(merchantsPath)) {
  fs.writeFileSync(merchantsPath, JSON.stringify(merchantsJson, null, 2));
  console.log(`Created ${merchantsPath}`);
}

// 5. Placeholder images (empty PNG files, can be replaced later)
const imgFiles = [
  'public/logos/alpha.png',
  'public/logos/beta.png',
  'public/products/alpha-shirt.png',
  'public/products/alpha-mug.png',
  'public/products/beta-notebook.png'
];

imgFiles.forEach(f => {
  if (!fs.existsSync(f)) {
    // Write a 1x1 transparent PNG (won't error if imported by Next.js)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9VUMHEQAAAAASUVORK5CYII=';
    fs.writeFileSync(f, Buffer.from(pngBase64, 'base64'));
    console.log(`Created placeholder: ${f}`);
  }
});

// 6. Scaffold page.tsx in /app/store/[merchantId]/
const pageTsxPath = 'app/store/[merchantId]/page.tsx';
if (!fs.existsSync(pageTsxPath)) {
  fs.writeFileSync(
    pageTsxPath,
    `import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

export default function Storefront({ params }) {
  const merchant = merchants[params.merchantId]
  if (!merchant) return notFound()

  return (
    <div style={{ background: merchant.themeColor, minHeight: '100vh', padding: 40 }}>
      <img src={merchant.logo} alt={merchant.name} height={60} style={{ marginBottom: 20 }} />
      <h1 style={{ color: '#fff' }}>{merchant.name}</h1>
      <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
        {merchant.products.map(product => (
          <div key={product.id} style={{ background: '#fff', borderRadius: 8, padding: 24, width: 220 }}>
            <img src={product.img} alt={product.name} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 4, marginBottom: 12 }} />
            <h3 style={{ margin: '8px 0 4px 0' }}>{product.name}</h3>
            <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>{product.desc}</div>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>\${product.price}</div>
            <button style={{ background: merchant.themeColor, color: '#fff', padding: '8px 20px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
`
  );
  console.log(`Created ${pageTsxPath}`);
}

console.log('Scaffold complete!');