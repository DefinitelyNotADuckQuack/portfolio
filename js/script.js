$(window).on("load", function() {
    $(".loader").fadeOut(500);
});

$(document).ready(function() {
    $("#slides").superslides({
        animation: "fade",
        play: 5000,
        pagination: false,
    });
    var typed = new Typed(".typed", {
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
});

$("[data-fancybox]").fancybox();

$(".items").isotope({
    filter: "*",
    animationOptions: {
        duration: 500,
        easing: "ease-in-out",
        queue: false,
    },
});

$("#filters a").click(function() {
    $("#filters .current").removeClass("current");
    $(this).addClass("current");

    var selector = $(this).attr("data-filter");

    $(".items").isotope({
        filter: selector,
        animationOptions: {
            duration: 500,
            easing: "ease-in-out",
            queue: false,
        },
    });
    return false;
});

$(window).on("load", function() {
    $(".items").isotope({
        filter: "*",
        animationOptions: {
            duration: 1500,
            easing: "linear",
            queue: false,
        },
    });
});
window.addEventListener("DOMContentLoaded", () => {
    const observedSections = [
        document.querySelector(".about-container"),
        document.querySelector("#portfolio"),
    ];

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        }, {
            threshold: 0.1
        }
    );

    observedSections.forEach((section) => {
        if (section) observer.observe(section);
    });
});

document.querySelectorAll('.main-nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
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