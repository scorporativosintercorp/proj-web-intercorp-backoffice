<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow border-b border-gray-100">
    <div class="h-6"></div>
  </header>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import {useSidebar} from "../hooks/useSidebar";

  export default defineComponent({
    setup(_, {emit}) {
      const dropdownOpen = ref(false);
      const {isOpen} = useSidebar();

      return {
        isOpen,
        dropdownOpen,
      };
    },
  });
</script>
