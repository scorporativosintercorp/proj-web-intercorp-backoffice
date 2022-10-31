<template>
  <div>
    <div class="mb-8">
      <div class="flex justify-between">
        <h3 class="text-3xl font-medium text-gray-700">Información financiera</h3>
        <router-link to="/agregar-informacion-financiera" class="btn btn-blue">Agregar nueva <i class="fa fa-plus"></i></router-link>
      </div>
    </div>

    <div class="flex flex-col my-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 relative">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">ID</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Año</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Trimestre</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Nombre</th>
                <th class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Acciones</th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(item, index) in items" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ item.id }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ item.anho }}</td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">{{ item.trimestre }}</td>
                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  <router-link :to="`/editar-informacion-financiera/idinfo/${item.id}`" :key="item.id" class="text--action" title="Editar">
                    {{ item.nombre }}
                  </router-link>
                </td>
                <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <router-link :to="`/editar-informacion-financiera/idinfo/${item.id}`" :key="item.id" class="btn--action">
                    <i class="fa fa-pen" title="Editar"></i>
                  </router-link>
                  <button type="button" class="btn--action" v-on:click="eliminarInformacionFinanciera(item.id)"><i title="Eliminar" class="fa fa-trash"></i></button>
                </td>
                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"></td>
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
    name: "informacionFinanciera",
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
        isLoading: false,
        API_URL: import.meta.env.VITE_API_URL,
        TINY_EDITOR_KEY: import.meta.env.VITE_TINY_EDITOR_KEY,
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
        this.obtenerIFinanciera(value, this.pageSize);
      },
      obtenerIFinanciera(pagina = this.page, cantidad = this.pageSize) {
        const clase = this;
        const params = {
          pagina: pagina,
          cantidad: cantidad,
        };
        const reqheaders = {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "x-access-token",
            "x-access-token": this.token,
          },
        };

        axios
          .post(import.meta.env.VITE_API_URL + "listar-informacion-financiera", params, reqheaders)
          .then((response) => {
            const {ifinanciera, totalItems} = response.data;
            this.items = ifinanciera;
            this.count = totalItems;
            this.isLoading = false;
          })
          .catch(function (error) {});
      },
      eliminarInformacionFinanciera(id) {
        if (confirm("¿Está seguro(a) de eliminar el registro?") == true) {
          let dataJson = {
            id_informacion_financiera: id,
          };

          axios({
            method: "post",
            url: this.API_URL + "eliminar-informacion-financiera",
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
      handlePageChange(value) {
        this.page = value;
        this.obtenerIFinanciera();
      },
      handlePageSizeChange(event) {
        this.pageSize = event.target.value;
        this.page = 1;
        this.obtenerIFinanciera();
      },
    },
    mounted() {
      this.obtenerIFinanciera();
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
