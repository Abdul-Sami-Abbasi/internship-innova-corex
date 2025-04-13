const imageInput = document.getElementById("image-input");
const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
let currentIndex = 0;
let images = JSON.parse(localStorage.getItem("imageGallery")) || [];

function saveToStorage() {
  localStorage.setItem("imageGallery", JSON.stringify(images));
}

imageInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => {
      images.push({ src: reader.result, caption: "Click to edit caption" });
      renderGallery();
      saveToStorage();
    };
    reader.readAsDataURL(file);
  });
});

function renderGallery() {
  gallery.innerHTML = "";
  images.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("draggable", true);
    card.dataset.index = index;

    card.innerHTML = `
      <img src="${img.src}" alt="Gallery Image">
      <button class="delete-btn" onclick="deleteImage(${index})">✖</button>
      <div class="caption" contenteditable oninput="updateCaption(${index}, this.innerText)">${img.caption}</div>
    `;

    // Lightbox preview
    card
      .querySelector("img")
      .addEventListener("click", () => openLightbox(index));

    // Drag & drop
    card.addEventListener("dragstart", () => card.classList.add("dragging"));
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (e) => e.preventDefault());
    card.addEventListener("drop", (e) => {
      const draggedIndex = gallery.querySelector(".dragging").dataset.index;
      const targetIndex = card.dataset.index;
      [images[draggedIndex], images[targetIndex]] = [
        images[targetIndex],
        images[draggedIndex],
      ];
      renderGallery();
      saveToStorage();
    });

    // Mobile touch support
    let touchStartX = 0;
    card.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      card.classList.add("dragging");
    });
    card.addEventListener("touchmove", (e) => {
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 30) {
        const target = document.elementFromPoint(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
        if (target && target.closest(".card")) {
          const targetIndex = target.closest(".card").dataset.index;
          const draggingIndex = card.dataset.index;
          [images[draggingIndex], images[targetIndex]] = [
            images[targetIndex],
            images[draggingIndex],
          ];
          renderGallery();
          saveToStorage();
        }
      }
    });
    card.addEventListener("touchend", () => card.classList.remove("dragging"));

    gallery.appendChild(card);
  });
}

function deleteImage(index) {
  images.splice(index, 1);
  renderGallery();
  saveToStorage();
}

function updateCaption(index, text) {
  images[index].caption = text;
  saveToStorage();
}

function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "flex";
  lightboxImg.src = images[index].src;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function navigateLightbox(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") navigateLightbox(1);
    if (e.key === "ArrowLeft") navigateLightbox(-1);
  }
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

renderGallery();
