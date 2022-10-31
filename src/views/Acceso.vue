<template>
  <section class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth auth-bg-1 theme-one">
          <div class="row w-100">
            <div class="mx-auto col-lg-4">
              <div class="auto-form-wrapper">
                <div class="text-center form-group">Accediendo. Por favor espere...</div>
              </div>
              <ul class="auth-footer"></ul>
              <p class="text-center footer-text">copyright © 2021 Intercorp. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from "axios";
  export default {
    name: "accesoSSO",
    data() {
      return {
        ACK: "",
      };
    },
    methods: {},
    mounted() {
      var router = this.$router;
      var store = this.$store;
      let ACK = atob(this.$route.query.ACK);
      var clase = this;
      axios
        .get(import.meta.env.VITE_SSO_URL + "api/account/getAccesos?appID=" + import.meta.env.VITE_SSO_APPID + "&userID=" + ACK)
        .then((response) => {
          console.log(response);
          this.$store
            .dispatch("loginSSO", response.data)
            .then((responsex) => {
              router.push("/");
            })
            .catch(function (error) {
              if (error.response && error.response.status === 401) {
                clase.$store.dispatch("logout");
                clase.$router.push("/login");
              } else {
                // Handle error however you want
              }
            });
        })
        .catch(function (error) {
          if (error.response && error.response.status === 401) {
            clase.$store.dispatch("logout");
            clase.$router.push("/login");
          } else {
            // Handle error however you want
          }
        });
      this.$store.dispatch("logout");
      clase.$store.dispatch("logout");
    },
  };
</script>

<style scoped lang="postcss">
  #error_msg {
    color: red;
  }
</style>
