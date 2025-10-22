<template>
    <a-modal
      class="slModal"
      :title="title"
       width="490px"
      destroyOnClose
      v-model="visible"
     >
      <div class="base-content">
        <p>原因：</p>
        <p style="margin-top:12px" v-for="(txt, index) in list" :key="index" v-html="txt"></p>
      </div>
      <div slot="footer">
        <div  v-if="isAdmin"> 
             <a-button @click.native="visible = false" style="margin-right:20px">取消</a-button>
            <a-button type="primary" @click="goChange"  style="width:118px">前往变更</a-button>
        </div>
     
      </div>
    </a-modal>
</template>

<script>
import { mapGetters} from 'vuex';
import {
  API_CheckBeforeEachApply
} from "@/v2/api/account";
export default {
  props: {
    title: {
      default: '提示',
     
    },
    reasons: {
      default: () => {return []}
    }

  },
  
  data() {
    return {
      visible: false,
      list: []
    }
  },

  computed: {
    ...mapGetters('user', {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
    }),
    isAdmin() {
      const flag = this.VUEX_ST_COMPANYSUER?.roles?.some(el => el.code == "ADMIN")
      // 判断 是不是 发起方
      const flag2 = this.reasons.some(el => el.initiator)
      return flag2 && flag
    }
  },
  watch: {
    reasons(arr) {
      if(!arr) return
      this.list = arr.map(el => {
        const str = el.reason.replace(/】/g, '"</span>').replace(/【/g, '<span style="color:rgba(0,0,0,.8)">"')
        return str
      });
    }
  },
  created() {

    
  },
  mounted() {
    
  },
  methods: {
    async goChange() {
      this.visible = false

      const res=  await API_CheckBeforeEachApply()
       if (res.data.boo) { 
        this.$router.push('/center/account/company/info/change')
       } else {
        this.$message.error(res.data.msg);
       }
      
    },
    showModal() {
      this.visible = true
    }
  },
  components: {

  }
}
</script>

<style scoped  lang='less' >
.slModal {
  /deep/ .ant-modal-header {
    background: #fff;
    padding: 20px;
  }
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-footer {
    border-top: 0;
    padding-top: 0;
  }
  .base-content {
    border-radius: 4px;
    border: 1px solid #E5E6EB;
    background: #F3F5F6;
    padding: 14px;
    color: #8191A9;
  }
}

</style>
