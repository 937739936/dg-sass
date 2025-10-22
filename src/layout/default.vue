<template>
    <div class="lay-container">
<!--        <header-com></header-com>-->
        <Header :if-home=false></Header>
        <div class="lay-wrapper">
            <div class="lay-content">
                <slot></slot>
            </div>
        </div>
        <footer-com></footer-com>
    </div>
</template>

<script>
// import HeaderCom from 'components/common/HeaderCom'
import FooterCom from 'components/common/FooterCom'
import Header from '../views/common/Header';
export default {
    components: {
        Header,
        FooterCom
    }
}
</script>

<style lang="stylus" scoped>

</style>
