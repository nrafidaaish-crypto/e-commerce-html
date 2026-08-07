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

function switchReportTab(type, element) {
  if (element) {
    const container = element.parentElement;
    container.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  const periodeText = document.getElementById('report-periode-text');
  const titleEl = document.getElementById('report-title');
  const countEl = document.getElementById('report-count');
  const itemsSoldEl = document.getElementById('report-items-sold');
  const grossEl = document.getElementById('report-gross');
  const feeEl = document.getElementById('report-fee');
  const revenueEl = document.getElementById('report-revenue');
  const listEl = document.getElementById('report-transaction-list');

  let activeOrders = [];

  if (type === 'harian') {
    periodeText.innerText = "Periode Laporan: Hari Ini (07 Ags 2026)";
    titleEl.innerText = "Ringkasan Laporan Harian";
    activeOrders = orders.filter(o => o.category === 'harian' || o.date === '07 Ags 2026');
    if (activeOrders.length === 0) activeOrders = orders.slice(0, 2);
  } else if (type === 'bulanan') {
    periodeText.innerText = "Periode Laporan: Bulan Ini (Agustus 2026)";
    titleEl.innerText = "Ringkasan Laporan Bulanan";
    activeOrders = orders.slice(0, 4);
  } else if (type === 'tahunan') {
    periodeText.innerText = "Periode Laporan: Tahun Ini (Tahun 2026)";
    titleEl.innerText = "Ringkasan Laporan Tahunan";
    activeOrders = orders;
  }

  // Hitung Angka Laporan
  let totalCount = activeOrders.length;
  let totalItems = 0;
  let totalGross = 0;

  activeOrders.forEach(o => {
    totalGross += o.total;
    if (o.items) {
      o.items.forEach(i => totalItems += i.qty);
    }
  });

  const adminFee = Math.round(totalGross * 0.03); // Biaya Admin 3%
  const netRevenue = totalGross - adminFee; // Pendapatan Bersih

  countEl.innerText = `${totalCount} Pesanan`;
  itemsSoldEl.innerText = `${totalItems} Pcs`;
  grossEl.innerText = `Rp ${totalGross.toLocaleString('id-ID')}`;
  feeEl.innerText = `- Rp ${adminFee.toLocaleString('id-ID')}`;
  revenueEl.innerText = `Rp ${netRevenue.toLocaleString('id-ID')}`;

  // Tampilkan Rincian Transaksi
  listEl.innerHTML = activeOrders.map(o => {
    const itemNames = o.items ? o.items.map(i => `${i.product.name} (x${i.qty})`).join(', ') : 'Produk Tas';
    const itemFee = Math.round(o.total * 0.03);
    const itemNet = o.total - itemFee;

    return `
      <div style="background:var(--surface); padding:12px; border-radius:var(--radius); margin-bottom:10px; font-size:12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <div class="flex-between" style="border-bottom:1px dashed var(--border); padding-bottom:6px; margin-bottom:6px;">
          <strong style="color:var(--primary);">${o.id}</strong>
          <span style="color:var(--text-muted); font-size:11px;">${o.date}</span>
        </div>
        <div style="font-weight:600; margin-bottom:2px;">Pembeli: ${o.customer}</div>
        <div style="color:var(--text-muted); font-size:11px; margin-bottom:6px;">${itemNames}</div>
        <div class="flex-between" style="font-size:11px; background:#FAF6F8; padding:6px 8px; border-radius:6px;">
          <span>Omset: <strong>Rp ${o.total.toLocaleString('id-ID')}</strong></span>
          <span style="color:#27ae60;">Bersih: <strong>Rp ${itemNet.toLocaleString('id-ID')}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}
