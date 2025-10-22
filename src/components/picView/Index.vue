<template>
    <viewer :images="imgs" ref="viewer" @inited="viewer=>{$viewer=viewer}">
        <img v-for="item in imgs" :key="item" :src="item" style="display: none">
    </viewer>
</template>

<script>

    export default {
        props: {
            imgList: Array
        },
        name: "picView",
        data() {
            return {
                imgs: []
            }
        },
        created() {
            if (this.imgList) {
                this.imgs = [...this.imgList]
            }
        },
        methods: {
            viewPic(img) {
                if (img) {
                    this.imgs = [img]
                }
                setTimeout(() => {
                    this.$viewer.view(0)
                }, 0)
            }
        }
    }
</script>

<style scoped>

</style>