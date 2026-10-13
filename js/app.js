let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selected = null;

function render(list = products) {
    let html = "";

    list.forEach((p) => {
        html += `
        <div class="card" onclick="openModal(${p.id})">
            <img src="${p.img}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} đ</p>

                <button class="add-cart-btn"
                        onclick="event.stopPropagation(); addToCart(${p.id})">
                    🛒 <span>Thêm vào giỏ</span>
                </button>
            </div>
        </div>`;
    });

    document.getElementById("productList").innerHTML = html;
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    let item = cart.find(x => x.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({
            id: p.id,
            name: p.name,
            price: p.price,
            img: p.img,
            qty: 1
        });
    }

    save();
    updateCart();

    console.log("✔ Đã thêm:", p.name);
}

function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
    let html = "";
    let total = 0;

    cart.forEach((item, i) => {
        total += item.price * item.qty;

        html += `
        <div class="cart-item">

            <div class="cart-top">
                <span class="cart-name">${item.name}</span>
                <span class="cart-price">${item.price.toLocaleString()} đ</span>
            </div>

            <div class="cart-bottom">
                <div class="qty-box">
                    <button class="qty-btn" onclick="change(${i},-1)">−</button>
                    <span class="qty-number">${item.qty}</span>
                    <button class="qty-btn" onclick="change(${i},1)">+</button>
                </div>

                <button class="delete-btn" onclick="removeItem(${i})">🗑</button>
            </div>

        </div>`;
    });

    document.getElementById("cartItems").innerHTML = html;
    document.getElementById("total").innerText = total.toLocaleString();

    document.getElementById("count").innerText =
        cart.reduce((t, i) => t + i.qty, 0);
}

function change(i, d) {
    cart[i].qty += d;

    if (cart[i].qty <= 0) {
        cart.splice(i, 1);
    }

    save();
    updateCart();
}

function removeItem(i) {
    cart.splice(i, 1);
    save();
    updateCart();
}

function toggleCart() {
    const box = document.getElementById("cartBox");

    box.style.display = (box.style.display === "block")
        ? "none"
        : "block";
}

function searchProduct(k) {
    render(
        products.filter(p =>
            p.name.toLowerCase().includes(k.toLowerCase())
        )
    );
}

function openModal(id) {
    selected = id;
    const p = products.find(x => x.id === id);

    if (!p) return;

    document.getElementById("modal").style.display = "block";
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalName").innerText = p.name;
    document.getElementById("modalPrice").innerText =
        p.price.toLocaleString() + " đ";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function addToCartFromModal() {
    addToCart(selected);
    closeModal();
}

function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng trống");
        return;
    }
    document.getElementById("checkoutModal").style.display = "block";
}

function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

function confirmOrder() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (!name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    let order = {
        customer: { name, phone, address },
        items: cart,
        total: cart.reduce((t, i) => t + i.price * i.qty, 0),
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("🎉 Đặt hàng thành công!");

    cart = [];
    save();
    updateCart();
    closeCheckout();
}

function filter(cat, el) {
    document.querySelectorAll(".category button")
        .forEach(b => b.classList.remove("active"));

    if (el) el.classList.add("active");

    if (cat === "all") render(products);
    else render(products.filter(p => p.cat === cat));
}

function scrollToSection(id) {
    document.getElementById(id)
        .scrollIntoView({ behavior: "smooth" });
}

function sendContact() {
    alert("Đã gửi liên hệ!");
}

window.onload = function () {
    render(products);
    updateCart();
};