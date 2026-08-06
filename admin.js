/* LOGIKA ADMIN & MANAJEMEN TOKO */
function renderAdminDashboard() {
  document.getElementById('stat-products').innerText = products.length;
  document.getElementById('stat-orders').innerText = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById('stat-sales').innerText = `Rp ${totalSales.toLocaleString('id-ID')}`;

  const recentContainer = document.getElementById('admin-dashboard-recent-orders');
  if (orders.length === 0) {
    recentContainer.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Belum ada pesanan masuk.</p>`;
    return;
  }

  recentContainer.innerHTML = orders.map(order => `
    <div class="order-card" style="flex-direction:column;">
      <div class="flex-between" style="font-size:12px; font-weight:600;">
        <span>Pembeli: ${order.customer}</span>
        <span style="color:var(--primary);">${order.id}</span>
      </div>
      <div style="font-size:11px; color:var(--text-muted); margin:4px 0;">
        ${order.items.map(i => `${i.product.name} (${i.color}) x${i.qty}`).join(', ')}
      </div>
      <div class="flex-between" style="font-size:12px;">
        <span>Total: Rp ${order.total.toLocaleString('id-ID')}</span>
        <span class="badge-store">${order.status}</span>
      </div>
    </div>
  `).join('');
}

function resetForm() {
  document.getElementById('product-form').reset();
  document.getElementById('input-prod-id').value = '';
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('input-prod-id').value;
  const name = document.getElementById('input-prod-name').value;
  const colors = document.getElementById('input-prod-colors').value.split(',').map(c=>c.trim());
  const price = parseInt(document.getElementById('input-prod-price').value);
  const stock = parseInt(document.getElementById('input-prod-stock').value);
  const img = document.getElementById('input-prod-img').value;
  const desc = document.getElementById('input-prod-desc').value;

  if (id) {
    const prod = products.find(p => p.id == id);
    if (prod) {
      Object.assign(prod, { name, colors, price, stock, img, desc });
      showToast("Produk berhasil diperbarui!");
    }
  } else {
    const newProd = {
      id: Date.now(),
      name, colors, price, stock, img, desc,
      rating: 5.0,
      sold: 0,
      reviews: []
    };
    products.unshift(newProd);
    showToast("Produk baru berhasil ditambahkan!");
  }

  resetForm();
  navigateTo('admin-products-page');
}

function editProduct(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;

  document.getElementById('input-prod-id').value = prod.id;
  document.getElementById('input-prod-name').value = prod.name;
  document.getElementById('input-prod-colors').value = prod.colors.join(', ');
  document.getElementById('input-prod-price').value = prod.price;
  document.getElementById('input-prod-stock').value = prod.stock;
  document.getElementById('input-prod-img').value = prod.img;
  document.getElementById('input-prod-desc').value = prod.desc;

  navigateTo('admin-input-page');
}

function deleteProduct(id) {
  if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
    products = products.filter(p => p.id !== id);
    renderAdminProducts();
    showToast("Produk berhasil dihapus!");
  }
}

function renderAdminProducts() {
  const container = document.getElementById('admin-product-list');
  container.innerHTML = products.map(p => `
    <div class="cart-item">
      <img src="${p.img}" class="cart-img" alt="${p.name}">
      <div class="cart-details">
        <div style="font-weight:600; font-size:13px;">${p.name}</div>
        <div style="font-size:11px; color:var(--text-muted);">Stok: ${p.stock}</div>
        <div style="font-weight:700; color:var(--primary); font-size:13px; margin-top:2px;">Rp ${p.price.toLocaleString('id-ID')}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button onclick="editProduct(${p.id})" class="btn btn-secondary" style="padding:4px 8px; font-size:11px;"><i class="fa-solid fa-pen"></i> Edit</button>
          <button onclick="deleteProduct(${p.id})" class="btn btn-outline" style="padding:4px 8px; font-size:11px; border-color:#FF3B30; color:#FF3B30;"><i class="fa-solid fa-trash"></i> Hapus</button>
        </div>
      </div>
    </div>
  `).join('');
}

function switchReportTab(type) {
  const titleEl = document.getElementById('report-title');
  const countEl = document.getElementById('report-count');
  const revenueEl = document.getElementById('report-revenue');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  titleEl.innerText = `Laporan Penjualan ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  countEl.innerText = orders.length;
  revenueEl.innerText = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
}
