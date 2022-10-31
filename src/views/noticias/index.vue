<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between">
        <h3 class="text-3xl font-medium text-gray-700">Listado de noticias</h3>
        <router-link to="/agregar-nueva-noticia" class="btn btn-blue">Agregar nueva noticia <i class="fa fa-plus"></i></router-link>
      </div>
    </div>

    <div class="flex flex-col my-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 relative">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">ID</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Título</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Tipo de noticia</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Destacada en Home</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Destacada en Noticias</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Acciones</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(item, index) in items" :key="index">
                <td class="px-5 py-3 border-b border-gray-200 whitespace-nowrap">{{ item.id }}</td>
                <td class="max-w-xs px-5 py-3 truncate whitespace-nowrap">
                  <router-link :to="`/editar-noticia/idnew/${item.id}`" :key="item.id" class="text--action">
                    {{ item.titulo }}
                  </router-link>
                </td>
                <td class="px-5 py-3 text-center">
                  <span class="tag">
                    {{ newType(item.tipo_noticia) }}
                  </span>
                </td>
                <td class="px-5 py-3 text-center border-b border-gray-200 whitespace-nowrap">
                  <i class="fa fa-check-square check-active" v-if="item.flag_home"></i>
                </td>
                <td class="px-5 py-3 text-center text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  <i class="fa fa-check-square check-active" v-if="item.destacado"></i>
                </td>
                <td class="px-5 py-3 text-sm font-medium leading-5 text-center border-b border-gray-200 whitespace-nowrap">
                  <router-link :to="`/editar-noticia/idnew/${item.id}`" :key="item.id" class="btn--action">
                    <i class="fa fa-pen" title="Editar"></i>
                  </router-link>

                  <button type="button" class="btn--action" v-on:click="eliminarNoticia(item.id)">
                    <i class="fa fa-trash-alt" title="Eliminar"></i>
                  </button>

                  <!-- <div v-bind:id="'accion_desactivar_' + item.id" v-if="item.activo == 0" class="cursor-pointer icon-div" v-on:click="cambiarEstadoNoticia(item.id, 1)">
                    <i title="Activar" class="mdi mdi-checkbox-marked-circle"></i>
                  </div> -->

                  <!-- <div v-bind:id="'accion_activar_' + item.id" v-if="item.activo == 1" class="cursor-pointer icon-div" v-on:click="cambiarEstadoNoticia(item.id, 0)">
                    <i title="Desactivar" class="mdi mdi-cancel"></i>
                  </div> -->
                </td>
                <td class="px-5 py-3 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="isLoading" class="loading"></div>
      </div>
    </div>
    <div>
      <v-pagination v-model="currentPage" :pageCount="pages" :value="1" @change="onChange"></v-pagination>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import vPagination from "../../components/TablePagination.vue";

  export default {
    name: "noticias",
    components: {
      vPagination,
    },
    data() {
      return {
        items: [],
        currentPage: 1,
        currentTutorial: null,
        currentIndex: -1,
        searchTitle: "",
        page: 1,
        count: 0,
        pageSize: 25,
        pages: 0,
        token: null,
        isLoading: false,
        API_URL: import.meta.env.VITE_API_URL,
        token: localStorage.getItem("token"),
      };
    },
    computed: {
      pages() {
        return Math.round(this.count / this.pageSize);
      },
    },
    methods: {
      onChange(value) {
        this.isLoading = true;
        this.obtenerNoticias(value, this.pageSize);
      },
      eliminarNoticia: function (id) {
        if (confirm("¿Está seguro(a) de eliminar el registro?") == true) {
          let dataJson = {
            id_noticia: id,
          };

          axios({
            method: "post",
            url: this.API_URL + "eliminar-noticia",
            data: dataJson,
            headers: {
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": this.token,
            },
          })
            .then((response) => window.location.reload())
            .catch((err) => console.log(err));
        }
      },
      cambiarEstadoNoticia: function (id, accion, event) {
        var mensaje = "";
        if (accion === 1) {
          mensaje = "¿Desea activar la noticia?";
        } else {
          mensaje = "¿Desea desactivar la noticia?";
        }
        this.$confirm({
          message: mensaje,
          button: {
            no: "No",
            yes: "Si",
          },
          callback: (confirm) => {
            if (confirm) {
              axios
                .post(import.meta.env.VITE_API_URL + "cambiar-estado-noticia", {id_noticia: id, accion: accion})
                .then((response) => window.location.reload())
                .catch((err) => console.log(err));
            }
          },
        });
      },
      obtenerNoticias(pagina = this.page, cantidad = this.pageSize) {
        var clase = this;
        var params = {
          pagina: pagina,
          cantidad: cantidad,
        };
        axios({
          method: "post",
          url: import.meta.env.VITE_API_URL + "listar-noticias",
          data: params,
          headers: {
            "Access-Control-Allow-Headers": "x-access-token",
            "x-access-token": this.token,
          },
        })
          .then((response) => {
            const {noticias, totalItems} = response.data;
            this.items = noticias;
            this.count = totalItems;
            this.isLoading = false;
          })
          .catch(function (error) {});
      },
      handlePageChange(value) {
        this.page = value;
        this.obtenerNoticias();
      },
      handlePageSizeChange(event) {
        this.pageSize = event.target.value;
        this.page = 1;
        this.obtenerNoticias();
      },
      getToken() {
        this.token = localStorage.getItem("token");
      },
      newType(index) {
        const typeList = ["Noticia", "Talento y Cultura", "Sostenibilidad", "Comunicados Corporativos"];
        return typeList[index];
      },
    },
    mounted() {
      this.getToken();
      this.obtenerNoticias();
    },
  };
</script>

<style scoped lang="postcss">
  .btn {
    &--action {
      @apply inline-block mx-2 text-2xl cursor-pointer text-indigo-600 hover:text-indigo-900;
    }
  }

  .text {
    &--action {
      @apply hover:underline max-w-xs px-5 py-3 truncate whitespace-nowrap;
    }
  }

  .check-active {
    @apply text-2xl text-green-800;
  }

  .tag {
    @apply text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded;
  }

  .loading {
    background-position-y: 70%;
  }
</style>
