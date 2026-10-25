const carousel = document.querySelector(".carousel");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".slide"));
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    const previousButton = carousel.querySelector(".previous");
    const nextButton = carousel.querySelector(".next");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeIndex = 0;
    let timer;
    let touchStartX = null;

    const showSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeIndex;
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle("is-active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    };

    const stopTimer = () => {
        window.clearInterval(timer);
    };

    const startTimer = () => {
        stopTimer();

        if (!prefersReducedMotion.matches && !document.hidden) {
            timer = window.setInterval(() => showSlide(activeIndex + 1), 6000);
        }
    };

    previousButton.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        startTimer();
    });

    nextButton.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        startTimer();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            startTimer();
        });
    });

    carousel.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch" && !event.target.closest("button")) {
            touchStartX = event.clientX;
        }
    });

    carousel.addEventListener("pointerup", (event) => {
        if (touchStartX === null) {
            return;
        }

        const distance = event.clientX - touchStartX;
        touchStartX = null;

        if (Math.abs(distance) >= 45) {
            showSlide(activeIndex + (distance < 0 ? 1 : -1));
            startTimer();
        }
    });

    carousel.addEventListener("pointercancel", () => {
        touchStartX = null;
    });

    carousel.addEventListener("mouseenter", stopTimer);
    carousel.addEventListener("mouseleave", startTimer);
    carousel.addEventListener("focusin", stopTimer);
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            startTimer();
        }
    });

    document.addEventListener("visibilitychange", startTimer);
    prefersReducedMotion.addEventListener("change", startTimer);

    startTimer();
}
