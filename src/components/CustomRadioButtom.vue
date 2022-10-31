<template>
  <div>
    <label class="radio-label" :for="'radio-' + id">
      <input type="radio" class="radio-input" :name="name" :value="value" :id="'radio-' + id" />
      <span class="radio-box">
        <span class="radio-supertitle">Plantilla #{{ id }}</span>
        <span class="radio-title">{{ title }}</span>
        <ul class="radio-items">
          <li v-for="(item, key) in items" :key="key" :class="[color, 'radio-items--li']">
            {{ item.name }}
          </li>
        </ul>
      </span>
    </label>
  </div>
</template>

<script>
  import {defineComponent, ref} from "vue";

  export default defineComponent({
    name: "CustomRadioButtom",
    props: {
      id: {
        type: Number,
        default: "",
      },
      title: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
      value: {
        type: String,
        default: "",
      },
      items: {
        type: Array,
      },
      color: {
        type: String,
      },
    },
  });
</script>

<style lang="postcss">
  .radio {
    &-box {
      @apply flex flex-col cursor-pointer relative bg-white border-2 border-gray-300 px-5 lg:px-6 py-4 rounded-md transition-all;
    }

    &-input {
      @apply invisible absolute top-0 left-0;

      &:checked {
        & + .radio-box {
          @apply border-blue-600;
        }
      }
    }

    &-supertitle {
      @apply text-sm leading-none mb-2;
    }

    &-title {
      @apply text-2xl font-semibold leading-none mb-3;
    }

    &-items {
      @apply grid grid-flow-col;

      &--li {
        @apply inline-block text-center text-xs text-white rounded-full h-5 leading-5 px-2 mr-2;

        &.violet {
          @apply bg-violet;
        }
        &.teal {
          @apply bg-teal;
        }
        &.red {
          @apply bg-red-500;
        }
      }
    }
  }
</style>
