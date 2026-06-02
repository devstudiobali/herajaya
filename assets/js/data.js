export async function getJsonData(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${path}. Status ${response.status}`);
  }

  return response.json();
}

export function getProducts() {
  return getJsonData("data/products.json");
}

export function getTestimonials() {
  return getJsonData("data/testimonials.json");
}

export function getGallery() {
  return getJsonData("data/gallery.json");
}
