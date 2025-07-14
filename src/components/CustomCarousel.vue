<script setup>
import { ref } from 'vue';
const hourlyScrollRef = ref(null);

// slider
function scrollHours(direction) {
    const el = hourlyScrollRef.value;
    if (!el) return;
    const scrollAmount = 200; // pixels per click
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

</script>

<template>
    <div class="mb-6 w-full text-center">
        <div class="relative" style="max-width: 70vw;">

            <!-- Left Button -->
            <button @click="scrollHours(-1)"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full shadow size-8"
                style="transform: translate(-70%, -20%);" aria-label="Scroll left">
                &#8592;
            </button>

            <!-- Right Button -->
            <button @click="scrollHours(1)"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full shadow size-8"
                style="transform: translate(70%, -20%);" aria-label="Scroll right">
                &#8594;
            </button>

            <div ref="hourlyScrollRef" class="overflow-x-auto w-full scrollbar-hide" style="max-width: 70vw;">
                <div class="min-w-max flex gap-2 mb-2">
                    <slot />
                </div>
            </div>

        </div>
    </div>
</template>