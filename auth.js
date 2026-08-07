/* LOGIKA LOGIN & ROLE SWITCH */
function switchLoginRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value.trim();

  if (selectedRole === 'admin') {
    if (u === 'GSTORE' && p === 'GS01') {
      currentUser = { role: 'admin', name: 'Sabine Rylee' };
      completeLogin('admin-dashboard-page', "Selamat datang Admin!");
    } else {
      showToast("Username/Password Admin Salah! (Petunjuk: GSTORE / GS01)");
    }
  } else {
    if (u === 'evaline' && p === 'ev01') {
      currentUser = { role: 'customer', name: 'Evaline' };
      completeLogin('customer-home', "Berhasil masuk!");
    } else {
      showToast("Username/Password Pelanggan Salah! (Petunjuk: evaline / ev01)");
    }
  }
}

function completeLogin(targetPage, message) {
  const loginEl = document.getElementById('login-page');
  loginEl.classList.remove('active');
  loginEl.style.display = 'none';

  historyStack = [];
  setupLayoutForUser();
  showToast(message);
  navigateTo(targetPage);
}

function handleLogout() {
  currentUser = null;
  document.getElementById('main-header').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
  
  const loginEl = document.getElementById('login-page');
  loginEl.style.display = 'flex';
  loginEl.classList.add('active');
  
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';

  document.querySelectorAll('.page:not(#login-page)').forEach(p => p.classList.remove('active'));
  historyStack = [];
  showToast("Anda telah keluar dari akun");
}

function setupLayoutForUser() {
  document.getElementById('main-header').style.display = 'flex';
  const nav = document.getElementById('main-nav');
  nav.style.display = 'flex';
  const cartBtn = document.getElementById('header-actions');

  if (currentUser.role === 'customer') {
    cartBtn.style.display = 'block';
    nav.innerHTML = `
      <button class="nav-item" onclick="navigateTo('customer-home')"><i class="fa-solid fa-store"></i>Marketplace</button>
      <button class="nav-item" onclick="navigateTo('customer-orders-page')"><i class="fa-solid fa-receipt"></i>Pesanan Saya</button>
      <button class="nav-item" onclick="navigateTo('customer-profile-page')"><i class="fa-solid fa-user"></i>Profil</button>
    `;
  } else {
    cartBtn.style.display = 'none';
    nav.innerHTML = `
      <button class="nav-item" onclick="navigateTo('admin-dashboard-page')"><i class="fa-solid fa-chart-pie"></i>Dashboard</button>
      <button class="nav-item" onclick="resetForm(); navigateTo('admin-input-page')"><i class="fa-solid fa-plus-circle"></i>Input</button>
      <button class="nav-item" onclick="navigateTo('admin-products-page')"><i class="fa-solid fa-boxes-stacked"></i>Produk</button>
      <button class="nav-item" onclick="navigateTo('admin-reports-page')"><i class="fa-solid fa-file-invoice"></i>Laporan</button>
      <button class="nav-item" onclick="navigateTo('admin-profile-page')"><i class="fa-solid fa-user-gear"></i>Profil Admin</button>
    `;
  }
}
