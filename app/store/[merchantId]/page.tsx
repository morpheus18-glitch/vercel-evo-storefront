import { notFound } from 'next/navigation'
import merchants from '@/data/merchants.json'

interface StorefrontPageProps {
  params: {
    merchantId: string
  }
}

export default function Storefront({ params }: StorefrontPageProps) {
  const merchant = merchants[params.merchantId]
  if (!merchant) return notFound()

  return (
    <div>
      <h1>{merchant.name}</h1>
      {/* Add your modern UI JSX here */}
    </div>
  )
}