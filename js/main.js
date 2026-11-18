import { PRODUCTS } from "./data/products.js";
import {
  SUBNAV_CATEGORIES,
  PRODUCT_CATEGORIES,
  BENEFITS_DATA,
  FAQ_DATA
} from "./data/content.js";
import { ICONS } from "./components/icons.js";
import {
  formatBRL,
  renderStars,
  renderSubnav,
  renderCategoryCircles,
  renderProductGrid,
  renderBenefits,
  renderFAQ
} from "./components/renderers.js";
import { CartManager } from "./components/cart.js";

const state = {
  activeCategory: "todos",
  searchQuery: "",
  sortBy: "featured",
  selectedVariants: {}, // { productId: variantIndex }
  modalProductId: null,
  modalVariantIdx: 0,
  modalSize: null
};

const cart = new CartManager();
const CONTACT_ENDPOINT = ""; // Configure em js/config.js para ativar o envio real via Formspree.

function showToast(message) {
  const toastEl = document.getElementById("performa-toast");
  const toastMsg = document.getElementById("toast-message");
  if (!toastEl || !toastMsg) return;
  toastMsg.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2800);
}

function injectStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon");
    if (ICONS[key]) el.innerHTML = ICONS[key];
  });
}


function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const SEARCH_SYNONYMS = {
  ten: ["ten", "tenis", "running", "sneaker"],
  tenis: ["tenis", "running", "sneaker", "sapato"],
  calcado: ["calcado", "calcados", "tenis", "chuteira"],
  corrida: ["corrida", "running", "pace"],
  futebol: ["futebol", "chuteira", "society", "campo"],
  basquete: ["basquete", "basketball", "quadra"],
  blusao: ["blusao", "moletom", "jaqueta", "agasalho"],
  moletom: ["moletom", "blusao", "jaqueta", "agasalho"],
  suplemento: ["suplemento", "suplementos", "nutricao", "whey", "creatina"]
};

function productSearchText(product) {
  return normalizeSearch([
    product.name, product.description, product.category, product.subCategory,
    product.brand, product.gender, ...(product.tags || []),
    ...(product.variants || []).map((variant) => variant.colorName)
  ].join(" "));
}

function matchesCategory(product, category) {
  if (category === "todos") return true;
  if (category === "promocoes") return Boolean(product.featuredPromo);
  const name = normalizeSearch(product.name + " " + product.description);
  const categoryText = `${product.category || ""} ${product.subCategory || ""} ${(product.tags || []).join(" ")}`;
  const tags = normalizeSearch(categoryText);
  const rules = {
    calcados: () => product.category === "calcados" || /tenis|chuteira|calcado/.test(name),
    corrida: () => /corrida|running|pace/.test(tags + " " + name),
    futebol: () => /futebol|chuteira|society/.test(tags + " " + name),
    basquete: () => /basquete|basketball/.test(tags + " " + name),
    roupas: () => product.category === "roupas" || /camiseta|short|calca|blusao|moletom|jaqueta/.test(name),
    moletom: () => /blusao|moletom|jaqueta|agasalho/.test(name + " " + tags),
    suplementos: () => /suplemento|whey|creatina|nutricao/.test(name + " " + tags),
    marcas: () => Boolean(product.brand) || /adidas|olympikus|under armour|nike|puma/.test(name),
    homens: () => product.gender === "masculino" || /masculino|unissex/.test(tags) || /chuteira|masculino/.test(name),
    mulheres: () => product.gender === "feminino" || /feminino|feminina|ladies|unissex/.test(tags + " " + name),
    criancas: () => product.gender === "infantil" || /infantil|crianca/.test(tags)
  };
  return rules[category] ? rules[category]() : product.category === category || product.subCategory === category;
}

function getFilteredCatalog() {
  let list = PRODUCTS.filter((product) => matchesCategory(product, state.activeCategory));
  const query = normalizeSearch(state.searchQuery);
  if (query) {
    const terms = query.split(/\s+/).filter(Boolean);
    list = list.filter((product) => {
      const searchable = productSearchText(product);
      return terms.every((term) => {
        const alternatives = SEARCH_SYNONYMS[term] || [term];
        return alternatives.some((candidate) => {
          if (candidate === "tenis" && product.category === "calcados" && product.subCategory !== "futebol") return true;
          return searchable.includes(candidate) || candidate.startsWith(term) || term.startsWith(candidate);
        });
      });
    });
  }
  if (state.sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (state.sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (state.sortBy === "discount") list.sort((a, b) => b.discountPercent - a.discountPercent);
  return list;
}

function updateCatalogView() {
  const subnavEl = document.getElementById("subnav-list");
  const catCirclesEl = document.getElementById("categories-track");
  const catalogGridEl = document.getElementById("catalog-grid");
  const emptyEl = document.getElementById("catalog-empty");

  if (!subnavEl.dataset.rendered) {
    renderSubnav(subnavEl, SUBNAV_CATEGORIES, state.activeCategory);
    subnavEl.dataset.rendered = "true";
  }
  if (!catCirclesEl.dataset.rendered) {
    renderCategoryCircles(catCirclesEl, PRODUCT_CATEGORIES, state.activeCategory);
    catCirclesEl.dataset.rendered = "true";
  }
  renderProductGrid(catalogGridEl, getFilteredCatalog(), emptyEl, "catalog-product-slide");

  document.querySelectorAll(".filter-pill-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.pillFilter === state.activeCategory));
  document.querySelectorAll(".subnav-link").forEach((link) => link.classList.toggle("active", link.dataset.filter === state.activeCategory));
  document.querySelectorAll(".category-circle-card").forEach((card) => card.classList.toggle("active", card.dataset.catFilter === state.activeCategory));
}

function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const variantIdx = state.selectedVariants[productId] || 0;
  state.modalProductId = productId;
  state.modalVariantIdx = variantIdx;
  state.modalSize = product.sizes[0];

  const variant = product.variants[variantIdx];

  document.getElementById("modal-product-title").textContent = product.name;
  const imgEl = document.getElementById("modal-product-img");
  imgEl.src = variant.image;
  imgEl.style.filter = variant.filterCss;

  document.getElementById("modal-product-rating").innerHTML = `
    <span class="stars-white">${renderStars(5)}</span>
    <span class="small text-secondary ms-1">${product.rating.toFixed(1).replace(".", ",")} (${product.reviewsCount} avaliações)</span>
  `;
  document.getElementById("modal-product-old-price").textContent = formatBRL(product.oldPrice);
  document.getElementById("modal-product-price").textContent = formatBRL(product.price);
  document.getElementById("modal-product-discount").textContent = `${product.discountPercent}% OFF`;
  document.getElementById("modal-product-desc").textContent = product.description;
  document.getElementById("modal-selected-color").textContent = variant.colorName;

  // Renderiza cores no modal
  const colorsWrap = document.getElementById("modal-colors-wrap");
  colorsWrap.innerHTML = product.variants
    .map(
      (v, idx) => `
      <button
        type="button"
        class="btn btn-sm ${idx === variantIdx ? "btn-light text-dark fw-bold" : "btn-outline-light"}"
        data-modal-variant="${idx}">
        ${v.colorName}
      </button>
    `
    )
    .join("");

  // Renderiza tamanhos no modal
  const sizesWrap = document.getElementById("modal-sizes-wrap");
  sizesWrap.innerHTML = product.sizes
    .map(
      (sz, idx) => `
      <button
        type="button"
        class="size-option-btn ${idx === 0 ? "active" : ""}"
        data-modal-size="${sz}">
        ${sz}
      </button>
    `
    )
    .join("");

  const modalEl = document.getElementById("productDetailsModal");
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  bsModal.show();
}

function initEvents() {
  // Cliques delegados globais
  document.addEventListener("click", (e) => {
    // 1. Subnav laranja
    const subnavLink = e.target.closest(".subnav-link");
    if (subnavLink) {
      state.activeCategory = subnavLink.dataset.filter;
      updateCatalogView();
    }

    // 2. Círculos de Categoria
    const catCircle = e.target.closest("[data-cat-filter]");
    if (catCircle) {
      const chosen = catCircle.dataset.catFilter;
      state.activeCategory = state.activeCategory === chosen ? "todos" : chosen;
      updateCatalogView();
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }

    // 3. Pills do catálogo
    const pillBtn = e.target.closest("[data-pill-filter]");
    if (pillBtn) {
      state.activeCategory = pillBtn.dataset.pillFilter;
      updateCatalogView();
    }

    // 4. Dots de variação de cor no card
    const dotBtn = e.target.closest(".variant-dot");
    if (dotBtn) {
      const prodId = dotBtn.dataset.productId;
      const vIdx = Number(dotBtn.dataset.variantIndex);
      state.selectedVariants[prodId] = vIdx;

      const product = PRODUCTS.find((p) => p.id === prodId);
      if (product) {
        const variant = product.variants[vIdx];
        document.querySelectorAll(`[data-product-card="${prodId}"]`).forEach((card) => {
          const img = card.querySelector(`[data-product-img="${prodId}"]`);
          if (img) {
            img.src = variant.image;
            img.style.filter = variant.filterCss;
          }
          card.querySelectorAll(".variant-dot").forEach((d, idx) => {
            d.classList.toggle("active", idx === vIdx);
          });
        });
      }
    }

    // 5. Botão "Ver detalhes" ou clique na foto do produto
    const detailsTrigger = e.target.closest("[data-open-details]");
    if (detailsTrigger) {
      openProductModal(detailsTrigger.dataset.openDetails);
    }

    // 6. Botão "Adicionar ao carrinho" rápido no card
    const quickAddTrigger = e.target.closest("[data-quick-add]");
    if (quickAddTrigger) {
      const prodId = quickAddTrigger.dataset.quickAdd;
      const product = PRODUCTS.find((p) => p.id === prodId);
      if (product) {
        const vIdx = state.selectedVariants[prodId] || 0;
        cart.addItem(product, vIdx, product.sizes[0], 1);
        showToast(`"${product.name}" adicionado ao carrinho!`);
      }
    }

    // 7. Seleção de cor dentro do modal
    const modalVarBtn = e.target.closest("[data-modal-variant]");
    if (modalVarBtn && state.modalProductId) {
      const vIdx = Number(modalVarBtn.dataset.modalVariant);
      const product = PRODUCTS.find((p) => p.id === state.modalProductId);
      if (product) {
        state.modalVariantIdx = vIdx;
        const variant = product.variants[vIdx];
        const imgEl = document.getElementById("modal-product-img");
        imgEl.src = variant.image;
        imgEl.style.filter = variant.filterCss;
        document.getElementById("modal-selected-color").textContent = variant.colorName;

        document.querySelectorAll("[data-modal-variant]").forEach((b, i) => {
          b.className = `btn btn-sm ${i === vIdx ? "btn-light text-dark fw-bold" : "btn-outline-light"}`;
        });
      }
    }

    // 8. Seleção de tamanho dentro do modal
    const modalSizeBtn = e.target.closest("[data-modal-size]");
    if (modalSizeBtn) {
      state.modalSize = modalSizeBtn.dataset.modalSize;
      document.querySelectorAll("[data-modal-size]").forEach((b) => {
        b.classList.toggle("active", b.dataset.modalSize === state.modalSize);
      });
    }

    // 9. Controles do carrinho
    const qtyBtn = e.target.closest("[data-qty-delta]");
    if (qtyBtn) {
      cart.updateQty(qtyBtn.dataset.qtyKey, Number(qtyBtn.dataset.qtyDelta));
    }

    const removeBtn = e.target.closest("[data-remove-cart]");
    if (removeBtn) {
      cart.removeItem(removeBtn.dataset.removeCart);
    }
  });

  // Botão Adicionar dentro do Modal de Detalhes
  document.getElementById("modal-add-to-cart-btn")?.addEventListener("click", () => {
    const product = PRODUCTS.find((p) => p.id === state.modalProductId);
    if (!product) return;
    cart.addItem(product, state.modalVariantIdx, state.modalSize, 1);
    bootstrap.Modal.getInstance(document.getElementById("productDetailsModal"))?.hide();
    showToast(`${product.name} (Tam. ${state.modalSize}) adicionado!`);
  });

  // Busca em tempo real
  const searchInput = document.getElementById("header-search-input");
  searchInput?.addEventListener("input", (e) => {
    const y = window.scrollY;
    state.searchQuery = e.target.value;
    updateCatalogView();
    requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: "auto" }));
  });

  document.getElementById("header-search-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  });

  // Ordenação
  document.getElementById("catalog-sort-select")?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    updateCatalogView();
  });

  // Reset filtros
  document.getElementById("btn-reset-filters")?.addEventListener("click", () => {
    state.activeCategory = "todos";
    state.searchQuery = "";
    if (searchInput) searchInput.value = "";
    updateCatalogView();
  });

  // Cupom no carrinho
  document.getElementById("apply-coupon-btn")?.addEventListener("click", () => {
    const code = document.getElementById("cart-coupon-input")?.value || "";
    if (cart.applyCoupon(code)) {
      showToast("Cupom PERFORMA10 aplicado (10% OFF)!");
    } else {
      showToast("Cupom inválido. Use PERFORMA10.");
    }
  });

  document.getElementById("btn-open-checkout")?.addEventListener("click", () => {
    bootstrap.Offcanvas.getInstance(document.getElementById("cartOffcanvas"))?.hide();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("checkoutInfoModal")).show();
  });

  document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.getElementById("checkout-feedback");
    if (!cart.items.length) { feedback.textContent = "Seu carrinho está vazio."; return; }
    if (!e.currentTarget.reportValidity()) return;
    const customer = Object.fromEntries(new FormData(e.currentTarget));
    const order = {
      number: `DEMO-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer,
      items: cart.items.map(({ productId, name, price, qty, size, colorName }) => ({ productId, name, price, qty, size, color: colorName })),
      total: cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    };
    const orders = JSON.parse(localStorage.getItem("performa_demo_orders") || "[]");
    orders.push(order);
    localStorage.setItem("performa_demo_orders", JSON.stringify(orders));
    feedback.textContent = `Pedido demonstrativo ${order.number} salvo neste navegador. Esta versão estática não envia pedidos para um servidor nem processa pagamentos.`;
    cart.clear();
    e.currentTarget.reset();
    showToast("Pedido de demonstração registrado neste dispositivo.");
  });

  // Formulário de contato: validação JS + Formspree quando configurado.
  const contactForm = document.getElementById("contact-form");
  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    form.classList.add("was-validated");
    const feedback = document.getElementById("contact-feedback");
    if (!form.checkValidity()) { form.reportValidity(); feedback.textContent = "Revise os campos destacados."; return; }
    const endpoint = CONTACT_ENDPOINT || window.PERFORMA_CONFIG?.CONTACT_ENDPOINT || "";
    if (!endpoint) {
      const messages = JSON.parse(localStorage.getItem("performa_demo_messages") || "[]");
      messages.push({ ...Object.fromEntries(new FormData(form)), createdAt: new Date().toISOString() });
      localStorage.setItem("performa_demo_messages", JSON.stringify(messages));
      feedback.textContent = "Validação concluída. Mensagem salva apenas neste navegador (modo demonstração). Configure o Formspree para encaminhar ao e-mail.";
      form.reset(); form.classList.remove("was-validated"); return;
    }
    const submit = document.getElementById("contact-submit");
    submit.disabled = true; feedback.textContent = "Enviando mensagem...";
    try {
      const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("O serviço de formulário não aceitou o envio.");
      feedback.textContent = "Mensagem enviada! Obrigado por entrar em contato.";
      form.reset(); form.classList.remove("was-validated");
    } catch (error) { feedback.textContent = `${error.message} Tente novamente mais tarde.`; }
    finally { submit.disabled = false; }
  });

  // Carrossel horizontal de categorias
  const categoryTrack = document.getElementById("categories-track");
  document.getElementById("categories-next")?.addEventListener("click", () => categoryTrack?.scrollBy({ left: Math.max(220, categoryTrack.clientWidth * 0.75), behavior: "smooth" }));
  document.getElementById("categories-prev")?.addEventListener("click", () => categoryTrack?.scrollBy({ left: -Math.max(220, categoryTrack.clientWidth * 0.75), behavior: "smooth" }));
  const subnav = document.getElementById("subnav-list");
  document.getElementById("subnav-next")?.addEventListener("click", () => subnav?.scrollBy({ left: 240, behavior: "smooth" }));
  document.getElementById("subnav-prev")?.addEventListener("click", () => subnav?.scrollBy({ left: -240, behavior: "smooth" }));
  const catalogTrack = document.getElementById("catalog-grid");
  document.getElementById("catalog-next")?.addEventListener("click", () => catalogTrack?.scrollBy({ left: Math.max(260, catalogTrack.clientWidth * 0.8), behavior: "smooth" }));
  document.getElementById("catalog-prev")?.addEventListener("click", () => catalogTrack?.scrollBy({ left: -Math.max(260, catalogTrack.clientWidth * 0.8), behavior: "smooth" }));

  // Newsletter demonstrativa: persistência local no navegador.
  document.getElementById("newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletter-email");
    if (!input?.checkValidity()) { input?.reportValidity(); return; }
    const subscribers = JSON.parse(localStorage.getItem("performa_demo_newsletter") || "[]");
    const email = input.value.trim().toLowerCase();
    if (!subscribers.includes(email)) subscribers.push(email);
    localStorage.setItem("performa_demo_newsletter", JSON.stringify(subscribers));
    input.value = "";
    showToast("Inscrição demonstrativa salva neste navegador.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  injectStaticIcons();

  const bannerImage = document.querySelector(".hero-background-image");
  bannerImage?.addEventListener("error", () => { bannerImage.style.display = "none"; }, { once: true });

  // Renderiza Promoções (os 4 cards em destaque da foto)
  const promoProducts = PRODUCTS.filter((p) => p.featuredPromo);
  renderProductGrid(document.getElementById("promocoes-grid"), promoProducts);

  // Filtros do catálogo usam exatamente a mesma taxonomia da navbar.
  const filterPills = document.getElementById("filter-pills");
  if (filterPills) {
    filterPills.innerHTML = PRODUCT_CATEGORIES.map((category) => `<button type="button" class="filter-pill-btn ${category.id === "todos" ? "active" : ""}" data-pill-filter="${category.id}">${category.label}</button>`).join("");
  }
  // Renderiza Catálogo Completo e controles
  updateCatalogView();

  // Renderiza Benefícios, Reviews e FAQ
  renderBenefits(document.getElementById("benefits-grid"), BENEFITS_DATA);
  renderFAQ(document.getElementById("faqAccordion"), FAQ_DATA);

  // Sincroniza carrinho
  cart.render();
  initEvents();
});
