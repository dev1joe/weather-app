<script setup>
import { defineProps } from 'vue';

defineProps({
    time12: {
        type: String,
        required: true
    },
    time24: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    temp: {
        type: Number,
        required: true
    }
});
</script>

<template>
    <div 
        class="inline-block p-4 bg-inherit rounded-3xl overflow-hidden text-center min-w-[100px]">
        <p class="">{{ time12 }}</p>
        <img class="mx-auto" :src="icon" alt="condition icon">
        <p class="text-2xl">{{ temp }}&deg;</p>
    </div>
</template>