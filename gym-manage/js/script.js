/**
 * TITAN GYM MANAGEMENT SYSTEM - PURE JAVASCRIPT APPLICATION ENGINE
 * LocalStorage Driven Interactive Frontend Platform
 */

// --- Default Mock Data Seeding ---
const DEFAULT_PACKAGES = [
  {
    id: "pkg_1",
    title: "Starter Fitness",
    category: "Beginner",
    priceMonthly: 29,
    priceYearly: 290,
    duration: "1 Month",
    features: [
      "Access to Gym Floor & Cardio Zone",
      "Locker Room & Shower Access",
      "Free Fitness Orientation",
      "1 Group Workout Session / Month",
      "Mobile App Tracking"
    ],
    featured: false
  },
  {
    id: "pkg_2",
    title: "Strength Beast",
    category: "Intermediate",
    priceMonthly: 59,
    priceYearly: 590,
    duration: "3 Months",
    features: [
      "Full Gym & Heavy Weight Zone Access",
      "Unlimited Group Fitness Classes",
      "Customized Workout Plan",
      "Personalized BMI & Nutrition Guide",
      "Sauna & Spa Access"
    ],
    featured: true
  },
  {
    id: "pkg_3",
    title: "Elite Titan VIP",
    category: "Advanced",
    priceMonthly: 99,
    priceYearly: 990,
    duration: "1 Year",
    features: [
      "24/7 Unlimited All-Access Pass",
      "Dedicated Personal Trainer (4x/mo)",
      "VIP Sauna, Cold Plunge & Spa",
      "Free Protein Shake / Workout Visit",
      "Priority Class Reservations"
    ],
    featured: false
  }
];

const DEFAULT_SCHEDULE = [
  { time: "07:00 AM - 08:30 AM", title: "Morning Crossfit Slam", category: "hiit", trainer: "Alex Rivera", spot: "Zone A" },
  { time: "09:00 AM - 10:15 AM", title: "Vinyasa Flow Yoga", category: "yoga", trainer: "Elena Rostova", spot: "Studio 2" },
  { time: "11:00 AM - 12:30 PM", title: "Hypertrophy Chest & Arms", category: "strength", trainer: "Marcus Vance", spot: "Weight Arena" },
  { time: "05:00 PM - 06:15 PM", title: "Fat Burner Cardio Spin", category: "cardio", trainer: "Sarah Jenkins", spot: "Cycle Studio" },
  { time: "06:30 PM - 08:00 PM", title: "Powerlifting & Core", category: "strength", trainer: "Marcus Vance", spot: "Zone B" }
];

// --- Store Management ---
class GymStore {
  static getPackages() {
    const data = localStorage.getItem('gym_packages');
    return data ? JSON.parse(data) : DEFAULT_PACKAGES;
  }
  
  static savePackages(packages) {
    localStorage.setItem('gym_packages', JSON.stringify(packages));
  }

  static getBookings() {
    const data = localStorage.getItem('gym_bookings');
    return data ? JSON.parse(data) : [
      {
        id: "BK-8901",
        userName: "John Doe",
        userEmail: "john@test.com",
        packageTitle: "Strength Beast",
        price: "$59",
        bookingDate: "2026-08-15",
        status: "Confirmed"
      }
    ];
  }

  static saveBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem('gym_bookings', JSON.stringify(bookings));
  }

  static updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem('gym_bookings', JSON.stringify(bookings));
    }
  }

  static getCurrentUser() {
    const user = localStorage.getItem('gym_current_user');
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user) {
    localStorage.setItem('gym_current_user', JSON.stringify(user));
  }

  static clearCurrentUser() {
    localStorage.removeItem('gym_current_user');
  }
}

// --- Toast Notification Engine ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-triangle';

  toast.innerHTML = `
    <i class="fas ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- App State & DOM Handlers ---
let currentBillingCycle = 'monthly'; // 'monthly' | 'yearly'
let selectedPackageForBooking = null;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize default data if absent
  if (!localStorage.getItem('gym_packages')) {
    GymStore.savePackages(DEFAULT_PACKAGES);
  }

  initNavigation();
  renderPackages();
  renderSchedule('all');
  initBmiCalculator();
  initAuthSystem();
  initModals();
  renderUserDashboard();
  renderAdminPanel();
});

/* --- Navigation & Smooth Scroll --- */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* --- Render Pricing Packages --- */
function renderPackages() {
  const grid = document.getElementById('packages-grid');
  if (!grid) return;

  const packages = GymStore.getPackages();
  grid.innerHTML = packages.map(pkg => {
    const price = currentBillingCycle === 'monthly' ? `$${pkg.priceMonthly}` : `$${pkg.priceYearly}`;
    const period = currentBillingCycle === 'monthly' ? '/ month' : '/ year';
    
    return `
      <div class="package-card ${pkg.featured ? 'featured' : ''}">
        ${pkg.featured ? '<div class="featured-badge">MOST POPULAR</div>' : ''}
        <div>
          <div class="pkg-header">
            <div class="pkg-category">${pkg.category}</div>
            <h3 class="pkg-title">${pkg.title}</h3>
          </div>
          <div class="pkg-price-box">
            <span class="pkg-price">${price}</span>
            <span class="pkg-duration">${period}</span>
          </div>
          <ul class="pkg-features">
            ${pkg.features.map(f => `
              <li class="pkg-feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <button class="btn ${pkg.featured ? 'btn-primary' : 'btn-outline'}" onclick="openBookingModal('${pkg.id}')">
          Book Membership <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    `;
  }).join('');
}

// Toggle Billing Cycle
function setBillingCycle(cycle) {
  currentBillingCycle = cycle;
  document.getElementById('btn-monthly').classList.toggle('active', cycle === 'monthly');
  document.getElementById('btn-yearly').classList.toggle('active', cycle === 'yearly');
  renderPackages();
}

/* --- Schedule Filter --- */
function renderSchedule(filterCategory = 'all') {
  const grid = document.getElementById('schedule-grid');
  if (!grid) return;

  const filtered = filterCategory === 'all' 
    ? DEFAULT_SCHEDULE 
    : DEFAULT_SCHEDULE.filter(s => s.category === filterCategory);

  grid.innerHTML = filtered.map(item => `
    <div class="class-card">
      <div class="class-header">
        <span class="class-time"><i class="far fa-clock"></i> ${item.time}</span>
        <span style="text-transform: uppercase; font-size: 0.75rem; font-weight:700; color: var(--accent);">${item.category}</span>
      </div>
      <div class="class-body">
        <h4 class="class-title">${item.title}</h4>
        <p class="class-trainer"><i class="fas fa-user-ninja"></i> Trainer: <strong>${item.trainer}</strong></p>
        <div class="class-footer">
          <span style="color: var(--text-muted); font-size:0.85rem;"><i class="fas fa-map-marker-alt"></i> ${item.spot}</span>
          <button class="btn btn-sm btn-outline" onclick="showToast('Class session slot reserved!', 'success')">Reserve Seat</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterSchedule(category, btn) {
  document.querySelectorAll('.schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSchedule(category);
}

/* --- BMI Calculator Logic --- */
function initBmiCalculator() {
  const heightInput = document.getElementById('bmi-height');
  const weightInput = document.getElementById('bmi-weight');
  
  if (!heightInput || !weightInput) return;

  const calculate = () => {
    const h = parseFloat(heightInput.value) / 100;
    const w = parseFloat(weightInput.value);

    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      document.getElementById('bmi-score').textContent = bmi;

      const statusEl = document.getElementById('bmi-status');
      const tipEl = document.getElementById('bmi-tip');

      if (bmi < 18.5) {
        statusEl.textContent = 'Underweight';
        statusEl.className = 'bmi-status underweight';
        tipEl.textContent = 'Focus on nutrient-dense calorie surplus & high-protein hypertrophy workouts.';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        statusEl.textContent = 'Normal Healthy Weight';
        statusEl.className = 'bmi-status normal';
        tipEl.textContent = 'Great shape! Maintain strength training & cardiovascular endurance balance.';
      } else if (bmi >= 25 && bmi < 29.9) {
        statusEl.textContent = 'Overweight';
        statusEl.className = 'bmi-status overweight';
        tipEl.textContent = 'Combine HIIT cardio sessions with caloric deficit to optimize body fat ratio.';
      } else {
        statusEl.textContent = 'Obese Range';
        statusEl.className = 'bmi-status obese';
        tipEl.textContent = 'Consult our certified trainers for a structured low-impact fat loss regimen.';
      }
    }
  };

  heightInput.addEventListener('input', calculate);
  weightInput.addEventListener('input', calculate);
  calculate();
}

/* --- Auth System --- */
function initAuthSystem() {
  updateUserNavState();
}

function updateUserNavState() {
  const currentUser = GymStore.getCurrentUser();
  const authNav = document.getElementById('nav-auth-container');
  if (!authNav) return;

  if (currentUser) {
    authNav.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-weight:600; color:#FFF;"><i class="fas fa-user-circle" style="color:var(--primary);"></i> ${currentUser.name}</span>
        <button class="btn btn-sm btn-outline" onclick="logoutUser()">Logout</button>
      </div>
    `;
  } else {
    authNav.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="openModal('modal-login')">Login</button>
      <button class="btn btn-primary btn-sm" onclick="openModal('modal-register')">Register</button>
    `;
  }

  renderUserDashboard();
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Check Admin credentials
  if (email === 'admin@gmail.com' && password === 'Test@12345') {
    const adminUser = { name: 'Admin Manager', email: 'admin@gmail.com', role: 'admin' };
    GymStore.setCurrentUser(adminUser);
    closeModal('modal-login');
    updateUserNavState();
    showToast('Logged in as Administrator!', 'success');
    switchAppTab('tab-admin');
    return;
  }

  // Regular user login mock
  if (email && password) {
    const user = { name: email.split('@')[0], email: email, role: 'user' };
    GymStore.setCurrentUser(user);
    closeModal('modal-login');
    updateUserNavState();
    showToast(`Welcome back, ${user.name}!`, 'success');
    switchAppTab('tab-dashboard');
  } else {
    showToast('Please enter valid credentials!', 'error');
  }
}

function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;

  if (name && email) {
    const newUser = { name, email, role: 'user' };
    GymStore.setCurrentUser(newUser);
    closeModal('modal-register');
    updateUserNavState();
    showToast('Account created successfully!', 'success');
    switchAppTab('tab-dashboard');
  }
}

function logoutUser() {
  GymStore.clearCurrentUser();
  updateUserNavState();
  showToast('You have been logged out.', 'info');
  switchAppTab('tab-packages');
}

/* --- Package Booking Engine --- */
function openBookingModal(packageId) {
  const currentUser = GymStore.getCurrentUser();
  if (!currentUser) {
    showToast('Please log in to book a membership package!', 'info');
    openModal('modal-login');
    return;
  }

  const packages = GymStore.getPackages();
  selectedPackageForBooking = packages.find(p => p.id === packageId);
  
  if (!selectedPackageForBooking) return;

  const summaryEl = document.getElementById('booking-pkg-summary');
  const price = currentBillingCycle === 'monthly' ? `$${selectedPackageForBooking.priceMonthly}` : `$${selectedPackageForBooking.priceYearly}`;

  summaryEl.innerHTML = `
    <div style="background: var(--bg-surface); padding: 18px; border-radius: var(--radius-md); margin-bottom: 20px; border:1px solid var(--border-light);">
      <h4 style="color:var(--primary);">${selectedPackageForBooking.title}</h4>
      <p style="color:var(--text-muted); font-size:0.9rem;">Category: ${selectedPackageForBooking.category}</p>
      <h3 style="margin-top:10px; color:#FFF;">${price} <span style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">/ ${currentBillingCycle}</span></h3>
    </div>
  `;

  openModal('modal-booking');
}

function confirmBooking(event) {
  event.preventDefault();
  const currentUser = GymStore.getCurrentUser();
  if (!currentUser || !selectedPackageForBooking) return;

  const startDate = document.getElementById('booking-date').value || new Date().toISOString().split('T')[0];
  const priceStr = currentBillingCycle === 'monthly' ? `$${selectedPackageForBooking.priceMonthly}` : `$${selectedPackageForBooking.priceYearly}`;

  const newBooking = {
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    userName: currentUser.name,
    userEmail: currentUser.email,
    packageTitle: selectedPackageForBooking.title,
    price: priceStr,
    bookingDate: startDate,
    status: 'Confirmed'
  };

  GymStore.saveBooking(newBooking);
  closeModal('modal-booking');
  showToast('Membership Package booked successfully!', 'success');
  renderUserDashboard();
  renderAdminPanel();
  switchAppTab('tab-dashboard');
}

/* --- Render User Portal Dashboard --- */
function renderUserDashboard() {
  const currentUser = GymStore.getCurrentUser();
  const dashboardContainer = document.getElementById('user-dashboard-content');
  if (!dashboardContainer) return;

  if (!currentUser) {
    dashboardContainer.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-light);">
        <i class="fas fa-lock" style="font-size:3rem; color:var(--primary); margin-bottom:20px;"></i>
        <h3>Member Portal Access Required</h3>
        <p style="color:var(--text-muted); margin-bottom:24px;">Please log in or register to view your membership status & active bookings.</p>
        <button class="btn btn-primary" onclick="openModal('modal-login')">Log In Now</button>
      </div>
    `;
    return;
  }

  const allBookings = GymStore.getBookings();
  const myBookings = allBookings.filter(b => b.userEmail === currentUser.email);

  dashboardContainer.innerHTML = `
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon-box"><i class="fas fa-user"></i></div>
        <div>
          <h4 style="font-size:1.1rem;">${currentUser.name}</h4>
          <p style="color:var(--text-muted); font-size:0.85rem;">${currentUser.email}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box cyan"><i class="fas fa-dumbbell"></i></div>
        <div>
          <h3>${myBookings.length}</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Active Gym Subscriptions</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box green"><i class="fas fa-shield-alt"></i></div>
        <div>
          <h4 style="color:var(--success);">VIP Member</h4>
          <p style="color:var(--text-muted); font-size:0.85rem;">Member Account Verified</p>
        </div>
      </div>
    </div>

    <h3 style="margin-bottom:20px;">My Package Booking History</h3>
    ${myBookings.length === 0 ? `
      <div style="background:var(--bg-card); padding:40px; text-align:center; border-radius:var(--radius-md); border:1px solid var(--border-light);">
        <p style="color:var(--text-muted);">No active membership bookings found.</p>
        <button class="btn btn-outline btn-sm" style="margin-top:16px;" onclick="switchAppTab('tab-packages')">Explore Gym Packages</button>
      </div>
    ` : `
      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Package</th>
              <th>Price</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            ${myBookings.map(b => `
              <tr>
                <td><strong>${b.id}</strong></td>
                <td>${b.packageTitle}</td>
                <td style="color:var(--accent); font-weight:700;">${b.price}</td>
                <td>${b.bookingDate}</td>
                <td><span class="status-badge ${b.status.toLowerCase()}">${b.status}</span></td>
                <td><button class="btn btn-sm btn-outline" onclick="showToast('Digital Receipt generated for ${b.id}', 'info')">Print Receipt</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

/* --- Render Admin Dashboard --- */
function renderAdminPanel() {
  const adminContainer = document.getElementById('admin-panel-content');
  if (!adminContainer) return;

  const currentUser = GymStore.getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    adminContainer.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-light);">
        <i class="fas fa-user-shield" style="font-size:3.5rem; color:var(--warning); margin-bottom:20px;"></i>
        <h3>Administrator Authentication Required</h3>
        <p style="color:var(--text-muted); margin-bottom:24px;">Please login using Admin credentials to manage Gym Packages, User Bookings, and System Analytics.</p>
        <p style="color:var(--accent); font-size:0.9rem; margin-bottom:20px;">Demo Admin Email: <strong>admin@gmail.com</strong> | Password: <strong>Test@12345</strong></p>
        <button class="btn btn-primary" onclick="openModal('modal-login')">Login as Admin</button>
      </div>
    `;
    return;
  }

  const packages = GymStore.getPackages();
  const bookings = GymStore.getBookings();

  adminContainer.innerHTML = `
    <div class="dashboard-grid">
      <div class="stat-card">
        <div class="stat-icon-box"><i class="fas fa-boxes"></i></div>
        <div>
          <h3>${packages.length}</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Active Gym Packages</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box cyan"><i class="fas fa-file-invoice-dollar"></i></div>
        <div>
          <h3>${bookings.length}</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Total Member Bookings</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box green"><i class="fas fa-wallet"></i></div>
        <div>
          <h3 style="color:var(--success);">$${bookings.length * 59}</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Estimated Revenue</p>
        </div>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h3>Manage Gym Packages</h3>
      <button class="btn btn-primary btn-sm" onclick="openModal('modal-add-package')"><i class="fas fa-plus"></i> Add New Package</button>
    </div>

    <div class="table-responsive" style="margin-bottom:40px;">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Monthly Price</th>
            <th>Yearly Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${packages.map(p => `
            <tr>
              <td><strong>${p.title}</strong></td>
              <td><span style="color:var(--accent);">${p.category}</span></td>
              <td>$${p.priceMonthly}</td>
              <td>$${p.priceYearly}</td>
              <td>
                <button class="btn btn-sm btn-outline" style="color:var(--danger); border-color:var(--danger);" onclick="deletePackage('${p.id}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h3 style="margin-bottom:20px;">All Member Bookings</h3>
    <div class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Member Name</th>
            <th>Email</th>
            <th>Package</th>
            <th>Price</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td><strong>${b.id}</strong></td>
              <td>${b.userName}</td>
              <td>${b.userEmail}</td>
              <td>${b.packageTitle}</td>
              <td style="color:var(--accent);">${b.price}</td>
              <td>${b.bookingDate}</td>
              <td><span class="status-badge ${b.status.toLowerCase()}">${b.status}</span></td>
              <td>
                <button class="btn btn-sm btn-outline" onclick="toggleBookingStatus('${b.id}')">
                  Toggle Status
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function handleAddPackage(event) {
  event.preventDefault();
  const title = document.getElementById('new-pkg-title').value;
  const category = document.getElementById('new-pkg-category').value;
  const monthly = parseFloat(document.getElementById('new-pkg-monthly').value);
  const yearly = parseFloat(document.getElementById('new-pkg-yearly').value);
  const featureList = document.getElementById('new-pkg-features').value.split(',').map(s => s.trim());

  if (title && monthly && yearly) {
    const packages = GymStore.getPackages();
    const newPkg = {
      id: 'pkg_' + Date.now(),
      title,
      category,
      priceMonthly: monthly,
      priceYearly: yearly,
      duration: '1 Month / 1 Year',
      features: featureList.length > 0 ? featureList : ['Full Gym Access'],
      featured: false
    };

    packages.push(newPkg);
    GymStore.savePackages(packages);
    closeModal('modal-add-package');
    renderPackages();
    renderAdminPanel();
    showToast('New Gym Package added successfully!', 'success');
  }
}

function deletePackage(id) {
  if (confirm('Are you sure you want to delete this gym package?')) {
    let packages = GymStore.getPackages();
    packages = packages.filter(p => p.id !== id);
    GymStore.savePackages(packages);
    renderPackages();
    renderAdminPanel();
    showToast('Package deleted!', 'info');
  }
}

function toggleBookingStatus(bookingId) {
  const bookings = GymStore.getBookings();
  const b = bookings.find(item => item.id === bookingId);
  if (b) {
    const nextStatus = b.status === 'Confirmed' ? 'Pending' : 'Confirmed';
    GymStore.updateBookingStatus(bookingId, nextStatus);
    renderAdminPanel();
    renderUserDashboard();
    showToast(`Booking ${bookingId} status changed to ${nextStatus}`, 'success');
  }
}

/* --- Tab View Controller --- */
function switchAppTab(tabId) {
  const tabs = ['tab-packages', 'tab-schedule', 'tab-bmi', 'tab-dashboard', 'tab-admin'];
  tabs.forEach(id => {
    const el = document.getElementById(id);
    const btn = document.getElementById('btn-' + id);
    if (el) el.style.display = (id === tabId) ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', id === tabId);
  });
}

/* --- Modals Helper --- */
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
