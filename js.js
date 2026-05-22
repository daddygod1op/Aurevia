/* ============================================
   AUREVIA — Premium Operations Platform
   Complete Application Logic v2.0
   ============================================ */

'use strict';

// ============================================================
// GLOBAL STATE
// ============================================================
const AppState = {
  currentUser: null,
  currentPage: 'dashboard',
  currentTheme: 'dark',
  tasks: {
    hotel: [],
    transport: []
  },
  activityLog: [],
  filterState: { hotel: 'all', transport: 'all' },
  notifications: [
    { id: 1, title: 'Room 204 check-in pending', time: '2 min ago', unread: true, icon: '🏨' },
    { id: 2, title: 'Vehicle AV-003 maintenance due', time: '15 min ago', unread: true, icon: '🔧' },
    { id: 3, title: 'New team member registered', time: '1 hr ago', unread: true, icon: '👤' },
    { id: 4, title: 'Daily report generated', time: '6 hrs ago', unread: false, icon: '📊' }
  ],
  weeklyData: [65, 80, 72, 90, 85, 78, 0],
  selectedIcon: '🏨',
  modalCategory: 'hotel',
  toastTimeout: null,
  ripples: []
};

// ============================================================
// DEFAULT TASK DATA
// ============================================================
const DEFAULT_TASKS = {
  hotel: [
    { id: 'h1', icon: '🏨', text: 'Room Cleaning & Turnover', priority: 'high', assignee: 'Sofia Chen', initials: 'SC', completed: false },
    { id: 'h2', icon: '🔑', text: 'Guest Check-in Preparation', priority: 'high', assignee: 'Marcus Williams', initials: 'MW', completed: false },
    { id: 'h3', icon: '🧺', text: 'Laundry Status Review', priority: 'medium', assignee: 'Priya Sharma', initials: 'PS', completed: false },
    { id: 'h4', icon: '📋', text: 'Inventory & Supply Check', priority: 'medium', assignee: 'James O\'Brien', initials: 'JO', completed: false },
    { id: 'h5', icon: '🍽️', text: 'Dining Area Setup', priority: 'medium', assignee: 'Sofia Chen', initials: 'SC', completed: false },
    { id: 'h6', icon: '🛎️', text: 'Concierge Briefing', priority: 'low', assignee: 'Marcus Williams', initials: 'MW', completed: false }
  ],
  transport: [
    { id: 't1', icon: '🚗', text: 'Vehicle Inspection Round', priority: 'high', assignee: 'James O\'Brien', initials: 'JO', completed: false },
    { id: 't2', icon: '⛽', text: 'Fuel Level Check', priority: 'high', assignee: 'Priya Sharma', initials: 'PS', completed: false },
    { id: 't3', icon: '👨‍✈️', text: 'Driver Availability Confirm', priority: 'medium', assignee: 'Sofia Chen', initials: 'SC', completed: false },
    { id: 't4', icon: '🗺️', text: 'Route Planning & Updates', priority: 'medium', assignee: 'Marcus Williams', initials: 'MW', completed: false },
    { id: 't5', icon: '🔧', text: 'Maintenance Log Update', priority: 'medium', assignee: 'James O\'Brien', initials: 'JO', completed: false },
    { id: 't6', icon: '📱', text: 'Dispatch Communication', priority: 'low', assignee: 'Priya Sharma', initials: 'PS', completed: false }
  ]
};

const TEAM_DATA = [
  { name: 'Sofia Chen', role: 'Head of Operations', dept: 'Hotel Ops', initials: 'SC', tasksCompleted: 0, totalTasks: 2, status: 'online', color: '#d4af37' },
  { name: 'Marcus Williams', role: 'Transport Manager', dept: 'Transport', initials: 'MW', tasksCompleted: 0, totalTasks: 2, status: 'online', color: '#60a5fa' },
  { name: 'Priya Sharma', role: 'Guest Relations', dept: 'Hotel Ops', initials: 'PS', tasksCompleted: 0, totalTasks: 2, status: 'away', color: '#f472b6' },
  { name: 'James O\'Brien', role: 'Fleet Supervisor', dept: 'Transport', initials: 'JO', tasksCompleted: 0, totalTasks: 2, status: 'online', color: '#4ade80' },
  { name: 'Elena Vasquez', role: 'Night Manager', dept: 'Hotel Ops', initials: 'EV', tasksCompleted: 3, totalTasks: 4, status: 'offline', color: '#a78bfa' },
  { name: 'Raj Mehta', role: 'Lead Driver', dept: 'Transport', initials: 'RM', tasksCompleted: 5, totalTasks: 5, status: 'online', color: '#fb923c' }
];

// ============================================================
// PRELOADER
// ============================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    setTimeout(() => { preloader.style.display = 'none'; }, 800);
  }, 2200);
}

// ============================================================
// CURSOR
// ============================================================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('button, a, .task-card-v2, .sidebar-link, .team-card, [onclick]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.opacity = '0.5';
      follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
      follower.style.borderColor = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.opacity = '1';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.borderColor = 'var(--gold-border)';
    });
  });
}

// ============================================================
// PARTICLES
// ============================================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${4 + Math.random() * 8}s;
      --delay: ${Math.random() * 6}s;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
    `;
    container.appendChild(p);
  }
}

// ============================================================
// RIPPLE EFFECT
// ============================================================
function createRipple(e, el) {
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    background:rgba(212,175,55,0.15);
    transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
  `;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ============================================================
// LOGIN
// ============================================================
function handleLogin() {
  const email = document.getElementById('login-email')?.value || 'admin@aurevia.com';
  const password = document.getElementById('login-password')?.value || 'admin';
  const roleBtn = document.querySelector('.role-btn.active');
  const role = roleBtn ? roleBtn.dataset.role : 'admin';

  if (!email || !password) {
    showToast('Please enter your credentials', '⚠', 'warn');
    return;
  }

  const namePart = email.split('@')[0];
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  AppState.currentUser = {
    name: displayName,
    email: email,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    initials: displayName.charAt(0).toUpperCase()
  };

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.innerHTML = '<span class="btn-text">Accessing...</span><span class="btn-arrow">⟳</span>';
    loginBtn.style.opacity = '0.8';
  }

  // Animate login page out
  const loginPage = document.getElementById('login-page');
  setTimeout(() => {
    loginPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    loginPage.style.opacity = '0';
    loginPage.style.transform = 'scale(1.02)';
    setTimeout(() => {
      showPage('main-app');
      initMainApp();
    }, 600);
  }, 800);
}

function handleLogout() {
  showConfirmDialog('Sign Out', 'Are you sure you want to sign out of Aurevia?', () => {
    const mainApp = document.getElementById('main-app');
    mainApp.style.transition = 'opacity 0.5s ease';
    mainApp.style.opacity = '0';
    setTimeout(() => {
      showPage('login-page');
      mainApp.style.opacity = '1';
      const loginPage = document.getElementById('login-page');
      loginPage.style.opacity = '1';
      loginPage.style.transform = 'scale(1)';
      AppState.currentUser = null;
      const loginBtn = document.getElementById('login-btn');
      if (loginBtn) {
        loginBtn.innerHTML = '<span class="btn-text">Access Portal</span><span class="btn-arrow">→</span>';
        loginBtn.style.opacity = '1';
      }
    }, 500);
  });
}

function showConfirmDialog(title, message, onConfirm) {
  const overlay = document.getElementById('confirm-modal');
  if (!overlay) { onConfirm(); return; }
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  document.getElementById('confirm-ok').onclick = () => {
    overlay.classList.remove('active');
    onConfirm();
  };
  overlay.classList.add('active');
}

// ============================================================
// PAGE MANAGEMENT
// ============================================================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

function navigateTo(page) {
  AppState.currentPage = page;

  document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  const breadcrumb = document.getElementById('breadcrumb-current');
  if (breadcrumb) {
    const labels = {
      dashboard: 'Dashboard', hotel: 'Hotel Operations',
      transport: 'Transport Ops', analytics: 'Analytics',
      team: 'Team Management', settings: 'Settings'
    };
    breadcrumb.textContent = labels[page] || page;
  }

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
  }

  // Refresh page-specific content
  if (page === 'analytics') refreshAnalytics();
  if (page === 'team') renderTeam();
  if (page === 'dashboard') updateDashboard();
}

// ============================================================
// INIT MAIN APP
// ============================================================
function initMainApp() {
  if (!AppState.currentUser) return;

  // Reset tasks from defaults
  AppState.tasks.hotel = DEFAULT_TASKS.hotel.map(t => ({ ...t }));
  AppState.tasks.transport = DEFAULT_TASKS.transport.map(t => ({ ...t }));
  AppState.activityLog = [];

  // Update user UI
  updateUserUI();

  // Set greeting
  setGreeting();

  // Set date
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Render everything
  renderTaskGrid('hotel');
  renderTaskGrid('transport');
  renderQuickTasks();
  renderTeam();
  updateDashboard();
  renderWeeklyChart();
  updateNotifBadge();

  // Init settings sidebar
  initSettingsTabs();
  initSidebarToggle();
  initLoginTabs();
  initSearchOverlay();
  initKeyboardShortcuts();

  // Load last login
  const lastLogin = document.getElementById('last-login-display');
  if (lastLogin) lastLogin.textContent = new Date().toLocaleString();

  // Profile inputs
  const nameInput = document.getElementById('profile-name-input');
  const emailInput = document.getElementById('profile-email-input');
  if (nameInput) nameInput.value = AppState.currentUser.name;
  if (emailInput) emailInput.value = AppState.currentUser.email;

  // Navigate to dashboard
  navigateTo('dashboard');

  showToast(`Welcome back, ${AppState.currentUser.name}! ✨`, '⬡');
}

function updateUserUI() {
  const u = AppState.currentUser;
  if (!u) return;
  ['sidebar-avatar', 'topbar-avatar', 'profile-avatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = u.initials;
  });
  const sName = document.getElementById('sidebar-name');
  const sRole = document.getElementById('sidebar-role');
  const tName = document.getElementById('topbar-name');
  if (sName) sName.textContent = u.name;
  if (sRole) sRole.textContent = u.role;
  if (tName) tName.textContent = u.name.split(' ')[0];
}

function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('dashboard-greeting');
  if (el) el.textContent = `${greet}, ${AppState.currentUser?.name || 'Admin'}. Here's your operational overview.`;
}

// ============================================================
// TASK RENDERING
// ============================================================
function renderTaskGrid(category) {
  const gridId = category + '-tasks-grid';
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const tasks = AppState.tasks[category];
  const filter = AppState.filterState[category];

  let filtered = tasks;
  if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (filter === 'done') filtered = tasks.filter(t => t.completed);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:60px 20px;">
        <div style="font-size:48px;margin-bottom:16px;opacity:0.3">◎</div>
        <p style="color:var(--text-muted);font-size:14px;">No tasks match this filter</p>
      </div>`;
    return;
  }

  filtered.forEach((task, idx) => {
    const card = createTaskCardElement(task, category, idx);
    grid.appendChild(card);
  });

  updateSectionStats(category);
  updateCountBadge(category);
}

function createTaskCardElement(task, category, idx) {
  const card = document.createElement('div');
  card.className = `task-card-v2${task.completed ? ' completed' : ''}`;
  card.dataset.id = task.id;
  card.style.animationDelay = (idx * 0.06) + 's';

  card.innerHTML = `
    <div class="task-card-top">
      <span class="task-emoji">${task.icon}</span>
      <div class="task-priority-dot priority-${task.priority}"></div>
    </div>
    <p class="task-name">${task.text}</p>
    <div class="task-meta">
      <div class="task-assignee">
        <div class="assignee-avatar">${task.initials}</div>
        <span>${task.assignee.split(' ')[0]}</span>
      </div>
      <button class="task-check-btn" onclick="toggleTask('${category}','${task.id}',event)" title="${task.completed ? 'Mark Incomplete' : 'Mark Complete'}">
        ${task.completed ? '✓' : ''}
      </button>
    </div>
    <div class="task-category-tag">${category === 'hotel' ? '🏨 Hotel' : '🚗 Transport'}</div>
  `;

  // Click anywhere on card to toggle
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('task-check-btn')) {
      toggleTask(category, task.id, e);
    }
  });

  // 3D tilt effect
  card.addEventListener('mousemove', handleCardTilt);
  card.addEventListener('mouseleave', resetCardTilt);

  return card;
}

function handleCardTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  card.style.transform = `translateY(-6px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg)`;
}

function resetCardTilt(e) {
  e.currentTarget.style.transform = '';
}

// ============================================================
// TASK OPERATIONS
// ============================================================
function toggleTask(category, taskId, e) {
  if (e) {
    e.stopPropagation();
    createRipple(e, e.currentTarget.closest?.('.task-card-v2') || e.currentTarget);
  }

  const tasks = AppState.tasks[category];
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;

  // Log activity
  const action = task.completed ? 'completed' : 'reopened';
  addActivity(task.completed ? '✅' : '↩️', `${task.text} was ${action}`, category);

  // Particles burst if completed
  if (task.completed && e) {
    spawnCompletionParticles(e);
    showToast(`"${task.text}" completed!`, '✓');
  }

  renderTaskGrid(category);
  updateDashboard();
  updateSectionStats(category);
  refreshAnalytics();
}

function spawnCompletionParticles(e) {
  const colors = ['#d4af37', '#f4d03f', '#4ade80', '#fff'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 / 12) * i;
    const dist = 40 + Math.random() * 60;
    p.style.cssText = `
      position:fixed;width:6px;height:6px;border-radius:50%;
      background:${colors[i % colors.length]};
      left:${e.clientX}px;top:${e.clientY}px;
      pointer-events:none;z-index:99999;
      animation:particleBurst 0.7s ease-out forwards;
      --tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

function addActivity(icon, text, category) {
  AppState.activityLog.unshift({
    icon, text, time: 'Just now',
    category, ts: Date.now()
  });
  if (AppState.activityLog.length > 20) AppState.activityLog.pop();
  renderActivityFeed();
}

function renderActivityFeed() {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;

  if (AppState.activityLog.length === 0) {
    feed.innerHTML = `
      <div class="activity-empty">
        <span class="activity-empty-icon">◎</span>
        <p>No activity yet. Start completing tasks to see updates here.</p>
      </div>`;
    return;
  }

  feed.innerHTML = AppState.activityLog.slice(0, 8).map(a => `
    <div class="activity-item">
      <span class="activity-icon">${a.icon}</span>
      <span class="activity-text">${a.text}</span>
      <span class="activity-time">${a.time}</span>
    </div>
  `).join('');
}

function filterTasks(category, filter) {
  AppState.filterState[category] = filter;
  renderTaskGrid(category);
}

function addNewTask() {
  const name = document.getElementById('new-task-name')?.value?.trim();
  const priority = document.getElementById('new-task-priority')?.value || 'medium';
  const assignee = document.getElementById('new-task-assignee')?.value || 'Sofia Chen';

  if (!name) {
    showToast('Please enter a task name', '⚠', 'warn');
    shakeElement(document.getElementById('new-task-name'));
    return;
  }

  const cat = AppState.modalCategory;
  const initials = assignee.split(' ').map(w => w[0]).join('').toUpperCase();
  const id = cat[0] + Date.now();

  AppState.tasks[cat].push({
    id, icon: AppState.selectedIcon, text: name,
    priority, assignee, initials, completed: false
  });

  addActivity('➕', `New task added: "${name}"`, cat);
  renderTaskGrid(cat);
  updateDashboard();
  closeModal();
  showToast(`Task "${name}" added successfully!`, '➕');
  updateCountBadge(cat);
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

function openAddTaskModal(category) {
  AppState.modalCategory = category;
  AppState.selectedIcon = category === 'hotel' ? '🏨' : '🚗';

  document.querySelectorAll('.icon-option').forEach((opt, i) => {
    opt.classList.toggle('active', i === 0);
  });

  const modal = document.getElementById('task-modal');
  const title = modal?.querySelector('.modal-title');
  if (title) title.textContent = `Add ${category === 'hotel' ? 'Hotel' : 'Transport'} Task`;

  const nameInput = document.getElementById('new-task-name');
  if (nameInput) nameInput.value = '';

  // Update icon picker first icon for category
  const firstIcon = document.querySelector('.icon-option');
  if (firstIcon) firstIcon.textContent = category === 'hotel' ? '🏨' : '🚗';

  if (modal) {
    modal.classList.add('active');
    setTimeout(() => nameInput?.focus(), 300);
  }
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

// ============================================================
// DASHBOARD UPDATES
// ============================================================
function updateDashboard() {
  const allTasks = [...AppState.tasks.hotel, ...AppState.tasks.transport];
  const total = allTasks.length;
  const completed = allTasks.filter(t => t.completed).length;
  const pending = total - completed;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  // KPIs
  animateNumber('kpi-total', total);
  animateNumber('kpi-completed', completed);
  animateNumber('kpi-pending', pending);

  const compPct = document.getElementById('kpi-comp-pct');
  const pendPct = document.getElementById('kpi-pend-pct');
  if (compPct) { compPct.textContent = pct + '%'; compPct.className = 'kpi-trend' + (pct > 0 ? ' up' : ''); }
  if (pendPct) pendPct.textContent = (100 - pct) + '%';

  // Progress ring
  const circle = document.getElementById('progress-circle');
  if (circle) {
    const circumference = 471;
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  const pctBig = document.getElementById('progress-pct-big');
  const pctLabel = document.getElementById('progress-pct-label');
  if (pctBig) pctBig.textContent = pct + '%';
  if (pctLabel) pctLabel.textContent = pct + '% Complete';

  // Hotel/Transport breakdown
  const hotelDone = AppState.tasks.hotel.filter(t => t.completed).length;
  const hotelTotal = AppState.tasks.hotel.length;
  const transDone = AppState.tasks.transport.filter(t => t.completed).length;
  const transTotal = AppState.tasks.transport.length;

  const hPct = hotelTotal ? Math.round((hotelDone / hotelTotal) * 100) : 0;
  const tPct = transTotal ? Math.round((transDone / transTotal) * 100) : 0;

  const hFill = document.getElementById('hotel-mini-fill');
  const tFill = document.getElementById('transport-mini-fill');
  const hText = document.getElementById('hotel-progress-text');
  const tText = document.getElementById('transport-progress-text');

  if (hFill) hFill.style.width = hPct + '%';
  if (tFill) tFill.style.width = tPct + '%';
  if (hText) hText.textContent = `${hotelDone}/${hotelTotal}`;
  if (tText) tText.textContent = `${transDone}/${transTotal}`;

  renderActivityFeed();
  renderQuickTasks();

  // Today's weekly data update
  AppState.weeklyData[6] = pct;
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff = target - start;
  const steps = 20;
  let i = 0;
  const interval = setInterval(() => {
    i++;
    el.textContent = Math.round(start + diff * (i / steps));
    if (i >= steps) { el.textContent = target; clearInterval(interval); }
  }, 20);
}

function updateSectionStats(category) {
  const tasks = AppState.tasks[category];
  const done = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pending = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const doneEl = document.getElementById(`${category}-done-count`);
  const pendEl = document.getElementById(`${category}-pending-count`);
  const pctEl = document.getElementById(`${category}-pct`);
  const barEl = document.getElementById(`${category}-section-bar`);

  if (doneEl) doneEl.textContent = done;
  if (pendEl) pendEl.textContent = pending;
  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';
}

function updateCountBadge(category) {
  const pending = AppState.tasks[category].filter(t => !t.completed).length;
  const badge = document.getElementById(`${category}-count`);
  if (badge) badge.textContent = pending;
}

function renderQuickTasks() {
  const list = document.getElementById('quick-task-list');
  if (!list) return;

  const allTasks = [...AppState.tasks.hotel, ...AppState.tasks.transport];
  const highPriority = allTasks.filter(t => !t.completed && t.priority === 'high').slice(0, 3);
  const medium = allTasks.filter(t => !t.completed && t.priority === 'medium').slice(0, 2 - highPriority.length + 2);
  const show = [...highPriority, ...medium].slice(0, 4);

  if (show.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">🎉 All high-priority tasks done!</div>`;
    return;
  }

  list.innerHTML = show.map(t => `
    <div class="quick-task" onclick="navigateTo('${t.id.startsWith('h') ? 'hotel' : 'transport'}')">
      <span class="qt-icon">${t.icon}</span>
      <span class="qt-text">${t.text}</span>
      <span class="qt-badge ${t.priority}">${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span>
    </div>
  `).join('');
}

// ============================================================
// ANALYTICS
// ============================================================
function renderWeeklyChart() {
  const barsEl = document.getElementById('chart-bars');
  const labelsEl = document.getElementById('chart-labels');
  if (!barsEl) return;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxVal = Math.max(...AppState.weeklyData, 1);

  barsEl.innerHTML = AppState.weeklyData.map((val, i) => `
    <div class="chart-bar-wrap">
      <span class="chart-val">${val}%</span>
      <div class="chart-bar${i === 6 ? ' today' : ''}" style="height:${(val / maxVal) * 100}%"></div>
    </div>
  `).join('');

  if (labelsEl) {
    labelsEl.innerHTML = days.map((d, i) => `<span class="chart-label${i === 6 ? ' gold-text' : ''}">${d}</span>`).join('');
  }
}

function refreshAnalytics() {
  const hotelDone = AppState.tasks.hotel.filter(t => t.completed).length;
  const transDone = AppState.tasks.transport.filter(t => t.completed).length;
  const total = AppState.tasks.hotel.length + AppState.tasks.transport.length;
  const totalDone = hotelDone + transDone;
  const pct = total ? Math.round((totalDone / total) * 100) : 0;

  // Update donut chart
  const circ = 188 * 2 * Math.PI * 60 / (2 * Math.PI * 60); // 376 approx
  const donutCirc = 188;
  const hSlice = total ? Math.round((hotelDone / total) * donutCirc) : 0;
  const tSlice = total ? Math.round((transDone / total) * donutCirc) : 0;

  const dHotel = document.getElementById('donut-hotel');
  const dTransport = document.getElementById('donut-transport');
  if (dHotel) dHotel.setAttribute('stroke-dasharray', `${hSlice} ${donutCirc}`);
  if (dTransport) {
    dTransport.setAttribute('stroke-dasharray', `${tSlice} ${donutCirc}`);
    dTransport.setAttribute('stroke-dashoffset', -hSlice);
  }

  const dCenter = document.getElementById('donut-center-val');
  if (dCenter) dCenter.textContent = totalDone;

  const lHotel = document.getElementById('legend-hotel');
  const lTransport = document.getElementById('legend-transport');
  if (lHotel) lHotel.textContent = hotelDone;
  if (lTransport) lTransport.textContent = transDone;

  // Gauge
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeVal = document.getElementById('gauge-val');
  if (gaugeArc) gaugeArc.setAttribute('stroke-dashoffset', 251 - (pct / 100) * 251);
  if (gaugeVal) gaugeVal.textContent = pct;

  // Weekly chart today
  AppState.weeklyData[6] = pct;
  renderWeeklyChart();
}

// ============================================================
// TEAM
// ============================================================
function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  // Update team completion stats from tasks
  TEAM_DATA.forEach(member => {
    const allTasks = [...AppState.tasks.hotel, ...AppState.tasks.transport];
    const memberTasks = allTasks.filter(t => t.assignee.includes(member.name.split(' ')[0]));
    member.tasksCompleted = memberTasks.filter(t => t.completed).length;
    member.totalTasks = memberTasks.length || member.totalTasks;
  });

  grid.innerHTML = TEAM_DATA.map((m, idx) => `
    <div class="team-card" style="animation-delay:${idx * 0.08}s">
      <div class="team-avatar" style="background:linear-gradient(135deg,${m.color},${m.color}bb)">${m.initials}</div>
      <h3 class="team-name">${m.name}</h3>
      <p class="team-role">${m.role}</p>
      <span class="team-dept">${m.dept}</span>
      <div class="team-stats">
        <div>
          <span class="team-stat-val">${m.tasksCompleted}</span>
          <span class="team-stat-label">Done</span>
        </div>
        <div>
          <span class="team-stat-val">${m.totalTasks}</span>
          <span class="team-stat-label">Total</span>
        </div>
        <div>
          <span class="team-stat-val">${m.totalTasks ? Math.round((m.tasksCompleted / m.totalTasks) * 100) : 0}%</span>
          <span class="team-stat-label">Rate</span>
        </div>
      </div>
      <span class="team-status-badge status-${m.status}">● ${m.status.charAt(0).toUpperCase() + m.status.slice(1)}</span>
    </div>
  `).join('');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('active');

  if (panel.classList.contains('active')) {
    // Mark all as read after viewing
    setTimeout(() => {
      AppState.notifications.forEach(n => { n.unread = false; });
      updateNotifBadge();
    }, 2000);
    renderNotifPanel();
  }
}

function renderNotifPanel() {
  const list = document.querySelector('.notif-list');
  if (!list) return;
  list.innerHTML = AppState.notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-dot"></div>
      <div class="notif-content">
        <p class="notif-title">${n.icon} ${n.title}</p>
        <p class="notif-time">${n.time}</p>
      </div>
    </div>
  `).join('');
}

function updateNotifBadge() {
  const badge = document.getElementById('notif-badge');
  const count = AppState.notifications.filter(n => n.unread).length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, icon = '✓', type = 'success') {
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastText = document.getElementById('toast-text');
  if (!toast) return;

  if (AppState.toastTimeout) clearTimeout(AppState.toastTimeout);

  toastText.textContent = message;
  toastIcon.textContent = icon;

  const colors = { success: 'var(--gold)', warn: 'var(--amber)', error: 'var(--red)' };
  toastIcon.style.background = type === 'success' ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : colors[type];

  toast.classList.add('show');
  AppState.toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// REPORT
// ============================================================
function generateReport() {
  const allTasks = [...AppState.tasks.hotel, ...AppState.tasks.transport];
  const done = allTasks.filter(t => t.completed).length;
  const total = allTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const reportContent = document.getElementById('report-content');
  if (reportContent) {
    reportContent.innerHTML = `
      <div class="report-section">
        <div style="text-align:center;padding:20px 0;border-bottom:1px solid var(--gold-border);margin-bottom:24px;">
          <div style="font-family:'Cinzel',serif;font-size:28px;color:var(--gold);letter-spacing:6px;margin-bottom:4px;">AUREVIA</div>
          <div style="font-size:12px;color:var(--text-muted);letter-spacing:3px;">DAILY OPERATIONS REPORT</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${date}</div>
        </div>
      </div>
      <div class="report-section">
        <h3>Performance Summary</h3>
        <div class="report-kpis">
          <div class="report-kpi"><span class="report-kpi-val">${total}</span><span class="report-kpi-label">Total Tasks</span></div>
          <div class="report-kpi"><span class="report-kpi-val">${done}</span><span class="report-kpi-label">Completed</span></div>
          <div class="report-kpi"><span class="report-kpi-val">${total - done}</span><span class="report-kpi-label">Pending</span></div>
          <div class="report-kpi"><span class="report-kpi-val">${pct}%</span><span class="report-kpi-label">Completion</span></div>
        </div>
      </div>
      <div class="report-section">
        <h3>Hotel Operations</h3>
        <div class="report-task-list">
          ${AppState.tasks.hotel.map(t => `
            <div class="report-task">
              <span>${t.icon} ${t.text}</span>
              <span class="report-status ${t.completed ? 'done' : 'pending'}">${t.completed ? '✓ Done' : '⏳ Pending'}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="report-section">
        <h3>Transport Operations</h3>
        <div class="report-task-list">
          ${AppState.tasks.transport.map(t => `
            <div class="report-task">
              <span>${t.icon} ${t.text}</span>
              <span class="report-status ${t.completed ? 'done' : 'pending'}">${t.completed ? '✓ Done' : '⏳ Pending'}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="text-align:center;margin-top:24px;font-size:11px;color:var(--text-muted);letter-spacing:1px;">
        Generated by Aurevia Operations Hub · Confidential
      </div>
    `;
  }

  const modal = document.getElementById('report-modal');
  if (modal) modal.classList.add('active');
  showToast('Report generated successfully', '📊');
}

// ============================================================
// RESET
// ============================================================
function resetAllTasks() {
  showConfirmDialog('Reset All Tasks', 'This will mark all tasks as incomplete. Continue?', () => {
    AppState.tasks.hotel.forEach(t => { t.completed = false; });
    AppState.tasks.transport.forEach(t => { t.completed = false; });
    AppState.activityLog = [];
    renderTaskGrid('hotel');
    renderTaskGrid('transport');
    updateDashboard();
    refreshAnalytics();
    showToast('All tasks have been reset', '↺');
    addActivity('↺', 'All tasks were reset for new day', 'system');
  });
}

// ============================================================
// THEME
// ============================================================
function toggleTheme() {
  const themes = ['dark', 'light', 'midnight'];
  const current = themes.indexOf(AppState.currentTheme);
  const next = themes[(current + 1) % themes.length];
  setTheme(next);
}

function setTheme(theme) {
  document.body.classList.remove('light-theme', 'midnight-theme');
  if (theme === 'light') document.body.classList.add('light-theme');
  if (theme === 'midnight') document.body.classList.add('midnight-theme');
  AppState.currentTheme = theme;

  // Update theme options in settings
  document.querySelectorAll('.theme-opt').forEach(opt => {
    opt.classList.toggle('active', opt.onclick?.toString().includes(theme));
  });

  showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`, '◑');
}

function setAccent(color) {
  document.documentElement.style.setProperty('--gold', color);
  const lighter = color + 'cc';
  document.documentElement.style.setProperty('--gold-light', lighter);

  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.style.background === color);
  });
  showToast('Accent color updated', '🎨');
}

// ============================================================
// SETTINGS
// ============================================================
function initSettingsTabs() {
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const panel = tab.dataset.settings;
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('settings-' + panel);
      if (target) target.classList.add('active');
    });
  });

  // Sidebar collapse toggle in settings
  const collapseToggle = document.getElementById('sidebar-collapse-toggle');
  if (collapseToggle) {
    collapseToggle.addEventListener('change', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.toggle('collapsed', collapseToggle.checked);
    });
  }
}

function saveProfile() {
  const name = document.getElementById('profile-name-input')?.value?.trim();
  const email = document.getElementById('profile-email-input')?.value?.trim();
  if (!name) { showToast('Please enter your name', '⚠', 'warn'); return; }

  AppState.currentUser.name = name;
  AppState.currentUser.email = email || AppState.currentUser.email;
  AppState.currentUser.initials = name.charAt(0).toUpperCase();
  updateUserUI();
  setGreeting();
  showToast('Profile updated successfully', '✓');
}

// ============================================================
// SIDEBAR
// ============================================================
function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const topToggle = document.getElementById('topbar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }
  if (topToggle && sidebar) {
    topToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  // Close on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !topToggle?.contains(e.target)) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

// ============================================================
// LOGIN TABS
// ============================================================
function initLoginTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(tab + '-tab');
      if (target) target.classList.add('active');
    });
  });

  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Password toggle
  const toggle = document.getElementById('toggle-password');
  const pwInput = document.getElementById('login-password');
  if (toggle && pwInput) {
    toggle.addEventListener('click', () => {
      pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
      toggle.textContent = pwInput.type === 'password' ? '◎' : '●';
    });
  }

  // Icon picker
  document.querySelectorAll('.icon-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      AppState.selectedIcon = opt.textContent;
    });
  });

  // Enter key on login
  document.getElementById('login-password')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  });
}

// ============================================================
// SEARCH OVERLAY
// ============================================================
function initSearchOverlay() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      clearSearchHighlights();
      return;
    }

    const allTasks = [...AppState.tasks.hotel, ...AppState.tasks.transport];
    const matches = allTasks.filter(t => t.text.toLowerCase().includes(q));

    if (matches.length > 0) {
      const cat = matches[0].id.startsWith('h') ? 'hotel' : 'transport';
      navigateTo(cat);
      setTimeout(() => {
        const cards = document.querySelectorAll('.task-card-v2');
        cards.forEach(card => {
          const name = card.querySelector('.task-name')?.textContent.toLowerCase();
          card.style.opacity = name?.includes(q) ? '1' : '0.3';
          card.style.transform = name?.includes(q) ? 'scale(1.02)' : 'scale(0.98)';
        });
      }, 300);
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(clearSearchHighlights, 500);
  });
}

function clearSearchHighlights() {
  document.querySelectorAll('.task-card-v2').forEach(card => {
    card.style.opacity = '';
    card.style.transform = '';
  });
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      const panel = document.getElementById('notif-panel');
      if (panel) panel.classList.remove('active');
    }
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1': e.preventDefault(); navigateTo('dashboard'); break;
        case '2': e.preventDefault(); navigateTo('hotel'); break;
        case '3': e.preventDefault(); navigateTo('transport'); break;
        case '4': e.preventDefault(); navigateTo('analytics'); break;
        case 'r': e.preventDefault(); resetAllTasks(); break;
      }
    }
  });
}

// ============================================================
// CLOCK & LIVE TICKER
// ============================================================
function startLiveClock() {
  function tick() {
    const now = new Date();
    // Update any live time elements
    const timeEls = document.querySelectorAll('.live-time');
    timeEls.forEach(el => {
      el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
  }
  tick();
  setInterval(tick, 1000);

  // Randomly add system activity notifications
  const autoMessages = [
    ['◉', 'System health check passed'],
    ['🌐', 'Network connectivity nominal'],
    ['📡', 'Data sync complete'],
    ['🔒', 'Security scan: all clear']
  ];

  let msgIndex = 0;
  setInterval(() => {
    if (AppState.currentUser && AppState.activityLog.length > 0) {
      const [icon, text] = autoMessages[msgIndex % autoMessages.length];
      // Only occasionally add system messages
      if (Math.random() < 0.3) {
        addActivity(icon, text, 'system');
      }
      msgIndex++;
    }
  }, 45000);
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.kpi-card, .dash-card, .team-card, .analytics-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ============================================================
// INJECT RIPPLE KEYFRAMES DYNAMICALLY
// ============================================================
function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(1); opacity: 0; }
    }
    @keyframes particleBurst {
      to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
    .gold-text { color: var(--gold) !important; }
    .task-category-tag {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 10px;
      letter-spacing: 0.5px;
    }
    .chart-label.gold-text { font-weight: 600; }
    .empty-state { animation: fadeIn 0.4s ease; }
  `;
  document.head.appendChild(style);
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  injectDynamicStyles();
  initPreloader();
  initCursor();
  initParticles();
  initLoginTabs();
  startLiveClock();

  // Add ripple to all buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary, .btn-gold, .btn-secondary');
    if (btn) createRipple(e, btn);
  });

  // Click outside notifications to close
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notif-panel');
    const notifBtn = e.target.closest('.notif-btn');
    if (panel && panel.classList.contains('active') && !panel.contains(e.target) && !notifBtn) {
      panel.classList.remove('active');
    }
  });

  // Report modal close buttons
  const reportClose = document.querySelector('#report-modal .modal-close');
  if (reportClose) {
    reportClose.addEventListener('click', () => {
      document.getElementById('report-modal')?.classList.remove('active');
    });
  }

  // Confirm modal cancel
  const confirmCancel = document.getElementById('confirm-cancel');
  if (confirmCancel) {
    confirmCancel.addEventListener('click', () => {
      document.getElementById('confirm-modal')?.classList.remove('active');
    });
  }
});