const productInput = document.getElementById("product")
const categoryInput = document.getElementById("category")
const priceInput = document.getElementById("price")
const quantityInput = document.getElementById("quantity")
const addBtn = document.getElementById("add-btn")
const productList = document.getElementById("product-list")
const searchInput = document.getElementById("search-input")
const categoryFilter = document.getElementById("category-filter")
const totalProducts = document.getElementById("total-products")
const totalItemsEl = document.getElementById("total-items")
const lowStockEl = document.getElementById("low-stock")



let products = JSON.parse(localStorage.getItem("products")) || []


addBtn.addEventListener("click", addProduct)

searchInput.addEventListener("input", searchProduct)

categoryFilter.addEventListener("change", filterByCategory)


function addProduct() {
    const productName = productInput.value
    const category = categoryInput.value
    const price = priceInput.value
    const quantity = Number(quantityInput.value)

    if (!productName.trim() || !category.trim()) return

    if (edit !== null) {
        const foundProduct = products.find(product => {
            return product.id === edit
        })

        foundProduct.name = productName
        foundProduct.category = category
        foundProduct.price = price
        foundProduct.quantity = quantity

        edit = null

    } else {

        const product = {
            id: Date.now(),
            name: productName,
            category,
            price,
            quantity
        }

        products.push(product)
    }

    localStorage.setItem("products", JSON.stringify(products))

    productInput.value = ""
    categoryInput.value = ""
    priceInput.value = ""
    quantityInput.value = ""

    renderProduct(products)
    updateSummary()
} 


function getProductHtml(productArray) {
    let productHtml = ""  

    productArray.forEach(product => {

        const stockStatus = product.quantity <= 5 ? "⚠️ Low Stock" : ""

        productHtml += 

            `
                <div class="product-card">

                    <div class="product-info">
                        <h2>${product.name}</h2>

                        <div class="product-details">
                            <p>Category: ${product.category}</p>
                            <p>Price: ₵${product.price.toLocaleString()}</p>
                            <p>Quantity: ${product.quantity}</p>
                        </div>

                        ${stockStatus ? `<p class="stock-status">${stockStatus}</p>` : ""}
                    </div>

                    <div class="product-actions">
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </div>

                </div>
            `
    })

    return productHtml
}


function renderProduct(productArray) {
    productList.innerHTML = getProductHtml(productArray)
}


function deleteProduct(id) {
    products = products.filter(product => {
        return product.id !== id
    }) 

    localStorage.setItem("products", JSON.stringify(products))

    renderProduct(products)
    updateSummary()
}


let edit = null

function editProduct(id) {
    const foundProduct = products.find(product => {
        return product.id === id
    })

    productInput.value = foundProduct.name
    categoryInput.value = foundProduct.category
    priceInput.value = foundProduct.price
    quantityInput.value = foundProduct.quantity

    edit = id

}


function searchProduct(e) {
    const searchValue = e.target.value

    const filteredProducts = products.filter(product => {
        return product.name
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    })

    renderProduct(filteredProducts)
}


function filterByCategory(e) {
    const selectedCategory = e.target.value

    if (selectedCategory === "All Categories") {
        renderProduct(products)
        return
    }

    const filteredProducts = products.filter(product => {
        return product.category === selectedCategory
    })

    renderProduct(filteredProducts)
}


function updateSummary() {
    totalProducts.textContent = products.length

    const totalItems = products.reduce((acc, product) => {
        return product.quantity + acc
    }, 0)

    totalItemsEl.textContent = totalItems

    const lowStockProducts = products.filter(product => {
        return product.quantity <= 5
    })

    lowStockEl.textContent = lowStockProducts.length
}


renderProduct(products)
updateSummary()