// Fade loader on window load
$(window).on("load", function () {
  $(".loader").fadeOut(500);
});

$(document).ready(function () {
  $("#slides").superslides({
    animation: "fade",
    play: 5000,
    pagination: false,
  });

  new Typed(".typed", {
    strings: [
      "Web Developer",
      "Python Developer",
      "2D Artist Illustrator and Animator",
    ],
    typeSpeed: 70,
    loop: true,
    startDelay: 1000,
    showCursor: false,
  });

  $("[data-fancybox]").fancybox();
});

document.querySelectorAll('.main-nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerOffset = document.querySelector(".main-nav").offsetHeight;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".main-nav");
  const header = document.querySelector("header");
  const headerBottom = header.offsetTop + header.offsetHeight;

  if (window.pageYOffset > headerBottom) {
    navbar.classList.add("fixed");
  } else {
    navbar.classList.remove("fixed");
  }
});

// Improved visibility detection for mobile and initial view
window.addEventListener("DOMContentLoaded", () => {
  const observedSections = [
    document.querySelector(".about-container"),
    document.querySelector("#portfolio"),
  ];

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01 }
  );

  observedSections.forEach((section) => {
    if (section) {
      observer.observe(section);

      // Fallback: add "show" immediately if already visible on load
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        section.classList.add("show");
      }
    }
  });
});

let loadedImageCount = 0;

function loadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) return;

  const tempImg = new Image();
  tempImg.src = src;

  tempImg.onload = function () {
    img.src = src;
    img.classList.remove("lazy-img");
    img.style.opacity = "1";

    loadedImageCount++;
    if (loadedImageCount === 12) {
      window.dispatchEvent(new Event("resize"));
    }
  };
}

const observer = new IntersectionObserver(
  (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observerInstance.unobserve(img);
      }
    });
  },
  { rootMargin: "200px" }
);

function createImageItem(category, thumbSrc, fullSrc, link = "") {
  const li = document.createElement("li");
  const classKey = category.toLowerCase().replace(/\s+/g, "-");
  li.className = `${classKey} col-xs-6 col-sm-4 col-md-3 col-lg-3`;
  li.setAttribute("data-category", classKey);

  let iconsHTML = `
    <a href="${fullSrc}" data-fancybox data-caption="${category}" class="openButton">
      <i class="fa fa-search"></i>
    </a>`;

  if (link && link !== "https://www.instagram.com/") {
    iconsHTML += `
      <a href="${link}" target="_blank" class="projectLink">
        <i class="fa fa-link"></i>
      </a>`;
  }

  li.innerHTML = `
    <div class="item">
      <img data-src="${thumbSrc}" class="lazy-img" />
      <div class="icons">${iconsHTML}</div>
      <div class="imageOverlay"></div>
    </div>
  `;

  return li;
}

function loadPortfolioItemsFromJSON() {
  fetch("portfolio_data.json")
    .then((res) => res.json())
    .then((data) => {
      const container = document.querySelector(".items");
      if (!container) {
        console.error("No .items container found!");
        return;
      }

      container.innerHTML = "";

      Object.entries(data).forEach(([category, items]) => {
        items.forEach(({ thumb, full, link }) => {
          const li = createImageItem(category, thumb, full, link);
          container.appendChild(li);
        });
      });

      document.querySelectorAll("img.lazy-img").forEach((img) => {
        observer.observe(img);
      });

      document.querySelectorAll("#filters a").forEach((button) => {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          document
            .querySelector("#filters .current")
            ?.classList.remove("current");
          this.classList.add("current");

          const filterValue = this.getAttribute("data-filter").replace(".", "");
          document.querySelectorAll(".items li").forEach((li) => {
            if (filterValue === "*" || li.classList.contains(filterValue)) {
              li.style.display = "";
            } else {
              li.style.display = "none";
            }
          });
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load portfolio_data.json", err);
    });
}

window.addEventListener("load", () => {
  loadPortfolioItemsFromJSON();
});
