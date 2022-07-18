function loadCart() {
let products = JSON.parse(localStorage.getItem("productCart"));
let cartTotalPrice = 0
let cartTotalItems = 0
let item = document.querySelector("#cart__items")
item.innerHTML=''

    for (let i = 0; i < products.length; i++) {
    // for (let [colors, quantity] of Object.entries(colors)) {    
        fetch("http://localhost:3000/api/products/" + products[i].id)
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((productData) => {
                            
                            item.innerHTML += `<article class="cart__item" data-id="${productData._id}" data-color="${products[i].color}">
                <div class="cart__item__img">
                  <img src="${productData.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${products[i].color}</p>
                    <p>${productData.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :   </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${products[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>`


                            //////////// SUPPRIMER PRODUIT DU LS 

                            let deleteBtns = document.getElementsByClassName("deleteItem")
                            let test = Object.values(deleteBtns)

                            console.log(test)

                            Object.values(deleteBtns).forEach(deleteBtn => {
                                deleteBtn.addEventListener('click', function () {
                                    let article = deleteBtn.closest("article")
                                    let articleId = article.getAttribute("data-id")
                                    let articleColor = article.getAttribute("data-color")

                                    removeProductFromLs(articleId, articleColor)
                                })
                            })


                            /////// MODIFICATIONS QUANTITE
                            // Changer la quantité d'un produit dans le ls

                            let productsQuantity = document.getElementsByClassName("itemQuantity")

                            Object.values(productsQuantity).forEach(quantity => {
                                quantity.addEventListener('change', function () {
                                    let article = quantity.closest("article")
                                    let dataId = article.getAttribute("data-id")
                                    let colorId = article.getAttribute("data-color")
                                    let newQuantity = quantity.value

                                    changeProductQuantity(dataId, colorId, newQuantity)
                                })
                            })



                            // PRIX TOTAL ET NBR PRODUITS

                            let totalQuantity = document.querySelector('#totalQuantity')
                            let totalPrice = document.querySelector('#totalPrice')
                            cartTotalItems += parseInt(products[i].quantity)

                            cartTotalPrice += productData.price * parseInt(products[i].quantity)

                            totalQuantity.innerHTML = cartTotalItems
                            totalPrice.innerHTML = cartTotalPrice


                        })


                }
            })
        console.log(i)
    }

}

////// SUPPRIMER PRODUIT LS /////////////

function removeProductFromLs(id, color) {
    let products = getProductsFromLocalStorage()
    let index = findProductInLocalStorage({id,color});
    if (index != -1) {
        products.splice(index,1)
    }
    storageAccess.setItem("productCart", JSON.stringify(products))
    loadCart()

    if (index !=0) {
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
    loadCart()
}


////// RECUPERATION DONNEES FORMULAIRE
function toOrder() {
    let formLocation = document.querySelector(".cart__order__form");

    ////// LANCEMENT REGEXP
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    let textRegExp = new RegExp("^[a-zéèçàA-Z0-9.-_ ]{2,50}$");

    ////// VERIFICATION DES REGEXP
    function validInput(inputText) {
        let inputErrorMessage = inputText.nextElementSibling;

        if (textRegExp.test(inputText.value)) {
            inputErrorMessage.textContent = '';
            return true;
        } else {
            inputErrorMessage.textContent = 'Veuillez entrer un texte valide.';
            return false;
        }
    };

    //// VERIFICATION REGXP UNIQUEMENT POUR L'EMAIL
    function validEmail(inputEmail) {
        let emailErrorMessage = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMessage.textContent = '';
            return true;
        } else {
            emailErrorMessage.textContent = 'Veuillez entrer un e-mail valide.';
            return false;
        }
    };
        ///////// TOUT LES INPUTS

    formLocation.firstName.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.lastName.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.address.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.city.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.email.addEventListener("change", function () {
        validEmail(this);
    });

    formLocation.order.addEventListener("click", (click) => {

        /////// VERIFICATION DU FORMULAIRE AVANT ENVOI
        click.preventDefault();

        ///// CREATION TABLEAU DES ID PRODUITS
        let products = JSON.parse(localStorage.getItem("productCart"));
        let productID = [];
        for (let i = 0; i < products.length; i++) {
            productID.push(products[i].id);
        };

        ////////// OBJECT POUR STOCKER LE FORMULAIRE ET LES ID PRODUITS
        let orderObject = {
            contact: {
                firstName: formLocation.firstName.value,
                lastName: formLocation.lastName.value,
                address: formLocation.address.value,
                city: formLocation.city.value,
                email: formLocation.email.value
            },
            products: productID
        };

        ///////// METHODE POST DE FETCH
        let fetchOptions = {
            method: 'POST',
            body: JSON.stringify(orderObject),
            headers: {
                "Content-Type": "application/json"
            }
        };

        //////// ON VERIFIE QUE LES INPUTS SOIENT CORRECT
        if (orderObject.products.length == 0) {
            alert("Vous n'avez aucun produit dans le panier")
        } else if (validInput(formLocation.firstName) &&
            validInput(formLocation.lastName) &&
            validInput(formLocation.address) &&
            validInput(formLocation.city) &&
            validEmail(formLocation.email)
        ) {
            ///////// RECUPERATION DU TABLEAU PRECEDENT
            fetch("http://localhost:3000/api/products/order", fetchOptions)
                .then((response) => {
                    return response.json();
                })
                ///////// CLEAR DU LOCAL STORAGE + CREATION DE L'ID DE LA COMMANDE
                .then((order) => {
                    localStorage.clear();
                    document.location.href = `./confirmation.html?orderId=${order.orderId}`;
                })
        } else {
            alert("Le formulaire est incomplet");
        }
    });
}


///// 
loadCart()
toOrder();





