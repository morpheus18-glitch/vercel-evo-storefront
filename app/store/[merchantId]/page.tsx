import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

type Props = {
  params: {
    merchantId: string
  }
}

export default function Storefront({ params }: Props) {
  const merchant = merchants[params.merchantId]
  if (!merchant) return notFound()

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8fbff 0%, #f0f4f8 100%)',
        minHeight: '100vh',
        fontFamily: "Inter, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        padding: '48px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          background: 'rgba(255,255,255,0.90)',
          boxShadow: '0 4px 28px 0 rgba(22,32,61,0.10), 0 1.5px 5px 0 rgba(0,0,0,0.01)',
          borderRadius: 28,
          padding: '48px 40px 40px 40px',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 38 }}>
          <img
            src={merchant.logo}
            alt={merchant.name}
            style={{
              height: 56,
              width: 56,
              objectFit: 'contain',
              borderRadius: 18,
              background: '#e7f0fb',
              marginRight: 28,
              boxShadow: '0 2px 8px 0 rgba(23,41,71,0.06)',
            }}
          />
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '-1.4px',
              margin: 0,
              color: '#182043',
            }}
          >
            {merchant.name}
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 36,
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {merchant.products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'rgba(252,255,255,0.96)',
                borderRadius: 18,
                boxShadow: '0 3px 14px 0 rgba(52,76,137,0.06)',
                padding: 30,
                width: 270,
                marginBottom: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'box-shadow 0.18s cubic-bezier(.34,.93,.59,.99)',
                border: '1.5px solid #f2f4f9',
              }}
            >
              <img
                src={product.img}
                alt={product.name}
                style={{
                  width: 144,
                  height: 144,
                  objectFit: 'cover',
                  borderRadius: 12,
                  marginBottom: 20,
                  boxShadow: '0 2px 12px 0 rgba(27,47,84,0.07)',
                  background: '#f3f6fa',
                }}
              />
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.5px',
                  margin: '6px 0 2px 0',
                  color: '#1c2343',
                  textAlign: 'center',
                }}
              >
                {product.name}
              </h3>
              <div
                style={{
                  fontSize: 15,
                  color: '#66739c',
                  marginBottom: 13,
                  textAlign: 'center',
                }}
              >
                {product.desc}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 15,
                  fontSize: 20,
                  color: '#2a3556',
                }}
              >
                ${product.price}
              </div>
              <button
                style={{
                  background: 'linear-gradient(90deg, #196ae6 0%, #1bbcf8 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '11px 32px',
                  border: 'none',
                  borderRadius: 10,
                  boxShadow: '0 2px 7px 0 rgba(27,188,248,0.15), 0 1px 2px rgba(25,106,230,0.07)',
                  cursor: 'pointer',
                  letterSpacing: '0.2px',
                  transition: 'background 0.14s, box-shadow 0.14s, transform 0.13s',
                  marginTop: 10,
                  outline: 'none',
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    'linear-gradient(90deg, #2a87e6 0%, #25d0fa 100%)')
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    'linear-gradient(90deg, #196ae6 0%, #1bbcf8 100%)')
                }
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}