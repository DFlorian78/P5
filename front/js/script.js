let canapeData = [];
const fetchCanape = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise) => {
            canapeData = promise
            console.log(canapeData);
        });
};

const canapeDisplay = async () => {
    await fetchCanape();

    document.getElementById("items").innerHTML = canapeData.map(
        (canape) => `
    <a href="./product.html?id=${canape._id}">
    <article>
    <img class="itemsArticleImg" src="${canape.imageUrl}" alt="${canape.altTxt}"/>
    <h3 class="productName">${canape.name.toUpperCase()}</h3>
    <p class="productDescription">${canape.description}</p></article>
    `).join("");
};

canapeDisplay();