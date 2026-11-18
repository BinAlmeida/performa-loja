import { ICONS } from "./icons.js";

export function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function renderStars(count = 5) {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += ICONS.starFilled;
  }
  return html;
}

export function renderSubnav(container, categories, activeFilter) {
  container.innerHTML = categories
    .map(
      (cat) => `
      <li>
        <a href="#catalogo" class="subnav-link ${activeFilter === cat.filter ? "active" : ""}" data-filter="${cat.filter}">
          ${cat.label}
        </a>
      </li>
    `
    )
    .join("");
}

export function renderCategoryCircles(container, categories, activeFilter) {
  container.innerHTML = categories
    .map(
      (cat) => `
      <button type="button" class="category-circle-card ${activeFilter === cat.id ? "active" : ""}" data-cat-filter="${cat.id}">
        <div class="category-circle-badge">
          ${ICONS[cat.iconKey]}
        </div>
        <span class="category-circle-label">${cat.label}</span>
      </button>
    `
    )
    .join("");
}

export function buildProductCardHTML(product, colClass = "catalog-product-slide") {
  const activeVariant = product.variants[0];
  const dotsHTML = product.variants
    .map(
      (variant, idx) => `
      <button
        type="button"
        class="variant-dot ${idx === 0 ? "active" : ""}"
        data-product-id="${product.id}"
        data-variant-index="${idx}"
        title="${variant.colorName}"
        aria-label="Cor ${variant.colorName}">
      </button>
    `
    )
    .join("");

  return `
    <div class="${colClass}">
      <article class="product-card" data-product-card="${product.id}">
        <div>
          <div class="product-media-box" data-open-details="${product.id}">
            <img
              src="${activeVariant.image}"
              alt="${product.name}"
              style="filter: ${activeVariant.filterCss};"
              data-product-img="${product.id}"
            />
          </div>

          <div class="variant-dots">
            ${dotsHTML}
          </div>

          <h3 class="product-title">${product.name}</h3>

          <div class="product-rating-row">
            <span class="stars-white">${renderStars(5)}</span>
            <span>${product.rating.toFixed(1).replace(".", ",")} | ${product.reviewsCount} avaliações</span>
          </div>

          <span class="product-old-price">${formatBRL(product.oldPrice)}</span>

          <div class="product-price-row">
            <strong class="product-current-price">${formatBRL(product.price)}</strong>
            <span class="product-discount-tag">${product.discountPercent}% de desconto</span>
          </div>

          <p class="product-short-desc">${product.description}</p>
        </div>

        <div class="product-card-actions">
          <button type="button" class="btn-card-details" data-open-details="${product.id}">
            Ver detalhes
          </button>
          <button type="button" class="btn-card-cart" data-quick-add="${product.id}">
            Adicionar ao carrinho
          </button>
        </div>
      </article>
    </div>
  `;
}

export function renderProductGrid(container, productsList, emptyMessageEl, colClass = "col-12 col-sm-6 col-lg-3") {
  if (!productsList.length) {
    container.innerHTML = "";
    if (emptyMessageEl) emptyMessageEl.classList.remove("d-none");
    return;
  }
  if (emptyMessageEl) emptyMessageEl.classList.add("d-none");
  container.innerHTML = productsList.map((p) => buildProductCardHTML(p, colClass)).join("");
}

export function renderBenefits(container, benefits) {
  container.innerHTML = benefits
    .map(
      (b) => `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="benefit-item">
          <div class="benefit-icon-wrap">${ICONS[b.iconKey]}</div>
          <div>
            <h3>${b.title}</h3>
            <p>${b.description}</p>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

export function renderReviews(container, reviews) {
  container.innerHTML = reviews
    .map(
      (r) => `
      <div class="col-12 col-md-4">
        <div class="review-card">
          <div>
            <div class="review-stars">${renderStars(r.rating)}</div>
            <p class="review-text">"${r.comment}"</p>
          </div>
          <div class="review-author">
            <div>
              <strong>${r.name}</strong>
              <span>Comprou: ${r.product}</span>
            </div>
            <span class="badge bg-dark border border-secondary text-white">Verificado</span>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

export function renderFAQ(container, faqList) {
  container.innerHTML = faqList
    .map(
      (item, index) => `
      <div class="accordion-item">
        <h2 class="accordion-header" id="faqHeading${index}">
          <button
            class="accordion-button ${index !== 0 ? "collapsed" : ""}"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#faqCollapse${index}"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="faqCollapse${index}">
            ${item.question}
          </button>
        </h2>
        <div
          id="faqCollapse${index}"
          class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
          aria-labelledby="faqHeading${index}"
          data-bs-parent="#faqAccordion">
          <div class="accordion-body">
            ${item.answer}
          </div>
        </div>
      </div>
    `
    )
    .join("");
}
