<script setup>
import { defineProps } from 'vue';
defineProps({
    day: String,
    mintemp: Number,
    maxtemp: Number,
    icon: String,
});
</script>

<template>
    <div class="p-4 bg-white dark:bg-gray-900 rounded-3xl text-sm text-center">
        <p class="mb-2">{{ day }}</p>
        <img class="mb-2 mx-auto" :src="icon" alt="condition icon">
        <p>
            <span>{{ maxtemp }}&deg;</span>
            <span class="ms-2 text-gray-400">{{ mintemp }}&deg;</span>
        </p>
    </div>
</template>