let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("orderId");

////// CHECK DE L'URL ET AFFICHAGE DE L'ID COMMANDE
function checkOrderId() {
    if (searchParams.has('orderId')) {
        ////// AFFICHAGE DE L'ID SUR LA PAGE COMMANDE
        let orderId = document.querySelector("#orderId");
        orderId.textContent = searchID;
    } else {
        document.location.href = './cart.html';
    }
}

checkOrderId();