<template>
  <el-row>
    <!-- {{ reMsg }} -->
    <!--<el-cascader-->
    <!--ref="areaNames"-->
    <!--style="width:100%"-->
    <!--:options="city.options"-->
    <!--:props="props"-->
    <!--v-model="cityValue"-->
    <!--@visible-change="_initData"-->
    <!--@active-item-change="handleItemChange"-->
    <!--@change="cityChange"-->
    <!--&gt;-->
    <!--</el-cascader>-->
    <el-cascader
      ref="areaNames"
      style="width:100%"
      :props="props"
      v-model="cityValue"
      @change="cityChange"
    >
    </el-cascader>
  </el-row>
</template>

<script>
  import {getAddress} from "../../api/wx/user";

  export default {
    name: "addressSelector",
    props: {
      reMsg: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        props: {
          // 级联选择器的属性配置
          value: "value",
          // children: "cities",
          checkStrictly: false,
          lazy: true,
          lazyLoad(node, resolve) {
            const {level, value} = node;
            getAddress(value ? value : undefined).then(res => {
                const nodes = res.data.map(item => {
                  return {
                    value: item.id,
                    label: item.name,
                    leaf: level >= 2,
                  };
                });
                resolve(nodes);
              }).catch(() => {
              resolve([]);
            });
          }
        },
        cityValue: [] // 城市代码
      };
    },
    computed: {},
    methods: {
      getCityCode() {
        return this.cityValue[2];
      },
      reset() {
        this.cityValue = [];
      },
      cityChange(value) {
        this.$nextTick(() => {
          if (value.length === 3) {
            this.$emit("cityChange", this.$refs["areaNames"].presentText);
          } else {
            this.$emit("cityChange", null);
          }
        });
      }
    },
    watch: {
      reMsg: {
        deep: true,
        immediate: true,
        handler(newVal) {
          this.$nextTick(() => {
            this.$refs["areaNames"].presentText = newVal || "";
          });
        }
      },
    },
    beforeDestroy() {
      if (this.$refs["areaNames"] && this.$refs["areaNames"].$refs.panel) {
        this.$refs["areaNames"].$refs.panel.activePath = [];
        this.$refs["areaNames"].$refs.panel.clearCheckedNodes();
        this.$refs["areaNames"].presentText = "";
        this.cityValue = [];
      }
    }
  };
</script>
