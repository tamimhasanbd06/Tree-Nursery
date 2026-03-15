const categoriesContainer = document.getElementById("categoriesContainer");
const treesContainer = document.getElementById("treesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allTreesbtn = document.getElementById("allTreesbtn");
const treeDetailsModal = document.getElementById("tree-details-modal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalTitle = document.getElementById("modalTitle");
const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");
const emptyCartMessage = document.getElementById("emptyCartMessage");
let cart = [];

// Loading
function showLoading() {
  loadingSpinner.classList.remove("hidden");
  treesContainer.innerHTML = "";
}
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

// Category btn
async function loadCategories() {
  // async await
  const res = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const data = await res.json();
  //   console.log(data);
  //   console.log(categoriesContainer);
  data.categories.forEach((category) => {
    // console.log(category);
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full";
    btn.textContent = category.category_name;
    btn.onclick = () => selectCategory(category.id, btn);
    categoriesContainer.appendChild(btn);
  });
}

async function selectCategory(categoryId, btn) {
  console.log(categoryId, btn);
  showLoading();

  // Update active button style
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesbtn",
  );
  //   console.log(allButtons);
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  btn.classList.add("btn-primary");
  btn.classList.remove("btn-outline");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/category/${categoryId}`,
  );
  const data = await res.json();
  console.log(data);
  displayTrees(data.plants);

  hideLoading();
}

allTreesbtn.addEventListener("click", () => {
  // Update active button style
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesbtn",
  );
  //   console.log(allButtons);
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  allTreesbtn.classList.add("btn-primary");
  allTreesbtn.classList.remove("btn-outline");

  loadTrees();
});

// Trees load and display
async function loadTrees() {
  showLoading();
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  hideLoading();
  displayTrees(data.plants);
}
function displayTrees(trees) {
  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className = `card bg-white shadow-sm border-b-2 ${tree.price > 500 ? "border-red-500" : "border-green-500"}`;
    card.innerHTML = `<figure>
        <img
          src="${tree.image}"
          alt="${tree.name}"
          title="${tree.name}"
          class="h-48 w-full object-cover cursor-pointer"
          onclick="openTreeModal(${tree.id})"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title cursor-pointer hover:text-[#4ade80]" onclick="openTreeModal(${tree.id})">${tree.name}</h2>
        <p class="line-clamp-2">
          ${tree.description}
        </p>
        <div class="badge badge-success badge-outline">${tree.category}</div>

        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl ${tree.price > 500 ? "text-red-500" : "text-[#4ade80]"}">$${tree.price}</h2>
          <button class="btn btn-primary" onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})">Cart</button>
        </div>
      </div>`;
    treesContainer.appendChild(card);
  });
}
async function openTreeModal(treeId) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
  );
  const data = await res.json();
  const plantDetails = data.plants;
  modalTitle.textContent = plantDetails.name;
  modalImage.src = plantDetails.image;
  modalCategory.textContent = plantDetails.category;
  modalDescription.textContent = plantDetails.description;
  modalPrice.textContent = plantDetails.price;
  treeDetailsModal.showModal();
}
loadCategories();
loadTrees();

// cart
function addToCart(id, name, price) {
  console.log(id, name, price, "add to cart");
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }

  updateCart();
}
function updateCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMessage.classList.remove("hidden");
    totalPrice.textContent = `$${0}`;
    return;
  }

  emptyCartMessage.classList.add("hidden");

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.className = "card card-body bg-slate-100 font-semibold";
    cartItem.innerHTML = `<div class="flex justify-between items-center">
                                <div>
                                    <h2>${item.name}</h2>
                                    <p> $${item.price} × ${item.quantity}</p>
                                </div>
                                <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">X</button>
                            </div>
                            <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>`;

    cartContainer.appendChild(cartItem);
  });

  totalPrice.innerText = `$${total}`;
}
function removeFromCart(treeId) {
  const updatedCartElements = cart.filter((item) => item.id != treeId);
  cart = updatedCartElements;
  updateCart();
}
