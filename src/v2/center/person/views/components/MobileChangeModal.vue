<template>
	<a-modal
		class="modal-wrap modal-wrap-no-cancel"
		:title="title"
    width="850px"
		:visible="visible"
		:confirm-loading="confirmLoading"
    :maskClosable="false"
    destroyOnClose
    :okText="okText"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<div class="modal-content">
      <div class="step-wrap">
        <div :class="['step-item', activeStep >= index ? 'step-item-active' : '']" v-for="(item, index) in stepList" :key="index">
          <span class="indicator">{{ index + 1 }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="step-item-line" v-if="index <= 2"></span>
        </div>
      </div>
      <div class="step-content">
        <Step1 v-if="activeStep === 0" :personalInfo="personalInfo" v-on:submit="submitSuccess" ref="Step1" />
        <Step2 v-if="activeStep === 1" :personalInfo="personalInfo" v-on:submit="submitSuccess" v-on:setChangeMobile="setChangeMobile" ref="Step2" />
        <Step3 v-if="activeStep === 2 && !isAuthing" :personalInfo="personalInfo" :changeMobile="changeMobile" v-on:submit="submitAuthing" ref="Step3" />
        <!-- <Step4 v-if="activeStep === 3" /> -->
        <Step5 v-if="activeStep === 3" :personalInfo="personalInfo" v-on:submit="submitSuccess" ref="Step4" />
        <StepAuthing v-if="activeStep === 2 && isAuthing" v-on:submit="submitAuthing" />
      </div>
    </div>
	</a-modal>
</template>
<script>
import { API_GetRealNameAuthDetail } from '@/v2/api/account';
import Step1 from './mobile/Step1';
import Step2 from './mobile/Step2';
import Step3 from './mobile/Step3';
import Step4 from './mobile/Step4';
import Step5 from './Step5';
import StepAuthing from './mobile/StepAuthing';

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
	data() {
		return {
			visible: false,
			confirmLoading: false,
      activeStep: 0,
      stepList: [
        {
          id: 1,
          title: '验证身份'
        },
        {
          id: 2,
          title: '填写信息'
        },
        {
          id: 3,
          title: '校验审核'
        },
        {
          id: 4,
          title: '变更完成'
        }
      ],
      personalInfo: {},
      changeMobile: null,
      isAuthing: false
		};
	},
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    StepAuthing
  },
  computed: {
    okText() {
      if (this.activeStep === 2 && this.isAuthing) {
        return '确定';
      }
      if (this.activeStep === 3) {
        return '确定';
      }
      if (this.activeStep === 2) {
        return '提交';
      }
      return '下一步';
    }
  },
  mounted() {
    this.initData();
  },
	methods: {
    setChangeMobile(mobile) {
      this.changeMobile = mobile;
    },
    async initData() {
			const { data } = await API_GetRealNameAuthDetail({ _t: new Date().getTime() });
			this.personalInfo = data;
		},
		showModal() {
			this.visible = true;
		},
    submitAuthing(flag) {
      if (flag === 'authing'){
        this.activeStep = 2;
        this.isAuthing = true;
      };
    },
    submitSuccess(flag) {
			if (flag <= 3) {
				this.activeStep = flag;
			} else {
				this.visible = false;
        this.activeStep = 0;
        this.$emit('update');
			}
    },
		handleOk() {
      if (this.isAuthing) {
        this.handleCancel();
        return;
      }
      if (this.activeStep === 0) {
        this.$refs.Step1.submit();
        return;
      }
      if (this.activeStep === 1) {
        this.$refs.Step2.submit();
        return;
      }
      if (this.activeStep === 2) {
        this.$refs.Step3.submit();
        return;
      }
      this.visible = false;
      this.$emit('update');
		},
		handleCancel() {
      this.activeStep = 0;
			this.visible = false;
      this.isAuthing = false;
      this.$emit('update');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/modal.less');
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/card-upload.less');
@import url('~@/v2/style/modal-form.less');
</style>
<style lang="less" scoped>
.modal-content {
  padding: 30px 50px 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-wrap {
  width: 740px;
  height: 32px;
  display: flex;
}
.step-item {
  width: 185px;
  height: 32px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 24px;
  .indicator {
    width: 32px;
    height: 32px;
    background: rgba(195, 195, 195, 1);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 32px;
  }
  .title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .step-item-line {
    width: 64px;
    height: 2px;
    display: inline-block;
    background: rgba(195, 195, 195, 1);
  }
}
.step-item:first-child {
  margin-left: 0;
}
.step-item:last-child {
  width: 100px;
}
.step-item-active {
  .indicator {
    background: @primary-color;
  }
  .title {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
  }
}
</style>