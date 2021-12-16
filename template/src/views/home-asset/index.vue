<!--
 * @Author: cuizh
 * @Date: 2021-05-18
 * @LastEditTime: 2021-09-30 15:33:28
 * @LastEditors: yincheng
 * @Description: 敏感数据分布
 * @FilePath: /ueba-web/src/views/home-asset/index.vue
-->
<template>
  <layout>
    <div class="home-asset-container">
      <div class="home-header">
        <div class="home-title">敏感数据分布</div>
        <i
          v-idss-tooltip="{ content: '导出报告', placement: 'left' }"
          class="iconfont iconexport2"
          style="color: #666; font-size: 18px; cursor: pointer"
          @click="toPdf"
        ></i>
      </div>
      <div id="chart-container" class="home-asset-chart-container">
        <el-row :gutter="10">
          <el-col :span="4">
            <!--数据资源总数-->
            <ThirdDataCard
              :info="assetCountAllVo"
              @one-trigger="assetCountAllVoOneTrigger"
              @two-trigger="assetCountAllVoTwoTrigger"
            />
          </el-col>
          <el-col :span="4">
            <!--涉敏资产数（数据库）-->
            <ThirdDataCard
              :info="senDBVo"
              @total-trigger="senDBVoTotalTrigger"
              @one-trigger="senDBVoOneTrigger"
              @two-trigger="senDBVoTwoTrigger"
              @three-trigger="senDBVoThreeTrigger"
              @four-trigger="senDBVoFourTrigger"
            />
          </el-col>
          <el-col :span="4">
            <!--涉敏资产数（文件）-->
            <ThirdDataCard
              :info="senFileVo"
              @total-trigger="senFileVoTotalTrigger"
              @one-trigger="senFileVoOneTrigger"
              @two-trigger="senFileVoTwoTrigger"
              @three-trigger="senFileVoThreeTrigger"
              @four-trigger="senFileVoFourTrigger"
            />
          </el-col>
          <el-col :span="4">
            <!--近七天新增资产数-->
            <ThirdDataCard
              :info="assetAddLast7DayVo"
              @one-trigger="assetAddLast7DayVoOneTrigger"
              @two-trigger="assetAddLast7DayVoTwoTrigger"
              @three-trigger="assetAddLast7DayVoThreeTrigger"
              @four-trigger="assetAddLast7DayVoFourTrigger"
            />
          </el-col>
          <el-col :span="8">
            <!--敏感数据资产占比-->
            <SenAssetPercentCard
              uu-key="senDBFileProportionVo"
              :skeleton-count="4"
              :formatter="senDBFileProportionVo.formatter"
              :serie-data="senDBFileProportionVo.serieData"
              title="敏感数据资产占比"
              @click-change="senDBFileProportionVoClick"
            />
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="8">
            <!--各级敏感资产占比-->
            <LevelSenAssetCard
              :series="senDataLevelVo.series"
              :x-axis="senDataLevelVo.xAxis"
              :legend="senDataLevelVo.legend"
              :chart-height="240"
              @click-change="senDataLevelVoClick"
            />
          </el-col>
          <el-col :span="8">
            <!--敏感数据分类占比TOP10-->
            <SenAssetPercentCard
              uu-key="senDataTop10Vo"
              left="25%"
              :serie-data="senDataTop10Vo.serieData"
              :chart-height="240"
              title="敏感数据分类占比TOP10"
            />
          </el-col>
          <el-col :span="8">
            <!--敏感资产存储类型统计TOP10-->
            <SenAssetStorageTypeCard
              :serie-data="senDataAssetTypeTop10Vo.serieData"
              :y-axis-data="senDataAssetTypeTop10Vo.yAxisData"
              :chart-height="240"
              @click-change="senDataAssetTypeTop10VoClick"
            />
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="12">
            <!--部门各级敏感资产分布TOP10-->
            <SenDataAssetCard
              uu-key="deptSenLevelTop10Vo"
              :chart-height="280"
              :y-axis-data="deptSenLevelTop10Vo.yAxisData"
              :legend="deptSenLevelTop10Vo.legend"
              :series="deptSenLevelTop10Vo.series"
              title="部门各级敏感资产分布TOP10"
            />
          </el-col>
          <el-col :span="12">
            <!--部门各类敏感资产分布TOP10-->
            <StackedHorizontalBar
              uu-key="deptSenTypeTop10Vo"
              :chart-height="280"
              :x-axis-data="deptSenTypeTop10Vo.xAxisData"
              :series="deptSenTypeTop10Vo.series"
              :legend="deptSenTypeTop10Vo.legend"
              title="部门各类敏感资产分布TOP10"
            />
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="12">
            <!--应用系统各级敏感数据资产分布TOP10-->
            <SenDataAssetCard
              uu-key="busSysSenLevelTop10Vo"
              :chart-height="280"
              :y-axis-data="busSysSenLevelTop10Vo.yAxisData"
              :legend="busSysSenLevelTop10Vo.legend"
              :series="busSysSenLevelTop10Vo.series"
              title="应用系统各级敏感数据资产分布TOP10"
            />
          </el-col>
          <el-col :span="12">
            <!--应用系统各类敏感资产分布TOP10-->
            <StackedHorizontalBar
              uu-key="busSysSenTypeTop10Vo"
              :x-axis-data="busSysSenTypeTop10Vo.xAxisData"
              :legend="busSysSenTypeTop10Vo.legend"
              :series="busSysSenTypeTop10Vo.series"
              :chart-height="280"
              title="应用系统各类敏感资产分布TOP10"
            />
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="8">
            <!--敏感数据特征统计TOP10-->
            <PieAreaCard
              uu-key="senAimStrategyTop10Vo"
              :chart-height="260"
              :legend-info="senAimStrategyTop10Vo.legendInfo"
              :serie-data="senAimStrategyTop10Vo.serieData"
            />
          </el-col>
          <el-col :span="16">
            <!--敏感分类分级分布-->
            <ScatterCard
              uu-key="senDataLevelTypeVo"
              :chart-height="260"
              :max-value="senDataLevelTypeVo.max"
              :x-axis-data="senDataLevelTypeVo.xAxisData"
              :y-axis-data="senDataLevelTypeVo.yAxisData"
              :series="senDataLevelTypeVo.series"
              title="敏感分类分级分布"
              @sen-type-change="getSenTypeProportion"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-if="visible">
      <el-dialog
        class="sen-type-proportion"
        title=""
        :visible.sync="visible"
        width="550px"
      >
        <div v-loading="loading" style="min-height: 300px">
          <!--敏感数据分类标签占比-->
          <SenAssetPercentCard
            ref="senType"
            left="30%"
            canvas-width="502px"
            :color="[
              '#2e96ce',
              '#0bc0d3',
              '#c48ee2',
              '#79b3fd',
              '#b6d553',
              '#f278a9',
              '#cfa472',
            ]"
            uu-key="senTypeStrategyProportionVo"
            :loading="loading"
            :serie-data="senTypeStrategyProportionVo.serieData"
            :chart-height="240"
            :title="`${senType}敏感数据分类标签占比`"
          />
        </div>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
/* eslint-disable no-empty */
import Dayjs from "dayjs";
import { getDayArea } from "@/utils/common";
import layout from "@/components/layout/layout.vue";
import JsPDF from "@/fusion-components/util/toPdf/index.js";
import ThirdDataCard from "./components/ThirdDataCard.vue";
import SenAssetPercentCard from "./components/SenAssetPercentCard.vue";
import LevelSenAssetCard from "./components/LevelSenAssetCard.vue";
import SenAssetStorageTypeCard from "./components/SenAssetStorageTypeCard.vue";
import SenDataAssetCard from "./components/SenDataAssetCard.vue";
import StackedHorizontalBar from "./components/StackedHorizontalBar.vue";
import PieAreaCard from "./components/PieAreaCard.vue";
import ScatterCard from "./components/ScatterCard.vue";

export default {
  name: "HomeAsset",
  components: {
    ThirdDataCard,
    layout,
    SenAssetPercentCard,
    LevelSenAssetCard,
    SenAssetStorageTypeCard,
    SenDataAssetCard,
    StackedHorizontalBar,
    PieAreaCard,
    ScatterCard,
  },
  data() {
    return {
      assetCountAllVo: {
        total: 0,
        title: "数据资源总数",
        subTitle: "",
        oneCount: 0,
        oneTitle: "已认领数量",
        twoCount: 0,
        twoTitle: "未认领数量",
      },
      senDBVo: {
        total: 0,
        title: "涉敏资源数",
        subTitle: "（数据库）",
        oneCount: 0,
        oneTitle: "关系型数据库",
        twoCount: 0,
        twoTitle: "大数据",
        threeTitle: "涉敏表",
        threeCount: 0,
        fourTitle: "涉敏表",
        fourCount: 0,
      },
      senFileVo: {
        total: 0,
        title: "涉敏资源数",
        subTitle: "（文件服务器）",
        oneCount: 0,
        oneTitle: "FTP",
        twoCount: 0,
        twoTitle: "SFTP",
        threeTitle: "涉敏文件",
        threeCount: 0,
        fourTitle: "涉敏文件",
        fourCount: 0,
      },
      assetAddLast7DayVo: {
        total: 0,
        title: "近七天新增涉敏资产数",
        subTitle: "",
        oneCount: 0,
        oneTitle: "关系型数据库",
        twoCount: 0,
        twoTitle: "大数据",
        threeCount: 0,
        threeTitle: "FTP",
        fourCount: 0,
        fourTitle: "SFTP",
      },
      // 敏感数据资产占比
      senDBFileProportionVo: {
        formatter: (params) => {
          const { color, data } = params;
          const { title, value, proportion } = data;

          return `<span style="display:inline-block;
            margin-right:5px;
            border-radius:10px;
            width:10px;height:10px;
            background-color: ${color};
          "></span>
         ${title}
         <br/>${value}(${proportion})`;
        },
        serieData: [],
      },
      // 各级敏感资产占比
      senDataLevelVo: {
        series: [],
        xAxis: ["字段", "文件"],
        legend: [],
      },
      // 敏感数据分类占比TOP10
      senDataTop10Vo: {
        serieData: [],
      },
      // 敏感资产存储类型统计TOP10
      senDataAssetTypeTop10Vo: {
        serieData: [],
        yAxisData: [],
      },
      // 部门各级敏感资产分布TOP10
      deptSenLevelTop10Vo: {
        yAxisData: [],
        legend: [],
        series: [],
      },
      // 部门各类敏感资产分布TOP10
      deptSenTypeTop10Vo: {
        xAxisData: [],
        series: [],
        legend: [],
      },
      // 应用系统各级敏感数据资产分布TOP10
      busSysSenLevelTop10Vo: {
        yAxisData: [],
        legend: [],
        series: [],
      },
      // 应用系统各类敏感资产分布TOP10
      busSysSenTypeTop10Vo: {
        xAxisData: [],
        series: [],
        legend: [],
      },
      // 敏感数据特征统计TOP10
      senAimStrategyTop10Vo: {
        legendInfo: {},
        serieData: [],
      },
      // 敏感分类分级分布
      senDataLevelTypeVo: {
        max: 0,
        xAxisData: [],
        yAxisData: [],
        series: [],
      },
      // 敏感数据分类标签占比
      senTypeStrategyProportionVo: {
        serieData: [],
      },

      visible: false,
      senType: "",
      loading: false,

      dataBaseList: [],
      bigDataList: [],
    };
  },
  created() {
    window.toOtherPageInChart = this.toOtherPageInChart;

    this.getFilterAssetType("DataBase", (result) => {
      this.dataBaseList = result;
    });
    this.getFilterAssetType("BigData", (result) => {
      this.bigDataList = result;
    });
    // this.initData();

    this.getAssetCountAll();
    this.getSenDB();
    this.getSenFile();
    this.getAssetAddLast7Day();
    this.getSenDBFileProportion();
    this.getSenDataLevel();
    this.getSenDataTop10();
    this.getSenDataAssetTypeTop10();
    this.getDeptSenLevelTop10();
    this.getDeptSenTypeTop10();
    this.getBusSysSenLevelTop10();
    this.getBusSysSenTypeTop10();
    this.getSenAimStrategyTop10();
    this.getSenDataLevelType();
  },
  beforeDestroy() {
    window.toOtherPageInChart = null;
  },
  methods: {
    async initData() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap",
          method: "GET",
        });

        const {
          assetCountAllVo,
          senDBVo,
          senFileVo,
          assetAddLast7DayVo,
          senDBFileProportionVoList,
          senDataLevelVoList,
          senDataTop10VoList,
          senDataAssetTypeTop10VoList,
          deptSenLevelTop10VoList,
          deptSenTypeTop10VoList,
          busSysSenLevelTop10VoList,
          busSysSenTypeTop10VoList,
          senAimStrategyTop10VoList,
          senDataLevelTypeVoList,
        } = result;

        if (assetCountAllVo) {
          const {
            // 数据资源总数
            assetCountAll,
            // 已认领数量
            assetCountClaim,
            // 未认领数量
            assetCountNotClaim,
          } = assetCountAllVo;
          this.assetCountAllVo.total = assetCountAll;
          this.assetCountAllVo.oneCount = assetCountClaim;
          this.assetCountAllVo.twoCount = assetCountNotClaim;
        }

        if (senDBVo) {
          const {
            // 涉敏总数
            senCountAll,
            // 数据库
            senCountDataBase,
            // 大数据
            senCountBigData,
          } = senDBVo;

          this.senDBVo.total = senCountAll;
          this.senDBVo.oneCount = senCountDataBase;
          this.senDBVo.twoCount = senCountBigData;
        }

        if (senFileVo) {
          const {
            // 涉敏总数
            senCountAll,
            // FTP
            senCountFTP,
            // SFTP
            senCountSFTP,
          } = senFileVo;

          this.senFileVo.total = senCountAll;
          this.senFileVo.oneCount = senCountFTP;
          this.senFileVo.twoCount = senCountSFTP;
        }

        if (assetAddLast7DayVo) {
          const {
            allCount,
            dbCount,
            bigDataCount,
            ftpCount,
            sftpCount,
          } = assetAddLast7DayVo;

          this.assetAddLast7DayVo.total = allCount;
          this.assetAddLast7DayVo.oneCount = dbCount;
          this.assetAddLast7DayVo.twoCount = bigDataCount;
          this.assetAddLast7DayVo.threeCount = ftpCount;
          this.assetAddLast7DayVo.fourCount = sftpCount;
        }

        if (Array.isArray(senDBFileProportionVoList)) {
          // { assetType(资产类型), proportion(占比), cnt(个数) }
          this.senDBFileProportionVo.serieData = senDBFileProportionVoList.map(
            ({ assetType, cnt, proportion }) => {
              return {
                title: assetType,
                proportion,
                name: `${cnt} (${proportion}) ${assetType} `,
                value: cnt,
              };
            }
          );
        }

        if (senDataLevelVoList) {
          const { dbList, dirList } = senDataLevelVoList;

          const series = [];
          const legend = [];
          if (Array.isArray(dbList)) {
            const len = dbList.length;
            for (let i = 0; i < len; ++i) {
              const {
                level: dbLevel,
                cnt: dbCnt,
                proportion: dbProportion,
              } = dbList[i];

              let dirCnt = 0;
              let dirProportion = "0.00%";
              if (dirList[i]) {
                const { cnt, proportion } = dirList[i];
                dirCnt = cnt;
                dirProportion = proportion;
              }

              legend.push(dbLevel);
              const data = [
                {
                  value: parseFloat(dbProportion),
                  count: dbCnt,
                  proportion: dbProportion,
                },
                {
                  value: parseFloat(dirProportion),
                  count: dirCnt,
                  proportion: dirProportion,
                },
              ];

              series.push({
                name: dbLevel,
                data,
              });
            }
          }
          this.senDataLevelVo.series = series;
          this.senDataLevelVo.legend = legend;
        }

        if (Array.isArray(senDataTop10VoList)) {
          // { senType(涉敏分类), proportion(占比), fileCount(文件数), fieldCount(字段数) }
          this.senDataTop10Vo.serieData = senDataTop10VoList.map(
            ({ senType, proportion, fileCount, fieldCount }) => ({
              title: senType,
              proportion,
              name: senType,
              value: fileCount + fieldCount,
              fileCount,
              fieldCount,
            })
          );
        }

        if (Array.isArray(senDataAssetTypeTop10VoList)) {
          // { assetType(资产类型), smt(总数), type(类型) }
          const serieData = [];
          const yAxisData = [];
          senDataAssetTypeTop10VoList.sort((pre, next) => pre.smt - next.smt);
          senDataAssetTypeTop10VoList.forEach(({ assetType, smt, type }) => {
            serieData.push({
              value: smt,
              valueType: type,
            });
            yAxisData.push(assetType);
          });

          this.senDataAssetTypeTop10Vo.serieData = serieData;
          this.senDataAssetTypeTop10Vo.yAxisData = yAxisData;
        }

        // 部门各级敏感资产分布TOP10
        if (Array.isArray(deptSenLevelTop10VoList)) {
          const yAxisData = [];
          const legend = [];
          const series = [];
          // deptId(部门Id), deptName(部门), senLevel(级别), fileCount(文件数量), fieldCount(字段数量)
          const info = {};
          deptSenLevelTop10VoList.forEach(
            ({ deptName, senLevel, fileCount, fieldCount, deptId }) => {
              yAxisData.push(deptName);
              legend.push(senLevel);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: deptId,
              };

              if (info[senLevel]) {
                info[senLevel].push(item);
              } else {
                info[senLevel] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.deptSenLevelTop10Vo.yAxisData = [...new Set(yAxisData)];
          this.deptSenLevelTop10Vo.legend = [...new Set(legend)];
          this.deptSenLevelTop10Vo.series = series;
        }

        // 部门各类敏感资产分布TOP10
        if (Array.isArray(deptSenTypeTop10VoList)) {
          const xAxisData = [];
          const legend = [];
          const series = [];
          // { deptName(部门名称), senType(涉敏分类), fileCount(文件数), fieldCount(字段数), deptId(部门ID) }
          const info = {};
          deptSenTypeTop10VoList.forEach(
            ({ deptId, deptName, senTypeFirst, fileCount, fieldCount }) => {
              xAxisData.push(deptName);
              legend.push(senTypeFirst);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: deptId,
              };

              if (info[senTypeFirst]) {
                info[senTypeFirst].push(item);
              } else {
                info[senTypeFirst] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.deptSenTypeTop10Vo.xAxisData = [...new Set(xAxisData)];
          this.deptSenTypeTop10Vo.legend = [...new Set(legend)];
          this.deptSenTypeTop10Vo.series = series;
        }

        // 应用系统各级敏感数据资产分布TOP10
        if (Array.isArray(busSysSenLevelTop10VoList)) {
          const yAxisData = [];
          const legend = [];
          const series = [];
          // { businessSysId(业务系统ID), businessSysName(业务系统名称), senLevel(级别), fileCount(文件数量), fieldCount(字段数量) }
          const info = {};
          busSysSenLevelTop10VoList.forEach(
            ({
              businessSysName,
              senLevel,
              fileCount,
              fieldCount,
              businessSysId,
            }) => {
              yAxisData.push(businessSysName);
              legend.push(senLevel);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: businessSysId,
              };

              if (info[senLevel]) {
                info[senLevel].push(item);
              } else {
                info[senLevel] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.busSysSenLevelTop10Vo.yAxisData = [...new Set(yAxisData)];
          this.busSysSenLevelTop10Vo.legend = [...new Set(legend)];
          this.busSysSenLevelTop10Vo.series = series;
        }

        // 应用系统各类敏感资产分布TOP10
        if (Array.isArray(busSysSenTypeTop10VoList)) {
          const xAxisData = [];
          const legend = [];
          const series = [];
          // { businessSysName(业务系统名称), senTypeFirst(涉敏一级分类), fileCount(文件数), fieldCount(字段数), businessSysId(业务系统ID) }
          const info = {};
          busSysSenTypeTop10VoList.forEach(
            ({
              businessSysId,
              businessSysName,
              senTypeFirst,
              fileCount,
              fieldCount,
            }) => {
              xAxisData.push(businessSysName);
              legend.push(senTypeFirst);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: businessSysId,
              };

              if (info[senTypeFirst]) {
                info[senTypeFirst].push(item);
              } else {
                info[senTypeFirst] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.busSysSenTypeTop10Vo.xAxisData = [...new Set(xAxisData)];
          this.busSysSenTypeTop10Vo.legend = [...new Set(legend)];
          this.busSysSenTypeTop10Vo.series = series;
        }

        // 敏感数据特征统计TOP10
        if (Array.isArray(senAimStrategyTop10VoList)) {
          const serieData = [];
          const legendInfo = {};
          senAimStrategyTop10VoList.forEach(
            ({ strategys, fieldCount, fileCount, proportion }) => {
              legendInfo[strategys] = fieldCount + fileCount;

              serieData.push({
                name: strategys,
                value: fieldCount + fileCount,
                fieldCount,
                fileCount,
                proportion,
              });
            }
          );

          this.senAimStrategyTop10Vo.legendInfo = legendInfo;
          this.senAimStrategyTop10Vo.serieData = serieData;
        }

        // 敏感分类分级分布
        if (Array.isArray(senDataLevelTypeVoList)) {
          const xAxisData = [];
          const yAxisData = [];
          const series = [];
          const info = {};
          let max = 0;
          senDataLevelTypeVoList.forEach(
            ({ senType, senLevel, fieldCount, fileCount, senTypeAlias }) => {
              xAxisData.push(senTypeAlias);
              yAxisData.push(senLevel);
              const v = fieldCount + fileCount;
              if (v > max) {
                max = v;
              }

              const item = [
                senTypeAlias,
                senLevel,
                v,
                fieldCount,
                fileCount,
                senType,
              ];

              if (info[senTypeAlias]) {
                info[senTypeAlias].push(item);
              } else {
                info[senTypeAlias] = [item];
              }
            }
          );

          for (let key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.senDataLevelTypeVo.max = max;
          this.senDataLevelTypeVo.xAxisData = [...new Set(xAxisData)];
          // y轴排序
          this.senDataLevelTypeVo.yAxisData = [...new Set(yAxisData)].sort();
          this.senDataLevelTypeVo.series = series;
        }
      } catch (e) {
        // console.log(e);
      }
    },

    /**
     * 数据资源总数
     */
    async getAssetCountAll() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/assetCountAll",
          method: "GET",
        });

        if (result) {
          const {
            // 数据资源总数
            assetCountAll,
            // 已认领数量
            assetCountClaim,
            // 未认领数量
            assetCountNotClaim,
          } = result;
          this.assetCountAllVo.total = assetCountAll;
          this.assetCountAllVo.oneCount = assetCountClaim;
          this.assetCountAllVo.twoCount = assetCountNotClaim;
        }
      } catch (e) {}
    },
    /**
     * 涉敏资产数（数据库）
     */
    async getSenDB() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDB",
          method: "GET",
        });

        if (result) {
          const {
            // 涉敏总数
            senCountAll,
            // 数据库
            senCountDataBase,
            senTableCountDataBase,
            // 大数据
            senCountBigData,
            senTableCountBigData,
          } = result;

          this.senDBVo.total = senCountAll;
          this.senDBVo.oneCount = senCountDataBase;
          this.senDBVo.twoCount = senCountBigData;
          this.senDBVo.threeCount = senTableCountDataBase || 0;
          this.senDBVo.fourCount = senTableCountBigData || 0;
        }
      } catch (e) {}
    },
    /**
     * 涉敏资产数（数据库）
     */
    async getSenFile() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senFile",
          method: "GET",
        });

        if (result) {
          const {
            // 涉敏总数
            senCountAll,
            // FTP
            senCountFTP,
            senCountFileFTP,
            // SFTP
            senCountSFTP,
            senCountFileSFTP,
          } = result;

          this.senFileVo.total = senCountAll;
          this.senFileVo.oneCount = senCountFTP;
          this.senFileVo.twoCount = senCountSFTP;
          this.senFileVo.threeCount = senCountFileFTP || 0;
          this.senFileVo.fourCount = senCountFileSFTP || 0;
        }
      } catch (e) {}
    },
    /**
     * 近七天新增资产数
     */
    async getAssetAddLast7Day() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/assetAddLast7Day",
          method: "GET",
        });

        if (result) {
          const {
            allCount,
            dbCount,
            bigDataCount,
            ftpCount,
            sftpCount,
          } = result;

          this.assetAddLast7DayVo.total = allCount;
          this.assetAddLast7DayVo.oneCount = dbCount;
          this.assetAddLast7DayVo.twoCount = bigDataCount;
          this.assetAddLast7DayVo.threeCount = ftpCount;
          this.assetAddLast7DayVo.fourCount = sftpCount;
        }
      } catch (e) {}
    },
    /**
     * 敏感数据资产占比
     */
    async getSenDBFileProportion() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDBFileProportion",
          method: "GET",
        });

        if (result) {
          // { assetType(资产类型), proportion(占比), cnt(个数) }
          this.senDBFileProportionVo.serieData = result.map(
            ({ assetType, cnt, proportion }) => {
              return {
                title: assetType,
                proportion,
                name: `${cnt} (${proportion}) ${assetType} `,
                value: cnt,
              };
            }
          );
        }
      } catch (e) {}
    },
    /**
     * 各级敏感资产占比
     */
    async getSenDataLevel() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDataLevel",
          method: "GET",
        });

        if (result) {
          const { dbList, dirList } = result;

          const series = [];
          const legend = [];
          if (Array.isArray(dbList)) {
            const len = dbList.length;
            for (let i = 0; i < len; ++i) {
              const {
                level: dbLevel,
                cnt: dbCnt,
                proportion: dbProportion,
              } = dbList[i];

              let dirCnt = 0;
              let dirProportion = "0.00%";
              if (dirList[i]) {
                const { cnt, proportion } = dirList[i];
                dirCnt = cnt;
                dirProportion = proportion;
              }

              legend.push(dbLevel);
              const data = [
                {
                  value: parseFloat(dbProportion),
                  count: dbCnt,
                  proportion: dbProportion,
                },
                {
                  value: parseFloat(dirProportion),
                  count: dirCnt,
                  proportion: dirProportion,
                },
              ];

              series.push({
                name: dbLevel,
                data,
              });
            }
          }
          this.senDataLevelVo.series = series;
          this.senDataLevelVo.legend = legend;
        }
      } catch (e) {}
    },
    /**
     * 敏感数据分类占比TOP10
     */
    async getSenDataTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDataTop10",
          method: "GET",
        });

        if (result) {
          // { senType(涉敏分类), proportion(占比), fileCount(文件数), fieldCount(字段数) }
          this.senDataTop10Vo.serieData = result.map(
            ({ senType, proportion, fileCount, fieldCount }) => ({
              title: senType,
              proportion,
              name: senType,
              value: fileCount + fieldCount,
              fileCount,
              fieldCount,
            })
          );
        }
      } catch (e) {}
    },
    /**
     * 敏感资产存储类型统计TOP10
     */
    async getSenDataAssetTypeTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDataAssetTypeTop10",
          method: "GET",
        });

        if (result) {
          // { assetType(资产类型), smt(总数), type(类型) }
          const serieData = [];
          const yAxisData = [];
          result.sort((pre, next) => pre.smt - next.smt);
          result.forEach(({ assetType, smt, type }) => {
            serieData.push({
              value: smt,
              valueType: type,
            });
            yAxisData.push(assetType);
          });

          this.senDataAssetTypeTop10Vo.serieData = serieData;
          this.senDataAssetTypeTop10Vo.yAxisData = yAxisData;
        }
      } catch (e) {}
    },
    /**
     * 部门各级敏感资产分布TOP10
     */
    async getDeptSenLevelTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/deptSenLevelTop10",
          method: "GET",
        });

        if (result) {
          const yAxisData = [];
          const legend = [];
          const series = [];
          // deptId(部门Id), deptName(部门), senLevel(级别), fileCount(文件数量), fieldCount(字段数量)
          const info = {};
          result.forEach(
            ({ deptName, senLevel, fileCount, fieldCount, deptId }) => {
              yAxisData.push(deptName);
              legend.push(senLevel);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: deptId,
              };

              if (info[senLevel]) {
                info[senLevel].push(item);
              } else {
                info[senLevel] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.deptSenLevelTop10Vo.yAxisData = [...new Set(yAxisData)];
          this.deptSenLevelTop10Vo.legend = [...new Set(legend)];
          this.deptSenLevelTop10Vo.series = series;
        }
      } catch (e) {}
    },
    /**
     * 部门各类敏感资产分布TOP10
     */
    async getDeptSenTypeTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/deptSenTypeTop10",
          method: "GET",
        });

        if (result) {
          const xAxisData = [];
          const legend = [];
          const series = [];
          // { deptName(部门名称), senType(涉敏分类), fileCount(文件数), fieldCount(字段数), deptId(部门ID) }
          const info = {};
          result.forEach(
            ({ deptId, deptName, senTypeFirst, fileCount, fieldCount }) => {
              xAxisData.push(deptName);
              legend.push(senTypeFirst);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: deptId,
              };

              if (info[senTypeFirst]) {
                info[senTypeFirst].push(item);
              } else {
                info[senTypeFirst] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.deptSenTypeTop10Vo.xAxisData = [...new Set(xAxisData)];
          this.deptSenTypeTop10Vo.legend = [...new Set(legend)];
          this.deptSenTypeTop10Vo.series = series;
        }
      } catch (e) {}
    },
    /**
     * 应用系统各级敏感数据资产分布TOP10
     */
    async getBusSysSenLevelTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/busSysSenLevelTop10",
          method: "GET",
        });

        if (result) {
          const yAxisData = [];
          const legend = [];
          const series = [];
          // { businessSysId(业务系统ID), businessSysName(业务系统名称), senLevel(级别), fileCount(文件数量), fieldCount(字段数量) }
          const info = {};
          result.forEach(
            ({
              businessSysName,
              senLevel,
              fileCount,
              fieldCount,
              businessSysId,
            }) => {
              yAxisData.push(businessSysName);
              legend.push(senLevel);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: businessSysId,
              };

              if (info[senLevel]) {
                info[senLevel].push(item);
              } else {
                info[senLevel] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.busSysSenLevelTop10Vo.yAxisData = [...new Set(yAxisData)];
          this.busSysSenLevelTop10Vo.legend = [...new Set(legend)];
          this.busSysSenLevelTop10Vo.series = series;
        }
      } catch (e) {}
    },
    /**
     * 应用系统各类敏感资产分布TOP10
     */
    async getBusSysSenTypeTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/busSysSenTypeTop10",
          method: "GET",
        });

        if (result) {
          const xAxisData = [];
          const legend = [];
          const series = [];
          // { businessSysName(业务系统名称), senTypeFirst(涉敏一级分类), fileCount(文件数), fieldCount(字段数), businessSysId(业务系统ID) }
          const info = {};
          result.forEach(
            ({
              businessSysId,
              businessSysName,
              senTypeFirst,
              fileCount,
              fieldCount,
            }) => {
              xAxisData.push(businessSysName);
              legend.push(senTypeFirst);

              const item = {
                value: fileCount + fieldCount,
                fileCount,
                fieldCount,
                id: businessSysId,
              };

              if (info[senTypeFirst]) {
                info[senTypeFirst].push(item);
              } else {
                info[senTypeFirst] = [item];
              }
            }
          );

          for (const key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.busSysSenTypeTop10Vo.xAxisData = [...new Set(xAxisData)];
          this.busSysSenTypeTop10Vo.legend = [...new Set(legend)];
          this.busSysSenTypeTop10Vo.series = series;
        }
      } catch (e) {}
    },
    /**
     * 敏感数据特征统计TOP10
     */
    async getSenAimStrategyTop10() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senAimStrategyTop10",
          method: "GET",
        });

        if (result) {
          const serieData = [];
          const legendInfo = {};
          result.forEach(({ strategys, fieldCount, fileCount, proportion }) => {
            legendInfo[strategys] = fieldCount + fileCount;

            serieData.push({
              name: strategys,
              value: fieldCount + fileCount,
              fieldCount,
              fileCount,
              proportion,
            });
          });

          this.senAimStrategyTop10Vo.legendInfo = legendInfo;
          this.senAimStrategyTop10Vo.serieData = serieData;
        }
      } catch (e) {}
    },
    /**
     * 敏感分类分级分布
     */
    async getSenDataLevelType() {
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senDataLevelType",
          method: "GET",
        });

        if (result) {
          const xAxisData = [];
          const yAxisData = [];
          const series = [];
          const info = {};
          let max = 0;
          result.forEach(
            ({ senType, senLevel, fieldCount, fileCount, senTypeAlias }) => {
              xAxisData.push(senTypeAlias);
              yAxisData.push(senLevel);
              const v = fieldCount + fileCount;
              if (v > max) {
                max = v;
              }

              const item = [
                senTypeAlias,
                senLevel,
                v,
                fieldCount,
                fileCount,
                senType,
              ];

              if (info[senTypeAlias]) {
                info[senTypeAlias].push(item);
              } else {
                info[senTypeAlias] = [item];
              }
            }
          );

          for (let key in info) {
            series.push({
              name: key,
              data: info[key],
            });
          }

          this.senDataLevelTypeVo.max = max;
          this.senDataLevelTypeVo.xAxisData = [...new Set(xAxisData)];
          // y轴排序
          this.senDataLevelTypeVo.yAxisData = [...new Set(yAxisData)].sort();
          this.senDataLevelTypeVo.series = series;
        }
      } catch (e) {}
    },

    async getSenTypeProportion(senType, senLevel) {
      this.senType = senType;
      this.senLevel = senLevel;
      this.visible = true;
      this.loading = true;
      try {
        const result = await this.$request({
          url: "/gov/api/index/dataMap/senTypeProportion",
          method: "POST",
          data: {
            senType,
            senLevel,
          },
        });

        if (Array.isArray(result)) {
          // { strategys(特征), proportion(占比), fileCount(文件数), fieldCount(字段数) }
          this.senTypeStrategyProportionVo.serieData = result.map(
            ({ strategys, proportion, fileCount, fieldCount }) => ({
              title: strategys,
              proportion,
              name: `${fileCount + fieldCount} (${proportion}) ${strategys} `,
              value: fileCount + fieldCount,
              fileCount,
              fieldCount,
            })
          );
        }
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async getFilterAssetType(assetType, cb) {
      const result = await this.$request({
        url: `/gov/api/index/dataMap/filterAssetType/${assetType}`,
        method: "GET",
      });

      if (result) {
        cb(result);
      }
    },
    assetCountAllVoOneTrigger() {
      // 数据资源清单管理
      this.$router.push({
        name: "data-resource",
      });
    },
    assetCountAllVoTwoTrigger() {
      // 资源认领
      this.$router.push({
        name: "claim-resource",
      });
    },

    senDBVoTotalTrigger() {
      // 涉敏库-筛选数据库类型
      this.$router.push({
        name: "increased-db",
      });
    },
    senDBVoOneTrigger() {
      // 涉敏库-筛选关系型数据库类型
      this.$router.push({
        name: "increased-db",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.dataBaseList,
          }),
        },
      });
    },
    senDBVoTwoTrigger() {
      // 涉敏库-筛选大数据类型
      this.$router.push({
        name: "increased-db",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.bigDataList,
          }),
        },
      });
    },
    senDBVoThreeTrigger() {
      // 涉敏库-筛选大数据类型
      this.$router.push({
        name: "increased-table",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.dataBaseList,
          }),
        },
      });
    },
    senDBVoFourTrigger() {
      // 涉敏库-筛选大数据类型
      this.$router.push({
        name: "increased-table",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.bigDataList,
          }),
        },
      });
    },

    senFileVoTotalTrigger() {
      this.$router.push({
        name: "increased-dir",
      });
    },
    senFileVoOneTrigger() {
      this.$router.push({
        name: "increased-dir",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["FTP"],
          }),
        },
      });
    },
    senFileVoTwoTrigger() {
      this.$router.push({
        name: "increased-dir",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["SFTP"],
          }),
        },
      });
    },
    senFileVoThreeTrigger() {
      this.$router.push({
        name: "increased-file",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["FTP"],
          }),
        },
      });
    },
    senFileVoFourTrigger() {
      this.$router.push({
        name: "increased-file",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["SFTP"],
          }),
        },
      });
    },

    assetAddLast7DayVoOneTrigger() {
      // 涉敏库-筛选关系型数据库类型 + 近7天
      const dayArea = getDayArea(-6);
      this.$router.push({
        name: "increased-db",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.dataBaseList,
            createTime: dayArea,
          }),
        },
      });
    },
    assetAddLast7DayVoTwoTrigger() {
      // 涉敏库-筛选大数据类型 + 近7天
      const dayArea = getDayArea(-6);
      this.$router.push({
        name: "increased-db",
        query: {
          defaultFilter: JSON.stringify({
            assetType: this.bigDataList,
            createTime: dayArea,
          }),
        },
      });
    },
    assetAddLast7DayVoThreeTrigger() {
      // 涉敏目录-筛选近七天 + FTP
      const dayArea = getDayArea(-6);
      this.$router.push({
        name: "increased-dir",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["FTP"],
            createTime: dayArea,
          }),
        },
      });
    },
    assetAddLast7DayVoFourTrigger() {
      // 涉敏目录-筛选近七天 + SFTP
      const dayArea = getDayArea(-6);
      this.$router.push({
        name: "increased-dir",
        query: {
          defaultFilter: JSON.stringify({
            assetType: ["SFTP"],
            createTime: dayArea,
          }),
        },
      });
    },

    senDBFileProportionVoClick({ data }) {
      const { title } = data;

      if (title === "DataBase") {
        // 涉敏库-筛选关系型数据库类型
        this.$router.push({
          name: "increased-db",
          query: {
            defaultFilter: JSON.stringify({
              assetType: this.dataBaseList,
            }),
          },
        });
      } else if (title === "BigData") {
        // 涉敏库-筛选大数据类型
        this.$router.push({
          name: "increased-db",
          query: {
            defaultFilter: JSON.stringify({
              assetType: this.bigDataList,
            }),
          },
        });
      } else if (title === "FTP") {
        this.$router.push({
          name: "increased-dir",
          query: {
            defaultFilter: JSON.stringify({
              assetType: ["FTP"],
            }),
          },
        });
      } else if (title === "SFTP") {
        this.$router.push({
          name: "increased-dir",
          query: {
            defaultFilter: JSON.stringify({
              assetType: ["SFTP"],
            }),
          },
        });
      }
    },

    senDataLevelVoClick(params) {
      const { name, seriesName } = params;

      if (name === "字段") {
        this.$router.push({
          name: "increased-field",
          query: {
            defaultFilter: JSON.stringify({
              senLevel: [seriesName],
            }),
          },
        });
      } else if (name === "文件") {
        this.$router.push({
          name: "increased-file",
          query: {
            defaultFilter: JSON.stringify({
              senLevel: [seriesName],
            }),
          },
        });
      }
    },

    senDataAssetTypeTop10VoClick(params) {
      const { data, name } = params;

      const { valueType } = data;

      this.$router.push({
        name: `increased-${valueType}`,
        query: {
          defaultFilter: JSON.stringify({
            assetType: [name],
          }),
        },
      });
    },

    toOtherPageInChart(page, type, paramsStr) {
      const params = JSON.parse(decodeURIComponent(paramsStr));
      if (page === "senDataTop10Vo") {
        const { title } = params.data;
        // 敏感数据分类占比TOP10
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senType: title,
            }),
          },
        });
      } else if (page === "deptSenLevelTop10Vo") {
        // 部门各级敏感资产分布TOP10
        const { data, seriesName } = params;
        const { id } = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senLevel: [seriesName],
              dept: [id],
            }),
          },
        });
      } else if (page === "deptSenTypeTop10Vo") {
        // 部门各类敏感资产分布TOP10
        const { data, seriesName } = params;
        const { id } = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senType: seriesName,
              dept: [id],
            }),
          },
        });
      } else if (page === "busSysSenLevelTop10Vo") {
        // 应用系统各级敏感数据资产分布TOP10
        const { data, seriesName } = params;
        const { id } = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senLevel: [seriesName],
              businessSys: [id],
            }),
          },
        });
      } else if (page === "busSysSenTypeTop10Vo") {
        // 应用系统各类敏感资产分布TOP10
        const { data, seriesName } = params;
        const { id } = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senType: seriesName,
              businessSys: [id],
            }),
          },
        });
      } else if (page === "senAimStrategyTop10Vo") {
        // 敏感数据特征统计TOP10
        const { name } = params;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              aimElementName: name,
            }),
          },
        });
      } else if (page === "senDataLevelTypeVo") {
        // 敏感分类分级分布
        const { data } = params;
        const [, senLevel, , , , senType] = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              senType,
              senLevel: [senLevel],
            }),
          },
        });
      } else if (page === "senTypeStrategyProportionVo") {
        // 敏感数据分类标签占比
        const { data } = params;
        const { title } = data;
        this.$router.push({
          name: `increased-${type}`,
          query: {
            defaultFilter: JSON.stringify({
              aimElementName: title,
              senType: this.senType,
              senLevel: [this.senLevel],
            }),
          },
        });
      }
    },
    toPdf() {
      const el = document.getElementById("chart-container");
      let Pdf = new JsPDF(
        el,
        `数据地图-${Dayjs().format("YYYY-MM-DD HH：mm：ss")}`
      );
      Pdf.justSave();
    },
  },
};
</script>

<style lang="postcss">
.home-asset-container {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 20px;
  padding-bottom: 20px;
  height: calc(100vh - 46px);
  position: relative;

  .home-header {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .home-title {
      font-size: 18px;
      font-weight: 700;
      color: #000;
      padding: 15px 0;
    }
  }

  .home-asset-chart-container {
    position: relative;
    z-index: 20;
  }
}

.tooltip-to-page-btn {
  text-decoration: underline;
  color: #81d3f8;
  cursor: pointer;
}

.sen-type-proportion {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>
