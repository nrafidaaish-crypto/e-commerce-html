/* RENDERING & INTERAKSI PELANGGAN */
function renderCustomerProducts() {
  const grid = document.getElementById('customer-product-list');
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProductDetail(${p.id})">
      <img src="${p.img}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <span class="badge-store">Girl's Store</span>
        <div class="product-title">${p.name}</div>
        <div class="product-price">Rp ${p.price.toLocaleString('id-ID')}</div>
        <div class="product-meta">
          <span><i class="fa-solid fa-star" style="color:#FFB800;"></i> ${p.rating}</span>
          <span>${p.sold} Terjual</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openProductDetail(id) {
  selectedDetailProduct = products.find(p => p.id === id);
  selectedColor = selectedDetailProduct.colors[0];
  selectedQuantity = 1;

  const initialImg = selectedDetailProduct.colorMap?.[selectedColor] || selectedDetailProduct.img;

  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <img src="${initialImg}" id="main-detail-img" class="detail-img" alt="${selectedDetailProduct.name}">
    <div class="detail-container">
      <span class="badge-store">Girl's Store • Jakarta Selatan</span>
      <h2 style="font-size:16px; margin:4px 0 8px;">${selectedDetailProduct.name}</h2>
      <div style="font-size:20px; font-weight:700; color:var(--primary); margin-bottom:4px;">
        Rp ${selectedDetailProduct.price.toLocaleString('id-ID')}
      </div>
      <div style="font-size:11px; color:var(--text-muted); margin-bottom:16px;">
        <span>Stok: ${selectedDetailProduct.stock}</span> | 
        <span><i class="fa-solid fa-truck-fast" style="color: #27ae60;"></i> Pengiriman 2-3 Hari</span>
      </div>

      <hr style="border:none; border-top:1px solid var(--border); margin:12px 0;">

      <h4 style="font-size:13px; margin-bottom:6px;">Deskripsi Lengkap Produk</h4>
      <p style="font-size:12px; color:#555; line-height:1.6; margin-bottom:20px; white-space: pre-line;">${selectedDetailProduct.desc}</p>

      <hr style="border:none; border-top:1px solid var(--border); margin:12px 0;">

      <div class="flex-between" style="margin-bottom:10px;">
        <h4 style="font-size:14px; font-weight:700;">
          ${selectedDetailProduct.rating} <i class="fa-solid fa-star" style="color:#FFB800;"></i> Penilaian Produk (${selectedDetailProduct.reviews ? selectedDetailProduct.reviews.length : 0})
        </h4>
      </div>

      <div id="reviews-list">
        ${renderReviews(selectedDetailProduct.reviews)}
      </div>

      <div style="display:flex; gap:10px; margin-top:24px;">
        <button class="btn btn-outline" onclick="openVariantSheetForCart()"><i class="fa-solid fa-cart-plus"></i> + Keranjang</button>
        <button class="btn btn-primary" onclick="openVariantSheetForBuy()">Beli Sekarang</button>
      </div>
    </div>
  `;
  navigateTo('product-detail-page');
}

function renderReviews(reviews) {
  if (!reviews || reviews.length === 0) {
    return `<p style="font-size:12px; color:var(--text-muted);">Belum ada ulasan untuk produk ini.</p>`;
  }
  return reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <span class="review-user">${r.name}</span>
        <span class="review-date">${r.date}</span>
      </div>
      <div style="color:#FFB800; font-size:10px; margin-bottom:2px;">
        ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
      </div>
      <div class="review-variant">${r.variant || 'Variasi: Standard'}</div>
      <p class="review-comment">${r.comment}</p>
    </div>
  `).join('');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-badge-count').innerText = totalQty;
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding:40px 0; color:var(--text-muted);">
        <i class="fa-solid fa-basket-shopping" style="font-size:48px; color:var(--secondary); margin-bottom:12px;"></i>
        <p>Keranjang belanjaanmu kosong</p>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.product.price * item.qty;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.selectedImg || item.product.img}" class="cart-img" alt="${item.product.name}">
        <div class="cart-details">
          <div style="font-weight:600; font-size:13px;">${item.product.name}</div>
          <div style="font-size:11px; color:var(--text-muted);">Warna: <strong>${item.color}</strong></div>
          <div style="font-weight:700; color:var(--primary); font-size:13px; margin-top:2px;">Rp ${item.product.price.toLocaleString('id-ID')}</div>
          <div class="flex-between" style="margin-top:6px;">
            <span style="font-size:12px;">Jumlah: <strong>${item.qty}</strong></span>
            <div style="display:flex; gap:6px;">
              <button onclick="openVariantSheetFromCart(${index})" class="btn btn-secondary" style="padding:4px 8px; font-size:10px;"><i class="fa-solid fa-pen"></i> Ubah Opsi</button>
              <button onclick="removeFromCart(${index})" style="border:none; background:none; color:#FF3B30; font-size:11px; cursor:pointer;"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('cart-total-price').innerText = `Rp ${total.toLocaleString('id-ID')}`;
  footer.style.display = 'block';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCart();
  showToast("Produk dihapus dari keranjang");
}

function renderCheckout() {
  const container = document.getElementById('checkout-items');
  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const itemTotal = item.product.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.selectedImg || item.product.img}" class="cart-img" alt="${item.product.name}">
        <div class="cart-details">
          <div style="font-weight:600; font-size:13px;">${item.product.name}</div>
          <div style="font-size:11px; color:var(--text-muted);">Warna Terpilih: <strong>${item.color}</strong></div>
          <div class="flex-between" style="margin-top:6px;">
            <span style="font-weight:700; color:var(--primary); font-size:12px;">Rp ${item.product.price.toLocaleString('id-ID')}</span>
            <span style="font-size:12px;">x${item.qty}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const shipping = 15000;
  const total = subtotal + shipping;

  document.getElementById('checkout-subtotal').innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
  document.getElementById('checkout-total').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

/* POP-UP MODAL VARIASI WARNA & QUANTITY */
function openVariantSheetForCart() {
  sheetTargetIndex = null;
  sheetActionMode = 'add_to_cart';
  openSheetGeneric(selectedDetailProduct, selectedColor, selectedQuantity, "Masukkan ke Keranjang");
}

function openVariantSheetForBuy() {
  sheetTargetIndex = null;
  sheetActionMode = 'buy_now';
  openSheetGeneric(selectedDetailProduct, selectedColor, selectedQuantity, "Lanjut ke Checkout");
}

function openVariantSheetFromCart(index) {
  sheetTargetIndex = index;
  sheetActionMode = 'edit_cart';
  const item = cart[index];
  openSheetGeneric(item.product, item.color, item.qty, "Simpan Perubahan");
}

function openSheetGeneric(productObj, currentColor, currentQty, buttonLabel) {
  selectedDetailProduct = productObj;
  selectedColor = currentColor || productObj.colors[0];
  selectedQuantity = currentQty || 1;

  document.getElementById('sheet-prod-img').src = selectedDetailProduct.colorMap?.[selectedColor] || selectedDetailProduct.img;
  document.getElementById('sheet-prod-price').innerText = `Rp ${selectedDetailProduct.price.toLocaleString('id-ID')}`;
  document.getElementById('sheet-prod-stock').innerText = `Stok: ${selectedDetailProduct.stock}`;
  document.getElementById('sheet-qty-val').innerText = selectedQuantity;
  document.getElementById('sheet-action-btn').innerText = buttonLabel;

  const optsContainer = document.getElementById('sheet-variant-options');
  optsContainer.innerHTML = selectedDetailProduct.colors.map((c, i) => {
    const thumbImg = selectedDetailProduct.colorMap?.[c] || selectedDetailProduct.img;
    const isActive = c === selectedColor ? 'active' : '';
    const isHot = i === 0 ? '<span style="color:var(--primary); margin-left:2px;">🔥</span>' : '';
    return `
      <div class="variant-card-btn ${isActive}" onclick="selectSheetColor('${c}', this, '${thumbImg}')">
        <img src="${thumbImg}" alt="${c}">
        <span>${c.toUpperCase()}</span> ${isHot}
      </div>
    `;
  }).join('');

  document.getElementById('variant-sheet-modal').classList.add('active');
}

function closeVariantSheet() {
  document.getElementById('variant-sheet-modal').classList.remove('active');
}

function selectSheetColor(color, el, imgUrl) {
  selectedColor = color;
  document.querySelectorAll('#sheet-variant-options .variant-card-btn').forEach(btn => btn.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sheet-prod-img').src = imgUrl;
}

function updateSheetQty(change) {
  selectedQuantity += change;
  if (selectedQuantity < 1) selectedQuantity = 1;
  if (selectedQuantity > selectedDetailProduct.stock) selectedQuantity = selectedDetailProduct.stock;
  document.getElementById('sheet-qty-val').innerText = selectedQuantity;
}

function confirmSheetAction() {
  const activeImg = selectedDetailProduct.colorMap?.[selectedColor] || selectedDetailProduct.img;

  if (sheetActionMode === 'add_to_cart') {
    const existing = cart.find(item => item.product.id === selectedDetailProduct.id && item.color === selectedColor);
    if (existing) {
      existing.qty += selectedQuantity;
    } else {
      cart.push({
        product: selectedDetailProduct,
        color: selectedColor,
        selectedImg: activeImg,
        qty: selectedQuantity
      });
    }
    updateCartBadge();
    showToast("Produk berhasil ditambahkan ke keranjang!");
  } 
  else if (sheetActionMode === 'buy_now') {
    cart = [{
      product: selectedDetailProduct,
      color: selectedColor,
      selectedImg: activeImg,
      qty: selectedQuantity
    }];
    updateCartBadge();
    navigateTo('checkout-page');
  } 
  else if (sheetActionMode === 'edit_cart' && sheetTargetIndex !== null) {
    cart[sheetTargetIndex].color = selectedColor;
    cart[sheetTargetIndex].selectedImg = activeImg;
    cart[sheetTargetIndex].qty = selectedQuantity;
    renderCart();
    updateCartBadge();
    showToast("Rincian keranjang diperbarui!");
  }

  closeVariantSheet();
}

function processOrder() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const total = subtotal + 15000;

  const newOrder = {
    id: 'GS-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    customer: currentUser.name,
    items: [...cart],
    total: total,
    payment: document.getElementById('payment-method').value,
    status: 'Diproses'
  };

  orders.unshift(newOrder);
  cart = [];
  updateCartBadge();
  showToast("Pesanan Berhasil Dibuat!");
  navigateTo('customer-orders-page');
}

function renderCustomerOrders() {
  const container = document.getElementById('customer-order-list');
  if (orders.length === 0) {
    container.innerHTML = `<p class="text-center" style="color:var(--text-muted); padding:30px;">Belum ada riwayat pesanan.</p>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card" style="flex-direction:column;">
      <div class="flex-between" style="border-bottom:1px solid var(--border); padding-bottom:6px; font-size:12px;">
        <strong>${order.id}</strong>
        <span style="color:var(--primary); font-weight:600;">${order.status}</span>
      </div>
      ${order.items.map(i => `
        <div style="font-size:12px; margin:4px 0;">
          • ${i.product.name} (${i.color}) x${i.qty}
        </div>
      `).join('')}
      <div class="flex-between" style="border-top:1px dashed var(--border); padding-top:6px; margin-top:6px; font-size:12px;">
        <span>Total Pembayaran:</span>
        <strong style="color:var(--primary);">Rp ${order.total.toLocaleString('id-ID')}</strong>
      </div>
    </div>
  `).join('');
}
