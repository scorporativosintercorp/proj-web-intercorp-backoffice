<template>
  <section class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
          <div class="row w-100">
            <div class="mx-auto col-lg-4">
              <div class="auto-form-wrapper">
                <div class="text-center form-group">Saliendo...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    mounted() {
      var router = this.$router;
      this.$store.dispatch("logout").then(router.push({path: `/login`}));
    },
  };
</script>
