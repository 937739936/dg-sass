<template>
  <a-modal
    :visible="visible"
    title="切换业务负责人"
    class="slModal"
    centered
    :width="404"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="spinning">
      <a-form class="slFormDetail" :form="form">
        <a-form-item label="选择业务负责人">
          <a-cascader
            :options="options"
            expand-trigger="hover"
            placeholder="请选择选择业务负责人"
            v-decorator="[
              `cascader`,
              {
                rules: [
                  {
                    required: true,
                    message: `请选择选择业务负责人`,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import {
  API_getCurrentDirectorByUser,
  API_getDirectorOptionByCompany,
  API_setCurrentDirector,
} from "@/v2/center/trade/api/contract";
const keyList = ["businessUnitName", "region", "department", "id"]; //层级
function optionsFun(List, i = 0) {
  let key = keyList[i];
  let newList = List.map((item) => {
    return item[key];
  });
  newList = [...new Set(newList)];
  let list = newList.map((item) => {
    //统一类型，方式数字ID匹配不上
    let obj = {
      value: String(item),
      label: item,
    };
    if (i < keyList.length - 1) {
      obj.children = optionsFun(
        List.filter((items) => {
          return items[key] == item;
        }),
        i + 1
      );
    } else if (i == keyList.length - 1) {
      let user = List.find((items) => {
        return items[key] == item;
      });
      //如果只有一个值，直接取名字，如果大于一个，拼接手机号
      if (
        List.filter((items) => {
          return items.memberName == user.memberName;
        }).length > 1
      ) {
        obj.label = `${user.memberName}-${user.memberMobile}`;
      } else {
        obj.label = user.memberName;
      }
    }
    return obj;
  });
  list.unshift({
    value: "",
    label: "全部",
  });
  return list;
}
export default {
  name: "CurrentDirector",
  components: {},
  data() {
    return {
      visible: false,
      directorList: [],
      spinning: true,
      form: this.$form.createForm(this),
    };
  },
  computed: {
    options() {
      let options = optionsFun(this.directorList);
      return options;
    },
  },
  methods: {
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {};
          keyList.map((item, index) => {
            params[item] = values.cascader[index];
          });
          API_setCurrentDirector(params).then((res) => {
            if (res.success) {
              this.visible = false;
              this.$message.success("操作成功！");
              //重置到列表页面
              //获取当前加载的所有层级，展示当前的上一个层级，上一个层级默认指向是列表层，所以没有问题
              let { matched,path } = this.$route;
              let matchedPath = matched[matched.length - 1].path;
              if (matched.length >= 2) {
                matchedPath = matched[matched.length - 2].path;
              }
              let newUrl=this.$router.resolve(matchedPath)
              //如果要跳转的路由和当前路由一直，刷新页面，否则跳转
              if(newUrl.route.path==path){
                this.$router.go(0);
              }else{
                this.$router.replace(matchedPath)
              }
            }
          });
        }
      });
    },
    async showModal() {
      this.visible = true;
      this.spinning = true;
      // 获取用户下的业务负责人
      await API_getDirectorOptionByCompany().then((res) => {
        if (res.success && res.data) {
          this.directorList = res.data;
        }
      });
      // 获取用户下的当前设置的业务负责人
      await API_getCurrentDirectorByUser().then((res) => {
        if (res.success && res.data) {
          let cascader = [];
          keyList.map((item, index) => {
            //空的话全部，全部'',不能选null,匹配补上
            cascader[index] = res.data[item] ? String(res.data[item]) : "";
          });
          this.form.setFieldsValue({ cascader });
        }
      });
      this.spinning = false;
    },
    handleCancel() {
      this.directorList = [];
      this.spinning = false;
      this.form.resetFields();
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.slModal {
  /deep/.ant-modal-header {
    padding: 16px 20px;
  }
  /deep/.ant-modal-body {
    padding: 0px 20px 14px;
  }
  /deep/.ant-modal-footer {
    padding: 16px 20px;
  }
}
</style>
