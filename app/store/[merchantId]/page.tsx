import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

export default async function Storefront({
  params,
}: {
  params: Promise<{ merchantId: string }>
}) {
  const { merchantId } = await params
  const merchant = merchants[merchantId]
  if (!merchant) return notFound()

  return (
    <div
      style={{ background: merchant.themeColor, minHeight: '100vh', padding: 40 }}
    >
      <Image src={merchant.logo} alt={merchant.name} width={120} height={120} />
      <h1 style={{ color: '#fff' }}>{merchant.name}</h1>
      <div
        style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}
      >
        {merchant.products.map((p) => (
          <div
            key={p.id}
            style={{ background: '#fff', borderRadius: 8, padding: 16, width: 220 }}
          >
            <Image
              src={p.img}
              alt={p.name}
              width={160}
              height={160}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
            <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
            <p style={{ margin: '0 0 8px' }}>{p.desc}</p>
            <strong>${p.price}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
