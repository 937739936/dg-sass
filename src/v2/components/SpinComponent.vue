<template>
    <div class="spin-modal" v-if="active">
        <a-spin :tip="text"></a-spin>
    </div>
</template>

<script>
    export default {
        name : "SpinComponent",
        props:{
            active:{
                default(){
                    return false;
                }
            },
            text:{
                default(){
                    return ''
                }
            }
        }
    }
</script>

<style lang="less">
    .spin-modal{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
        background: rgba(255,255,255,0.8);
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: center;

    }
</style>
