import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

export default async function Storefront({
  params,
}: {
  params: { merchantId: string }
}) {
  const merchant = merchants[params.merchantId]
  if (!merchant) return notFound()

  return (
    <div>
      <h1>{merchant.name}</h1>
      {/* Modern UI here */}
    </div>
  )
}