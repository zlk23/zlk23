<template>
  <div>
    <div class="echarts">
        <div id="main0"></div>
        <div id="main1"></div>
        <div id="main2"></div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
    data(){
        return{
            dataList:[],
        }
    },
    created(){
        this.getData();
    },
    methods:{
        
        getData(){
            var $this=this;
            request({
            url: '/wx/awards/statistics',
            method: 'get',
            }).then(res=>{
                if (res.code == 200) {
                    $this.dataList = res.data;

                    console.log($this.dataList)
                    $this.drawChart()
                }
            })
        },
        drawChart() {
            var datas=this.dataList
            datas.forEach((item,index) => {
                var id='main'+index;
                console.log(id)
                // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
                var myChart = this.$echarts.init(document.getElementById(id));
                var data=[];
                var num=[];
                var people=item.peopleList;
                people.forEach(item=>{
                    data.push(item.name)
                    num.push(Number(item.num))
                })
                console.log(data)
                console.log(num)
                // 指定图表的配置项和数据
                var option = {

                    color:"#1989fa",
                    title: {
                    text: item.awardsName,
                    },
                    tooltip: {},
                    legend: {
                    data: ["投票数"],
                    },
                    xAxis: {
                    data: data,
                    axisLabel: {
                        //x轴文字的配置
                        show: true,
                        interval: 0,//使x轴文字显示全
                    }
                    },
                    yAxis: {},
                    series: [
                    {
                        name: "票数",
                        type: "bar",
                        data: num,
                    },
                    ],
                }; 
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            });

        },

    }
}
</script>

<style>
.echarts{
    padding: 40px 20px;
}
.echarts>div{
    float: left;
    width:30%;
    min-width: 300px;
    min-height: 200px;

}
</style>