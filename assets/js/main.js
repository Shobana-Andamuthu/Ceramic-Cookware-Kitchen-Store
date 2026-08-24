/* ==========================================================================
   CERAMIC KITCHEN STORE - MASTER JAVASCRIPT
   Theme (Dark/Light), Direction (LTR/RTL), Auth, Cart, Wishlist, Search, Gallery
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initAuth();
  initHeader();
  initCart();
  initWishlist();
  initSearch();
  initQuickView();
  initFAQ();
  initGalleryLightbox();
  initPageLoader();
  initBackToTop();
  initCategoryFilters();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (LIGHT / DARK MODE)
   -------------------------------------------------------------------------- */
function initTheme() {
  const currentTheme = localStorage.getItem('ceramic_theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.innerHTML = document.documentElement.classList.contains('dark') ? '☀ Light' : '☾ Dark';
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('ceramic_theme', isDark ? 'dark' : 'light');
  
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.innerHTML = isDark ? '☀ Light' : '☾ Dark';
  });
  showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`);
}

/* --------------------------------------------------------------------------
   2. DIRECTION TOGGLE (LTR / RTL)
   -------------------------------------------------------------------------- */
function initDirection() {
  const currentDir = localStorage.getItem('ceramic_direction') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);

  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  dirToggleBtns.forEach(btn => {
    btn.textContent = currentDir === 'rtl' ? 'LTR' : 'RTL';
    btn.addEventListener('click', toggleDirection);
  });
}

function toggleDirection() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('ceramic_direction', newDir);

  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  dirToggleBtns.forEach(btn => {
    btn.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
  });
  showToast(`Switched text direction to ${newDir.toUpperCase()}`);
}

/* --------------------------------------------------------------------------
   3. AUTHENTICATION STATE DEMO
   -------------------------------------------------------------------------- */
function initAuth() {
  const loggedInUser = localStorage.getItem('ceramic_user');
  const authActionBtns = document.querySelectorAll('.auth-action-btn');

  authActionBtns.forEach(btn => {
    if (loggedInUser) {
      btn.href = 'account.html';
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span class="hidden sm:inline">Account</span>
      `;
    } else {
      btn.href = 'login.html';
      btn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
        <span class="hidden sm:inline">Login</span>
      `;
    }
  });
}

/* --------------------------------------------------------------------------
   4. HEADER & MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  const mobileToggleBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function openMobileNav() {
    mobileNavDrawer?.classList.add('active');
    mobileNavBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavDrawer?.classList.remove('active');
    mobileNavBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggleBtn?.addEventListener('click', openMobileNav);
  closeMobileNavBtn?.addEventListener('click', closeMobileNav);
  mobileNavBackdrop?.addEventListener('click', closeMobileNav);

  // Mobile Menu Accordions
  const accordionHeaderBtns = document.querySelectorAll('.mobile-acc-btn');
  accordionHeaderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.acc-icon');
      if (content) {
        content.classList.toggle('hidden');
        icon?.classList.toggle('rotate-180');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. SHOPPING CART SYSTEM (LOCALSTORAGE)
   -------------------------------------------------------------------------- */
let cartItems = JSON.parse(localStorage.getItem('ceramic_kitchen_cart')) || [
  { id: 'prod-3', title: 'Durable Ceramic cooking pot with Lid', price: 1500.00, image: 'assets/images/products/ceramic-cooking-pot.png', qty: 1 },
  { id: 'prod-1', title: 'Mug Set, 3-Piece', price: 229.00, image: 'assets/images/products/mug-set.png', qty: 2 }
];

function initCart() {
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');

  function openCart() {
    cartDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    cartDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartToggleBtns.forEach(btn => btn.addEventListener('click', openCart));
  closeCartBtn?.addEventListener('click', closeCart);
  drawerOverlay?.addEventListener('click', closeCart);

  // Delegate Add To Cart Click Events
  document.body.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
      const id = addBtn.dataset.id || 'prod-' + Date.now();
      const title = addBtn.dataset.title || 'Handcrafted Ceramic Item';
      const price = parseFloat(addBtn.dataset.price || 450);
      const image = addBtn.dataset.image || 'assets/images/products/ceramic-cooking-pot.png';
      
      addToCart(id, title, price, image);
    }
  });

  renderCart();
}

function addToCart(id, title, price, image) {
  const existing = cartItems.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ id, title, price, image, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`Added "${title}" to your Shopping Bag!`);
}

function updateCartQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cartItems = cartItems.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
  }
}

function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  saveCart();
  renderCart();
  showToast('Item removed from cart');
}

function saveCart() {
  localStorage.setItem('ceramic_kitchen_cart', JSON.stringify(cartItems));
}

function renderCart() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartBadgeCounts = document.querySelectorAll('.badge-count');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  
  const totalCount = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

  cartBadgeCounts.forEach(el => el.textContent = totalCount);
  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹ ${subtotal.toFixed(2)}`;

  if (!cartContainer) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="text-center py-12 text-stone-500">
        <svg class="w-12 h-12 mx-auto text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <p class="font-serif font-semibold text-lg text-stone-700 dark:text-stone-300">Your Shopping Bag is empty</p>
        <p class="text-xs mt-1 text-stone-500">Explore our handcrafted collection to add items.</p>
        <a href="products.html" onclick="document.getElementById('cartDrawer').classList.remove('active'); document.getElementById('drawerOverlay').classList.remove('active'); document.body.style.overflow='';" class="btn-brown text-xs mt-4 inline-block">Browse Cookware &rarr;</a>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="flex-1">
        <h4 class="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">${item.title}</h4>
        <div class="text-xs font-bold text-amber-900 dark:text-amber-400 mt-0.5">₹ ${item.price.toFixed(2)}</div>
        <div class="flex items-center gap-2 mt-2">
          <div class="inline-flex items-center border border-brandBorder rounded bg-white dark:bg-stone-800 text-xs">
            <button onclick="updateCartQty('${item.id}', -1)" class="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700">-</button>
            <span class="px-2 text-stone-800 dark:text-stone-100 font-bold">${item.qty}</span>
            <button onclick="updateCartQty('${item.id}', 1)" class="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700">+</button>
          </div>
          <button onclick="removeFromCart('${item.id}')" class="text-xs text-red-600 hover:underline">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   6. WISHLIST SYSTEM (LOCALSTORAGE)
   -------------------------------------------------------------------------- */
let wishlistItems = JSON.parse(localStorage.getItem('ceramic_kitchen_wishlist')) || ['prod-3'];

function initWishlist() {
  updateWishlistBadges();
  document.body.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist-btn-card');
    if (wishBtn) {
      const id = wishBtn.dataset.id || 'prod-1';
      toggleWishlist(id, wishBtn);
    }
  });
}

function toggleWishlist(id, btnEl) {
  const index = wishlistItems.indexOf(id);
  if (index > -1) {
    wishlistItems.splice(index, 1);
    btnEl?.classList.remove('active');
    showToast('Removed from Wishlist');
  } else {
    wishlistItems.push(id);
    btnEl?.classList.add('active');
    showToast('Added to your Wishlist!');
  }
  localStorage.setItem('ceramic_kitchen_wishlist', JSON.stringify(wishlistItems));
  updateWishlistBadges();
}

function updateWishlistBadges() {
  const wishBadges = document.querySelectorAll('.wishlist-badge-count');
  wishBadges.forEach(el => el.textContent = wishlistItems.length);
}

/* --------------------------------------------------------------------------
   7. SEARCH OVERLAY & DYNAMIC SEARCH
   -------------------------------------------------------------------------- */
const searchDatabase = [
  { title: 'Durable Ceramic cooking pot with Lid', category: 'Cookware', price: '₹ 1,500.00', link: 'product-details.html', image: 'assets/images/products/ceramic-cooking-pot.png' },
  { title: 'Mug Set, 3-Piece', category: 'Dining', price: '₹ 229.00', link: 'product-details.html', image: 'assets/images/products/mug-set.png' },
  { title: 'Large Platter Plate', category: 'Dining', price: '₹ 159.00', link: 'product-details.html', image: 'assets/images/products/large-platter.png' },
  { title: 'Ceramic Serving Bowl', category: 'Dining', price: '₹ 340.00', link: 'product-details.html', image: 'assets/images/products/serving-bowl.png' },
  { title: 'Ceramic Storage Jar Set', category: 'Storage', price: '₹ 480.00', link: 'product-details.html', image: 'assets/images/products/storage-jar.png' },
  { title: 'Artisan Sourdough Baker', category: 'Bakeware', price: '₹ 1,250.00', link: 'product-details.html', image: 'assets/images/products/bakeware-casserole.png' },
  { title: 'Handcrafted Ceramic Fry Pan', category: 'Cookware', price: '₹ 1,180.00', link: 'product-details.html', image: 'assets/images/products/fry-pan.png' },
  { title: 'Material Guide: Ceramic vs Cast Iron', category: 'Guide', price: 'Free', link: 'material-guide.html', image: 'assets/images/products/ceramic-cooking-pot.png' },
  { title: 'Slow-Simmered Harvest Vegetable Stew Recipe', category: 'Recipe', price: 'Recipe', link: 'recipe-details.html', image: 'assets/images/recipes/recipe-stew.png' }
];

function initSearch() {
  const searchToggleBtns = document.querySelectorAll('#searchToggleBtn, .search-trigger-btn');
  const searchModalOverlay = document.getElementById('searchModalOverlay');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('globalSearchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');

  function openSearch() {
    searchModalOverlay?.classList.add('active');
    searchInput?.focus();
  }

  function closeSearch() {
    searchModalOverlay?.classList.remove('active');
  }

  searchToggleBtns.forEach(btn => btn.addEventListener('click', openSearch));
  closeSearchBtn?.addEventListener('click', closeSearch);

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      if (searchResultsContainer) searchResultsContainer.innerHTML = '<p class="text-xs text-stone-500 text-center py-4">Start typing to search products, recipes, and material guides...</p>';
      return;
    }

    const matches = searchDatabase.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = '<p class="text-xs text-stone-500 text-center py-6">No matching items or recipes found.</p>';
      return;
    }

    searchResultsContainer.innerHTML = matches.map(item => `
      <a href="${item.link}" class="flex items-center gap-3 p-2.5 hover:bg-brandTan/40 dark:hover:bg-stone-800 rounded-lg transition-colors border-b border-brandBorder/40">
        <img src="${item.image}" class="w-10 h-10 object-cover rounded border border-brandBorder">
        <div class="flex-1">
          <h4 class="text-xs font-semibold text-brandText dark:text-stone-200">${item.title}</h4>
          <span class="text-[10px] text-stone-500 uppercase font-semibold">${item.category}</span>
        </div>
        <span class="text-xs font-bold text-amber-900 dark:text-amber-400">${item.price}</span>
      </a>
    `).join('');
  });
}

/* --------------------------------------------------------------------------
   8. QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initQuickView() {
  const modalOverlay = document.getElementById('quickViewModal');
  const closeModalBtn = document.getElementById('closeQuickViewBtn');

  document.body.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('.btn-quick-view');
    if (qvBtn) {
      const title = qvBtn.dataset.title || 'Handcrafted Ceramic Pot';
      const price = qvBtn.dataset.price || '1,500.00';
      const image = qvBtn.dataset.image || 'assets/images/products/ceramic-cooking-pot.png';
      const category = qvBtn.dataset.category || 'Cookware';

      document.getElementById('qvTitle').textContent = title;
      document.getElementById('qvPrice').textContent = `₹ ${price}`;
      document.getElementById('qvCategory').textContent = category.toUpperCase();
      document.getElementById('qvImage').src = image;

      const qvCartBtn = document.getElementById('qvAddToCartBtn');
      if (qvCartBtn) {
        qvCartBtn.dataset.title = title;
        qvCartBtn.dataset.price = price;
        qvCartBtn.dataset.image = image;
      }

      modalOverlay?.classList.add('active');
    }
  });

  closeModalBtn?.addEventListener('click', () => modalOverlay?.classList.remove('active'));
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   9. FAQ ACCORDION & REALTIME FAQ SEARCH
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqAccordionBtns = document.querySelectorAll('.faq-accordion-btn, .faq-toggle');
  faqAccordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon, .acc-icon');
      
      faqAccordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          const otherContent = otherBtn.nextElementSibling;
          if (otherContent && (otherContent.classList.contains('faq-answer') || otherContent.classList.contains('faq-content'))) {
            otherContent.classList.add('hidden');
          }
          otherBtn.querySelector('.faq-icon, .acc-icon')?.classList.remove('rotate-180');
        }
      });

      if (content) {
        content.classList.toggle('hidden');
      }
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  });

  const faqSearchInput = document.getElementById('faqSearchInput');
  faqSearchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. GALLERY LIGHTBOX
   -------------------------------------------------------------------------- */
const galleryImages = [
  'assets/images/hero/hero-1.png',
  'assets/images/hero/hero-2.png',
  'assets/images/lifestyle/craftsmanship.png',
  'assets/images/recipes/recipe-stew.png',
  'assets/images/products/ceramic-cooking-pot.png',
  'assets/images/products/gift-starter-set.png',
  'assets/images/products/bakeware-casserole.png',
  'assets/images/products/fry-pan.png'
];
let currentLightboxIndex = 0;

function initGalleryLightbox() {
  const lightboxOverlay = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const prevBtn = document.getElementById('prevLightboxBtn');
  const nextBtn = document.getElementById('nextLightboxBtn');

  document.querySelectorAll('.gallery-item-trigger').forEach((item, idx) => {
    item.addEventListener('click', () => {
      currentLightboxIndex = idx;
      showLightboxImage();
      lightboxOverlay?.classList.add('active');
    });
  });

  function showLightboxImage() {
    if (lightboxImg && galleryImages[currentLightboxIndex]) {
      lightboxImg.src = galleryImages[currentLightboxIndex];
    }
  }

  prevBtn?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage();
  });

  nextBtn?.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    showLightboxImage();
  });

  closeBtn?.addEventListener('click', () => lightboxOverlay?.classList.remove('active'));
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* --------------------------------------------------------------------------
   12. STYLISH & SMOOTH PAGE LOADER
   -------------------------------------------------------------------------- */
function initPageLoader() {
  let loader = document.getElementById('pageLoader');
  
  // If element doesn't exist in static HTML, create it dynamically
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <span class="loader-brand">Ceramic Kitchen</span>
      <span class="loader-subtext">Handcrafted Artisanal Cookware</span>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
  }

  function hideLoader() {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 450);
    }
  }

  // Dismiss loader on window load or timeout fallback
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 800);
  }
}

/* --------------------------------------------------------------------------
   13. FLOATING CIRCULAR BACK TO TOP ARROW BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let btn = document.getElementById('backToTopBtn');
  
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = `
      <svg class="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   14. INTERACTIVE CATEGORY FILTERING (RECIPES & GALLERY)
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  // Recipe Category Filter
  const recipeBtns = document.querySelectorAll('.recipe-cat-btn');
  const recipeCards = document.querySelectorAll('.recipe-card-item');

  if (recipeBtns.length && recipeCards.length) {
    recipeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        
        recipeBtns.forEach(b => {
          b.classList.remove('bg-brandBrown', 'text-white', 'shadow-sm');
          b.classList.add('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        });

        btn.classList.remove('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        btn.classList.add('bg-brandBrown', 'text-white', 'shadow-sm');

        recipeCards.forEach(card => {
          const itemCat = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
          if (cat === 'all' || itemCat.includes(cat.toLowerCase())) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Gallery Category Filter
  const galleryBtns = document.querySelectorAll('.gallery-cat-btn');
  const galleryCards = document.querySelectorAll('.gallery-card-item');

  if (galleryBtns.length && galleryCards.length) {
    galleryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');

        galleryBtns.forEach(b => {
          b.classList.remove('bg-brandBrown', 'text-white', 'shadow-sm');
          b.classList.add('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        });

        btn.classList.remove('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        btn.classList.add('bg-brandBrown', 'text-white', 'shadow-sm');

        galleryCards.forEach(card => {
          const itemCat = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
          if (cat === 'all' || itemCat.includes(cat.toLowerCase())) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Gift Sets Category Filter
  const giftBtns = document.querySelectorAll('.gift-cat-btn');
  const giftCards = document.querySelectorAll('.gift-card-item');

  if (giftBtns.length && giftCards.length) {
    giftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');

        giftBtns.forEach(b => {
          b.classList.remove('bg-brandBrown', 'text-white', 'shadow-sm');
          b.classList.add('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        });

        btn.classList.remove('bg-brandCard', 'border', 'border-brandBorder', 'text-stone-700', 'dark:text-stone-300');
        btn.classList.add('bg-brandBrown', 'text-white', 'shadow-sm');

        giftCards.forEach(card => {
          const itemCat = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
          if (cat === 'all' || itemCat.includes(cat.toLowerCase())) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}
