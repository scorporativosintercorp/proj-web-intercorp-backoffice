<template>
  <div>
    <editor :v-model="vmodel" :api-key="token"></editor>
  </div>
</template>

<script>
  import Editor from "@tinymce/tinymce-vue";

  export default {
    name: "Wysiwyg",
    components: {
      editor: Editor,
    },
    props: {
      token: {
        type: String,
        default: "",
      },
      vmodel: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        html: "",
      };
    },
    mounted() {
      this.tokenTest();
    },
    methods: {
      tokenTest() {
        console.log("token", this.token);
      },
    },
  };
</script>

<style lang="scss" scoped></style>
