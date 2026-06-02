const components = [
  "navbar",
  "hero",
  "about",
  "why-us",
  "services",
  "catalog",
  "sparepart",
  "service-center",
  "rental",
  "business-consultation",
  "testimonial",
  "gallery",
  "faq",
  "cta",
  "footer"
];

const componentPath = (componentName) => `components/${componentName}.html`;

const createErrorMarkup = (componentName, message) => `
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Gagal memuat komponen <strong>${componentName}</strong>. ${message}
    </div>
  </section>
`;

async function fetchComponent(componentName) {
  try {
    const response = await fetch(componentPath(componentName));

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Component loader error: ${componentName}`, error);
    return createErrorMarkup(componentName, error.message);
  }
}

export async function loadComponents(targetSelector = "#app") {
  const target = document.querySelector(targetSelector);

  if (!target) {
    console.error(`Component loader error: target ${targetSelector} tidak ditemukan.`);
    return;
  }

  target.setAttribute("aria-busy", "true");

  const componentMarkup = await Promise.all(
    components.map((componentName) => fetchComponent(componentName))
  );

  target.innerHTML = componentMarkup.join("");
  target.removeAttribute("aria-busy");
}

export { components };
