// ====== AUTHENTICATION ======
const USERS_KEY = 'hoc_users';
const CURRENT_USER_KEY = 'hoc_current_user';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}
function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function showAuthOverlay() {
  document.getElementById('authOverlay').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
}
function hideAuthOverlay() {
  document.getElementById('authOverlay').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');
}

// Toggle between login and signup forms
const showLoginBtn = document.getElementById('showLogin');
const showSignupBtn = document.getElementById('showSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

showLoginBtn.addEventListener('click', () => {
  showLoginBtn.classList.add('active');
  showSignupBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  loginError.classList.add('hidden');
  signupError.classList.add('hidden');
});

showSignupBtn.addEventListener('click', () => {
  showSignupBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  loginError.classList.add('hidden');
  signupError.classList.add('hidden');
});

// Sign Up
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (!name || !email || !password) {
    signupError.textContent = 'All fields are required.';
    signupError.classList.remove('hidden');
    return;
  }
  if (password !== confirm) {
    signupError.textContent = 'Passwords do not match.';
    signupError.classList.remove('hidden');
    return;
  }
  if (password.length < 6) {
    signupError.textContent = 'Password must be at least 6 characters.';
    signupError.classList.remove('hidden');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    signupError.textContent = 'Email already registered. Please log in.';
    signupError.classList.remove('hidden');
    return;
  }

  const newUser = { name, email, password }; // In a real app, never store plaintext passwords
  users.push(newUser);
  saveUsers(users);
  setCurrentUser({ name, email });
  signupError.classList.add('hidden');
  updateUIForLoggedInUser();
  hideAuthOverlay();
  startMainApp();
});

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    loginError.textContent = 'Invalid email or password.';
    loginError.classList.remove('hidden');
    return;
  }
  loginError.classList.add('hidden');
  setCurrentUser({ name: user.name, email: user.email });
  updateUIForLoggedInUser();
  hideAuthOverlay();
  startMainApp();
});

// Logout
function logout() {
  clearCurrentUser();
  showAuthOverlay();
  document.getElementById('userDropdown').classList.add('hidden');
}

// Update UI after login
function updateUIForLoggedInUser() {
  const user = getCurrentUser();
  if (user) {
    document.getElementById('userDisplayName').textContent = user.name;
    document.getElementById('userMenuBtn').style.display = 'flex';
  }
}

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    updateUIForLoggedInUser();
    hideAuthOverlay();
    startMainApp();
  } else {
    showAuthOverlay();
    init3DHeart();
    initTypingEffect();
  }
});

// User dropdown toggle
document.getElementById('userMenuBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('userDropdown').classList.toggle('hidden');
});
document.addEventListener('click', () => {
  document.getElementById('userDropdown').classList.add('hidden');
});
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});

// ====== 3D HEART ======
function init3DHeart() {
  const canvas = document.getElementById('heroCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 30);

  // Heart shape
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push(new THREE.Vector2(x * 0.4, y * 0.4));
  }
  const heartGeo = new THREE.LatheGeometry(pts, 64);
  const heartMat = new THREE.MeshPhongMaterial({
    color: 0xff2a6d,
    emissive: 0x330000,
    emissiveIntensity: 0.4,
    shininess: 100,
  });
  const heart = new THREE.Mesh(heartGeo, heartMat);
  scene.add(heart);

  scene.add(new THREE.AmbientLight(0x404040));
  const dLight = new THREE.DirectionalLight(0xffffff, 1);
  dLight.position.set(1, 1, 1);
  scene.add(dLight);
  const bLight = new THREE.DirectionalLight(0xff8888, 0.8);
  bLight.position.set(-1, -1, -1);
  scene.add(bLight);

  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pCount = 800;
  const posArr = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i += 3) {
    posArr[i] = (Math.random() - 0.5) * 60;
    posArr[i + 1] = (Math.random() - 0.5) * 60;
    posArr[i + 2] = (Math.random() - 0.5) * 30;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xff2a6d,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  function animate() {
    requestAnimationFrame(animate);
    heart.rotation.y += 0.005;
    heart.rotation.x += 0.001;
    const scale = 1 + 0.02 * Math.sin(Date.now() * 0.01);
    heart.scale.set(scale, scale, scale);
    particles.rotation.y += 0.0002;
    particles.rotation.x += 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  renderer.setSize(innerWidth, innerHeight);
}

// ====== TYPING EFFECT ======
function initTypingEffect() {
  const words = ["Our Technology", "Your Lifeline", "Precision ECG"];
  const dyn = document.getElementById('heroDynamic');
  let wIdx = 0, cIdx = 0, del = false;
  function type() {
    const w = words[wIdx];
    dyn.textContent = w.substring(0, cIdx);
    if (!del) {
      if (cIdx < w.length) { cIdx++; setTimeout(type, 120); }
      else { setTimeout(() => del = true, 1500); setTimeout(type, 100); }
    } else {
      if (cIdx > 0) { cIdx--; setTimeout(type, 60); }
      else { del = false; wIdx = (wIdx + 1) % words.length; setTimeout(type, 200); }
    }
  }
  type();
}

// ====== MARKETPLACE INITIALIZATION ======
let mainAppStarted = false;
function startMainApp() {
  if (mainAppStarted) return;
  mainAppStarted = true;

  // Initialize 3D heart and typing if not already running
  if (!window.heartInitialized) {
    init3DHeart();
    initTypingEffect();
    window.heartInitialized = true;
  }

  // Scroll animations (bi‑directional)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('animated', entry.isIntersecting);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });

  // Search
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  searchToggle.addEventListener('click', () => searchOverlay.classList.remove('hidden'));
  closeSearch.addEventListener('click', () => searchOverlay.classList.add('hidden'));
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.add('hidden');
  });

  // Product data
  const products = [
    { id: 1, name: "ECG Monitor Pro", price: 4999, category: "device", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=400&fit=crop", desc: "12‑lead wireless ECG, AI analysis, PDF reports." },
    { id: 2, name: "AD8232 Sensor Module", price: 899, category: "module", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop", desc: "Single‑lead heart rate front‑end for DIY." },
    { id: 3, name: "Electrode Pads (50 pcs)", price: 299, category: "consumable", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop", desc: "Hypoallergenic adhesive pads." },
    { id: 4, name: "USB Data Cable", price: 199, category: "accessory", img: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop", desc: "Braided micro‑USB cable." },
    { id: 5, name: "Pro Software License", price: 999, category: "software", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop", desc: "Cloud storage & advanced AI." },
    { id: 6, name: "Carrying Case", price: 799, category: "accessory", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop", desc: "Custom foam protection." },
    { id: 7, name: "Smartphone Adapter", price: 349, category: "accessory", img: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop", desc: "OTG adapter for mobile." },
    { id: 8, name: "Reusable Leads (Set)", price: 599, category: "consumable", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=400&fit=crop", desc: "Snap‑on, latex‑free leads." }
  ];

  const grid = document.getElementById('productsGrid');
  function renderProducts(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-animate onclick="openModal(${p.id})">
        <div class="h-52 overflow-hidden"><img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover"></div>
        <div class="p-4">
          <h3 class="text-lg font-bold text-white">${p.name}</h3>
          <p class="text-slate-400 text-sm mt-1 line-clamp-2">${p.desc}</p>
          <div class="flex justify-between items-center mt-3">
            <span class="text-rose-400 font-bold text-xl">₹${p.price.toLocaleString()}</span>
            <button onclick="event.stopPropagation(); addToCart(${p.id})" class="bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full transition"><i class="fas fa-cart-plus mr-1"></i> Add</button>
          </div>
        </div>
      </div>
    `).join('');
    // Re‑observe newly added elements
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }
  renderProducts();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const matches = products.filter(p => p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
    searchResults.innerHTML = matches.map(p => `
      <div class="flex items-center gap-3 cursor-pointer hover:bg-slate-800 rounded-lg p-2" onclick="openModal(${p.id}); searchOverlay.classList.add('hidden')">
        <img src="${p.img}" class="w-10 h-10 rounded object-cover">
        <span class="text-white text-sm">${p.name}</span>
      </div>
    `).join('');
  });

  // Carousel
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = products.slice(0, 4).map(p => `
    <div class="carousel-item">
      <div class="product-card" onclick="openModal(${p.id})">
        <div class="h-44 overflow-hidden"><img src="${p.img}" alt="${p.name}" class="w-full h-full object-cover"></div>
        <div class="p-3">
          <h4 class="font-bold text-white text-sm">${p.name}</h4>
          <div class="flex justify-between items-center mt-2">
            <span class="text-rose-400 font-bold text-sm">₹${p.price.toLocaleString()}</span>
            <button onclick="event.stopPropagation(); addToCart(${p.id})" class="text-rose-400 text-lg"><i class="fas fa-plus-circle"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('carouselPrev').addEventListener('click', () => carousel.scrollBy({ left: -320, behavior: 'smooth' }));
  document.getElementById('carouselNext').addEventListener('click', () => carousel.scrollBy({ left: 320, behavior: 'smooth' }));

  // Touch swipe for carousel
  let isDown = false, startX, scrollLeft;
  carousel.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
  carousel.addEventListener('mouseleave', () => isDown = false);
  carousel.addEventListener('mouseup', () => isDown = false);
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollLeft - (x - startX) * 2;
  });
  carousel.addEventListener('touchstart', (e) => { isDown = true; startX = e.touches[0].pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
  carousel.addEventListener('touchend', () => isDown = false);
  carousel.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    carousel.scrollLeft = scrollLeft - (x - startX) * 2;
  });

  // ====== CART ======
  let cart = JSON.parse(localStorage.getItem('hocCart') || '[]');
  function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.classList.toggle('hidden', totalItems === 0);
    if (totalItems > 0) {
      badge.classList.add('badge-pop');
      setTimeout(() => badge.classList.remove('badge-pop'), 300);
    }

    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
      container.innerHTML = '<p class="text-slate-400 text-center text-sm">Your cart is empty.</p>';
      document.getElementById('checkoutBtn').disabled = true;
    } else {
      container.innerHTML = cart.map((item, idx) => {
        const p = products.find(p => p.id === item.productId);
        return `
          <div class="flex items-center bg-slate-800/50 rounded-xl p-3">
            <img src="${p.img}" class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover mr-3">
            <div class="flex-1">
              <h4 class="text-white text-sm font-medium">${p.name}</h4>
              <div class="flex items-center mt-1">
                <button onclick="updateQty(${idx}, -1)" class="text-slate-400 hover:text-white"><i class="fas fa-minus text-xs"></i></button>
                <span class="mx-2 text-white text-sm">${item.quantity}</span>
                <button onclick="updateQty(${idx}, 1)" class="text-slate-400 hover:text-white"><i class="fas fa-plus text-xs"></i></button>
              </div>
            </div>
            <span class="text-rose-400 font-bold text-sm">₹${(p.price * item.quantity).toLocaleString()}</span>
            <button onclick="removeItem(${idx})" class="ml-2 text-slate-400 hover:text-rose-400"><i class="fas fa-trash"></i></button>
          </div>`;
      }).join('');
      document.getElementById('checkoutBtn').disabled = false;
    }
    const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.productId).price * item.quantity, 0);
    document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;
    localStorage.setItem('hocCart', JSON.stringify(cart));
  }

  window.addToCart = (id, qty = 1) => {
    const existing = cart.find(item => item.productId === id);
    if (existing) existing.quantity += qty;
    else cart.push({ productId: id, quantity: qty });
    updateCartUI();
  };
  window.updateQty = (idx, change) => {
    cart[idx].quantity += change;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    updateCartUI();
  };
  window.removeItem = (idx) => {
    cart.splice(idx, 1);
    updateCartUI();
  };
  updateCartUI();

  // ====== PRODUCT MODAL ======
  window.openModal = (id) => {
    const p = products.find(p => p.id === id);
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalDesc').textContent = p.desc;
    document.getElementById('modalPrice').textContent = `₹${p.price.toLocaleString()}`;
    document.getElementById('modalQty').value = 1;
    document.getElementById('modalAddToCart').dataset.productId = id;
    document.getElementById('productModal').classList.add('active');
  };

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('productModal').classList.remove('active');
  });
  document.getElementById('modalAddToCart').addEventListener('click', () => {
    const id = parseInt(document.getElementById('modalAddToCart').dataset.productId);
    const qty = parseInt(document.getElementById('modalQty').value) || 1;
    addToCart(id, qty);
    document.getElementById('productModal').classList.remove('active');
  });
  document.getElementById('modalQtyMinus').addEventListener('click', () => {
    const q = document.getElementById('modalQty');
    if (q.value > 1) q.value--;
  });
  document.getElementById('modalQtyPlus').addEventListener('click', () => {
    const q = document.getElementById('modalQty');
    q.value++;
  });

  // ====== CART SIDEBAR ======
  document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
  });
  document.getElementById('closeCartBtn').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
  });

  // ====== CHECKOUT ======
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + products.find(p => p.id === item.productId).price * item.quantity, 0);
    document.getElementById('checkoutTotal').textContent = `₹${total.toLocaleString()}`;
    document.getElementById('checkoutModal').classList.add('active');
    document.getElementById('cartSidebar').classList.remove('open');
  });
  document.getElementById('closeCheckoutBtn').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('active');
  });
  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    cart = [];
    updateCartUI();
    document.getElementById('checkoutModal').classList.remove('active');
    alert('Order placed successfully! 🎉');
  });

  // ====== CONTACT FORM ======
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
  });
}