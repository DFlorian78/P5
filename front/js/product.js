let urlParam = (new URL(location)).searchParams
let productId = urlParam.get("id")
const titleId = document.getElementById("title")
const colorId = document.getElementById("colors")
const imgId = document.querySelector(".item__img")
const descriptionId = document.getElementById("description")
const priceId = document.getElementById("price")

fetch("http://localhost:3000/api/products/" + productId)
  .then((response) => {
    if (response.ok) {
      response.json()
        .then((product) => {

          titleId.innerHTML = `${product.name}`
          descriptionId.innerHTML = `${product.description}`
          priceId.innerHTML = `${product.price}`
          imgId.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
          const colorArray = product.colors
          for (let color of colorArray) {
            colorId.innerHTML += `<option value="${color}"> ${color}</option>`
          }


        })


    }

  })

const btnAdd = document.querySelector("#addToCart")
const color = document.querySelector("#colors")
const quantity = document.querySelector("#quantity")

btnAdd.addEventListener('click', e => {

  let goToCart = document.getElementById("goToCart");
  goToCart.addEventListener("click", () => {
    window.location.href = "./cart.html";
  });

  if (color.value === "") {
    alert("Vous devez choisir une couleur")
  } else if (quantity.value > 0 && quantity.value < 100) {

    const productOptions = {
      id: productId,
      color: color.value,
      quantity: quantity.value,
    }

    addToCart(productOptions)

  } else if (quantity.value > 100) {
    alert("Vous devez choisir une quantité comprise entre 1 et 100.")

  }



})