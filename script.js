// ────────────────────────────────────────────────
const API_BASE = "https://openapi.programming-hero.com/api";

// DOM Elements
const categoriesList      = document.getElementById("categories-list");
const categoriesMobile    = document.getElementById("categories-mobile");
const productsGrid        = document.getElementById("products-grid");
const skeletonLoader      = document.getElementById("skeleton-loader");
const allTreesBtn         = document.getElementById("all-trees-btn");
const allTreesMobile      = document.getElementById("all-trees-mobile");
const priceRange          = document.getElementById("price-range");
const priceDisplay        = document.getElementById("price-display");
const priceRangeMobile    = document.getElementById("price-range-mobile");
const priceDisplayMobile  = document.getElementById("price-display-mobile");
const cartItems           = document.getElementById("cart-items");
const cartTotal           = document.getElementById("cart-total");
const emptyCart           = document.getElementById("empty-cart");
const themeToggle         = document.getElementById("theme-toggle");
const flyCart             = document.getElementById("fly-to-cart");
const toastContainer      = document.getElementById("toast-container");
const navbar              = document.getElementById("navbar");
const modal               = document.getElementById("product-modal");

// State
let allPlants      = [];
let cart           = JSON.parse(localStorage.getItem("cart")) || [];
let maxPrice       = 10000;
let currentMaxPrice = 10000;

// ────────────────────────────────────────────────
// Helpers
function showSkeleton() {
  skeletonLoader.classList.remove("hidden");
  productsGrid.classList.add("hidden");
}

function hideSkeleton() {
  skeletonLoader.classList.add("hidden");
  productsGrid.classList.remove("hidden");
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} shadow-lg max-w-xs`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function flyToCart(btn) {
  if (!btn || !flyCart) return;
  
  const rect = btn.getBoundingClientRect();
  const startX = rect.left + rect.width/2 - 24;
  const startY = rect.top + rect.height/2 - 24;

  flyCart.style.left = `${startX}px`;
  flyCart.style.top  = `${startY}px`;
  flyCart.style.transform = "scale(0.4)";
  flyCart.style.opacity = "0";
  flyCart.classList.remove("hidden");

  const cartRect = document.querySelector(".card-body")?.getBoundingClientRect() || {right: window.innerWidth-80, top: 120};
  const endX = cartRect.right - 80;
  const endY = cartRect.top + 80;

  requestAnimationFrame(() => {
    flyCart.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(1)`;
    flyCart.style.opacity = "1";
    setTimeout(() => {
      flyCart.classList.add("hidden");
      flyCart.style.transform = "";
      flyCart.style.opacity = "";
    }, 900);
  });
}

// ────────────────────────────────────────────────
// Cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    emptyCart.classList.remove("hidden");
    cartTotal.textContent = "$0.00";
    return;
  }

  emptyCart.classList.add("hidden");

  cart.forEach(item => {
    total += item.price * item.quantity;
    const el = document.createElement("div");
    el.className = "bg-base-200 rounded-xl p-4 flex justify-between items-center";
    el.innerHTML = `
      <div>
        <div class="font-semibold">${item.name}</div>
        <div class="text-sm opacity-70">$${item.price} × ${item.quantity}</div>
      </div>
      <div class="text-right font-bold text-success">$${(item.price * item.quantity).toFixed(0)}</div>
    `;
    cartItems.appendChild(el);
  });

  cartTotal.textContent = `$${total.toFixed(0)}`;
}

// ────────────────────────────────────────────────
// API & Rendering
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const { categories } = await res.json();

    const renderBtns = (container) => {
      container.innerHTML = "";
      categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline w-full";
        btn.textContent = cat.category_name;
        btn.onclick = () => loadCategory(cat.id, btn);
        container.appendChild(btn);
      });
    };

    renderBtns(categoriesList);
    renderBtns(categoriesMobile);
  } catch (err) {
    console.error("Categories failed", err);
  }
}

async function loadAllPlants() {
  showSkeleton();
  try {
    const res = await fetch(`${API_BASE}/plants`);
    const { plants } = await res.json();
    allPlants = plants;
    maxPrice = Math.max(...plants.map(p => p.price), 10000);
    priceRange.max = maxPrice;
    priceRangeMobile.max = maxPrice;
    filterAndRender();
  } catch (err) {
    console.error("Plants failed", err);
  }
}

async function loadCategory(id, clickedBtn) {
  showSkeleton();

  // Active state
  document.querySelectorAll("#categories-list button, #categories-mobile button, #all-trees-btn, #all-trees-mobile")
    .forEach(b => b.classList.replace("btn-primary", "btn-outline"));
  clickedBtn?.classList.replace("btn-outline", "btn-primary");

  try {
    const res = await fetch(`${API_BASE}/category/${id}`);
    const { plants } = await res.json();
    allPlants = plants;
    filterAndRender();
  } catch (err) {
    console.error(err);
  }
}

function filterAndRender() {
  const max = parseInt(priceRange.value);
  priceDisplay.textContent = `$${max}`;
  priceRangeMobile.value = max;
  priceDisplayMobile.textContent = `$${max}`;

  const filtered = allPlants.filter(p => p.price <= max);

  productsGrid.innerHTML = "";

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<div class="col-span-full text-center py-20 text-xl opacity-60">No trees in this price range</div>`;
    hideSkeleton();
    return;
  }

  filtered.forEach(plant => {
    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group";
    card.innerHTML = `
      <figure class="relative">
        <img src="${plant.image}" alt="${plant.name}" class="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" onclick="showDetails(${plant.id})" />
      </figure>
      <div class="card-body p-5">
        <h2 class="card-title text-lg cursor-pointer hover:text-success" onclick="showDetails(${plant.id})">${plant.name}</h2>
        <p class="text-sm line-clamp-2 opacity-70">${plant.description || "Beautiful tree for your garden"}</p>
        <div class="badge badge-outline badge-success mt-2">${plant.category}</div>
        <div class="flex justify-between items-center mt-4">
          <div class="text-2xl font-bold ${plant.price > 5000 ? 'text-error' : 'text-success'}">$${plant.price}</div>
          <button class="btn btn-success btn-sm" onclick="addToCart(${plant.id}, '${plant.name.replace(/'/g,"\\'")}', ${plant.price}, this)">Add</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  hideSkeleton();
}

async function showDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/plant/${id}`);
    const { plants: plant } = await res.json();

    document.getElementById("modal-name").textContent = plant.name;
    document.getElementById("modal-image").src = plant.image;
    document.getElementById("modal-category").textContent = plant.category;
    document.getElementById("modal-description").textContent = plant.description || "No description available.";
    document.getElementById("modal-price").textContent = plant.price;

    modal.showModal();
  } catch (err) {
    console.error(err);
  }
}

function addToCart(id, name, price, btn) {
  flyToCart(btn);
  showToast(`Added ${name}!`, "success");

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart();
  updateCartUI();
}

// ────────────────────────────────────────────────
// Event Listeners
allTreesBtn.onclick = () => {
  allTreesBtn.classList.replace("btn-outline", "btn-primary");
  allTreesMobile.classList.replace("btn-outline", "btn-primary");
  loadAllPlants();
};

allTreesMobile.onclick = allTreesBtn.onclick;

priceRange.oninput = filterAndRender;
priceRangeMobile.oninput = () => {
  priceRange.value = priceRangeMobile.value;
  filterAndRender();
};

themeToggle.onclick = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
};

// Scroll effect for navbar
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});

// Init
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

loadCategories();
loadAllPlants();
updateCartUI();