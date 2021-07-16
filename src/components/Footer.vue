<template>
  <v-footer color="orange">
    <v-row justify="center" no-gutters>
      <v-btn v-for="icon in icons" :key="icon.name" :href="icon.path" class="mx-3 white--text" icon>
        <v-icon size="24px">{{ icon.name }}</v-icon>
      </v-btn>
      <v-col cols="12" class="text-center white--text">
        © {{ new Date().getFullYear() }} —
        <strong>Zhang Ji | All Rights Reserved.</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      { name: "fab fa-facebook", path: "https://www.facebook.com" },
      { name: "fab fa-instagram", path: "https://www.instagram.com" },
      { name: "fab fa-line", path: "https://www.line.me" },
    ],
  }),
};
</script>