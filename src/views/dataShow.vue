<template>
  <div class="main">
    <div align="center" class="divHead">{{ head }}</div>
    <div class="divBody">
      <div class="body1">
        <div>{{ obj.data1Name }}</div>
        <div>
          <span v-for="i in obj.data1Num"
            ><span class="numSpan">{{ i }}</span></span
          >
          <span >人</span>
        </div>
      </div>
      <div class="body2">
        <div>{{ obj.data2Name }}</div>
        <div>
          <span v-for="i in obj.data2Num"
            ><span class="numSpan">{{ i }}</span></span
          >
          <span >元</span>
        </div>
      </div>
    </div>

    <div align="center">
      <div class="divFoot ">{{ nowDate }}</div>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
export default {
  data() {
    return {
      head: "网上学院实时订单交易",
      obj: {
        data1Name: "报名总人数：",
        data1Num: [],
        data2Name: "缴费总金额：",
        data2Num: []
      },
      nowDate: null,
      times: null,
      $randomPer: null,
      isFullscreen: false
    };
  },
  filters: {
    // //设置一个函数来进行过滤
    // formaDate: function(d) {
    //   return{d.getFullYear() +
    //     "-" +
    //     (d.getMonth() + 1) +
    //     "-" +
    //     d.getDate() +
    //     " " +
    //     d.getHours() +
    //     ":" +
    //     d.getMinutes() +
    //     ":" +
    //     d.getSeconds()}
    // }
  },
  methods: {
    addDate() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        hour: nowDate.getHours(),
        minute: nowDate.getMinutes(),
        second: nowDate.getSeconds()
      };
      let zero1 = 0,
        zero2 = 0,
        zero3 = 0,
        zero4 = 0,
        zero5 = 0;
      if (date.month >= 10) zero1 = "";
      if (date.date >= 10) zero2 = "";
      if (date.hour >= 10) zero3 = "";
      if (date.minute >= 10) zero4 = "";
      if (date.second >= 10) zero5 = "";
      let systemDate =
        date.year +
        "-" +
        zero1 +
        date.month +
        "-" +
        zero2 +
        date.date +
        " " +
        zero3 +
        date.hour +
        ":" +
        zero4 +
        date.minute +
        ":" +
        zero5 +
        date.second;
      return systemDate;
    },
    perNum1($random2) {
      let n=parseInt($random2)
      //   var $random2 = parseInt(Math.random() * 5) + 1;
      //   this.$randomPer += $random2;
      this.$obj = String(n);
      this.obj.data1Num = this.$obj.split("");
      //   setTimeout(this.perNum1, 2000);
    },
    accMul(arg1, arg2) {
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      } catch (e) {}
      try {
        m += s2.split(".")[1].length;
      } catch (e) {}
      return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
      );
    },
    perNum2($random2) {
        let n=parseInt($random2)
      this.$obj = String(n);
      this.obj.data2Num = this.$obj.split("");
    },
    getAllMsg() {
      let that = this;
      request({
        url: '/wx/system/home/getClassUserNumber',
        method: 'get',
      }).then(res=>{
        if (res.code == 200) {
          that.perNum1(res.data);
        }
      });
      request({
        url: '/wx/system/home/getTotalMoney',
        method: 'get',
      }).then(res=>{
        if (res.code == 200) {
          that.perNum2(res.data);
        }
      })

      // this.$axios
      //   .get("/wx/system/home/getClassUserNumber", {
      //     params: {}
      //   })
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       that.perNum1(res.data.data);
      //     }
      //   });
      // this.$axios
      //   .get("/wx/system/home/getTotalMoney", {
      //     params: {}
      //   })
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       that.perNum2(res.data.data);
      //     }
      //   });
    }
  },
  mounted() {
    //document.body.style.backgroundColor = "red";
    setInterval(() => {
      this.getAllMsg();
    }, 10000);
    this.$randomPer =
      parseInt(
        (new Date().getTime() -
          new Date(new Date().setHours(0, 0, 0, 0)).getTime()) /
          1000
      ) + 1000;
    let that = this;
    this.times = setInterval(() => {
      that.nowDate = that.addDate();
    }, 1000);
  },
  created() {
    this.getAllMsg();
  },
  beforeDestroy: function() {
    this.times = null;
  }
};
</script>

<style scoped>
* {
  font-size: 44px;
  color: white;
  letter-spacing: 5px;
  margin: 0;
  padding: 0;
}
.main {
  background-image: url("../assets/image/bg.jpg");
  background-size: 100% 100%;
  height: 100vh;
}
.divHead {
  padding: 10% 0;
  font-size: 60px;
  font-weight: bold;
}
.body1 {
  margin: 30px;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
.body2 {
  margin: 30px;
  display: flex;
  font-weight: bold;
  justify-content: center;
}
.numSpan {
  background: white;
  border-radius: 5px;
  /* box-shadow: 0 0 50px rgb(248, 1, 1) ; */
  color: gold;
  font-weight: bold;
  margin: 5px;
  padding: 5px;
}
.divFoot {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  font-size: 28px;
}
</style>
