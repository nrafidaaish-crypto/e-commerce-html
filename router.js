/* ROUTING DAN PERPINDAHAN HALAMAN */
function navigateTo(pageId, pushToHistory = true) {
  if (pushToHistory && historyStack[historyStack.length - 1] !== pageId) {
    historyStack.push(pageId);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const activePage = document.getElementById(pageId);
  if (activePage) activePage.classList.add('active');

  const pageTitleEl = document.getElementById('page-title');
  const backBtn = document.getElementById('back-btn');

  if (historyStack.length > 1 && pageId !== 'customer-home' && pageId !== 'admin-dashboard-page') {
    backBtn.style.display = 'block';
  } else {
    backBtn.style.display = 'none';
  }

  switch(pageId) {
    case 'customer-home':
      pageTitleEl.innerText = "Girl's Store";
      renderCustomerProducts();
      break;
    case 'product-detail-page':
      pageTitleEl.innerText = "Detail Produk";
      break;
    case 'cart-page':
      pageTitleEl.innerText = "Keranjang Belanja";
      renderCart();
      break;
    case 'checkout-page':
      pageTitleEl.innerText = "Checkout Pesanan";
      renderCheckout();
      break;
    case 'customer-orders-page':
      pageTitleEl.innerText = "Riwayat Pesanan Saya";
      renderCustomerOrders();
      break;
    case 'customer-profile-page':
      pageTitleEl.innerText = "Profil Pelanggan";
      break;
    case 'admin-dashboard-page':
      pageTitleEl.innerText = "Admin Dashboard";
      renderAdminDashboard();
      break;
    case 'admin-input-page':
      pageTitleEl.innerText = document.getElementById('input-prod-id').value ? "Edit Produk" : "Input Produk";
      break;
    case 'admin-products-page':
      pageTitleEl.innerText = "Kelola Produk";
      renderAdminProducts();
      break;
    case 'admin-reports-page':
      pageTitleEl.innerText = "Laporan Penjualan";
      switchReportTab('harian');
      break;
    case 'admin-profile-page':
      pageTitleEl.innerText = "Profil Admin & Store Manager";
      break;
  }

  updateNavActiveState(pageId);
  window.scrollTo(0,0);
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prevPage = historyStack[historyStack.length - 1];
    navigateTo(prevPage, false);
  }
}

function updateNavActiveState(pageId) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const navs = document.querySelectorAll('.nav-item');
  if (currentUser?.role === 'customer') {
    if (pageId === 'customer-home') navs[0]?.classList.add('active');
    if (pageId === 'customer-orders-page') navs[1]?.classList.add('active');
    if (pageId === 'customer-profile-page') navs[2]?.classList.add('active');
  } else if (currentUser?.role === 'admin') {
    if (pageId === 'admin-dashboard-page') navs[0]?.classList.add('active');
    if (pageId === 'admin-input-page') navs[1]?.classList.add('active');
    if (pageId === 'admin-products-page') navs[2]?.classList.add('active');
    if (pageId === 'admin-reports-page') navs[3]?.classList.add('active');
    if (pageId === 'admin-profile-page') navs[4]?.classList.add('active');
  }
}
