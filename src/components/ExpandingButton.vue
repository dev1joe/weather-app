<script setup>
import { ref } from 'vue';
import SettingsBar from './SettingsBar.vue';
import CogOutlineIcon from 'vue-material-design-icons/CogOutline.vue';
import ArrowUpIcon from 'vue-material-design-icons/ArrowUp.vue';

const isContentHidden = ref(true);

function toggleContent() {
    isContentHidden.value = !isContentHidden.value;
}
</script>

<template>
    <!-- Main container:
        - 'relative' is crucial for positioning the absolute settings bar relative to this parent.
        - 'flex flex-col items-end' is still good for aligning the button.
        - 'overflow-hidden' on the parent helps maintain rounded corners and clips content if needed. -->
    <div class="flex flex-col items-end relative bg-white dark:bg-gray-900 rounded-full">
        <!-- Button remains at the top. The z-100 ensures it stays above the sliding bar. -->
        <button class="bg-white dark:bg-gray-900 text-2xl rounded-full p-3 z-100" @click="toggleContent">
            <!-- Icon changes based on whether the content is hidden or visible -->
            <CogOutlineIcon size="32" v-show="isContentHidden" />
            <ArrowUpIcon size="32" v-show="!isContentHidden" />
        </button>

        <!-- The div containing SettingsBar:
            - 'absolute' takes it out of the normal flow, allowing overlap.
            - 'top-[56px]' positions it directly below the button (assuming button height is 56px: 32px icon + 2*12px padding).
                You might need to adjust this 'top' value based on the exact height of your button.
            - 'z-50' ensures it appears above other content on the page (adjust if needed).
            - 'w-full' ensures it takes the full width of its relative parent. -->
        <div class="absolute top-[56px] z-50 w-full"
            :class="{ 'settings-bar-collapsed': isContentHidden, 'settings-bar-expanded': !isContentHidden }">
            <!-- SettingsBar component. Added padding for better visual spacing. -->
            <SettingsBar class="p-3 !flex !flex-col" />
        </div>
    </div>
</template>

<style scoped>
/* Base button styles to reset default browser styles */
button {
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    font-family: inherit;
}

/* Styles for the settings bar when it is collapsed (hidden) */
.settings-bar-collapsed {
    max-height: 0;
    /* Hides the content by collapsing its height */
    opacity: 0;
    /* Fades out the content */
    overflow: hidden;
    /* Crucial for clipping content that exceeds max-height */
    /* Define the transition properties for smooth animation.
        Using 'ease-out' for max-height on collapse makes it feel natural,
        slowing down as it reaches its hidden state. */
    transition: max-height 0.4s ease-out, opacity 0.2s ease-out;
}

/* Styles for the settings bar when it is expanded (visible) */
.settings-bar-expanded {
    /* IMPORTANT: Adjust this 'max-height' value!
        It should be *just* large enough to contain all content of your SettingsBar
        when it's fully open. If it's too large, the 'ease-out' on hiding will
        appear slow because it's animating a much larger range than needed.
        A value like 200px-300px is often sufficient for a few buttons.
        You might need to inspect your SettingsBar in the browser developer tools
        to find its actual height when expanded. */
    max-height: 250px;
    /* Example: Try a value that comfortably fits your content */
    opacity: 1;
    /* Fades in the content */
    overflow: hidden;
    /* Keeps content clipped if it somehow overflows */
    /* Define the transition properties for smooth animation.
        Using 'ease-in' for max-height on expansion makes it feel natural,
        speeding up as it reveals. */
    transition: max-height 0.4s ease-in, opacity 0.2s ease-in;
}
</style>
