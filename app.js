(function () {
  const CATEGORIES = ["All", "Electronics", "Clothing", "Home & Garden", "Vehicles", "Books", "Sports", "Toys", "Other"];
  const STORAGE_KEY = "smallmarket-products";
  const FAV_KEY = "smallmarket-favorites";

  const seedProducts = [
    {
      id: "seed-1", name: "Mountain Bike", description: "Lightly used mountain bike, great condition, 21-speed.",
      price: 180, category: "Sports", location: "Mekelle", contact: "0912345678", image: "", createdAt: Date.now() - 100000,
    },
    {
      id: "seed-2", name: "Study Desk", description: "Wooden desk, perfect for students. Sturdy and spacious.",
      price: 45, category: "Home & Garden", location: "Mekelle", contact: "0911223344", image: "", createdAt: Date.now() - 50000,
    },
    {
      id: "seed-3", name: "Used Laptop", description: "Works well, good for browsing and office work. Charger included.",
      price: 220, category: "Electronics", location: "Mekelle", contact: "0900112233", image: "", createdAt: Date.now(),
    },
  ];

  function loadProducts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
      return [...seedProducts];
    }
    return JSON.parse(raw);
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  function loadFavorites() {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  }

  function saveFavorites(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }

  let products = loadProducts();
  let favorites = loadFavorites();
  let activeCategory = "All";
  let searchTerm = "";

  const productGrid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const categoryFilter = document.getElementById("categoryFilter");
  const categorySelect = document.getElementById("categorySelect");
  const searchInput = document.getElementById("searchInput");
  const toast = document.getElementById("toast");

  const addModal = document.getElementById("addModal");
  const openAddBtn = document.getElementById("openAddBtn");
  const closeAddBtn = document.getElementById("closeAddBtn");
  const addForm = document.getElementById("addForm");
  const imageInput = document.getElementById("imageInput");

  const detailsModal = document.getElementById("detailsModal");
  const detailsContent = document.getElementById("detailsContent");

  function formatPrice(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function buildCategoryFilter() {
    categoryFilter.innerHTML = "";
    CATEGORIES.forEach((c) => {
      const chip = document.createElement("button");
      chip.className = "chip" + (c === activeCategory ? " active" : "");
      chip.textContent = c;
      chip.onclick = () => { activeCategory = c; buildCategoryFilter(); render(); };
      categoryFilter.appendChild(chip);
    });
  }

  function buildCategorySelect() {
    categorySelect.innerHTML = "";
    CATEGORIES.filter((c) => c !== "All").forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    });
  }

  function getFiltered() {
    return products
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  function render() {
    const list = getFiltered();
    productGrid.innerHTML = "";
    emptyState.style.display = list.length === 0 ? "block" : "none";

    list.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-card-image">
          ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="image-placeholder">No image</span>`}
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="product-card-location">${p.location}</p>
          <div class="product-card-price">${formatPrice(p.price)}</div>
        </div>
      `;
      card.onclick = () => openDetails(p.id);
      productGrid.appendChild(card);
    });
  }

  function openDetails(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const isFav = favorites.includes(id);
    const isMine = id.startsWith("mine-");

    detailsContent.innerHTML = `
      <div class="modal-head">
        <h2>${p.name}</h2>
        <button class="modal-close" id="closeDetailsBtn">&times;</button>
      </div>
      <div class="details-image">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="image-placeholder">No image</span>`}
      </div>
      <span class="product-card-category">${p.category}</span>
      <div class="details-price">${formatPrice(p.price)}</div>
      <p class="details-meta">📍 ${p.location}</p>
      <p>${p.description}</p>
      <div class="details-seller"><strong>Contact:</strong> ${p.contact}</div>
      <div class="details-actions">
        <button class="btn-ghost" id="favBtn">${isFav ? "♥ Saved" : "♡ Save"}</button>
        ${isMine ? `<button class="btn-danger" id="deleteBtn">Delete listing</button>` : ""}
      </div>
    `;

    document.getElementById("closeDetailsBtn").onclick = closeDetails;
    document.getElementById("favBtn").onclick = () => toggleFavorite(id);
    const deleteBtn = document.getElementById("deleteBtn");
    if (deleteBtn) deleteBtn.onclick = () => deleteProduct(id);

    detailsModal.classList.add("open");
  }

  function closeDetails() {
    detailsModal.classList.remove("open");
  }

  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter((f) => f !== id);
      showToast("Removed from saved");
    } else {
      favorites.push(id);
      showToast("Saved");
    }
    saveFavorites(favorites);
    openDetails(id);
  }

  function deleteProduct(id) {
    if (!confirm("Delete this listing?")) return;
    products = products.filter((p) => p.id !== id);
    saveProducts(products);
    closeDetails();
    render();
    showToast("Listing deleted");
  }

  // Add product form
  openAddBtn.onclick = () => addModal.classList.add("open");
  closeAddBtn.onclick = () => addModal.classList.remove("open");
  addModal.onclick = (e) => { if (e.target === addModal) addModal.classList.remove("open"); };
  detailsModal.onclick = (e) => { if (e.target === detailsModal) closeDetails(); };

  addForm.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const file = imageInput.files[0];

    const finish = (imageDataUrl) => {
      const product = {
        id: "mine-" + Date.now(),
        name: formData.get("name"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        category: formData.get("category"),
        location: formData.get("location"),
        contact: formData.get("contact"),
        image: imageDataUrl || "",
        createdAt: Date.now(),
      };
      products.push(product);
      saveProducts(products);
      addForm.reset();
      addModal.classList.remove("open");
      render();
      showToast("Item listed");
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => finish(reader.result);
      reader.readAsDataURL(file);
    } else {
      finish(null);
    }
  };

  searchInput.oninput = (e) => { searchTerm = e.target.value; render(); };

  buildCategoryFilter();
  buildCategorySelect();
  render();
})();
