<template>
  <div class="contaner">
      <div class="city-info">
        <dl>
          <!--当前城市显示-->
          <dt class="city-name" style="font-size: 30px;">{{location}}</dt>
        </dl>
        <!-- 动态获取时间 -->
        <div>
                {{ nowDate + ' ' + nowTime + ' ' + nowWeek }}
        </div>
        <dl id="display" style="font-size: 10px;">
           <h1>{{forecast}}℃  晴</h1>
           
        </dl>
     </div>
         <!--为echarts准备一个具备大小的容器dom-->
      <div class="echarts">
        <div id="main" style="width: 600px;height: 200px;"></div>
        <div id="seven" style="width: 600px;height: 200px;"></div>
      </div>
      <!-- 城市列表-->
    <div class="change-address">
      <van-cell is-link @click="showPopup" v-model="showAddr">
         切换城市 
        <span class="showAddr">{{showAddr}}</span>
      </van-cell>
      <van-popup v-model="show" position="bottom" :style="{ height: '50%' ,padding:'16px'}">
        <van-area
          :area-list="areaList"
          :columns-placeholder="['请选择', '请选择', '请选择']"
          value="510100"
          title="选择地址"
          @change="changeAddr"
          @cancel="cancelChoose"
          @confirm="chooseThis"
        />
      </van-popup>
    </div>
    <!-- 个人中心 -->
    <div class="myself">
      <van-cell is-link @click="f" v-model="showAddr">
         个人中心 
        <span class="showAddr">{{s}}</span>
      </van-cell>
    </div>
    </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
import addressData from "../common/area.js";
export default {
  name: "",
  data() {
    return {
      charts: "",
      forecast: "",
      /* opinionData: ["3", "2", "4", "4", "5"]*/
      opinionData: [],
      date: [],
      opinionData1: [],
      date1: [],
      show: false,

      areaList: addressData,
      showAddr: "",
      resAddr: "",
      nowDate: "",    // 当前日期
      nowTime: "",    // 当前时间
      nowWeek: ""     // 当前星期
    };
  },
  methods: {
    getData() {
      axios
        .get(
          "https://yiketianqi.com/api?version=v9&appid=13577332&appsecret=B7tpUULh"
        )
        .then(
          (response) => {
            console.log(response.data.data[0].hours);
            //获取24小时天气
            var json = response.data.data[0].hours;
            for (var i = 0; i < json.length; i++) {
              this.opinionData[i] = response.data.data[0].hours[i].tem;
              this.date[i] = response.data.data[0].hours[i].hours;
            }
            this.drawLine("main");
            //获取实时天气
            var forecast1 = response.data.data[0].tem;
            this.forecast = forecast1;
            //获取当前城市
            var location1 = response.data.city;
            this.location = location1;
            console.log(forecast1);
            console.log(location1);
            console.log(response.data.data);
            //获取7日天气
            var json1 = response.data.data;
            for (var j = 0; j < json1.length; j++) {
              this.opinionData1[j] = response.data.data[j].tem;
              this.date1[j] = response.data.data[j].date;
            }
            this.drawLine1("seven");
          },
          (response) => {
            console.log("error");
          }
        );
    },
    //24小时天气折线图设置
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "24小时天气",
          left: "center",
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          // data: ["00时","01时","02时","03时","04时","05时","06时","07时","08时","09时","10时","11时","12时",
          //"13时","14时","15时","16时","17时","18时","19时","20时","21时","22时","23时"]
          data: this.date,
        },
        yAxis: {
          type: "value",
        },

        series: [
          {
            name: "当前天气",
            type: "line",
            data: this.opinionData,
          },
        ],
      });
    },
    //7日天气折线图设置
    drawLine1(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "7日天气",
          left: "center",
        },
        xAxis: {
          type: "category",
          // boundaryGap: false,
          // data: ["00时","01时","02时","03时","04时","05时","06时","07时","08时","09时","10时","11时","12时",
          //"13时","14时","15时","16时","17时","18时","19时","20时","21时","22时","23时"]
          data: this.date1,
        },
        yAxis: {
          type: "value",
        },

        series: [
          {
            name: "当日天气",
            type: "line",
            data: this.opinionData1,
          },
        ],
      });
    },
    showPopup() {
      this.show = true;
    },
    changeAddr(picker) {
      //value=0改变省，1改变市，2改变区
      let val = picker.getValues();
      this.resAddr = val;
    },
    chooseThis() {
      this.show = false;
      //选中地址成功后回显
      this.showAddr =
        this.resAddr[0].name +
        "-" +
        this.resAddr[1].name +
        "-" +
        this.resAddr[2].name;
      console.log(this.resAddr, "即将传给后端的省市区信息");
    },
    //获取时间
     currentTime() {
            setInterval(this.getDate, 500);
        },
        getDate: function() {
            var _this = this;
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth() + 1;
            let dd = new Date().getDate();
            let week = new Date().getDay();
            let hh = new Date().getHours();
            let mf =
                new Date().getMinutes() < 10
                    ? "0" + new Date().getMinutes()
                    : new Date().getMinutes();
            if (week == 1) {
                this.nowWeek = "星期一";
            } else if (week == 2) {
                this.nowWeek = "星期二";
            } else if (week == 3) {
                this.nowWeek = "星期三";
            } else if (week == 4) {
                this.nowWeek = "星期四";
            } else if (week == 5) {
                this.nowWeek = "星期五";
            } else if (week == 6) {
                this.nowWeek = "星期六";
            } else {
                this.nowWeek = "星期日";
            }
            _this.nowTime = hh + ":" + mf;
            _this.nowDate = yy + "/" + mm + "/" + dd;
        }
  },
  //调用
  mounted() {
    this.getData();
    this.currentTime();
  },
  // 销毁定时器
   beforeDestroy: function() {
        if (this.getDate) {
            console.log("销毁定时器")
            clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
        }
    }
};
</script>
<style>
.contaner{
        width: 100%;
        height: 100%; 
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background-image: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596317168057&di=545c4f0d1fe621bc299e9f773a1435ed&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn23%2F600%2Fw1920h1080%2F20180524%2Febc0-haysviy2793720.jpg);
        background-repeat: no-repeat;
        background-size:100% 100%;
    }

.city-info{
        background-color: rgba(193, 213, 221, 0.479);
        position:absolute;
        left:2%;
        top: 0%;
        border:2px solid;
        border-radius:25px;

}
.echarts {
    position :absolute;
    top:20%;
    left:25%;
    background-color: rgba(240, 255, 240, 0.534);
    border:2px solid;
    border-radius:25px;
}    
       
/* #display {
  position: absolute;
  right: 40%;
  top: 10%;
  color: rgb(14, 0, 0);
} */
.change-address {
  background-color: #f1f1f1;
  text-align: center;
  position: absolute;
  padding: 10px;
  top:90%;
 
}
.city {
  font-size: 40px;
  position: absolute;
  top: 50%;
  color: rgb(14, 0, 0);
}
.myself{
  background-color: #f1f1f1;
  text-align: center;
  position: absolute;
  padding: 10px;
  top:90%;
  right:0%;
}

</style>
