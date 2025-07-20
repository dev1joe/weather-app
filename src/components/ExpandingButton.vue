<script setup>
import { ref } from 'vue';
import SettingsBar from './SettingsBar.vue';
import CogOutlineIcon from 'vue-material-design-icons/CogOutline.vue';
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';

const isContentHidden = ref(true);

function toggleContent() {
    isContentHidden.value = !isContentHidden.value;
}
</script>

<template>
    <div class="flex items-center gap-2 overflow-hidden bg-white dark:bg-gray-900 rounded-full" style="transition: all 1s ease-in-out;">
        <Transition name="fade">
            <div v-show="!isContentHidden" class="py-2 flex items-center gap-2 relative left-0">
                <SettingsBar class="ml-3" />
            </div>
        </Transition>
        <button class="bg-white dark:bg-gray-900 text-2xl rounded-full p-3 z-100" @click="toggleContent">
            <CogOutlineIcon size="32" v-show="isContentHidden" />
            <ArrowRightIcon size="32" v-show="!isContentHidden" />
        </button>
    </div>
</template>

<style scoped>
button {
    /* position: relative; */
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
    /* background: transparent; */
    /* padding: 0; */
    /* font-size: inherit; */
    font-family: inherit;
}

.content-div {
    transition: all 1s ease-in-out;
}

/*
  The 'fade' transition styles.
  Vue adds specific classes during the transition:
  - .fade-enter-active, .fade-leave-active: Apply during the entire entering/leaving phase.
  - .fade-enter-from, .fade-leave-to: Starting/ending states of the transition.
  - .fade-enter-to, .fade-leave-from: Ending/starting states of the transition (often implicitly handled by default styles).
*/

.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s ease;
    /* Duration and easing of the transition */
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    left: 100%;
    /* Element starts/ends invisible */
}

/*
  .fade-enter-to and .fade-leave-from typically imply opacity: 1;
  which is the default state of the element, so they are often not explicitly defined
  unless you want a different "final" state than the element's natural display.
*/
</style>
