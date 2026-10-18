document.addEventListener("DOMContentLoaded", function () {

    /* ============================================
       PREMIUM BACKGROUND HERO SLIDER
       4 slides
       3 seconds each
    ============================================ */

    const slides = document.querySelectorAll(".bg-hero-slide");

    const progressItems =
        document.querySelectorAll(".bg-progress-item");

    const nextButton =
        document.querySelector(".bg-next");

    const prevButton =
        document.querySelector(".bg-prev");


    let currentSlide = 0;

    const slideTime = 3000;

    let sliderTimer;


    /* ============================================
       SHOW SLIDE
    ============================================ */

    function showSlide(index) {

        /* Reset all slides */

        slides.forEach(function (slide) {

            slide.classList.remove("active");

        });


        /* Reset progress */

        progressItems.forEach(function (item) {

            item.classList.remove("active");

            const progress =
                item.querySelector("i");

            if (progress) {

                progress.style.animation = "none";

                progress.offsetHeight;

                progress.style.animation = "";

            }

        });


        /* Activate selected slide */

        slides[index].classList.add("active");

        progressItems[index].classList.add("active");


        currentSlide = index;

    }


    /* ============================================
       NEXT
    ============================================ */

    function nextSlide() {

        currentSlide++;

        if (currentSlide >= slides.length) {

            currentSlide = 0;

        }

        showSlide(currentSlide);

        restartSlider();

    }


    /* ============================================
       PREVIOUS
    ============================================ */

    function previousSlide() {

        currentSlide--;

        if (currentSlide < 0) {

            currentSlide =
                slides.length - 1;

        }

        showSlide(currentSlide);

        restartSlider();

    }


    /* ============================================
       START AUTO SLIDER
    ============================================ */

    function startSlider() {

        sliderTimer =
            setInterval(function () {

                currentSlide++;

                if (currentSlide >= slides.length) {

                    currentSlide = 0;

                }

                showSlide(currentSlide);

            }, slideTime);

    }


    /* ============================================
       RESTART
    ============================================ */

    function restartSlider() {

        clearInterval(sliderTimer);

        startSlider();

    }


    /* ============================================
       BUTTONS
    ============================================ */

    nextButton.addEventListener(
        "click",
        nextSlide
    );


    prevButton.addEventListener(
        "click",
        previousSlide
    );


    /* ============================================
       START
    ============================================ */

    showSlide(0);

    startSlider();


    /* ============================================
       PAUSE WHEN MOUSE IS OVER HERO
    ============================================ */

    const hero =
        document.querySelector(".premium-bg-hero");


    hero.addEventListener(
        "mouseenter",
        function () {

            clearInterval(sliderTimer);

        }
    );


    hero.addEventListener(
        "mouseleave",
        function () {

            startSlider();

        }
    );


    /* ============================================
       MOBILE SWIPE
    ============================================ */

    let touchStartX = 0;

    let touchEndX = 0;


    hero.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    hero.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0].screenX;


            const difference =
                touchStartX - touchEndX;


            /* Swipe left */

            if (difference > 50) {

                nextSlide();

            }


            /* Swipe right */

            else if (difference < -50) {

                previousSlide();

            }

        },
        {
            passive: true
        }
    );

});
