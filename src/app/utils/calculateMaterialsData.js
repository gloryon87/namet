export default function calculateMaterialsData(materials, goodsColor) {
  const materialQtyMap = {}
  materials.forEach(material => {
  materialQtyMap[material.color] = material.qty
})

const materialDifferenceArray = goodsColor.map(color => {
  const colorName = color.name
  const qtyInProdMaterials = materialQtyMap[colorName] || 0

  return {
    color: colorName,
    difference: qtyInProdMaterials - (color.colorArea || 0)
  }
})

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
