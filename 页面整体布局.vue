<template>
  <div class="main">
    <div class="content">
      <div class="main-con">
        <Top></Top>
        <transition name="el-zoom-in-top">
          <router-view></router-view>
        </transition>
      </div>
      <!-- <Bottom title="成都寻道科技有限公司"></Bottom> -->
    </div>
    <Menu_Bar title="精准资助系统" :menuList="menu"></Menu_Bar>
  </div>
</template>

<script>
  import Top from './layout/Top'
  /* import Bottom from './layout/Bottom' */
  import MenuBar from './layout/MenuBar'
  import { _getLS } from '../tools/util'
  export default{
    name: 'Main',
    data () {
      return {
        menu: []
      }
    },
    components: {
      Top,
      /* Bottom, */
      Menu_Bar: MenuBar
    },
    created () {
      this.setMenu()
    },
    methods: {
      setMenu () {
        switch (_getLS('role')) {  /* 1,2,3,4,5 分别代表 学校，学院，辅导员，学生 */
          case '1':
            this.menu = [
              {
                type: '临时困难补助',
                list: [
                  {
                    link: 'schoolSubsidyCheck', name: '困难补助审核', icon: '#icon-shenhe'
                  },
                  {
                    link: 'subsidyHistory', name: '补助历史记录', icon: '#icon-lishi'
                  }
                ]
              },
              {
                type: '经济困难告警',
                list: [
                  {
                    link: 'economicDifficultAlarm', name: '经济困难告警', icon: '#icon-gaojing'
                  }
                ]
              },
              {
                type: '研究生三助',
                list: [
                  {
                    link: 'graduateAssistant', name: '在岗', icon: '#icon-zaigang'
                  },
                  {
                    link: 'dimission', name: '离岗', icon: '#icon-ligang'
                  }
                ]
              },
              {
                type: '助学金发放',
                list: [
                  {
                    link: 'grants', name: '助学金发放', icon: '#icon-fafang'
                  }, {
                    link: 'addGrants', name: '新建发放', icon: '#icon-xinjian'
                  }
                ]
              },
              {
                type: '更多',
                list: [
                  {link: 'subsidizeAnalyze', name: '资助分析', icon: '#icon-fenxi'},
                  {link: 'inbox', name: '消息提醒', icon: '#icon-tixing'},
                  {link: 'releaseAnnouncement', name: '发布公告', icon: '#icon-gonggaofabu'},
                  {link: 'schoolAnnouncement', name: '学校公告', icon: '#icon-gonggao'}
                ]
              }
            ]
            break
          case '2':
            this.menu = [
              {
                type: '临时困难补助',
                list: [
                  {
                    link: 'collegeSubsidyCheck', name: '困难补助审核', icon: '#icon-shenhe'
                  },
                  {
                    link: 'subsidyHistory', name: '补助历史记录', icon: '#icon-lishi'
                  }
                ]
              },
              {
                type: '经济困难告警',
                list: [
                  {
                    link: 'economicDifficultAlarm', name: '经济困难告警', icon: '#icon-gaojing'
                  }
                ]
              },
              {
                type: '研究生三助',
                list: [
                  {
                    link: 'graduateAssistant', name: '在岗', icon: '#icon-zaigang'
                  },
                  {
                    link: 'dimission', name: '离岗', icon: '#icon-ligang'
                  }
                ]
              },
              {
                type: '助学金发放',
                list: [
                  {
                    link: 'grants', name: '助学金发放', icon: '#icon-fafang'
                  }
                ]
              },
              {
                type: '更多',
                list: [
                  {
                    link: 'schoolAnnouncement', name: '学校公告', icon: '#icon-gonggao'
                  },
                  {link: 'inbox', name: '消息提醒', icon: '#icon-tixing'}
                ]
              }
            ]
            break
          case '3':
            this.menu = [
              {
                type: '临时困难补助',
                list: [
                  {
                    link: 'advisorSubsidyCheck', name: '困难补助审核', icon: '#icon-shenhe'
                  },
                  {
                    link: 'subsidyHistory', name: '补助历史记录', icon: '#icon-lishi'
                  },
                  {
                    link: 'advisorSubsidyApply', name: '困难补助申请', icon: '#icon-shenqing'
                  }
                ]
              },
              {
                type: '经济困难告警',
                list: [
                  {
                    link: 'economicDifficultAlarm', name: '经济困难告警', icon: '#icon-gaojing'
                  }
                ]
              },
              {
                type: '研究生三助',
                list: [
                  {
                    link: 'graduateAssistant', name: '在岗', icon: '#icon-zaigang'
                  },
                  {
                    link: 'dimission', name: '离岗', icon: '#icon-ligang'
                  }
                ]
              },
              {
                type: '助学金发放',
                list: [
                  {
                    link: 'grants', name: '助学金发放', icon: '#icon-fafang'
                  }
                ]
              },
              {
                type: '更多',
                list: [
                  {
                    link: 'schoolAnnouncement', name: '学校公告', icon: '#icon-gonggao'
                  },
                  {link: 'inbox', name: '消息提醒', icon: '#icon-tixing'}
                ]
              }
            ]
            break
          case '4':
            break
          case '5':
            this.menu = [
              {
                type: '基本信息维护',
                list: [
                  {link: 'studentInfo', name: '基本信息维护', icon: '#icon-jibenxinxi'}
                ]
              }, {
                type: '临时困难补助',
                list: [
                  {link: 'studentSubsidyApply', name: '困难补助申请', icon: '#icon-shenqing'},
                  {link: 'subsidyApplyHistory', name: '补助申请记录', icon: '#icon-shenqinglishi'}
                ]
              },
              {
                type: '助学金发放',
                list: [
                  {
                    link: 'grantsStudent', name: '助学金发放', icon: '#icon-fafang'
                  }
                ]
              },
              {
                type: '更多',
                list: [
                  {
                    link: 'schoolAnnouncement', name: '学校公告', icon: '#icon-gonggao'
                  },
                  {link: 'inbox', name: '消息提醒', icon: '#icon-tixing'}
                ]
              }
            ]
            break
          default:
            break
        }
      }
    }
  }
</script>
<style lang="less">
  ::-webkit-scrollbar
  {  
    width: 8px;  
    height: 8px;  
    background-color: #F5F5F5;  
  }
  ::-webkit-scrollbar-track  
  {  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    background-color: #F5F5F5;  
  }
  ::-webkit-scrollbar-thumb  
  {  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #555;  
  }
</style>

