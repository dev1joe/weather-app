<template>
    <div class="my-swiper-container">
        <swiper navigation :modules="modules" :pagination="{ clickable: true }"
            @swiper="onSwiper" @slideChange="onSlideChange" class="mySwiper">
            <!-- <swiper-slide v-for="i in 20" :key="i" class="bg-white dark:bg-gray-800 rounded-xl">
                <div class="slide-content">Slide {{ i }}</div>
            </swiper-slide> -->
            <slot />
        </swiper>
        <!-- <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// Import Swiper modules (if you need them, e.g., Navigation, Pagination)
import { Navigation, Pagination } from 'swiper/modules';

// Reactive reference to hold the Swiper instance
const swiperInstance = ref(null);

// Define the modules to use (important for navigation, pagination, etc.)
const modules = [Navigation]; // add pagination module if needed

// Define Swiper breakpoints
const swiperBreakpoints = {
    // mobile phone breakpoints
    320: {
        slidesPerView: 3,
        spaceBetween: 12,
    },
    480: {
        slidesPerView: 4,
        spaceBetween: 12,
    },
    640: { // tailwind sm breakpoint
        slidesPerView: 5,
        spaceBetween: 12,
    },
    768: { // tailwind md breakpoint
        slidesPerView: 6,
        spaceBetween: 15,
    },
    1024: { // tailwind lg breakpoint
        slidesPerView: 9,
        spaceBetween: 15,
    },
    1280: { // tailwind xl breakpoint
        slidesPerView: 10,
        spaceBetween: 15,
    },
};

// Callback when Swiper is initialized
const onSwiper = (swiper) => {
    console.log('Swiper initialized:', swiper);
    swiperInstance.value = swiper; // Store the Swiper instance
};

// Callback on slide change
const onSlideChange = () => {
    console.log('Slide changed');
};

// Example of programmatically navigating
const goToSpecificSlide = (index) => {
    if (swiperInstance.value) {
        console.log(`scrolling to slide ${index}`);
        swiperInstance.value.slideTo(index, 500, true);
    } else {
        console.warn('Swiper instance not available');
    }
};

onMounted(() => {
    // You can call goToSpecificSlide here if you want to scroll to a specific slide on mount
    // For example, to scroll to the current hour (as per your original request):
    // Assuming your slides correspond directly to hours (index 0 = hour 0, etc.)
    // You might need more complex logic if your slides don't directly map to hours.

    let counter = 0;

    const intervalID = setInterval(() => {
        const currentHour = new Date().getHours();
        goToSpecificSlide(currentHour);

        counter++;

        if (counter > 3) {
            clearInterval(intervalID);
        }
    }, 1000);
});
</script>

<style scoped>
/* Basic styling for Swiper to be visible */
.my-swiper-container {
    width: 100%;
    /* max-width: 1400px; */
    position: relative;
}

/* Adjust max-width for larger screens using media queries */
/* start with 320px because SM Z Fold width is 344 */
@media (min-width: 320px) {
    .my-swiper-container {
        max-width: 310px;
    }
}

@media (min-width: 480px) {
    .my-swiper-container {
        max-width: 460px;
    }
}

@media (min-width: 640px) {
    .my-swiper-container {
        max-width: 615px;
    }
}

@media (min-width: 768px) {
    .my-swiper-container {
        max-width: 750px;
    }
}

@media (min-width: 1024px) {
    .my-swiper-container {
        max-width: 960px;
    }
}

@media (min-width: 1200px) {
    .my-swiper-container {
        max-width: 900px;
    }
}

@media (min-width: 1450px) {
    .my-swiper-container {
        max-width: 1150px;
    }
}

.mySwiper {
    max-height: 200px;
    /* Set a height for the carousel */
}

.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border: 1px solid #ccc;
}

.slide-content {
    padding: 20px;
}

/* Offset the "Previous" button */
.mySwiper .swiper-button-prev {
    left: -20px !important;
    /* Push it 20px further to the left outside the carousel bounds */
    /* You might need to adjust the `top` and `transform` if you moved them significantly */
    /* top: 50%; */
    /* transform: translateY(-50%); */
    color: #007bff;
    /* Example color */
    background-color: rgba(255, 255, 255, 0.8);
    /* Add a background for visibility */
    border-radius: 50%;
    width: 44px;
    /* Default size */
    height: 44px;
    /* Default size */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* Add some shadow */
}

/* Offset the "Next" button */
.mySwiper .swiper-button-next {
    right: -20px !important;
    /* Push it 20px further to the right outside the carousel bounds */
    /* top: 50%; */
    /* transform: translateY(-50%); */
    color: #007bff;
    /* Example color */
    background-color: rgba(255, 255, 255, 0.8);
    /* Add a background for visibility */
    border-radius: 50%;
    width: 44px;
    /* Default size */
    height: 44px;
    /* Default size */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    /* Add some shadow */
}
</style>