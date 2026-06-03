import { loadComponents } from "./components-loader.js";
import { getGallery, getProducts, getTestimonials } from "./data.js";

const whatsappBaseUrl = "https://wa.me/6281933305777";
const catalogItemsPerPage = 3;

const categoryBadgeClasses = {
  "Mesin Baru": "border-blue-200 bg-blue-100 text-blue-900",
  "Mesin Rekondisi": "border-emerald-200 bg-emerald-100 text-emerald-900",
  Supplies: "border-amber-200 bg-amber-100 text-amber-900",
  Sparepart: "border-rose-200 bg-rose-100 text-rose-900"
};

function getCategoryBadgeClass(category) {
  return categoryBadgeClasses[category] || "border-slate-200 bg-slate-100 text-slate-900";
}

function getProductMeta(product) {
  const [brand, ...typeParts] = product.name.split(" ");

  return {
    brand,
    type: typeParts.join(" ") || product.name
  };
}

function getProductImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  return [product.image];
}

function getProductDetailItems(product) {
  if (Array.isArray(product.detailSpecs) && product.detailSpecs.length > 0) {
    return product.detailSpecs;
  }

  const categoryDetails = {
    "Mesin Baru": [
      "Unit baru bergaransi dan siap digunakan untuk operasional kantor.",
      "Cocok untuk kebutuhan print, copy, scan, dan workflow dokumen harian.",
      "Dapat dikonsultasikan sesuai volume cetak, lokasi, dan skenario pemakaian.",
      "Mendukung instalasi awal agar mesin siap dipakai dengan alur kerja yang rapi.",
      "Rekomendasi unit dapat disesuaikan dengan kebutuhan kantor, sekolah, atau usaha.",
      "Tim Herajaya membantu arahan penggunaan dan perawatan dasar setelah pembelian.",
      "Opsi pengadaan dapat dibahas sesuai prioritas performa, fitur, dan budget."
    ],
    "Mesin Rekondisi": [
      "Unit rekondisi siap pakai dengan pengecekan fungsi utama sebelum pengiriman.",
      "Pilihan ekonomis untuk kebutuhan operasional menengah hingga aktif.",
      "Rekomendasi kondisi unit dapat disesuaikan dengan target volume kerja.",
      "Cocok untuk pelanggan yang membutuhkan mesin produktif dengan investasi lebih efisien.",
      "Fungsi print, copy, scan, dan paper feed dapat dikonsultasikan sesuai kebutuhan.",
      "Tim teknis dapat membantu memberi arahan perawatan agar pemakaian lebih stabil.",
      "Dukungan sparepart dan supplies dapat disiapkan untuk kebutuhan operasional lanjutan."
    ],
    Supplies: [
      "Consumable pendukung untuk menjaga hasil cetak tetap stabil.",
      "Dapat dikonsultasikan berdasarkan tipe mesin dan kebutuhan pemakaian.",
      "Cocok untuk stok operasional kantor, sekolah, dan fotocopy center.",
      "Membantu menjaga kualitas output dokumen agar tetap tajam dan konsisten.",
      "Kebutuhan jumlah stok dapat disesuaikan dengan volume cetak bulanan.",
      "Tim Herajaya dapat membantu mengecek kecocokan supplies dengan tipe mesin.",
      "Pengadaan supplies dapat dikombinasikan dengan kebutuhan service atau sparepart."
    ],
    Sparepart: [
      "Komponen pengganti untuk maintenance dan perbaikan mesin fotocopy.",
      "Pengecekan kompatibilitas dapat dibantu oleh tim teknis Herajaya.",
      "Membantu mengurangi downtime dan menjaga performa mesin tetap terkontrol.",
      "Cocok untuk penggantian komponen aus pada pemakaian harian yang aktif.",
      "Tim teknis dapat memberi arahan part yang paling relevan sesuai gejala mesin.",
      "Sparepart dapat dikonsultasikan bersama jadwal pengecekan atau service mesin.",
      "Mendukung operasional agar alur cetak, scan, dan copy tetap lancar."
    ]
  };

  return [
    product.specs,
    ...(categoryDetails[product.category] || [
      "Detail kebutuhan dapat dikonsultasikan dengan tim Herajaya.",
      "Rekomendasi akan disesuaikan dengan kondisi operasional pelanggan."
    ])
  ].slice(0, 6);
}

function getProductCtaText(product) {
  if (product.category === "Supplies") {
    return "Order Supplies via Whatsapp";
  }

  if (product.category === "Sparepart") {
    return "Konsultasi Sparepart";
  }

  return "Konsultasi / Order Unit";
}

function createProductCard(product) {
  return `
    <article class="group flex h-full flex-col overflow-hidden border border-white/70 bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10">
      <div class="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22%3E%3Crect width=%22800%22 height=%22600%22 fill=%22%23e2e8f0%22/%3E%3Crect x=%22230%22 y=%22150%22 width=%22340%22 height=%22260%22 rx=%2224%22 fill=%22%230f172a%22/%3E%3Crect x=%22272%22 y=%22195%22 width=%22256%22 height=%2280%22 rx=%2212%22 fill=%22%23f8fafc%22/%3E%3Crect x=%22272%22 y=%22310%22 width=%22180%22 height=%2224%22 fill=%22%232563eb%22/%3E%3Crect x=%22272%22 y=%22352%22 width=%22230%22 height=%2224%22 fill=%22%2394a3b8%22/%3E%3C/svg%3E';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-80"></div>
        <span class="absolute left-4 top-4 border px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur ${getCategoryBadgeClass(product.category)}">
          ${product.category}
        </span>
      </div>

      <div class="flex flex-1 flex-col p-6">
        <h3 class="catalog-card-title text-xl font-bold leading-snug text-slate-950">${product.name}</h3>
        <p class="mt-3 text-sm leading-7 text-slate-600">${product.specs}</p>

        <div class="mt-auto grid grid-cols-2 gap-3 pt-6">
          <button
            type="button"
            data-product-detail="${product.id}"
            class="inline-flex min-h-11 items-center justify-center border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            Detail
          </button>
          <a
            href="${whatsappBaseUrl}?text=${encodeURIComponent(`Halo Herajaya, saya ingin konsultasi tentang ${product.name}.`)}"
            class="inline-flex min-h-11 items-center justify-center bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            target="_blank"
            rel="noopener"
          >
            Whatsapp
          </a>
        </div>
      </div>
    </article>
  `;
}

function ensureProductModal() {
  if (document.querySelector("#productModal")) {
    return;
  }

  const modal = document.createElement("div");
  modal.id = "productModal";
  modal.className = "product-modal hidden";
  modal.innerHTML = `
    <div class="product-modal-backdrop" data-modal-close></div>
    <article class="product-modal-panel" role="dialog" aria-modal="true" aria-labelledby="productModalTitle">
      <button type="button" class="product-modal-close" data-modal-close aria-label="Tutup detail produk">
        <i data-lucide="x" aria-hidden="true"></i>
      </button>
      <div id="productModalContent"></div>
    </article>
  `;

  document.body.appendChild(modal);
  initIcons();

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.querySelector("#productImageLightbox")) {
      return;
    }

    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeProductModal();
    }
  });
}

function openProductImageLightbox(images, initialIndex, altText) {
  const existingLightbox = document.querySelector("#productImageLightbox");

  if (existingLightbox) {
    existingLightbox.remove();
  }

  let activeImageIndex = initialIndex;
  const hasImageSlider = images.length > 1;
  const lightbox = document.createElement("div");
  lightbox.id = "productImageLightbox";
  lightbox.className = "product-image-lightbox";
  lightbox.innerHTML = `
    <div class="product-image-lightbox-backdrop" data-image-lightbox-close></div>
    <article class="product-image-lightbox-panel" role="dialog" aria-modal="true" aria-label="Foto produk diperbesar">
      <button type="button" class="product-image-lightbox-close" data-image-lightbox-close aria-label="Tutup foto produk">
        <i data-lucide="x" aria-hidden="true"></i>
      </button>
      <img
        src="${images[activeImageIndex]}"
        alt="${altText}"
        class="product-image-lightbox-photo"
        data-image-lightbox-photo
        onerror="this.src='assets/images/products/placeholder-copier.svg';"
      />
      ${hasImageSlider ? `
        <button
          type="button"
          class="product-image-lightbox-nav product-image-lightbox-prev"
          data-image-lightbox-nav="previous"
          aria-label="Foto produk sebelumnya"
        >
          <i data-lucide="chevron-left" class="h-6 w-6" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="product-image-lightbox-nav product-image-lightbox-next"
          data-image-lightbox-nav="next"
          aria-label="Foto produk berikutnya"
        >
          <i data-lucide="chevron-right" class="h-6 w-6" aria-hidden="true"></i>
        </button>
        <div class="product-image-lightbox-counter" data-image-lightbox-counter>
          ${activeImageIndex + 1} / ${images.length}
        </div>
      ` : ""}
    </article>
  `;

  document.body.appendChild(lightbox);
  initIcons();

  const photo = lightbox.querySelector("[data-image-lightbox-photo]");
  const counter = lightbox.querySelector("[data-image-lightbox-counter]");

  function setActiveImage(nextIndex) {
    activeImageIndex = (nextIndex + images.length) % images.length;
    photo.src = images[activeImageIndex];

    if (counter) {
      counter.textContent = `${activeImageIndex + 1} / ${images.length}`;
    }
  }

  function closeLightbox() {
    lightbox.remove();
    document.removeEventListener("keydown", handleLightboxKeydown);
  }

  function handleLightboxKeydown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeLightbox();
    }

    if (event.key === "ArrowLeft" && hasImageSlider) {
      setActiveImage(activeImageIndex - 1);
    }

    if (event.key === "ArrowRight" && hasImageSlider) {
      setActiveImage(activeImageIndex + 1);
    }
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-image-lightbox-close]")) {
      closeLightbox();
      return;
    }

    const navButton = event.target.closest("[data-image-lightbox-nav]");

    if (navButton) {
      const direction = navButton.dataset.imageLightboxNav === "next" ? 1 : -1;
      setActiveImage(activeImageIndex + direction);
    }
  });

  document.addEventListener("keydown", handleLightboxKeydown);
}

function openProductModal(product) {
  ensureProductModal();

  const modal = document.querySelector("#productModal");
  const content = document.querySelector("#productModalContent");
  const meta = getProductMeta(product);
  const detailItems = getProductDetailItems(product);
  const productImages = getProductImages(product);
  const hasImageSlider = productImages.length > 1;
  let activeImageIndex = 0;
  const whatsappText = `Halo Herajaya, saya ingin konsultasi/order ${product.name} (${product.category}). Mohon info detail dan rekomendasinya.`;

  content.innerHTML = `
    <div class="grid gap-6 lg:min-h-[32rem] lg:grid-cols-[0.95fr_1.05fr]">
      <div class="min-h-full">
        <div class="product-modal-photo-frame relative h-full min-h-[18rem] overflow-hidden border border-blue-200/20 bg-slate-900" data-product-zoom>
          <img
            src="${productImages[0]}"
            alt="${product.name}"
            class="h-full min-h-[18rem] w-full object-contain p-4"
            data-product-carousel-image
            onerror="this.src='assets/images/products/placeholder-copier.svg';"
          />
          <div class="product-modal-photo-hint">Klik untuk memperbesar</div>
          ${hasImageSlider ? `
            <button
              type="button"
              class="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur transition hover:border-blue-300 hover:bg-blue-600/80"
              data-product-carousel="previous"
              aria-label="Foto produk sebelumnya"
            >
              <i data-lucide="chevron-left" class="h-5 w-5" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/70 text-white shadow-lg backdrop-blur transition hover:border-blue-300 hover:bg-blue-600/80"
              data-product-carousel="next"
              aria-label="Foto produk berikutnya"
            >
              <i data-lucide="chevron-right" class="h-5 w-5" aria-hidden="true"></i>
            </button>
            <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden="true">
              ${productImages.map((_, index) => `<span class="h-2 w-2 rounded-full ${index === 0 ? "bg-blue-300" : "bg-white/35"}" data-product-carousel-dot="${index}"></span>`).join("")}
            </div>
          ` : ""}
          <span class="absolute left-4 top-4 border px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur ${getCategoryBadgeClass(product.category)}">
            ${product.category}
          </span>
        </div>
      </div>

      <div class="flex flex-col pt-8 lg:pt-10">
        <h3 id="productModalTitle" class="text-2xl font-black leading-tight text-white sm:text-3xl">${product.name}</h3>

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="border border-white/10 bg-white/5 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Merk</p>
            <p class="mt-1 font-black text-white">${meta.brand}</p>
          </div>
          <div class="border border-white/10 bg-white/5 p-4">
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Type</p>
            <p class="mt-1 font-black text-white">${meta.type}</p>
          </div>
        </div>

        <div class="mt-5">
          <p class="text-sm font-black text-white">Deskripsi & Spesifikasi</p>
          <ul class="mt-3 space-y-3 text-sm leading-7 text-slate-300">
            ${detailItems.map((item) => `<li class="flex gap-3"><span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]"></span><span>${item}</span></li>`).join("")}
          </ul>
        </div>

        <a
          href="${whatsappBaseUrl}?text=${encodeURIComponent(whatsappText)}"
          class="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-1 hover:bg-blue-500"
          target="_blank"
          rel="noopener"
        >
          ${getProductCtaText(product)}
        </a>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  initIcons();

  const carouselImage = content.querySelector("[data-product-carousel-image]");
  const carouselButtons = content.querySelectorAll("[data-product-carousel]");
  const carouselDots = content.querySelectorAll("[data-product-carousel-dot]");
  const zoomTarget = content.querySelector("[data-product-zoom]");

  function setActiveImage(nextIndex) {
    activeImageIndex = (nextIndex + productImages.length) % productImages.length;
    carouselImage.src = productImages[activeImageIndex];
    carouselDots.forEach((dot, index) => {
      dot.classList.toggle("bg-blue-300", index === activeImageIndex);
      dot.classList.toggle("bg-white/35", index !== activeImageIndex);
    });
  }

  if (hasImageSlider) {
    carouselButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.productCarousel === "next" ? 1 : -1;
        setActiveImage(activeImageIndex + direction);
      });
    });
  }

  zoomTarget.addEventListener("click", (event) => {
    if (event.target.closest("[data-product-carousel]")) {
      return;
    }

    openProductImageLightbox(productImages, activeImageIndex, product.name);
  });
}

function closeProductModal() {
  const modal = document.querySelector("#productModal");
  const lightbox = document.querySelector("#productImageLightbox");

  if (!modal) {
    return;
  }

  if (lightbox) {
    lightbox.remove();
  }

  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function createTestimonialCard(testimonial) {
  return `
    <article class="premium-card rounded-lg p-7">
      <p class="text-sm leading-7 text-slate-600">"${testimonial.quote}"</p>
      <div class="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
        <img
          src="${testimonial.image}"
          alt="Foto ${testimonial.name}"
          class="h-16 w-16 shrink-0 rounded-full border border-blue-200 object-cover shadow-lg shadow-blue-950/20"
          loading="lazy"
        />
        <div>
          <h3 class="font-black text-slate-950">${testimonial.name}</h3>
          <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">${testimonial.segment}</p>
        </div>
      </div>
    </article>
  `;
}

function createGalleryItem(item) {
  return `
    <article class="group overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg shadow-slate-900/5">
      <div class="aspect-[4/3] overflow-hidden bg-slate-200">
        <img
          src="${item.image}"
          alt="${item.title}"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onerror="this.src='assets/images/products/placeholder-copier.svg';"
        />
      </div>
      <div class="p-5">
        <p class="text-xs font-black uppercase tracking-[0.16em] text-blue-600">${item.category}</p>
        <h3 class="mt-2 font-black text-slate-950">${item.title}</h3>
      </div>
    </article>
  `;
}

function setActiveFilter(activeButton) {
  document.querySelectorAll(".catalog-filter").forEach((button) => {
    button.classList.remove("bg-slate-950", "text-white");
    button.classList.add("text-slate-600", "hover:bg-slate-100");
  });

  activeButton.classList.add("bg-slate-950", "text-white");
  activeButton.classList.remove("text-slate-600", "hover:bg-slate-100");
}

function createCatalogPagination(currentPage, totalPages) {
  if (totalPages <= 1) {
    return "";
  }

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    const isActive = page === currentPage;

    return `
      <button
        type="button"
        class="catalog-page-button inline-grid h-11 w-11 place-items-center rounded-xl border text-sm font-black shadow-lg shadow-slate-950/20 backdrop-blur transition ${isActive ? "border-blue-400 bg-blue-600/35 text-white ring-1 ring-blue-300/50" : "border-white/15 bg-white/10 text-blue-100 hover:border-blue-400 hover:bg-blue-600/25 hover:text-white"}"
        data-page="${page}"
        aria-label="Buka halaman katalog ${page}"
        ${isActive ? 'aria-current="page"' : ""}
      >
        ${page}
      </button>
    `;
  }).join("");

  return `
    <button
      type="button"
      class="catalog-page-button inline-grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-blue-100 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:border-blue-400 hover:bg-blue-600/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/15 disabled:hover:bg-white/10 disabled:hover:text-blue-100"
      data-page-action="previous"
      ${currentPage === 1 ? "disabled" : ""}
      aria-label="Halaman katalog sebelumnya"
    >
      <i data-lucide="chevron-left" class="h-5 w-5"></i>
    </button>
    ${pageButtons}
    <button
      type="button"
      class="catalog-page-button inline-grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/10 text-blue-100 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:border-blue-400 hover:bg-blue-600/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-white/15 disabled:hover:bg-white/10 disabled:hover:text-blue-100"
      data-page-action="next"
      ${currentPage === totalPages ? "disabled" : ""}
      aria-label="Halaman katalog berikutnya"
    >
      <i data-lucide="chevron-right" class="h-5 w-5"></i>
    </button>
  `;
}

function renderProducts(products, category = "all", currentPage = 1) {
  const catalogGrid = document.querySelector("#catalogGrid");
  const catalogPagination = document.querySelector("#catalogPagination");

  if (!catalogGrid) {
    return;
  }

  const filteredProducts =
    category === "all" ? products : products.filter((product) => product.category === category);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / catalogItemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageStart = (safePage - 1) * catalogItemsPerPage;
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + catalogItemsPerPage);

  catalogGrid.innerHTML = visibleProducts.map(createProductCard).join("");

  if (catalogPagination) {
    catalogPagination.innerHTML = createCatalogPagination(safePage, totalPages);
  }

  initIcons();
}

async function initCatalog() {
  const catalogGrid = document.querySelector("#catalogGrid");

  if (!catalogGrid) {
    return;
  }

  try {
    const products = await getProducts();
    let activeCategory = "all";
    let currentPage = 1;

    ensureProductModal();
    renderProducts(products, activeCategory, currentPage);

    catalogGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-product-detail]");

      if (!button) {
        return;
      }

      const product = products.find((item) => item.id === button.dataset.productDetail);

      if (product) {
        openProductModal(product);
      }
    });

    document.querySelectorAll(".catalog-filter").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        currentPage = 1;
        setActiveFilter(button);
        renderProducts(products, activeCategory, currentPage);
      });
    });

    const catalogPagination = document.querySelector("#catalogPagination");

    if (catalogPagination) {
      catalogPagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page-action], [data-page]");

        if (!button || button.disabled) {
          return;
        }

        if (button.dataset.page) {
          currentPage = Number(button.dataset.page);
        } else {
          currentPage += button.dataset.pageAction === "next" ? 1 : -1;
        }

        renderProducts(products, activeCategory, currentPage);
      });
    }
  } catch (error) {
    console.error("Catalog render error:", error);
    catalogGrid.innerHTML = `
      <div class="border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        Katalog belum dapat dimuat. Silakan cek file data/products.json.
      </div>
    `;
  }
}

async function initTestimonials() {
  const testimonialGrid = document.querySelector("#testimonialGrid");

  if (!testimonialGrid) {
    return;
  }

  try {
    const testimonials = await getTestimonials();
    testimonialGrid.innerHTML = testimonials.map(createTestimonialCard).join("");
  } catch (error) {
    console.error("Testimonial render error:", error);
    testimonialGrid.innerHTML = `
      <div class="border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        Testimoni belum dapat dimuat.
      </div>
    `;
  }
}

async function initGallery() {
  const galleryGrid = document.querySelector("#galleryGrid");

  if (!galleryGrid) {
    return;
  }

  try {
    const galleryItems = await getGallery();
    galleryGrid.innerHTML = galleryItems.map(createGalleryItem).join("");
  } catch (error) {
    console.error("Gallery render error:", error);
    galleryGrid.innerHTML = `
      <div class="border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        Galeri belum dapat dimuat.
      </div>
    `;
  }
}

function initNavigation() {
  const menuToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");

  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initFooterYear() {
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function initFloatingWhatsapp() {
  localStorage.removeItem("floatingWhatsappPosition");

  const existingWidget = document.querySelector("#floatingWhatsapp");

  if (existingWidget) {
    existingWidget.remove();
  }

  const widget = document.createElement("a");
  widget.id = "floatingWhatsapp";
  widget.href = `${whatsappBaseUrl}?text=${encodeURIComponent("Halo Herajaya, saya ingin konsultasi solusi mesin fotocopy.")}`;
  widget.target = "_blank";
  widget.rel = "noopener";
  widget.setAttribute("aria-label", "Chat Whatsapp Herajaya");
  widget.innerHTML = `
    <span class="floating-whatsapp-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M16 4.5A11.4 11.4 0 0 0 6.5 22.2L5 27l5-1.45A11.42 11.42 0 1 0 16 4.5Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2.2"/>
        <path d="M12.05 10.35c-.25-.56-.52-.58-.76-.59h-.65c-.22 0-.58.08-.88.4-.3.33-1.16 1.13-1.16 2.76s1.19 3.2 1.35 3.42c.16.22 2.3 3.68 5.68 5.02 2.8 1.11 3.37.89 3.98.83.61-.06 1.97-.81 2.25-1.59.28-.78.28-1.45.2-1.59-.08-.14-.3-.22-.63-.39-.33-.17-1.97-.97-2.28-1.08-.3-.11-.53-.17-.75.17-.22.33-.86 1.08-1.05 1.3-.19.22-.39.25-.72.08-.33-.17-1.41-.52-2.69-1.66-.99-.88-1.66-1.98-1.85-2.31-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.72-1.79-1-2.44Z" fill="currentColor"/>
      </svg>
    </span>
  `;

  document.body.appendChild(widget);
}

function formatCounterValue(value, counter) {
  if (counter.dataset.prefix === "1.") {
    if (value >= 1000) {
      return `1.000${counter.dataset.suffix || ""}`;
    }

    return `${value}${counter.dataset.suffix || ""}`;
  }

  return `${value}${counter.dataset.suffix || ""}`;
}

function animateCounter(counter, duration = 850) {
  const target = Number(counter.dataset.target || 0);
  const startTime = performance.now();

  if (counter.counterFrame) {
    cancelAnimationFrame(counter.counterFrame);
  }

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * easedProgress);

    counter.textContent = formatCounterValue(value, counter);

    if (progress < 1) {
      counter.counterFrame = requestAnimationFrame(update);
    }
  }

  counter.textContent = formatCounterValue(0, counter);
  counter.counterFrame = requestAnimationFrame(update);
}

function initStatCounters() {
  const statCards = document.querySelectorAll(".stat-card");

  statCards.forEach((card) => {
    const counter = card.querySelector(".stat-counter");

    if (!counter) {
      return;
    }

    animateCounter(counter, 900);

    card.addEventListener("mouseenter", () => animateCounter(counter));
    card.addEventListener("focusin", () => animateCounter(counter));
  });
}

function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function initApp() {
  await loadComponents();
  initNavigation();
  initFooterYear();
  initIcons();
  initFloatingWhatsapp();
  initStatCounters();
  await initCatalog();
  await initTestimonials();
  await initGallery();
}

initApp();
