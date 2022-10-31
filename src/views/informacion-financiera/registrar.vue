<template>
  <div class="form--main">
    <div class="mb-8">
      <div v-if="showMessage" class="mb-6">
        <p class="text-center">Información actualizada correctamente</p>
      </div>
      <h3 class="text-3xl font-semibold text-gray-700">Registro de Información Financiera</h3>
    </div>

    <div v-if="errors.length" class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      <svg class="inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
      <div>Por favor complete los campos requeridos</div>
    </div>

    <div class="mb-10">
      <div class="p-6 bg-white rounded-md shadow">
        <div class="pb-4 border-b border-gray-100 mb-7">
          <div class="grid grid-cols-1 gap-6">
            <form class="form" enctype="multipart/form-data" @submit.prevent="grabarInformacionFinanciera">
              <div class="form-group">
                <div class="input-group">
                  <input type="number" class="form-control" v-model="anho" placeholder="Año" />
                  <div v-if="anhoError" class="label-error">{{ anhoError }}</div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="number" class="form-control" v-model="trimestre" placeholder="Trimestre" />
                  <div class="laber-error"></div>
                  <div v-if="trimestreError" class="label-error">{{ trimestreError }}</div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="text" class="form-control" v-model="nombre" placeholder="Nombre" />
                  <div v-if="nombreError" class="label-error">{{ nombreError }}</div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="file" class="form-control" id="archivo" placeholder="Archivo" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="text" class="form-control" v-model="nombre_en" placeholder="Nombre (Inglés)" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="file" class="form-control" id="archivo_en" placeholder="Archivo (Inglés)" />
                </div>
              </div>
              <div class="flex justify-end">
                <button class="btn btn-blue">Enviar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading form--loading"></div>
  </div>
</template>

<script lang="js">
  import axios from 'axios';

  export default {
    name: 'registrarInformacionFinanciera',
    data () {
      return {
        API_URL: import.meta.env.VITE_API_URL,
        nombre: '',
        nombre_en: '',
        anho: '',
        trimestre: '',
        archivo: '',
        archivo_en: '',
        activeItem: 'espaniol',
        errors: [],
        loading: false,
        showMessage: false,
        token: localStorage.getItem("token"),

        // Errores
        anhoError: '',
        trimestreError: '',
        nombreError: '',
      }
    },
    mounted() {
      this.test()
    },
    methods: {
      isActive (menuItem) {
        return this.activeItem === menuItem
      },
      setActive (menuItem) {
        this.activeItem = menuItem
      },
      grabarInformacionFinanciera () {
        this.errors = []

        if (!this.anho) {
          this.errors.push('El año es obligatorio.');
          this.anhoError = 'El año es obligatorio.';
        }

        if (!this.trimestre) {
          this.errors.push('El trimestre es obligatorio.')
          this.trimestreError = 'El trimestre es obligatorio.';
        }

        if (!this.nombre) {
          this.errors.push('El nombre es obligatorio.')
          this.nombreError = 'El nombre es obligatorio.';
        }

        if (this.errors.length > 0) {
          setTimeout(function () {
            const el = document.getElementById('p-errors')
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }, 200)
        } else {
          this.loading = true;
          let clase = this;

          let primerarchivo = null;
          let segundoarchivo = null;

          if (document.getElementById('archivo').files[0] != null) {
            primerarchivo = document.getElementById('archivo').files[0]
            segundoarchivo = document.getElementById('archivo_en').files[0]
          } else if (document.getElementById('archivo_en').files[0] != null) {
            primerarchivo = document.getElementById('archivo_en').files[0]
          }
          if (primerarchivo != null) {
            var bodyFormData = new FormData()
            bodyFormData.append('archivo', primerarchivo)

            axios({
              method: 'post',
              url: this.API_URL + 'subirarchivo',
              data: bodyFormData,
              headers:
              {
                "Access-Control-Allow-Headers": "x-access-token",
                "x-access-token": this.token,
              }
            })
              .then((response) => {

                clase.archivo = response.data.archivo
                this.loading = false;

                if (segundoarchivo != null) {

                  var bodyFormData = new FormData()
                  bodyFormData.append('archivo', segundoarchivo);

                  axios({
                    method: 'post',
                    url: this.API_URL + 'subirarchivo',
                    data: bodyFormData,
                    headers:
                     {
                        // 'Content-Type': 'multipart/form-data',
                        "Access-Control-Allow-Headers": "x-access-token",
                        "x-access-token": this.token,
                      }
                  })
                    .then((response) => {


                      console.log("RESPONSE CARGA IMÁGENES", response);

                      clase.archivo_en = response.data.archivo;
                      this.loading = false;

                      const dataJson = {
                        anho: clase.anho,
                        nombre: clase.nombre,
                        nombre_en: clase.nombre_en,
                        trimestre: clase.trimestre,
                        archivo: clase.archivo,
                        archivo_en: clase.archivo_en
                      };

                      axios({
                        method: 'post',
                        url: this.API_URL + 'informacion-financiera',
                        data: dataJson,
                        headers:
                          {
                            "Access-Control-Allow-Headers": "x-access-token",
                            "x-access-token": this.token,
                          }
                      })
                        .then((response) => {
                          console.log(`response`, response);
                          this.showMessage = true;
                          this.loading = false;

                          this.anhoError= '';
                          this.trimestreError= '';
                          this.nombreError= '';
                        })
                        .catch(err => console.log(err))
                    })
                    .catch((response) => {
                      this.loading = false;
                      console.log(response)
                    })
                } else {
                  let dataJson = {
                    anho: clase.anho,
                    nombre: clase.nombre,
                    nombre_en: clase.nombre_en,
                    trimestre: clase.trimestre,
                    archivo: clase.archivo,
                    archivo_en: clase.archivo_en
                  };

                  axios({
                    method: 'post',
                    url: this.API_URL + 'informacion-financiera',
                    data: dataJson,
                    headers:
                      {
                        "Access-Control-Allow-Headers": "x-access-token",
                        "x-access-token": this.token,
                      }
                  })
                    .then((response) => {
                      this.showMessage = true;
                      this.loading = false;

                      this.anhoError= '';
                      this.trimestreError= '';
                      this.nombreError= '';
                    })
                    .catch(err => console.log(err))
                }
              })
              .catch((response) => {
                this.loading = false;
                console.log(response)
              })
          } else {
            let dataJson = {
              anho: clase.anho,
              nombre: clase.nombre,
              nombre_en: clase.nombre_en,
              trimestre: clase.trimestre,
              archivo: clase.archivo,
              archivo_en: clase.archivo_en
            };

            axios({
              method: "post",
              url: this.API_URL + "informacion-financiera",
              data: dataJson,
              headers: {
                // "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Headers": "x-access-token",
                "x-access-token": this.token,
              },
            })
              .then((response) => {
                this.showMessage = true;
                this.loading = false;
              })
              .catch((response) => {
                this.loading = false;
              })
          }
        }
      },
      test() {
        console.log(`API_URL`, import.meta.env.VITE_API_URL);
      }

    }
  }
</script>

<style scoped lang="postcss">
  .form--main {
    @apply relative;
  }
</style>
