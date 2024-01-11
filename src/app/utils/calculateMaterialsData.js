export default function calculateMaterialsData(materials, goodsColor) {
  const materialQtyMap = {}
  materials.forEach(material => {
  materialQtyMap[material.color] = material.qty
})
//  console.log(goodsColor)
  
const materialDifferenceArray = goodsColor.flatMap(color => {
  const colorName = color.name
  const qtyInProdMaterials = materialQtyMap[colorName] || 0

  return {
    color: colorName,
    difference: qtyInProdMaterials - (color.colorArea || 0)
  }
})
  // console.log(materialDifferenceArray)

// Додаємо відсутні кольори з materials
  materials.forEach(material => {
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
