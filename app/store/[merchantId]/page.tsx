import React from 'react'
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
    <div>
      <h1>{merchant.name}</h1>
      {/* Modern UI here */}
    </div>
  )
}
