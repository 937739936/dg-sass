<template>
  <div></div>
</template>

<script>
import { loginFree } from "@/v2/utils/loginFree";
import { getQueryString } from "@/v2/utils/index";

export default {
  async beforeCreate() {
    const result = await loginFree();
    this.$router.replace({
      path: getQueryString("toPath"),
      query: {
        redirect_url: result.redirect_url
      }
    });
  },
}
</script>

<style>

</style>