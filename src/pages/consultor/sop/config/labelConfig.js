// 引入axios
import {axios} from '../../../../assets/js/http/axios'
/*
 *params(角色ID，标签ID)
 * 根据当前角色和标签ID来判断当前页面的筛选项
 * 时间控件：time、精确查找：input、远程下拉搜索：selectTo、下拉展示：select，分别对应不同的表单控件
 * */
const ConfigSearch = {
  // 获取配置内容
  getConfig: (curRole, labelID) => {
    let backForm = ''
    // 9种角色，分为4类权限，3种展示形式
    // 咨询师展示形式
    function zxsRole () {
      let resl
      if (labelID.toString() === '29' || labelID.toString() === '30' || labelID.toString() === '31' || labelID.toString() === '1' || labelID.toString() === '27' || labelID.toString() === '28') {
        resl = [
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      } else {
        resl = [
          {
            name: '分配时间',
            formEle: 'time',
            id: 'distribute_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '订单ID',
            formEle: 'input',
            id: 'order_id',
            placeholder: '请输入订单ID',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      }
      axios.get('/backend-api/bk-api-tag-manage/get-cancel-type').then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < resl.length; i++) {
            if (resl[i].id === 'cancel_type') {
              resl[i].options = res.data.data
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      return resl
    }
    // 总管理员（城市经理、咨询经理）
    function managerAdm () {
      let resl
      if (labelID.toString() === '29' || labelID.toString() === '30' || labelID.toString() === '31' || labelID.toString() === '1' || labelID.toString() === '27' || labelID.toString() === '28') {
        resl = [
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '咨询师主管',
            formEle: 'selectTo',
            id: 'employee_leader_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      } else {
        resl = [
          {
            name: '分配时间',
            formEle: 'time',
            id: 'distribute_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '订单ID',
            formEle: 'input',
            id: 'order_id',
            placeholder: '请输入订单ID',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '咨询师主管',
            formEle: 'selectTo',
            id: 'employee_leader_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      }
      axios.get('/backend-api/bk-api-tag-manage/get-cancel-type').then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < resl.length; i++) {
            if (resl[i].id === 'cancel_type') {
              resl[i].options = res.data.data
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      return resl
    }
    // 总管理员（产品经理）
    function proAdm () {
      let resl
      if (labelID.toString() === '29' || labelID.toString() === '30' || labelID.toString() === '31' || labelID.toString() === '1' || labelID.toString() === '27' || labelID.toString() === '28') {
        resl = [
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '咨询师主管',
            formEle: 'selectTo',
            id: 'employee_leader_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '城市',
            formEle: 'select',
            id: 'city_id',
            options: [],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      } else {
        resl = [
          {
            name: '分配时间',
            formEle: 'time',
            id: 'distribute_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '标签日期',
            formEle: 'time',
            id: 'create_datetime',
            placeholder: '请输入时间',
            model: ''
          },
          {
            name: '订单ID',
            formEle: 'input',
            id: 'order_id',
            placeholder: '请输入订单ID',
            model: ''
          },
          {
            name: '咨询师',
            formEle: 'selectTo',
            id: 'employee_id',
            placeholder: '',
            model: ''
          },
          {
            name: '咨询师主管',
            formEle: 'selectTo',
            id: 'employee_leader_id',
            placeholder: '',
            model: ''
          },
          {
            name: '标签ID',
            formEle: 'input',
            id: 'tag_id',
            placeholder: '请输入标签ID',
            model: ''
          },
          {
            name: '标签状态',
            formEle: 'select',
            id: 'is_cancel',
            options: [
              {
                id: '0',
                text: '正常'
              },
              {
                id: '1',
                text: '取消'
              }
            ],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '城市',
            formEle: 'select',
            id: 'city_id',
            options: [],
            placeholder: '请选择',
            model: ''
          },
          {
            name: '取消类型',
            formEle: 'select',
            id: 'cancel_type',
            options: [],
            placeholder: '请选择',
            model: ''
          }
        ]
      }
      let params = {
        city_type: '1'
      }
      axios.get('/backend-api/select2/select2/get-city-list-select2', {params: params}).then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < resl.length; i++) {
            if (resl[i].id === 'city_id') {
              resl[i].options = res.data.data
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      axios.get('/backend-api/bk-api-tag-manage/get-cancel-type').then((res) => {
        if (res.data.code === 0) {
          for (let i = 0; i < resl.length; i++) {
            if (resl[i].id === 'cancel_type') {
              resl[i].options = res.data.data
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
      return resl
    }
    // 返回筛选项(第一期)
    function getForm (para) {
      let result = ''
      switch (para) {
        case 'header_manager':
          result = zxsRole()
          break
        case 'admin':
          result = managerAdm()
          break
        case 'city_config':
          result = proAdm()
          break
        case 'admin_sop':
          result = proAdm()
          break
        default:
          result = proAdm()
      }
      return result
    }
    // 以标签ID为维度进行配置，新增一个标签就新增一个分支，方便维护
    switch (labelID.toString()) {
      case '7': backForm = getForm(curRole)// 预约当日未通话
        break
      case '13': backForm = getForm(curRole)// 带看报告未发送
        break
      case '35': backForm = getForm(curRole)// 成交后跟进频率低
        break
      case '6': backForm = getForm(curRole)// 日常跟进频率低
        break
      case '12': backForm = getForm(curRole)// 带看报告发送延迟
        break
      case '25': backForm = getForm(curRole)// 带看后跟进频率低
        break
      case '16': backForm = getForm(curRole)// 带看录入延迟
        break
      case '15': backForm = getForm(curRole)// 联系延迟
        break
      case '36': backForm = getForm(curRole)// 未穿工服
        break
      case '34': backForm = getForm(curRole)// A类质检
        break
      case '26': backForm = getForm(curRole)// 首电质检不合格
        break
      case '5': backForm = getForm(curRole)// 新上户跟进频率低
        break
      case '4': backForm = getForm(curRole)// 不合理关订单
        break
      case '10': backForm = getForm(curRole)// 带看楼盘未签到
        break
      case '24': backForm = getForm(curRole)// 网签未陪同
        break
      case '9': backForm = getForm(curRole)// 带看迟到
        break
      case '18': backForm = getForm(curRole)// 认购录入延迟
        break
      case '17': backForm = getForm(curRole)// 排号录入延迟
        break
      case '20': backForm = getForm(curRole)// 网签录入延迟
        break
      case '19': backForm = getForm(curRole)// 草签录入延迟
        break
      case '29': backForm = getForm(curRole)// 报备次数错误A
        break
      case '30': backForm = getForm(curRole)// 报备次数错误B
        break
      case '31': backForm = getForm(curRole)// 报备次数错误C
        break
      case '1': backForm = getForm(curRole)// 楼盘学习未完成
        break
      case '21': backForm = getForm(curRole)// 认购前风险提示
        break
      case '27': backForm = getForm(curRole)// 问答数量不达标
        break
      case '28': backForm = getForm(curRole)// 问答质量不合格
        break
      case '3': backForm = getForm(curRole)// 首次联系延迟
        break
      default: backForm = []
    }
    return backForm
  }
}
export {ConfigSearch}
