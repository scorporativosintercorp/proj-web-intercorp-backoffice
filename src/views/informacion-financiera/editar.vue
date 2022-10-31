<template>
  <div class="form--main">
    <div class="mb-8">
      <div v-if="showMessage" class="mb-6">
        <p class="text-center">Información actualizada correctamente</p>
      </div>
      <h3 class="text-3xl font-semibold text-gray-700">Edición de Información Financiera</h3>
    </div>

    <div v-if="errors.length" class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
      <svg class="inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
      <div>Por favor complete los campos requeridos</div>
    </div>

    <div>
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <form class="form" enctype="multipart/form-data" @submit.prevent="actualizarInformacionFinanciera">
              <div class="form-group">
                <div class="input-group">
                  <input type="number" class="form-control" v-model="anho" placeholder="Año" />
                  <div v-if="anhoError" class="label-error">{{ anhoError }}</div>
                </div>
              </div>
              <div class="form-group">
                <div class="input-group">
                  <input type="number" class="form-control" v-model="trimestre" placeholder="Trimestre" />
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
                <div class="input-group">
                  <a id="archivo_enlace" href="" target="_blank"></a>
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
                <div class="input-group">
                  <a id="archivo_en_enlace" href="" target="_blank"></a>
                </div>
              </div>
              <div class="flex justify-end">
                <button class="btn btn-blue">Actualizar</button>
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
  import axios from 'axios'
  export default {
    name: 'editarCategoria',
    data () {
      return {
        API_URL: import.meta.env.VITE_API_URL,
        ARCHIVOS_URL: import.meta.env.VITE_ARCHIVOS_URL,
        idinfo: null,
        token: localStorage.getItem("token"),
        nombre: '',
        nombreen: '',
        activo: true,
        activeItem: 'espaniol',
        errors: [],
        trimestre: '',
        anho: '',
        sent: false,
        loading: false,
        showMessage: false,
        // Errores
        anhoError: '',
        trimestreError: '',
        nombreError: '',
      }
    },
    methods: {
      isActive (menuItem) {
        return this.activeItem === menuItem
      },
      setActive (menuItem) {
        this.activeItem = menuItem
      },
      actualizarInformacionFinanciera () {
        this.errors = []

        if (!this.anho) {
          this.errors.push('El año es obligatorio.');
          this.anhoError = 'El año es obligatorio.';
        }

        if (!this.trimestre) {
          this.errors.push('El trimestre es obligatorio.');
          this.trimestreError = 'El trimestre es obligatorio.';
        }

        if (!this.nombre) {
          this.errors.push('El nombre es obligatorio.');
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
          let clase = this
          let primerarchivo = null
          let segundoarchivo = null
          if (document.getElementById('archivo').files[0] != null) {
            primerarchivo = document.getElementById('archivo').files[0]
            segundoarchivo = document.getElementById('archivo_en').files[0]
          } else if (document.getElementById('archivo_en').files[0] != null) {
            primerarchivo = document.getElementById('archivo_en').files[0]
          }
          if (primerarchivo != null) {
            let bodyFormData = new FormData()
            bodyFormData.append('archivo', primerarchivo)
            axios({
              method: 'post',
              url: this.API_URL + 'subirarchivo',
              data: bodyFormData,
              headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Headers": "x-access-token",
                "x-access-token": this.token,
              },
            })
              .then(function (response) {
                console.log(response.data.archivo)
                clase.archivo = response.data.archivo
                this.loading = false;
                console.log(segundoarchivo)
                if (segundoarchivo != null) {
                  console.log(segundoarchivo)
                  var bodyFormData = new FormData()
                  bodyFormData.append('archivo', segundoarchivo)
                  axios({
                    method: 'post',
                    url: this.API_URL + 'subirarchivo',
                    data: bodyFormData,
                    headers: {
                      "Content-Type": "multipart/form-data",
                      "Access-Control-Allow-Headers": "x-access-token",
                      "x-access-token": this.token,
                    },
                  })
                    .then(function (response) {
                      this.loading = false;
                      console.log(response);
                      clase.archivo_en = response.data.archivo;

                      let dataJson = {
                        id_informacion_financiera: this.idinfo,
                        anho: clase.anho,
                        nombre: clase.nombre,
                        nombre_en: clase.nombre_en,
                        trimestre: clase.trimestre,
                        archivo: clase.archivo,
                        archivo_en: clase.archivo_en
                      };

                      axios({
                        method: "put",
                        url: this.API_URL + "informacion-financiera",
                        data: dataJson,
                        headers: {
                          "Access-Control-Allow-Headers": "x-access-token",
                          "x-access-token": this.token,
                        },
                      })
                        .then((response) => {
                          this.loading = false;
                          this.showMessage = true;

                          this.anhoError= '';
                          this.trimestreError= '';
                          this.nombreError= '';
                        })
                        .catch(err => console.log(err));
                    })
                    .catch((response) => {
                      this.loading = false;
                      console.log(response)
                    })
                } else {
                  let dataJson = {
                    id_informacion_financiera: this.idinfo,
                    anho: clase.anho,
                    nombre: clase.nombre,
                    nombre_en: clase.nombre_en,
                    trimestre: clase.trimestre,
                    archivo: clase.archivo,
                    archivo_en: clase.archivo_en
                  };

                  axios({
                    method: "put",
                    url: this.API_URL + "informacion-financiera",
                    data: dataJson,
                    headers: {
                      "Access-Control-Allow-Headers": "x-access-token",
                      "x-access-token": this.token,
                    },
                  })
                    .then((response) => {
                      this.showMessage = true;
                      this.loading = false;

                      this.anhoError= '';
                      this.trimestreError= '';
                      this.nombreError= '';
                    })
                    .catch((response) => {
                      this.loading = false;
                    });
                }
              })
              .catch((response) => {
                this.loading = false;
              })
          } else {
            let dataJson = {
              id_informacion_financiera: this.idinfo,
              anho: clase.anho,
              nombre: clase.nombre,
              nombre_en: clase.nombre_en,
              trimestre: clase.trimestre,
              archivo: clase.archivo,
              archivo_en: clase.archivo_en
            };

            axios({
              method: "put",
              url: this.API_URL + "informacion-financiera",
              data: dataJson,
              headers: {
                "Access-Control-Allow-Headers": "x-access-token",
                "x-access-token": this.token,
              },
            })
              .then((response) => {
                this.showMessage = true;
                this.anhoError= '';
                this.trimestreError= '';
                this.nombreError= '';
              setTimeout(() => {
                this.loading = false;
              }, 1000);
            })
            .catch((response) => {
              this.loading = false;
            })
          }
        }
      },
      eliminarAdjunto() {

      }
    },
    created() {
      let id = this.$route.params.idinfo;
      this.idinfo = this.$route.params.idinfo;

      let dataJson = {
        id_informacion_financiera: id
      }

      axios({
        method: 'post',
        url: this.API_URL + 'detalle-informacion-financiera',
        data: dataJson,
        headers: {
          "Access-Control-Allow-Headers": "x-access-token",
          "x-access-token": this.token,
        },
      })
        .then((response) => {
          this.anho = response.data.anho
          this.trimestre = response.data.trimestre
          this.nombre = response.data.nombre
          this.nombre_en = response.data.informacion_financiera_idiomas[0].nombre
          if (response.data.link) {
            document.getElementById('archivo_enlace').href = this.ARCHIVOS_URL + response.data.link
            document.getElementById('archivo_enlace').text = '>> ' + response.data.link
          }
          if (response.data.informacion_financiera_idiomas[0].link) {
            document.getElementById('archivo_en_enlace').href = this.ARCHIVOS_URL + response.data.informacion_financiera_idiomas[0].link
            document.getElementById('archivo_en_enlace').text = '>> ' + response.data.informacion_financiera_idiomas[0].link
          }
        })
    }
  }
</script>

<style scoped lang="postcss"></style>
