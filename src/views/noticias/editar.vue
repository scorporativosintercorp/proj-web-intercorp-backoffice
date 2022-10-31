<template>
  <div class="form--main">
    <form v-if="!sent" enctype="multipart/form-data" @submit.prevent="register(activo)">
      <h3 class="mb-4 text-2xl font-bold" id="mainTitle">Editar noticia</h3>

      <p class="mb-4 font-bold text-red-700">
        <span v-if="cur_lang === 'es'">Datos en español:</span>
        <span v-else-if="cur_lang === 'en'">Datos en inglés:</span>
      </p>

      <div class="mb-10">
        <div class="p-6 bg-white rounded-md shadow">
          <div class="flex justify-between pb-4 border-b border-gray-100 mb-7">
            <h2 class="text-lg font-semibold">Datos principales:</h2>

            <div class="flex items-center">
              <span class="inline-block mr-2">Selecciona un idioma: </span>
              <select name="lang" class="py-1 pl-1 pr-8 leading-none border-none" @change="toggleLangs">
                <option value="es" selected>ES</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div v-if="cur_lang === 'es'">
              <label class="sr-only" for="titulo">Añadir título</label>
              <input class="w-full text-xl border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="titulo" placeholder="Añadir título" v-model="titulo" />
              <div v-if="tituloError" class="label-error">{{ tituloError }}</div>
            </div>

            <div v-else-if="cur_lang === 'en'">
              <label class="sr-only" for="titulo_en">Añadir título en inglés</label>
              <input class="w-full text-xl border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="titulo_en" placeholder="Añadir título en inglés" v-model="titulo_en" />
            </div>

            <div v-if="cur_lang === 'es'">
              <label class="text-gray-700 sr-only" for="bajada_nota">Añadir bajada</label>
              <textarea class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" rows="3" id="bajada_nota" placeholder="Teclea para ingresar la bajada de la nota" v-model="bajada_nota"></textarea>
              <div v-if="bajadaNotaError" class="label-error">{{ bajadaNotaError }}</div>
            </div>

            <div v-if="cur_lang === 'en'">
              <label class="text-gray-700 sr-only" for="bajada_nota_en">Añadir bajada en inglés</label>
              <textarea class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" rows="3" id="bajada_nota_en" placeholder="Teclea para ingresar la bajada de la nota en inglés" v-model="bajada_nota_en"></textarea>
            </div>

            <div v-if="cur_lang === 'es'">
              <editor
                v-model="texto"
                :api-key="TINY_EDITOR_KEY"
                :init="{
                  width: '100%',
                  height: 400,
                  menubar: false,
                  plugins: ['advlist autolink lists link image media charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount | code preview'],
                  toolbar: 'undo redo | formatselect | link image media | bold italic underline backcolor | \
                            alignleft aligncenter alignright alignjustify | blockquote | \
                            bullist numlist outdent indent | removeformat | help | code preview',
                  relative_urls: false,
                  convert_urls: true,

                  image_title: true,
                  images_upload_url: API_URL + 'subirimagen-richtext',
                  images_upload_handler: uploadImagenRichText,
                }"
              />
              <div v-if="textoError" class="label-error">{{ textoError }}</div>
            </div>

            <div v-if="cur_lang === 'en'">
              <editor
                v-model="texto_en"
                :api-key="TINY_EDITOR_KEY"
                :init="{
                  width: '100%',
                  height: 400,
                  menubar: false,
                  plugins: ['advlist autolink lists link image media charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount | code preview'],
                  toolbar: 'undo redo | formatselect | link image media | bold italic underline backcolor | \
                            alignleft aligncenter alignright alignjustify | blockquote | \
                            bullist numlist outdent indent | removeformat | help | code preview',
                  image_title: true,
                  images_upload_url: API_URL + 'subirimagen-richtext',
                  images_upload_handler: uploadImagenRichText,
                }"
              />
            </div>

            <div v-if="cur_lang === 'es'">
              <label class="sr-only" for="palabras_clave">Palabras clave</label>
              <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="palabras_clave" placeholder="Ingresa las palabras claves de la nota" v-model="palabras_clave" />
            </div>

            <div v-if="cur_lang === 'en'">
              <label class="sr-only" for="palabras_clave_en">Palabras clave en inglés</label>
              <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="palabras_clave_en" placeholder="Ingresa las palabras claves de la nota en inglés" v-model="palabras_clave_en" />
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div v-if="cur_lang === 'es'" class="bg-white rounded-md shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Inserta la imagen de la cabecera de la nota</h3>
                  <p class="text-sm">Tamaño de la imagen: 960px x 540px a 72ppp.</p>
                </div>
                <div class="p-6">
                  <input type="file" id="link_imagen_cabecera" v-on:change="subirImagen($event, 'link_imagen_cabecera', 'preview_image_header_url')" class="form-control" placeholder="Imagen de la cabecera" />
                  <div v-if="imagenCabeceraError" class="label-error">{{ imagenCabeceraError }}</div>
                </div>
              </div>

              <div v-if="cur_lang === 'en'" class="bg-white rounded-md shadow">
                <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Inserta la imagen de la cabecera de la nota en inglés</h3>
                  <p class="text-sm">Tamaño de la imagen: 960px x 540px a 72ppp.</p>
                </div>
                <div class="p-6">
                  <input type="file" id="link_imagen_cabecera_en" v-on:change="subirImagen($event, 'link_imagen_cabecera_en', 'preview_image_header_url_en')" class="form-control" placeholder="Imagen Preview" />
                </div>
              </div>

              <div class="bg-white rounded-md shadow">
                <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Visualización de imagen</h3>
                  <span class="text-sm">Tipo de imagen: Cabecera</span>
                </div>
                <div class="p-6">
                  <figure v-if="cur_lang === 'es'">
                    <img v-if="preview_image_header_url" :src="preview_image_header_url" alt="Imagen previa de la cabecera" />
                  </figure>
                  <figure v-if="cur_lang === 'en'">
                    <img v-if="preview_image_header_url_en" :src="preview_image_header_url_en" alt="Imagen previa de la cabecera" />
                  </figure>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div v-if="cur_lang === 'es'" class="bg-white rounded-md shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Inserta la imagen previa de la nota</h3>
                  <p class="text-sm">Tamaño de la imagen: 400px x 266px a 72ppp.</p>
                </div>
                <div class="p-6">
                  <input type="file" id="link_imagen_preview" v-on:change="subirImagen($event, 'link_imagen_preview', 'preview_image_preview_url')" class="form-control" placeholder="Imagen Preview" />
                  <div v-if="imagenPreviaError" class="label-error">{{ imagenPreviaError }}</div>
                </div>
              </div>

              <div v-if="cur_lang === 'en'" class="bg-white rounded-md shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Inserta la imagen previa de la nota en inglés</h3>
                  <p class="text-sm">Tamaño de la imagen: 400px x 266px a 72ppp.</p>
                </div>
                <div class="p-6">
                  <input type="file" id="link_imagen_preview_en" v-on:change="subirImagen($event, 'link_imagen_preview_en', 'preview_image_preview_url_en')" class="form-control" placeholder="Imagen Preview" />
                </div>
              </div>

              <div class="bg-white rounded-md shadow">
                <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Visualización de imagen</h3>
                  <span class="text-sm">Tipo de imagen: Previa</span>
                </div>
                <div class="flex flex-col items-center p-6">
                  <figure v-if="cur_lang === 'es'">
                    <img :src="preview_image_preview_url" width="400" v-if="preview_image_preview_url" alt="Imagen previa de la cabecera" />
                  </figure>
                  <figure v-if="cur_lang === 'en'">
                    <img :src="preview_image_preview_url_en" v-if="preview_image_preview_url_en" width="400" alt="Imagen previa de la cabecera" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="mb-4 font-bold text-red-700">Datos compartidos entre español e inglés:</p>

      <div class="mb-10">
        <div class="p-6 bg-white rounded-md shadow">
          <div class="pb-4 border-b border-gray-100 mb-7">
            <h2 class="text-lg font-semibold">Autor</h2>
          </div>

          <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:mb-8">
            <div>
              <div class="bg-[#F4F8FD] rounded-md">
                <div class="p-6">
                  <div class="grid grid-cols-1 gap-5">
                    <div>
                      <label class="sr-only" for="autor_nombre">Ingresa el nombre del autor</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="autor_nombre" placeholder="Ingresa el nombre del autor" v-model="autor_nombre" />
                    </div>

                    <div>
                      <label class="sr-only" for="autor_cargo">Ingresa el cargo del autor</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="autor_cargo" placeholder="Ingresa el cargo del autor" v-model="autor_cargo" />
                    </div>

                    <div>
                      <label class="block mb-4 leading-none" for="autor_imagen"
                        >Inserta la imagen del autor<br />
                        <span class="text-sm">Tamaño de la imagen: 80px x 80px a 72ppp.</span>
                      </label>
                      <input type="file" id="autor_imagen" v-on:change="subirImagen($event, 'autor_imagen', 'preview_image_author_url')" class="form-control" placeholder="Imagen Preview" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="bg-white rounded-md shadow">
                <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Visualización de imagen</h3>
                  <span class="text-sm">Tipo de imagen: Previa</span>
                </div>
                <div class="p-6">
                  <div class="flex justify-center">
                    <figure>
                      <img :src="preview_image_author_url" v-if="preview_image_author_url" width="80" alt="Imagen del autor" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-4 border-b border-gray-100 mb-7">
            <h2 class="mb-3 text-lg font-semibold">Cita</h2>
            <p class="text-sm">Copiar y pegar este texto: <strong>###quote###</strong> en el cuerpo de la noticia donde se quiera mostrar esta cita</p>
          </div>

          <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:mb-8">
            <div>
              <div class="bg-[#F4F8FD] rounded-md">
                <div class="p-6">
                  <div class="grid grid-cols-1 gap-5">
                    <div>
                      <label class="sr-only" for="cita_autor">Ingresa el nombre del autor de la cita</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="cita_autor" placeholder="Ingresa el nombre del autor de la cita" v-model="cita_autor" />
                    </div>

                    <div>
                      <label class="sr-only" for="cita_cargo">Ingresa el cargo del autor de la cita</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="cita_cargo" placeholder="Ingresa el cargo del autor de la cita" v-model="cita_cargo" />
                    </div>

                    <div>
                      <label class="sr-only" for="cita_parrafo_principal">Ingresa el párrafo principal de la cita</label>
                      <textarea class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" rows="4" type="text" id="cita_parrafo_principal" placeholder="Ingresa el párrafo principal de la cita" v-model="cita_parrafo_principal"></textarea>
                    </div>

                    <div>
                      <label class="sr-only" for="cita_parrafo_secundario">Ingresa el párrafo secundario de la cita</label>
                      <textarea class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" rows="4" type="text" id="cita_parrafo_secundario" placeholder="Ingresa el párrafo secundario de la cita" v-model="cita_parrafo_secundario"></textarea>
                    </div>

                    <div>
                      <label class="block mb-4 leading-none" for="cita_imagen"
                        >Inserta la imagen del autor<br />
                        <span class="text-sm">Tamaño de la imagen: 160px x 160px a 72ppp.</span>
                      </label>
                      <input type="file" id="cita_imagen" v-on:change="subirImagen($event, 'cita_imagen', 'preview_image_quote_author_url')" class="form-control" placeholder="Imagen Preview" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="bg-white rounded-md shadow">
                <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                  <h3 class="text-sm font-semibold">Visualización de imagen</h3>
                  <span class="text-sm">Tipo de imagen: Previa</span>
                </div>
                <div class="p-6">
                  <div class="flex justify-center">
                    <figure>
                      <img :src="preview_image_quote_author_url" v-if="preview_image_quote_author_url" width="160" alt="Imagen previa de la cabecera" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-7">
            <h2 class="text-lg font-semibold">SEO</h2>
          </div>

          <div class="grid grid-cols-1 gap-6 mb-8">
            <div>
              <div class="bg-[#F4F8FD] rounded-md">
                <div class="p-6">
                  <div class="grid grid-cols-1 gap-7">
                    <div>
                      <label class="" for="seo_meta_title">Meta Tittle</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="seo_meta_title" placeholder="Intercorp - Título de la noticia" v-model="seo_meta_title" />
                    </div>

                    <div>
                      <label class="" for="seo_meta_description">Meta Description</label>
                      <textarea class="w-full border-gray-200 rounded-md ext-xl focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" rows="3" id="seo_meta_description" placeholder="Ingresar la meta description" v-model="seo_meta_description"></textarea>
                    </div>

                    <div>
                      <label class="" for="seo_meta_keywords">Meta Keywords</label>
                      <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="seo_meta_keywords" placeholder="Ejemplo: palabra clave 1, palabra clave 2, palabra clave 3" v-model="seo_meta_keywords" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-7">
            <h2 class="mb-3 text-lg font-semibold">Galería de imágenes</h2>
            <p class="text-sm">Tamaño de la imagen: 420px x 420px a 72ppp.</p>
            <p class="text-sm">Copiar y pegar este texto: <strong>###gallery###</strong> en el cuerpo de la noticia donde se quiera mostrar la galería de imágenes.</p>
          </div>

          <div class="grid grid-cols-1 gap-5 mb-10 md:grid-cols-2">
            <div class="bg-white rounded-md shadow">
              <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                <h3 class="text-sm font-semibold">Inserta las imágenes para la galería</h3>
              </div>
              <div class="p-6">
                <div>
                  <div v-on:click="toggleModale" class="cursor-pointer gallery-images--add">Agregar imagen a la galería</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-md shadow">
              <div class="flex justify-between px-6 py-4 border-b border-gray-200">
                <h3 class="text-sm font-semibold">Visualización de imagen</h3>
                <span class="text-sm">Tipo de imagen: Galería</span>
              </div>
              <div class="p-6">
                <div class="gallery--grid">
                  <div v-for="(item, key) in galeria" :key="key" class="gallery--item">
                    <div class="gallery--content">
                      <button type="button" @click="eliminarImagenGaleria(item.id, key)" class="gallery--delete" title="Eliminar"><i class="fa fa-times"></i></button>
                      <div class="gallery--figure">
                        <div>
                          <img :src="item.url" :alt="item.legend" />
                        </div>
                      </div>
                    </div>
                    <div class="gallery--legend">
                      <h5>{{ item.legend }}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#F4F8FD] rounded-md mb-8">
            <div class="p-6">
              <div class="mb-5">
                <h3 class="font-semibold">Tiempo de lectura</h3>
              </div>
              <div class="grid grid-cols-1 gap-7">
                <div>
                  <label class="sr-only" for="tiempo_de_lectura">Meta Tittle</label>
                  <input class="w-full border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" id="tiempo_de_lectura" placeholder="Colocar el texto en minutos." v-model="tiempo_de_lectura" />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white shadow">
            <div class="p-6">
              <div class="mb-5">
                <h3 class="mb-4 font-bold">Color principal</h3>
                <p class="text-sm">Selecciona el color principal de la nota</p>
              </div>
              <div>
                <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <li>
                    <label class="radio" for="lila">
                      <input type="radio" class="lila" checked name="color-principal" id="lila" value="#A480FF" v-model="color_principal" />
                      <span>Lila</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio" for="verde">
                      <input type="radio" class="verde" name="color-principal" id="verde" value="#23DEB8" v-model="color_principal" />
                      <span>Verde</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio" for="coral">
                      <input type="radio" class="coral" name="color-principal" id="coral" value="#FF5757" v-model="color_principal" />
                      <span>Coral</span>
                    </label>
                  </li>
                  <li>
                    <label class="radio" for="celeste">
                      <input type="radio" class="celeste" name="color-principal" id="celeste" value="#1ACFFF" v-model="color_principal" />
                      <span>Celeste</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="mb-4 font-bold text-red-700">Elige la ubicación del texto dentro de la web:</p>

      <div class="mb-10">
        <div class="p-6 bg-[#F4F8FD] rounded-md shadow">
          <h2 class="mb-5 text-lg font-semibold">Ubicación</h2>
          <div class="mb-5">
            <div class="p-6 bg-white rounded-md shadow">
              <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <li>
                  <label class="checkbox" for="flag-home">
                    <input type="checkbox" id="flag-home" value="1" v-model="flag_home" />
                    <span>Destacada Home</span>
                  </label>
                </li>
                <li>
                  <label class="checkbox" for="destacado">
                    <input type="checkbox" id="destacado" value="1" v-model="destacado" />
                    <span>Noticia destacada</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-5">
            <div class="p-6 bg-white rounded-md shadow">
              <h4 class="mb-4 font-bold font-sm">Tipo de noticia</h4>
              <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <li>
                  <label class="radio" for="tipo-noticia">
                    <input type="radio" name="tipo_noticia" id="tipo-noticia" value="0" v-model="tipo_noticia" @change="setNewsType($event)" />
                    <span>Noticia</span>
                  </label>
                </li>
                <li>
                  <label class="radio" for="tipo-talento-cultura">
                    <input type="radio" name="tipo_noticia" id="tipo-talento-cultura" value="1" v-model="tipo_noticia" @change="setNewsType($event)" />
                    <span>Talento y Cultura</span>
                  </label>
                </li>
                <li>
                  <label class="radio" for="tipo-sostenibilidad">
                    <input type="radio" name="tipo_noticia" id="tipo-sostenibilidad" value="2" v-model="tipo_noticia" @change="setNewsType($event)" />
                    <span>Sostenibilidad</span>
                  </label>
                </li>
                <li>
                  <label class="radio" for="tipo-comunicados-sorporativos">
                    <input type="radio" name="tipo_noticia" id="tipo-comunicados-sorporativos" value="3" v-model="tipo_noticia" @change="setNewsType($event)" />
                    <span>Comunicados Corporativos</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p class="mb-4 font-bold text-red-700">Estado de la noticia:</p>

      <div class="mb-10">
        <div class="p-6 bg-[#F4F8FD] rounded-md shadow">
          <div class="mb-5">
            <div class="p-6 bg-white rounded-md shadow">
              <ul class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <li>
                  <label class="radio" for="activar">
                    <input type="radio" id="activar" value="1" v-model="activo" />
                    <span>Publicada</span>
                  </label>
                </li>
                <li>
                  <label class="radio" for="desactivar">
                    <input type="radio" id="desactivar" value="0" v-model="activo" />
                    <span>Borrador</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end mb-10">
        <button @click="preview" type="button" class="btn btn-blue">Previsualizar</button>
        <button type="submit" class="ml-8 btn btn-red">Grabar</button>
      </div>
    </form>

    <div v-if="sent" class="h-[50vh] flex flex-col justify-center items-center">
      <div class="form--response__content">
        <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
          <div class="mb-5">
            <h2 class="font-bold text-center stext-2xl">Noticia guardada correctamente</h2>
          </div>
          <div class="text-center">
            <router-link to="/noticias" class="btn btn-red"><i class="mr-2 fa fa-arrow-left"></i> Volver</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading form--loading"></div>

    <div class="modale--block" v-if="revele">
      <div class="overlay" v-on:click="toggleModale"></div>

      <div class="modale">
        <h2 class="mb-6 font-semibold text-center">Agregar nueva imagen a la galería</h2>
        <div class="mb-4">
          <input class="w-full text-sm border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" type="text" placeholder="Ingresa la leyenda de la imagen" id="legend" />
        </div>
        <div class="mb-4">
          <input type="file" name="imagen-galeria" accept="image/*" id="imageGallery" />
        </div>
        <div class="flex justify-between">
          <button type="button" @click="toggleModale" class="btn btn-red">Cancelar</button>
          <button type="button" @click="addItemGaleria" :disabled="isDisabled" class="btn btn-blue">Agregar</button>
        </div>
        <div class="hidden modale--loading loading" id="modaleLoading"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {defineComponent} from "vue";
  import axios from "axios";
  import Editor from "@tinymce/tinymce-vue";

  export default defineComponent({
    components: {
      editor: Editor,
    },
    data() {
      return {
        revele: false,
        isDisabled: false,

        cur_lang: "es",
        idnew: null,
        API_URL: import.meta.env.VITE_API_URL,
        TINY_EDITOR_KEY: import.meta.env.VITE_TINY_EDITOR_KEY,
        PREVIEW_URL: import.meta.env.VITE_PREVIEW + "es/noticias-y-contacto/",
        VITE_IMAGES_URL: import.meta.env.VITE_IMAGES_URL,
        token: localStorage.getItem("token"),
        galleryList: [],

        preview_image_preview_url: null,
        preview_image_preview_url_en: null,
        preview_image_header_url: null,
        preview_image_header_url_en: null,
        preview_image_author_url: null,
        preview_image_quote_author_url: null,

        id_noticia: null,
        titulo: "",
        titulo_en: "",
        texto: "",
        texto_en: "",
        bajada_nota: "",
        bajada_nota_en: "",
        tipo_plantilla: "",
        color_principal: "",
        link_imagen_cabecera: "",
        link_imagen_cabecera_en: "",
        link_imagen_preview: "",
        link_imagen_preview_en: "",
        palabras_clave: "",
        palabras_clave_en: "",
        autor_nombre: "",
        autor_cargo: "",
        autor_imagen: "",
        cita_autor: "",
        cita_cargo: "",
        cita_imagen: "",
        cita_parrafo_principal: "",
        cita_parrafo_secundario: "",
        tiempo_de_lectura: "",
        seo_meta_title: "",
        seo_meta_description: "",
        seo_meta_keywords: "",
        destacado: "",
        tipo_noticia: "",
        flag_home: "",
        id_usuario: "",
        errors: [],
        galeria: [],
        galeriaLegenda: [],
        activo: 1,
        archivo: "",
        archivoen: "",
        slug: "",
        sent: false,
        loading: false,

        // Errores
        errors: false,
        tituloError: "",
        bajadaNotaError: "",
        textoError: "",
        imagenCabeceraError: "",
        imagenPreviaError: "",
      };
    },
    mounted() {
      if (this.$route.query.next === "true") {
        setTimeout(function () {
          document.getElementById("badge-proceda").hidden = true;
          const el = document.getElementById("seccion_imagenes");
          if (el) {
            el.scrollIntoView({behavior: "smooth", block: "center"});
          }
        }, 1000);
      }
    },
    created() {
      this.idnew = this.$route.params.idnew;

      let dataJson = {
        id_noticia: this.idnew,
        slug: "",
      };

      axios({
        method: "post",
        url: this.API_URL + "detalle-noticia-back",
        data: dataJson,
        headers: {
          "Access-Control-Allow-Headers": "x-access-token",
          "x-access-token": this.token,
        },
      }).then((response) => {
        this.titulo = response.data.titulo;
        this.texto = response.data.texto;
        this.bajada_nota = response.data.bajada_nota;
        this.tipo_plantilla = response.data.tipo_plantilla;
        this.color_principal = response.data.color_principal;
        this.link_imagen_cabecera = response.data.link_imagen_cabecera;
        this.ink_imagen_cabecera_en = response.data.ink_imagen_cabecera_en;
        this.link_imagen_preview = response.data.link_imagen_preview;
        this.link_imagen_preview_en = response.data.link_imagen_preview_en;
        this.palabras_clave = response.data.palabras_clave;
        this.autor_nombre = response.data.autor_nombre;
        this.autor_cargo = response.data.autor_cargo;
        this.autor_imagen = response.data.autor_imagen;
        this.cita_autor = response.data.cita_autor;
        this.cita_cargo = response.data.cita_cargo;
        this.cita_imagen = response.data.cita_imagen;
        this.cita_parrafo_principal = response.data.cita_parrafo_principal;
        this.cita_parrafo_secundario = response.data.cita_parrafo_secundario;
        this.tiempo_de_lectura = response.data.tiempo_de_lectura;
        this.seo_meta_title = response.data.seo_meta_title;
        this.seo_meta_description = response.data.seo_meta_description;
        this.seo_meta_keywords = response.data.seo_meta_keywords;
        this.destacado = response.data.destacado;
        this.tipo_noticia = response.data.tipo_noticia;
        this.flag_home = response.data.flag_home;
        this.activo = response.data.activo === true ? 1 : 0;
        this.slug = response.data.slug;
        this.galleryList = response.data.galeria;

        this.galleryList.forEach((item) => {
          let newImage = {
            legend: item.legenda,
            url: this.VITE_IMAGES_URL + item.link_imagen,
            id: item.id,
          };

          this.galeria.push(newImage);
        });

        if (response.data.noticia_idiomas.length > 0) {
          this.titulo_en = response.data.noticia_idiomas[0].titulo;
          this.texto_en = response.data.noticia_idiomas[0].texto;
          this.bajada_nota_en = response.data.noticia_idiomas[0].bajada_nota;
          this.palabras_clave_en = response.data.noticia_idiomas[0].palabras_clave;
        }

        if (response.data.link_imagen_cabecera != "") {
          this.preview_image_header_url = this.VITE_IMAGES_URL + response.data.link_imagen_cabecera;
        }

        if (response.data.link_imagen_preview != "") {
          this.preview_image_preview_url = this.VITE_IMAGES_URL + response.data.link_imagen_preview;
        }

        if (response.data.autor_imagen != "") {
          this.preview_image_author_url = this.VITE_IMAGES_URL + response.data.autor_imagen;
        }

        if (response.data.cita_imagen != "") {
          this.preview_image_quote_author_url = this.VITE_IMAGES_URL + response.data.cita_imagen;
        }
      });
    },
    methods: {
      register(status = this.activo, redirect = 0) {
        this.errors = [];

        let dataJson = {
          id_noticia: this.idnew,
          titulo: this.titulo,
          titulo_en: this.titulo_en,
          texto: this.texto,
          texto_en: this.texto_en,
          bajada_nota: this.bajada_nota,
          bajada_nota_en: this.bajada_nota_en,
          tipo_plantilla: this.tipo_plantilla,
          color_principal: this.color_principal,
          link_imagen_cabecera: this.link_imagen_cabecera,
          link_imagen_cabecera_en: this.ink_imagen_cabecera_en,
          link_imagen_preview: this.link_imagen_preview,
          link_imagen_preview_en: this.link_imagen_preview_en,
          palabras_clave: this.palabras_clave,
          palabras_clave_en: this.palabras_clave_en,
          autor_nombre: this.autor_nombre,
          autor_cargo: this.autor_cargo,
          autor_imagen: this.autor_imagen,
          cita_autor: this.cita_autor,
          cita_cargo: this.cita_cargo,
          cita_imagen: this.cita_imagen,
          cita_parrafo_principal: this.cita_parrafo_principal,
          cita_parrafo_secundario: this.cita_parrafo_secundario,
          tiempo_de_lectura: this.tiempo_de_lectura,
          seo_meta_title: this.seo_meta_title,
          seo_meta_description: this.seo_meta_description,
          seo_meta_keywords: this.seo_meta_keywords,
          destacado: this.destacado,
          tipo_noticia: this.tipo_noticia,
          flag_home: this.flag_home,
          activo: status,
        };

        this.tituloError = this.titulo.length > 1 ? "" : "Este campo es obligatorio";
        this.bajadaNotaError = this.bajada_nota.length > 1 ? "" : "Este campo es obligatorio";
        this.textoError = this.texto.length > 1 ? "" : "Este campo es obligatorio";
        this.imagenCabeceraError = this.link_imagen_cabecera.length > 1 ? "" : "Este campo es obligatorio";
        this.imagenPreviaError = this.link_imagen_preview.length > 1 ? "" : "Este campo es obligatorio";

        let flag = !(this.tituloError || this.bajadaNotaError || this.textoError || this.imagenCabeceraError || this.imagenPreviaError);

        if (flag) {
          this.loading = true;

          axios({
            method: "put",
            url: this.API_URL + "noticia",
            data: dataJson,
            headers: {
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": this.token,
            },
          })
            .then((response) => {
              if (redirect === 1) {
                axios({
                  method: "post",
                  url: this.API_URL + "detalle-noticia-back",
                  data: dataJson,
                  headers: {
                    "Access-Control-Allow-Headers": "x-access-token",
                    "x-access-token": this.token,
                  },
                }).then((response) => {
                  this.activo = 0;
                  window.open(this.PREVIEW_URL + response.data.slug);
                  this.loading = false;
                });
              } else {
                setTimeout(() => {
                  this.loading = false;
                  this.sent = true;
                }, 1000);
              }
            })
            .catch((err) => console.log(err));
        } else {
          this.errors = true;

          setTimeout(function () {
            const el = document.getElementById("mainTitle");
            if (el) {
              el.scrollIntoView({behavior: "smooth", block: "center"});
            }
          }, 200);
        }
      },
      addItemGaleria() {
        const loading = document.getElementById("modaleLoading");
        const image = document.getElementById("imageGallery");
        const legend = document.getElementById("legend");
        var imageUrl = "";

        loading.classList.remove("hidden");

        if (image.files[0]) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(image.files[0]);
          fileReader.addEventListener("load", function (el) {
            imageUrl = el.target.result;
          });

          let bodyFormData = new FormData();

          bodyFormData.append("imagen", image.files[0]);
          bodyFormData.append("id_noticia", this.idnew);
          bodyFormData.append("legenda", legend.value);
          bodyFormData.append("id_usuario", 1);

          axios({
            method: "post",
            url: this.API_URL + "subirimagengaleria",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": this.token,
            },
          }).then((response) => {
            setTimeout(() => {
              let newImage = {
                legend: legend.value,
                url: response.data.url + response.data.imagen,
                id: response.data.data_imagen.id,
              };

              this.galeria.push(newImage);

              this.revele = false;
              image.value = "";
              legend.value = "";
              loading.classList.add("hidden");
            }, 1000);
          });
        }
      },
      setNewsType(event) {
        const value = event.path[0].value;
        this.tipo_noticia = value;
      },
      subirImagen(event, campo, preview) {
        let bodyFormData = new FormData();
        bodyFormData.append("imagen", event.target.files[0]);

        axios({
          method: "post",
          url: import.meta.env.VITE_API_URL + "subirimagen",
          data: bodyFormData,
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Headers": "x-access-token",
            "x-access-token": this.token,
          },
        })
          .then((response) => {
            let archivo = response.data.archivo;
            let imgPreview = this.VITE_IMAGES_URL + archivo;

            this[campo] = archivo;
            this[preview] = imgPreview;
          })
          .catch((err) => console.log(err));
      },
      toggleLangs() {
        this.cur_lang = this.cur_lang === "es" ? "en" : "es";
      },
      preview() {
        let retVal = confirm("Esta acción pondrá la noticia en estado 'Borrador' para poder previsualizarla. ¿Desea continuar?");

        if (retVal == true) {
          this.register(0, 1);
          return true;
        } else {
          return false;
        }
      },
      subirGaleria() {
        this.galeria.forEach((imagen, index) => {
          let bodyFormData = new FormData();

          bodyFormData.append("imagen", imagen);
          bodyFormData.append("id_noticia", this.idnew);
          bodyFormData.append("legenda", this.galeriaLegenda[index]);
          bodyFormData.append("id_usuario", 1);

          axios({
            method: "post",
            url: this.API_URL + "subirimagengaleria",
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Headers": "x-access-token",
              "x-access-token": this.token,
            },
          })
            .then((response) => {})
            .catch((err) => console.log(err));
        });
      },
      uploadImagenRichText(blobInfo, success, failure, progress) {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", this.API_URL + "subirimagen-richtext");
        xhr.setRequestHeader("x-access-token", this.token);

        xhr.upload.onprogress = function (e) {
          progress((e.loaded / e.total) * 100);
        };

        xhr.onload = function () {
          var json;

          if (xhr.status === 403) {
            failure("HTTP Error: " + xhr.status, {remove: true});
            return;
          }

          if (xhr.status < 200 || xhr.status >= 300) {
            failure("HTTP Error: " + xhr.status);
            return;
          }

          json = JSON.parse(xhr.responseText);

          if (!json || typeof json.imagen !== "string") {
            failure("Invalid JSON: " + xhr.responseText);
            return;
          }

          success(json.url + json.imagen);
        };

        xhr.onerror = function () {
          failure("Image upload failed due to a XHR Transport error. Code: " + xhr.status);
        };

        formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());
        formData.append("type", "imagen");

        xhr.send(formData);
      },
      eliminarImagenGaleria(idImagen, index) {
        const dataJson = {
          id_imagen: idImagen,
        };

        axios({
          method: "post",
          url: this.API_URL + "eliminarimagengaleria",
          data: dataJson,
          headers: {
            "Access-Control-Allow-Headers": "x-access-token",
            "x-access-token": this.token,
          },
        }).then((response) => {
          this.galeria.splice(index, 1);
        });
      },
      toggleModale: function () {
        this.revele = !this.revele;
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .form {
    &--main {
      @apply relative;
    }

    &--loading {
      background-position-y: 90%;
    }
  }

  .gallery {
    &-images {
      &--item {
        @apply px-5 py-3 shadow mb-5;

        &__header {
          @apply mb-2 lg:mb-3 flex justify-between items-center;
        }
      }

      &--delete {
        @apply inline-block rounded-sm px-3 py-1 bg-red-500 text-xs text-white leading-none;
      }

      &--add {
        @apply inline-block rounded-md px-3 py-2 border bg-purple-500 text-xs text-white leading-none;
      }
    }

    &--grid {
      @apply grid grid-cols-2 xl:grid-cols-3 gap-4;
    }

    &--item {
      @apply p-2 rounded border border-gray-200;
    }

    &--content {
      @apply relative;

      &:after {
        content: "";
        padding-top: 100%;
        @apply block;
      }
    }

    &--figure {
      @apply absolute inset-0 overflow-hidden;
    }

    &--delete {
      @apply absolute top-0 right-0 bg-white bg-opacity-75 inline-block leading-none z-10 text-lg;
    }
  }

  .overlay {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .modale {
    background: #f1f1f1;
    color: #333;
    padding: 50px;
    position: fixed;
    top: 30%;

    &--block {
      @apply z-10 flex justify-center items-start fixed inset-0;
    }
  }
</style>
