export default function calculateGoodsData(goodsArray) {
  const goodsQtyArray = goodsArray?.map(good => good.qty) ?? []
  const goodsQty = goodsQtyArray.reduce((total, num) => total + num, 0)

  const goodsAreasArray = goodsArray?.map(good => good.goodArea) ?? []
  const goodsArea = goodsAreasArray.reduce((total, num) => total + num, 0)

  const goodsDeliveredArray = goodsArray?.map(good => good.delivered) ?? []
  const goodsDelivered = goodsDeliveredArray.reduce(
    (total, num) => total + (num ?? 0),
    0
  )

  const goodsDeliveredAreaArray =
    goodsArray?.map(good => (good.delivered ?? 0) * (good.a * good.b ?? 0)) ??
    []
  const goodsDeliveredArea = goodsDeliveredAreaArray.reduce(
    (total, num) => total + (num ?? 0),
    0
  )

  return {
    goodsQty,
    goodsArea,
    goodsDelivered,
    goodsDeliveredArea
  }
}
