export default function calculateMaterialsData(materials, goodsColor) {
  const mergedMaterials = materials?.reduce((acc, item) => {
  const existingItem = acc.find(accItem => accItem.color === item.color)

  if (existingItem) {
    existingItem.qty += item.qty
  } else {
    acc.push({ color: item.color, qty: item.qty })
  }
  return acc
}, [])


  const materialQtyMap = {}
  mergedMaterials.forEach(material => {
  materialQtyMap[material.color] = material.qty
})
//  console.log(goodsColor)
  
const materialDifferenceArray = goodsColor?.flatMap(color => {
  const colorName = color.name
  const qtyInProdMaterials = materialQtyMap[colorName] || 0

  return {
    color: colorName,
    difference: qtyInProdMaterials - (color.colorArea || 0)
  }
})
  // console.log(materialDifferenceArray)

// Додаємо відсутні кольори з materials
  mergedMaterials.forEach(material => {
  const colorName = material.color
  if (!materialDifferenceArray.some(entry => entry.color === colorName)) {
    materialDifferenceArray.push({
      color: colorName,
      difference: material.qty
    })
  }
  })
    return materialDifferenceArray

}
