const storageAccess = localStorage
function getProductsFromLocalStorage() {
    const products = storageAccess.getItem("productCart")
    if (!products) {
        return [];
    }
    return JSON.parse(products);
}
//// MAJ PRODUITS LS ///////
function updateLocalStorage(products) {
    storageAccess.setItem("productCart", JSON.stringify(products))
}
////// AJOUT PRODUITS LS //////
function findProductInLocalStorage(product){
  /////// PRODUITS DU LS//////
  let products = getProductsFromLocalStorage()
  let index = -1;
  if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
          ////// RECHERCHER PRODUITS //////////
          if (products[i].id == product.id && products[i].color == product.color) {
              index = i;
              break
          }
      }
  }
  return index  
}

function addToCart(product) {
    /////// PRODUITS DU LS//////
    let products = getProductsFromLocalStorage()
    let index = findProductInLocalStorage(product);
    
    if (index == -1) {
        products.push(product)
    } else {
        products[index].quantity = parseInt(products[index].quantity) + parseInt(product.quantity)
    }

    storageAccess.setItem("productCart", JSON.stringify(products))

}
////// SUPPRIMER PRODUIT LS /////////////
/*
function removeProductFromLs(id, color) {
    let products = getProductsFromLocalStorage()
    let index = findProductInLocalStorage({id,color});
    if (index != -1) {
        products.splice(index,1)
    }
    storageAccess.setItem("productCart", JSON.stringify(products))
    location.reload()
}

/////////   MODIFIER QUANTITE  ////////////

function changeProductQuantity(id, color, quantity) {
    let products = getProductsFromLocalStorage()
    let index = findProductInLocalStorage({id,color});
    if (index != -1) {
        products[index].quantity = quantity
    }
    storageAccess.setItem("productCart", JSON.stringify(products))
    location.reload()
} */