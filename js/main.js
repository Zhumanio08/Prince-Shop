// ============================================
// PRINCE — Main Application
// ============================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ========== ELEMENTS ==========
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const modalOverlay = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalDescription = document.getElementById("modalDescription");
  const modalAvailability = document.getElementById("modalAvailability");
  const sizesGrid = document.getElementById("sizesGrid");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const galleryImg = document.getElementById("galleryImg");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const zoomBtn = document.getElementById("zoomBtn");
  const zoomOverlay = document.getElementById("zoomOverlay");
  const zoomImage = document.getElementById("zoomImage");
  const zoomClose = document.getElementById("zoomClose");
  const catalogGrid = document.getElementById("catalogGrid");

  let currentProduct = null;
  let currentImageIndex = 0;

  // ========== HEADER SCROLL EFFECT ==========
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  // ========== BURGER MENU ==========
  const navOverlay = document.getElementById("navOverlay");

  const toggleMenu = () => {
    const isActive = !nav.classList.contains("active");
    burger.classList.toggle("active");
    nav.classList.toggle("active");
    if (navOverlay) navOverlay.classList.toggle("active");
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  burger.addEventListener("click", toggleMenu);

  if (navOverlay) {
    navOverlay.addEventListener("click", toggleMenu);
  }

  // Close menu on link click
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // Close menu on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      toggleMenu();
    }
  });

  // ========== RENDER CATALOG ==========
  const renderCatalog = () => {
    if (!catalogGrid) return;

    catalogGrid.innerHTML = products
      .map(
        (product, index) => `
        <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${index * 0.1}s">
          <div class="product-card__image">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-card__info">
            <h3 class="product-card__title">${product.name}</h3>
            <span class="product-card__price">${product.price}</span>
          </div>
        </div>
      `,
      )
      .join("");

    // Add click handlers
    catalogGrid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = parseInt(card.dataset.productId);
        const product = products.find((p) => p.id === id);
        if (product) {
          openModal(product);
        }
      });
    });
  };

  renderCatalog();

  // Helper: determine if product is in stock (at least one size available)
  const isInStock = (product) => product.sizes.some((s) => s.available);

  // ========== MODAL ==========
  const openModal = (product) => {
    currentProduct = product;
    currentImageIndex = 0;

    const inStock = isInStock(product);

    modalTitle.textContent = product.name;
    modalPrice.textContent = product.price;
    modalDescription.textContent = product.description;
    modalAvailability.textContent = inStock ? "В наличии" : "Нет в наличии";
    modalAvailability.className =
      "modal__availability " +
      (inStock
        ? "modal__availability--in-stock"
        : "modal__availability--out-of-stock");

    // Set WhatsApp link
    const message = encodeURIComponent(product.whatsappMessage);
    whatsappBtn.href = `https://wa.me/77754782111?text=${message}`;
    whatsappBtn.setAttribute("data-product-name", product.name);

    // Show/hide WhatsApp button based on availability
    whatsappBtn.style.display = inStock ? "inline-flex" : "none";

    // Render sizes
    renderSizes(product);

    // Render gallery
    renderGallery(product);

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  // ========== SIZES ==========
  const renderSizes = (product) => {
    if (!sizesGrid) return;

    sizesGrid.innerHTML = product.sizes
      .map(
        (size) => `
        <button class="size-btn${size.available ? "" : " size-btn--disabled"}" data-size="${size.name}" ${size.available ? "" : "disabled"}>${size.name}</button>
      `,
      )
      .join("");

    // Select first available size by default
    const firstAvailableBtn = sizesGrid.querySelector(
      ".size-btn:not(.size-btn--disabled)",
    );
    if (firstAvailableBtn) {
      firstAvailableBtn.classList.add("active");

      // Update WhatsApp message with first available size
      if (currentProduct) {
        const selectedSize = firstAvailableBtn.dataset.size;
        const message = encodeURIComponent(
          `${currentProduct.whatsappMessage} Размер: ${selectedSize}.`,
        );
        whatsappBtn.href = `https://wa.me/77754782111?text=${message}`;
      }
    }

    sizesGrid
      .querySelectorAll(".size-btn:not(.size-btn--disabled)")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          sizesGrid
            .querySelectorAll(".size-btn")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Update WhatsApp message with selected size
          if (currentProduct) {
            const selectedSize = btn.dataset.size;
            const message = encodeURIComponent(
              `${currentProduct.whatsappMessage} Размер: ${selectedSize}.`,
            );
            whatsappBtn.href = `https://wa.me/77754782111?text=${message}`;
          }
        });
      });
  };

  // ========== GALLERY ==========
  const renderGallery = (product) => {
    if (!galleryImg || !galleryThumbs) return;

    galleryImg.src = product.images[0];
    galleryImg.alt = product.name;

    galleryThumbs.innerHTML = product.images
      .map(
        (img, index) => `
        <div class="gallery__thumb ${index === 0 ? "active" : ""}" data-index="${index}">
          <img src="${img}" alt="${product.name} - фото ${index + 1}" loading="lazy">
        </div>
      `,
      )
      .join("");

    galleryThumbs.querySelectorAll(".gallery__thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const index = parseInt(thumb.dataset.index);
        setGalleryImage(index);
      });
    });
  };

  const setGalleryImage = (index) => {
    if (!currentProduct) return;
    currentImageIndex = index;
    galleryImg.src = currentProduct.images[index];
    galleryImg.alt = currentProduct.name;

    galleryThumbs.querySelectorAll(".gallery__thumb").forEach((thumb) => {
      thumb.classList.toggle("active", parseInt(thumb.dataset.index) === index);
    });
  };

  // ========== ZOOM ==========
  zoomBtn.addEventListener("click", () => {
    if (!galleryImg.src) return;
    zoomImage.src = galleryImg.src;
    zoomOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  const closeZoom = () => {
    zoomOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  zoomClose.addEventListener("click", closeZoom);

  zoomOverlay.addEventListener("click", (e) => {
    if (e.target === zoomOverlay) {
      closeZoom();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && zoomOverlay.classList.contains("active")) {
      closeZoom();
    }
  });

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
  const animateOnScroll = () => {
    const animatedElements = document.querySelectorAll(
      ".advantage-card, .product-card",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            entry.target.style.animationDelay = `${delay}ms`;
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    animatedElements.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  };

  animateOnScroll();

  // ========== ACTIVE NAV LINK ON SCROLL ==========
  const updateActiveNavLink = () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav__link");

    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });

  // ========== INITIAL CHECK FOR HEADER ==========
  handleHeaderScroll();

  console.log("PRINCE — сайт успешно загружен");
});
