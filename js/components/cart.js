import { formatBRL } from "./renderers.js";
import { ICONS } from "./icons.js";

const STORAGE_KEY = "performa_cart_v1";

export class CartManager {
  constructor() {
    this.items = this.load();
    this.couponApplied = false;
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  addItem(product, variantIndex = 0, size = null, qty = 1) {
    const variant = product.variants[variantIndex] || product.variants[0];
    const selectedSize = size || product.sizes[0];
    const key = `${product.id}_${variant.colorName}_${selectedSize}`;

    const existing = this.items.find((item) => item.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({
        key,
        productId: product.id,
        name: product.name,
        price: product.price,
        colorName: variant.colorName,
        image: variant.image,
        filterCss: variant.filterCss,
        size: selectedSize,
        qty
      });
    }
    this.save();
    this.render();
  }

  updateQty(key, delta) {
    const item = this.items.find((i) => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.items = this.items.filter((i) => i.key !== key);
    }
    this.save();
    this.render();
  }

  removeItem(key) {
    this.items = this.items.filter((i) => i.key !== key);
    this.save();
    this.render();
  }

  itemsForCheckout() {
    return this.items.map((item) => ({ product_id: item.productId, quantity: item.qty, size: item.size, color: item.colorName }));
  }

  clear() {
    this.items = [];
    this.couponApplied = false;
    this.save();
    this.render();
  }

  applyCoupon(code) {
    if (code.trim().toUpperCase() === "PERFORMA10") {
      this.couponApplied = true;
      this.render();
      return true;
    }
    return false;
  }

  getTotals() {
    const totalItems = this.items.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = this.items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const discount = this.couponApplied ? subtotal * 0.1 : 0;
    const shipping = subtotal === 0 || subtotal - discount >= 299 ? 0 : 24.9;
    const total = Math.max(0, subtotal - discount + shipping);
    return { totalItems, subtotal, discount, shipping, total };
  }

  render() {
    const badgeEl = document.getElementById("cart-badge");
    const listEl = document.getElementById("cart-items-list");
    const subtotalEl = document.getElementById("cart-subtotal");
    const shippingEl = document.getElementById("cart-shipping");
    const discountRowEl = document.getElementById("cart-discount-row");
    const discountValEl = document.getElementById("cart-discount-val");
    const totalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("btn-open-checkout");

    const { totalItems, subtotal, discount, shipping, total } = this.getTotals();

    if (badgeEl) badgeEl.textContent = totalItems;

    if (!listEl) return;

    if (this.items.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-5 text-secondary">
          <p class="mb-2 text-white fw-semibold">Seu carrinho está vazio</p>
          <p class="small">Adicione tênis ou equipamentos esportivos para continuar.</p>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      if (checkoutBtn) checkoutBtn.disabled = false;
      listEl.innerHTML = this.items
        .map(
          (item) => `
          <div class="cart-item-row">
            <div class="cart-item-thumb">
              <img src="${item.image}" alt="${item.name}" style="filter: ${item.filterCss};" />
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <h4 class="h6 mb-1 text-white" style="font-size: 0.84rem;">${item.name}</h4>
                <button type="button" class="btn btn-sm text-white p-0" data-remove-cart="${item.key}" aria-label="Remover item">
                  ${ICONS.trash}
                </button>
              </div>
              <p class="small text-secondary mb-2">Cor: ${item.colorName} | Tam: ${item.size}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="qty-control">
                  <button type="button" data-qty-delta="-1" data-qty-key="${item.key}">-</button>
                  <span>${item.qty}</span>
                  <button type="button" data-qty-delta="1" data-qty-key="${item.key}">+</button>
                </div>
                <strong class="text-white" style="font-size: 0.9rem;">${formatBRL(item.price * item.qty)}</strong>
              </div>
            </div>
          </div>
        `
        )
        .join("");
    }

    if (subtotalEl) subtotalEl.textContent = formatBRL(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "GRÁTIS" : formatBRL(shipping);

    if (discountRowEl && discountValEl) {
      if (discount > 0) {
        discountRowEl.classList.remove("d-none");
        discountValEl.textContent = `- ${formatBRL(discount)}`;
      } else {
        discountRowEl.classList.add("d-none");
      }
    }

    if (totalEl) totalEl.textContent = formatBRL(total);
  }
}
