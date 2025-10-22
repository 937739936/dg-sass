<template>
	<a-modal
		class="modal-wrap modal-wrap-no-cancel"
		:title="title"
    width="608px"
		:visible="visible"
		:confirm-loading="confirmLoading"
    :maskClosable="false"
    destroyOnClose
    :okText="activeStep === 2 ? '确定' : '下一步'"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<div class="modal-content">
      <div class="step-wrap">
        <div :class="['step-item', activeStep >= index ? 'step-item-active' : '']" v-for="(item, index) in stepList" :key="index">
          <span class="indicator">{{ index + 1 }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="step-item-line" v-if="index <= 1"></span>
        </div>
      </div>
      <div class="step-content">
        <Step1 :personalInfo="personalInfo" v-if="activeStep === 0" v-on:submit="submitSuccess" ref="Step1" />
        <Step2 :title="title" :personalInfo="personalInfo" v-if="activeStep === 1" v-on:submit="submitSuccess" ref="Step2" />
        <Step3 :title="title" :personalInfo="personalInfo" v-if="activeStep === 2" v-on:submit="submitSuccess" ref="Step3" />
      </div>
    </div>
	</a-modal>
</template>
<script>
import { API_GetRealNameAuthDetail } from '@/v2/api/account';
import Step1 from './email/Step1';
import Step2 from './email/Step2';
import Step3 from './email/Step3';

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
          title: '填写邮箱'
        },
        {
          id: 3,
          title: '变更完成'
        }
      ],
      personalInfo: {}
		};
	},
  components: {
    Step1,
    Step2,
    Step3
  },
  mounted() {
    this.initData();
  },
	methods: {
    submitSuccess(flag) {
			if (this.activeStep < 3) {
				this.activeStep = flag;
			} else {
				this.visible = false;
        this.activeStep = 0;
        this.$emit('update');
			}
    },
    async initData() {
			const { data } = await API_GetRealNameAuthDetail({ t: new Date().getTime() });
			this.personalInfo = data;
		},
		showModal() {
			this.visible = true;
		},
		handleOk() {
      if (this.activeStep === 0) {
        this.$refs.Step1.submit();
        return;
      }
      if (this.activeStep === 1) {
        this.$refs.Step2.submit();
        return;
      }
      this.visible = false;
      this.$emit('update');
		},
		handleCancel() {
      this.activeStep = 0;
			this.visible = false;
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
  width: 100%;
  height: 32px;
  display: flex;
}
.step-item {
  width: 180px;
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