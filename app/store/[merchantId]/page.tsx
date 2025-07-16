import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

export default function Storefront({ params }: any) {
  const merchant = merchants[params.merchantId]
  if (!merchant) return notFound()

  return (
    <div>
      <h1>{merchant.name}</h1>
      {/* Add your modern UI JSX here, or paste the styling block from earlier */}
    </div>
  )
}