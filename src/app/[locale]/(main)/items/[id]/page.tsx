import React from 'react'
import ItemDetailPage from './detail-page/ProductDetailPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  

  return (
    <>
    {/* <h2>detail page</h2> */}
    <ItemDetailPage id={id}/>
    </>
  )
}
