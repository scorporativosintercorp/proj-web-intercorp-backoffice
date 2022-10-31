<template>
  <div class="pagination">
    <ul :class="paginationClasses.ul">
      <li v-if="paginationLabels.first" :class="`${paginationClasses.li} ${hasFirst ? paginationClasses.liDisable : ''}`">
        <button @click="first" :disabled="hasFirst" :class="`${paginationClasses.button} ${hasFirst ? paginationClasses.buttonDisable : ''}`" v-html="paginationLabels.first"></button>
      </li>

      <li v-if="paginationLabels.prev" :class="`${paginationClasses.li} ${hasFirst ? paginationClasses.liDisable : ''}`">
        <button @click="prev" :disabled="hasFirst" :class="`${paginationClasses.button} ${hasFirst ? paginationClasses.buttonDisable : ''}`" v-html="paginationLabels.prev"></button>
      </li>

      <li v-for="page in items" :key="page.label" :class="`${paginationClasses.li} ${page.active ? paginationClasses.liActive : ''} ${page.disable ? paginationClasses.liDisable : ''}  ${current === page.label ? 'active' : ''}`">
        <button v-if="page.disable" :class="`${paginationClasses.button} ${paginationClasses.buttonDisable}`">...</button>
        <button v-else @click="goto(page.label)" :class="`${paginationClasses.button} ${page.active ? paginationClasses.buttonActive : ''}`">{{ page.label }}</button>
      </li>

      <li v-if="paginationLabels.next" :class="`${paginationClasses.li} ${hasLast ? paginationClasses.liDisable : ''}`">
        <button @click="next" :disabled="hasLast" :class="`${paginationClasses.button} ${hasLast ? paginationClasses.buttonDisable : ''}`" v-html="paginationLabels.next"></button>
      </li>

      <li v-if="paginationLabels.last" :class="`${paginationClasses.li} ${hasLast ? paginationClasses.liDisable : ''}`">
        <button @click="last" :disabled="hasLast" :class="`${paginationClasses.button} ${hasLast ? paginationClasses.buttonDisable : ''}`" v-html="paginationLabels.last"></button>
      </li>
    </ul>
  </div>
</template>

<script>
  const defaultClasses = {
    ul: "pagination",
    li: "pagination-item",
    liActive: "pagination-item--active",
    liDisable: "pagination-item--disable",
    button: "pagination-link",
    buttonActive: "pagination-link--active",
    buttonDisable: "pagination-link--disable",
  };

  const defaultLabels = {
    first: "&laquo;",
    prev: "&lsaquo;",
    next: "&rsaquo;",
    last: "&raquo;",
  };

  export default {
    props: {
      value: {
        type: Number,
        required: true,
      },
      pageCount: {
        type: Number,
        required: true,
      },
      classes: {
        type: Object,
        required: false,
        default: () => ({}),
      },
      labels: {
        type: Object,
        required: false,
        default: () => ({}),
      },
    },
    data() {
      return {
        current: this.value,
        paginationClasses: {
          ...defaultClasses,
          ...this.classes,
        },
        paginationLabels: {
          ...defaultLabels,
          ...this.labels,
        },
      };
    },
    pages() {
      return Math.round(this.count / this.pageSize);
    },
    mounted() {
      if (this.value > this.pageCount) {
        this.$emit("input", this.pageCount);
      }
    },

    computed: {
      items() {
        let valPrev = this.value > 1 ? this.value - 1 : 1; // for easier navigation - gives one previous page
        let valNext = this.value < this.pageCount ? this.value + 1 : this.pageCount; // one next page
        let extraPrev = valPrev === 3 ? 2 : null;
        let extraNext = valNext === this.pageCount - 2 ? this.pageCount - 1 : null;
        let dotsBefore = valPrev > 3 ? 2 : null;
        let dotsAfter = valNext < this.pageCount - 2 ? this.pageCount - 1 : null;
        let output = [];

        for (let i = 1; i <= this.pageCount; i += 1) {
          //if ([1, this.pageCount, this.value, valPrev, valNext, extraPrev, extraNext, dotsBefore, dotsAfter].includes(i)) {
          output.push({
            label: i,
            active: this.value === i,
            // disable: [dotsBefore, dotsAfter].includes(i),
          });
          //}
        }

        return output;
      },
      hasFirst() {
        return this.current === 1;
      },
      hasLast() {
        return this.current === this.pageCount;
      },
    },
    watch: {
      value() {
        this.$emit("change");
      },
    },
    methods: {
      first() {
        if (!this.hasFirst) {
          this.$emit("change", 1);
          this.current = 1;
        }
      },
      prev() {
        if (!this.hasFirst) {
          this.$emit("change", this.current - 1);
          this.current = this.current - 1;
        }
      },
      goto(page) {
        this.$emit("change", page);
        this.current = page;
      },
      next() {
        if (!this.hasLast) {
          this.$emit("change", this.current + 1);
          this.current = this.current + 1;
        }
      },
      last() {
        if (!this.hasLast) {
          this.$emit("change", this.pageCount);
          this.current = this.pageCount;
        }
      },
    },
  };
</script>

<style lang="postcss" scoped>
  .pagination {
    @apply flex justify-start md:justify-end;

    &-link {
      @apply relative block text-blue-600 bg-white border border-gray-200;
      padding: 0.5rem 0.75rem;
      margin-left: -1px;
      line-height: 1.25;
    }

    &-item {
      &.active {
        button {
          @apply text-white border-blue-600 bg-blue-600;
        }
      }
    }
  }

  .page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
  }

  .pagination-link--disable {
    z-index: 1;
    color: #ddd;
    background-color: #fff;
    border-color: #ddd;
  }

  .pagination-link--active {
    z-index: 1;
    /*color: #fff;
     background-color: #007bff;
    border-color: #007bff; */
    cursor: pointer;
  }

  .page.item {
    display: list-item;
  }

  .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    cursor: auto;
    background-color: #fff;
    border-color: #dee2e6;
  }

  button,
  select {
    text-transform: none;
  }
</style>
