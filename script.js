// Data produk simulasi
let products = [
    {
        id: 1,
        nama: "Produk A",
        deskripsi: "Deskripsi Produk A",
        sku: "SKU001",
        harga_jual: 50000,
        harga_pokok: 30000,
        stok: 10,
        kategori: "Makanan",
        merek: "Merek A",
        gambar: ""
    },
    {
        id: 2,
        nama: "Produk B",
        deskripsi: "Deskripsi Produk B",
        sku: "SKU002",
        harga_jual: 75000,
        harga_pokok: 50000,
        stok: 5,
        kategori: "Minuman",
        merek: "Merek B",
        gambar: ""
    }
];

// Array keranjang belanja
let cart = [];

// Array transaksi simulasi untuk laporan
let transactions = [
    { productId: 1, quantity: 2, total: 100000, date: "2024-06-01" },
    { productId: 2, quantity: 1, total: 75000, date: "2024-06-01" }
];

// Fungsi menampilkan waktu dan tanggal di navbar index.html
function updateDateTime() {
    const dtDisplay = document.getElementById("datetime-display");
    if (!dtDisplay) return;
    const now = new Date();
    dtDisplay.textContent = now.toLocaleString("id-ID", {
        dateStyle: "short",
        timeStyle: "short"
    });
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Fungsi menambahkan produk ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const cartItem = cart.find(item => item.product.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    renderCart();
}

// Fungsi menghapus produk dari keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    renderCart();
}

// Fungsi mengubah kuantitas produk di keranjang
function changeQuantity(productId, delta) {
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) return;
    cartItem.quantity += delta;
    if (cartItem.quantity < 1) {
        removeFromCart(productId);
    } else {
        renderCart();
    }
}

// Fungsi menghitung total harga keranjang
function calculateTotal() {
    return cart.reduce((total, item) => total + item.product.harga_jual * item.quantity, 0);
}

// Fungsi menampilkan keranjang di halaman index.html
function renderCart() {
    const tbody = document.querySelector("#cart-table tbody");
    const totalEl = document.getElementById("cart-total");
    if (!tbody || !totalEl) return;

    tbody.innerHTML = "";
    cart.forEach(item => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = item.product.nama;
        tr.appendChild(nameTd);

        const priceTd = document.createElement("td");
        priceTd.textContent = "Rp " + item.product.harga_jual.toLocaleString("id-ID");
        tr.appendChild(priceTd);

        const qtyTd = document.createElement("td");
        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-sm";
        const btnMinus = document.createElement("button");
        btnMinus.className = "btn btn-outline-secondary";
        btnMinus.textContent = "-";
        btnMinus.onclick = () => changeQuantity(item.product.id, -1);
        const qtySpan = document.createElement("span");
        qtySpan.className = "px-2 align-self-center";
        qtySpan.textContent = item.quantity;
        const btnPlus = document.createElement("button");
        btnPlus.className = "btn btn-outline-secondary";
        btnPlus.textContent = "+";
        btnPlus.onclick = () => changeQuantity(item.product.id, 1);
        btnGroup.appendChild(btnMinus);
        btnGroup.appendChild(qtySpan);
        btnGroup.appendChild(btnPlus);
        qtyTd.appendChild(btnGroup);
        tr.appendChild(qtyTd);

        const subtotalTd = document.createElement("td");
        subtotalTd.textContent = "Rp " + (item.product.harga_jual * item.quantity).toLocaleString("id-ID");
        tr.appendChild(subtotalTd);

        const actionTd = document.createElement("td");
        const btnRemove = document.createElement("button");
        btnRemove.className = "btn btn-danger btn-sm";
        btnRemove.textContent = "Hapus";
        btnRemove.onclick = () => removeFromCart(item.product.id);
        actionTd.appendChild(btnRemove);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });

    totalEl.textContent = "Rp " + calculateTotal().toLocaleString("id-ID");
}

// Fungsi simulasi proses pembayaran
function processPayment() {
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }
    alert("Pembayaran berhasil!");
    cart = [];
    renderCart();
}

// Fungsi menampilkan daftar produk di halaman manage-products.html
function renderProducts() {
    const tbody = document.querySelector("#products-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    products.forEach(product => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = product.nama;
        tr.appendChild(nameTd);

        const skuTd = document.createElement("td");
        skuTd.textContent = product.sku;
        tr.appendChild(skuTd);

        const priceTd = document.createElement("td");
        priceTd.textContent = "Rp " + product.harga_jual.toLocaleString("id-ID");
        tr.appendChild(priceTd);

        const stockTd = document.createElement("td");
        stockTd.textContent = product.stok;
        tr.appendChild(stockTd);

        const actionTd = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-outline-primary me-2";
        btnEdit.innerHTML = '<i class="bi bi-pencil"></i> Edit';
        btnEdit.onclick = () => openEditProductModal(product.id);
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-sm btn-outline-danger";
        btnDelete.innerHTML = '<i class="bi bi-trash"></i> Hapus';
        btnDelete.onclick = () => deleteProduct(product.id);
        actionTd.appendChild(btnEdit);
        actionTd.appendChild(btnDelete);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

// Fungsi membuka modal tambah/edit produk
function openEditProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.nama;
    document.getElementById("product-description").value = product.deskripsi;
    document.getElementById("product-sku").value = product.sku;
    document.getElementById("product-price").value = product.harga_jual;
    document.getElementById("product-cost").value = product.harga_pokok;
    document.getElementById("product-stock").value = product.stok;
    document.getElementById("product-category").value = product.kategori;
    document.getElementById("product-brand").value = product.merek;
    document.getElementById("product-image").value = product.gambar;
    const productModal = new bootstrap.Modal(document.getElementById("productModal"));
    productModal.show();
}

// Fungsi menghapus produk
function deleteProduct(productId) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    products = products.filter(p => p.id !== productId);
    renderProducts();
}

// Fungsi menambah atau mengedit produk dari form
function saveProduct(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById("product-id").value);
    const nama = document.getElementById("product-name").value.trim();
    const deskripsi = document.getElementById("product-description").value.trim();
    const sku = document.getElementById("product-sku").value.trim();
    const harga_jual = parseFloat(document.getElementById("product-price").value);
    const harga_pokok = parseFloat(document.getElementById("product-cost").value);
    const stok = parseInt(document.getElementById("product-stock").value);
    const kategori = document.getElementById("product-category").value;
    const merek = document.getElementById("product-brand").value;
    const gambar = document.getElementById("product-image").value.trim();

    if (!nama || !sku || isNaN(harga_jual) || isNaN(harga_pokok) || isNaN(stok) || !kategori || !merek) {
        alert("Mohon isi semua field yang wajib dengan benar.");
        return;
    }

    if (id) {
        // Edit produk
        const product = products.find(p => p.id === id);
        if (product) {
            product.nama = nama;
            product.deskripsi = deskripsi;
            product.sku = sku;
            product.harga_jual = harga_jual;
            product.harga_pokok = harga_pokok;
            product.stok = stok;
            product.kategori = kategori;
            product.merek = merek;
            product.gambar = gambar;
        }
    } else {
        // Tambah produk baru
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            nama,
            deskripsi,
            sku,
            harga_jual,
            harga_pokok,
            stok,
            kategori,
            merek,
            gambar
        });
    }

    renderProducts();
    const productModal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
    productModal.hide();
    document.getElementById("product-form").reset();
}

// Fungsi menampilkan data inventaris di halaman manage-inventory.html
function renderInventory() {
    const tbody = document.querySelector("#inventory-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    products.forEach(product => {
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = product.nama;
        tr.appendChild(nameTd);

        const skuTd = document.createElement("td");
        skuTd.textContent = product.sku;
        tr.appendChild(skuTd);

        const stockTd = document.createElement("td");
        stockTd.textContent = product.stok;
        if (product.stok <= 5) {
            stockTd.classList.add("text-danger", "fw-bold");
        }
        tr.appendChild(stockTd);

        tbody.appendChild(tr);
    });
}

// Fungsi membuka modal penyesuaian stok
function openStockModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    document.getElementById("stock-product-id").value = product.id;
    document.getElementById("stock-quantity").value = product.stok;
    const stockModal = new bootstrap.Modal(document.getElementById("stockModal"));
    stockModal.show();
}

// Fungsi menyimpan penyesuaian stok
function saveStock(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById("stock-product-id").value);
    const newStock = parseInt(document.getElementById("stock-quantity").value);
    if (isNaN(newStock) || newStock < 0) {
        alert("Jumlah stok tidak valid.");
        return;
    }
    const product = products.find(p => p.id === id);
    if (product) {
        product.stok = newStock;
    }
    renderInventory();
    const stockModal = bootstrap.Modal.getInstance(document.getElementById("stockModal"));
    stockModal.hide();
}

// Fungsi menampilkan laporan di halaman reports.html
function renderReport(dateFilter) {
    const tbody = document.querySelector("#report-table tbody");
    const totalSalesEl = document.getElementById("total-sales");
    if (!tbody || !totalSalesEl) return;

    let filteredTransactions = transactions;
    if (dateFilter) {
        filteredTransactions = transactions.filter(t => t.date === dateFilter);
    }

    // Hitung total penjualan dan jumlah per produk
    let salesByProduct = {};
    let totalSales = 0;
    filteredTransactions.forEach(t => {
        if (!salesByProduct[t.productId]) {
            salesByProduct[t.productId] = { quantity: 0, total: 0 };
        }
        salesByProduct[t.productId].quantity += t.quantity;
        salesByProduct[t.productId].total += t.total;
        totalSales += t.total;
    });

    tbody.innerHTML = "";
    for (const productId in salesByProduct) {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) continue;
        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = product.nama;
        tr.appendChild(nameTd);

        const qtyTd = document.createElement("td");
        qtyTd.textContent = salesByProduct[productId].quantity;
        tr.appendChild(qtyTd);

        const totalTd = document.createElement("td");
        totalTd.textContent = "Rp " + salesByProduct[productId].total.toLocaleString("id-ID");
        tr.appendChild(totalTd);

        tbody.appendChild(tr);
    }

    totalSalesEl.textContent = "Rp " + totalSales.toLocaleString("id-ID");
}

function filterProducts(query) {
    query = query.trim().toLowerCase();
    if (!query) return [];

    return products.filter(product => {
        return product.nama.toLowerCase().includes(query) ||
            product.deskripsi.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.kategori.toLowerCase().includes(query) ||
            product.merek.toLowerCase().includes(query);
    });
}

function renderSearchResults(results) {
    const container = document.getElementById("search-results");
    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = '<div class="list-group-item">Tidak ada produk ditemukan.</div>';
        return;
    }

    results.forEach(product => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "list-group-item list-group-item-action";
        item.textContent = product.nama + " - Rp " + product.harga_jual.toLocaleString("id-ID");
        item.onclick = () => {
            addToCart(product.id);
            container.innerHTML = "";
            document.getElementById("product-search").value = "";
        };
        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("product-form");
    if (productForm) {
        productForm.addEventListener("submit", saveProduct);
        renderProducts();
    }

    const stockForm = document.getElementById("stock-form");
    if (stockForm) {
        stockForm.addEventListener("submit", saveStock);
        renderInventory();
    }

    const reportForm = document.getElementById("report-form");
    if (reportForm) {
        reportForm.addEventListener("submit", e => {
            e.preventDefault();
            const date = document.getElementById("report-date").value;
            renderReport(date);
        });
        renderReport();
    }

    // Index page cart rendering and payment
    if (document.querySelector("#cart-table")) {
        renderCart();

        // Payment method buttons
        const payCashBtn = document.getElementById("pay-cash");
        const payCardBtn = document.getElementById("pay-card");
        const payQrisBtn = document.getElementById("pay-qris");
        const payOnlineBtn = document.getElementById("pay-online");
        const cashPaymentArea = document.getElementById("cash-payment-area");
        const cashAmountInput = document.getElementById("cash-amount");
        const changeAmountDisplay = document.getElementById("change-amount");
        let selectedPaymentMethod = null;

        function resetPaymentButtons() {
            [payCashBtn, payCardBtn, payQrisBtn, payOnlineBtn].forEach(btn => btn.classList.remove("active"));
            cashPaymentArea.classList.add("d-none");
            cashAmountInput.value = "";
            changeAmountDisplay.textContent = "Rp 0";
        }

        payCashBtn.addEventListener("click", () => {
            resetPaymentButtons();
            payCashBtn.classList.add("active");
            cashPaymentArea.classList.remove("d-none");
            selectedPaymentMethod = "tunai";
        });
        payCardBtn.addEventListener("click", () => {
            resetPaymentButtons();
            payCardBtn.classList.add("active");
            selectedPaymentMethod = "kartu";
        });
        payQrisBtn.addEventListener("click", () => {
            resetPaymentButtons();
            payQrisBtn.classList.add("active");
            selectedPaymentMethod = "qris";
        });
        payOnlineBtn.addEventListener("click", () => {
            resetPaymentButtons();
            payOnlineBtn.classList.add("active");
            selectedPaymentMethod = "online";
        });

        cashAmountInput.addEventListener("input", () => {
            const cash = parseFloat(cashAmountInput.value);
            const total = calculateTotal();
            if (!isNaN(cash) && cash >= total) {
                changeAmountDisplay.textContent = "Rp " + (cash - total).toLocaleString("id-ID");
            } else {
                changeAmountDisplay.textContent = "Rp 0";
            }
        });

        document.getElementById("pay-button").addEventListener("click", () => {
            if (!selectedPaymentMethod) {
                alert("Pilih metode pembayaran terlebih dahulu.");
                return;
            }
            if (selectedPaymentMethod === "tunai") {
                const cash = parseFloat(cashAmountInput.value);
                const total = calculateTotal();
                if (isNaN(cash) || cash < total) {
                    alert("Jumlah uang tunai tidak cukup.");
                    return;
                }
            }
            processPayment();
            resetPaymentButtons();
        });

        // Add search input event listener
        const searchInput = document.getElementById("product-search");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const query = searchInput.value;
                const results = filterProducts(query);
                renderSearchResults(results);
            });
        }
    }

const barcodeScanBtn = document.getElementById("barcode-scan-btn");
const cameraModal = new bootstrap.Modal(document.getElementById("cameraModal"));
const cameraStream = document.getElementById("camera-stream");
const cameraCloseBtn = document.getElementById("camera-close-btn");
let scanning = false;
let scanTimeout = null;

function onBarcodeDetected(code) {
    if (!scanning) return;
    scanning = false;
    clearTimeout(scanTimeout);
    stopBarcodeScanner();
    cameraModal.hide();

    // On Kasir page (index.html), fill search input and add product to cart by SKU/barcode
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        const searchInput = document.getElementById("product-search");
        if (searchInput) {
            searchInput.value = code;
            const product = products.find(p => p.sku === code);
            if (product) {
                addToCart(product.id);
                alert(`Produk "${product.nama}" berhasil ditambahkan ke keranjang.`);
            } else {
                alert(`Produk dengan SKU/barcode "${code}" tidak ditemukan.`);
            }
        }
    }

    // On manage-products.html, fill SKU field in product form
    if (window.location.pathname.endsWith("manage-products.html")) {
        const skuInput = document.getElementById("product-sku");
        if (skuInput) {
            skuInput.value = code;
            alert(`SKU diisi dengan barcode: ${code}`);
        }
    }
}

async function startCamera() {
    cameraModal.show();
    scanning = true;
    startBarcodeScanner(onBarcodeDetected);

    // Set timeout for scan failure notification (e.g., 10 seconds)
    scanTimeout = setTimeout(() => {
        if (scanning) {
            scanning = false;
            stopBarcodeScanner();
            cameraModal.hide();
            alert("Kode batang tidak terdeteksi");
        }
    }, 10000);
}

function stopCamera() {
    scanning = false;
    clearTimeout(scanTimeout);
    stopBarcodeScanner();
    cameraModal.hide();
}

if (barcodeScanBtn) {
    barcodeScanBtn.addEventListener("click", () => {
        startCamera();
    });
}

if (cameraCloseBtn) {
    cameraCloseBtn.addEventListener("click", () => {
        stopCamera();
    });
}

// Stop camera when modal is hidden by other means (e.g. backdrop click)
document.getElementById("cameraModal").addEventListener("hidden.bs.modal", () => {
    stopCamera();
});
});
