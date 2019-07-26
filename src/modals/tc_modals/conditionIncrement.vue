<template>
  <Modal class="conditon-incr-modal"
    width="560"
    :mask-closable="false"
    :closable="false"
    v-model="value">
    <div class="ci-header" slot="header">
      <span>增量设置</span>
      <Icon type="md-close" @click="cancel" />
    </div>
    <div class="ci-body">
      <div class="row">
        <label class="prefix">选择字段</label>
        <el-select class="select"
          v-model="chooseFieldName"
          @change="changeField"
          placeholder="请选择">
          <el-option
            v-for="item in conditions"
            :key="item.name"
            :value="item.name"
            :label="item.name">
          </el-option>
        </el-select>
        <span class="tooltip">可使用日期或数值字段，建议使用索引字段</span>
      </div>
      <div v-show="chooseFieldName">
        <div class="row">
          <label class="prefix">增量方式</label>
          <el-select class="select"
            @change="changeMethod"
            v-model="chooseMethodValue"
            placeholder="请选择">
            <el-option
              v-for="item in fieldIncrMethods"
              :disabled="item.disabled"
              :value="item.value"
              :key="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="row" v-show="chooseType === 0">
          <div class="sub-row">
            <input type="checkbox"
              v-model="otherData.end.enable">
            <span class="note-text">限制最大值不超过</span>
            <Input class="input-val"
              placeholder="请输入值"
              :disabled="!otherData.end.enable"
              v-model="otherData.end.value"/>
          </div>
          <div class="sub-row">
            <input type="checkbox" v-model="otherData.start.enable">
            <span class="note-text">下次同步从指定值开始</span>
            <el-select class="select"
              :disabled="!otherData.start.enable"
              v-model="otherData.start.compare"
              placeholder="请选择">
              <el-option
                v-for="item in CONSTANT.compareType"
                :value="item.value"
                :key="item.value"
                :label="item.label">
              </el-option>
            </el-select>
            <Input class="input-val"
              v-model="otherData.start.value"
              :disabled="!otherData.start.enable"
              placeholder="请输入值" />
          </div>
        </div>
        <div class="row" v-show="chooseType === 1">
          <div class="sub-row date-row">
            <input type="checkbox" v-model="maxDateData.end.enable">
            <span class="note-text">限制最大值不超过</span>
            <el-radio-group
              :disabled="!maxDateData.end.enable"
              v-model="maxDateData.end.mode">
              <el-radio label="today">当前日期</el-radio>
              <el-radio label="relative">
                <el-select class="select"
                  :disabled="maxDateData.end.mode != 'relative'"
                  v-model="maxDateData.end.type" placeholder="请选择">
                  <el-option
                    v-for="item in CONSTANT.dateType"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
                <Input class="input-val"
                  :disabled="maxDateData.end.mode != 'relative'"
                  v-model="maxDateData.end.value" placeholder="请输入值"/>天
              </el-radio>
            </el-radio-group>
          </div>
          <div class="sub-row date-row">
            <input type="checkbox" v-model="maxDateData.start.enable">
            <span class="note-text">下次同步从指定值开始</span>
            <el-select class="select"
              :disabled="!maxDateData.start.enable"
              v-model="maxDateData.start.compare"
              placeholder="请选择">
              <el-option
                v-for="item in CONSTANT.compareType"
                :value="item.value"
                :key="item.value"
                :label="item.label">
              </el-option>
            </el-select>
            <el-date-picker
              :disabled="!maxDateData.start.enable"
              v-model="maxDateData.start.value"
              align="center"
              class="datepicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
        <div class="row" v-show="chooseType === 2">
          <div class="sub-row date-row">
            <span class="prefix">同步起始点</span>
            <el-radio-group v-model="relativeDateData.start.mode">
              <el-radio label="today"
                @click.native="relativeDateData.start.value = '0'">当前日期</el-radio>
              <el-radio label="relative">
                <el-select class="select"
                  :disabled="relativeDateData.start.mode != 'relative'"
                  v-model="relativeDateData.start.type" placeholder="请选择">
                  <el-option
                    v-for="item in CONSTANT.dateType"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
                <Input class="input-val"
                  :disabled="relativeDateData.start.mode != 'relative'"
                  v-model="relativeDateData.start.value" placeholder="请输入值"/>天
              </el-radio>
            </el-radio-group>
          </div>
          <div class="sub-row date-row">
            <span class="prefix">同步终止点</span>
            <el-radio-group v-model="relativeDateData.end.mode">
              <el-radio label="today"
                @click.native="relativeDateData.end.value = '0'">当前日期</el-radio>
              <el-radio label="relative">
                <el-select class="select"
                  :disabled="relativeDateData.end.mode != 'relative'"
                  :value="relativeDateData.end.type"
                  placeholder="请选择">
                  <el-option
                    v-for="item in CONSTANT.dateType"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
                <Input class="input-val"
                  :disabled="relativeDateData.end.mode != 'relative'"
                  v-model="relativeDateData.end.value"
                  placeholder="请输入值" />天
              </el-radio>
              <el-radio label="unlimited"
                @click.native="relativeDateData.end.value = ''">不限制</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="row">
          <label class="prefix">定时同步</label>
          <el-radio-group v-model="isOpenSync">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </div>
        <div class="block" v-show="isOpenSync === 0">
          <div class="row" >
            <label class="prefix">定时类型</label>
            <el-select class="select"
              @change="changeSyncType"
              v-model="chooseSyncType">
              <el-option
                v-for="item in CONSTANT.syncTimeType"
                :value="item.value"
                :key="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </div>
          <div class="block" v-show="chooseSyncType === CONSTANT.syncTimeField.ORIGIN">
            <label class="prefix fixed">同步时间</label>
            <div class="sub-block">
              <div class="row"
                v-for="(item, index) in customSyncData.origin"
                :key="index">
                <el-time-picker class="timepicker"
                  v-model="customSyncData.origin[index]"
                  value-format="HH:mm"
                  default-value="0"
                  align="center">
                </el-time-picker>
                <div class="add-row"
                  v-show="customSyncData.origin.length === index + 1"
                  @click="addCustomRow">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="remove-row"
                  v-show="customSyncData.origin.length > 1"
                  @click="removeCustomRow(index)">
                  <i class="el-icon-minus"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="block" v-show="chooseSyncType === CONSTANT.syncTimeField.HOUR">
            <div class="row">
              <label class="prefix">间隔</label>
              <el-radio-group v-model="hourSyncData.delta">
                <el-radio label="1">每一小时</el-radio>
                <el-radio label="2">每两小时</el-radio>
              </el-radio-group>
            </div>
            <div class="row">
              <label class="prefix">起始时间</label>
              <el-time-picker class="timepicker"
                align="center"
                value-format="HH:mm"
                default-value="00:00"
                v-model="hourSyncData.start"></el-time-picker>
            </div>
            <div class="row">
              <label class="prefix">结束时间</label>
              <el-time-picker class="timepicker"
                align="center"
                value-format="HH:mm"
                default-value="00:00"
                v-model="hourSyncData.end"></el-time-picker>
            </div>
          </div>
          <div class="row" v-show="chooseSyncType === CONSTANT.syncTimeField.CRONTAB">
            <label class="prefix">定时配置</label>
            <Input class="time-input-rule"
              v-model="crontabSyncData.crontab"
              placeholder="* */1 * * *"/>
          </div>
          <div class="row" v-show="chooseSyncType === CONSTANT.syncTimeField.MINUTE">
            <label class="prefix">同步频次</label>
            <span>每</span>
            <el-select class="select select-freq"
              v-model="minuteSyncDdata.minute">
              <el-option v-for="(n, i) in 60"
                :key="i"
                :label="i"
                :value="i">
              </el-option>
            </el-select>
            <span>分</span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="ct-footer">
      <Button @click="ok">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    fields: Array,
    increaseData: Object,
    timerData: Object
  },
  data () {
    return {
      chooseFieldName: '',
      chooseFieldType: 0,
      chooseMethodValue: 'maximum',
      chooseType: 0,
      isOpenSync: 1,
      chooseSyncType: 'origin',
      conditions: [],
      fieldIncrMethods: [],
      // Increment Params
      otherData: {
        start: {
          compare: '>',
          enable: false,
          value: ''
        },
        end: {
          enable: false,
          value: ''
        }
      },
      maxDateData: {
        start: {
          enable: false,
          compare: '>',
          value: 0
        },
        end: {
          enable: false,
          value: '0',
          type: 'before',
          mode: 'today'
        }
      },
      relativeDateData: {
        start: {
          mode: 'today',
          type: 'before',
          value: '0'
        },
        end: {
          mode: 'today',
          type: 'before',
          value: '0'
        }
      },
      // Timer Params
      customSyncData: {
        type: 'origin',
        origin: ['00:00'],
        enable: true
      },
      hourSyncData: {
        type: 'delta',
        delta: '1',
        start: '00:00',
        end: '00:00',
        enable: true
      },
      crontabSyncData: {
        type: 'crontab',
        crontab: '',
        enable: true
      },
      minuteSyncDdata: {
        type: 'minute',
        minute: '1',
        enable: true
      }
    }
  },
  methods: {
    init () {
      this.conditions = this.fields
      this.fieldIncrMethods = this.CONSTANT.increaseType
    },
    changeField (val) {
      this.conditions.forEach(element => {
        if (element.name === val) {
          this.chooseFieldType = this.CONSTANT.fieldDateType[element.date_type] ||
            this.CONSTANT.fieldDateType.string
        }
      })
      switch (this.chooseFieldType) {
        case this.CONSTANT.fieldDateType.date:
          this.fieldIncrMethods.forEach((item) => {
            if (item.hasOwnProperty('disabled')) item.disabled = false
          })
          break
        default:
          this.fieldIncrMethods.forEach((item) => {
            if (item.hasOwnProperty('disabled')) item.disabled = true
          })
          break
      }
      this.chooseType = this.chooseFieldType
      this.chooseMethodValue = this.$options.data().chooseMethodValue
      this.resetData()
    },
    changeMethod (val) {
      this.chooseType = this.chooseFieldType + this.CONSTANT.fieldIncreType[val]
      this.resetData()
    },
    changeSyncType () {
      this.resetSync()
    },
    addCustomRow () {
      this.customSyncData.origin.push(0)
    },
    removeCustomRow (index) {
      this.customSyncData.origin.splice(index, 1)
    },
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      if (!this.chooseFieldName) {
        this.$message.error('请选择增量字段')
        return
      }
      let incrData = {
        field: this.chooseFieldName,
        type: this.chooseMethodValue
      }
      switch (this.chooseType) {
        case 0:
          incrData[incrData.type] = { ...this.otherData }
          break
        case 1:
          incrData[incrData.type] = { ...this.maxDateData }
          break
        case 2:
          incrData[incrData.type] = { ...this.relativeDateData }
          break
      }

      let syncData = {}
      if (this.isOpenSync === 0) {
        switch (this.chooseSyncType) {
          case this.CONSTANT.syncTimeField.ORIGIN:
            syncData = {
              ...this.customSyncData,
              origin: this.customSyncData.origin.map((item) => {
                return {
                  hour: item.split(':')[0],
                  minute: item.split(':')[1]
                }
              })
            }
            break
          case this.CONSTANT.syncTimeField.HOUR:
            syncData = {
              ...this.hourSyncData,
              start: {
                hour: this.hourSyncData.start.split(':')[0],
                minute: this.hourSyncData.start.split(':')[1]
              },
              end: {
                hour: this.hourSyncData.end.split(':')[0],
                minute: this.hourSyncData.end.split(':')[1]
              }
            }
            break
          case this.CONSTANT.syncTimeField.CRONTAB:
            syncData = { ...this.crontabSyncData }
            break
          case this.CONSTANT.syncTimeField.MINUTE:
            syncData = { ...this.minuteSyncDdata }
            break
        }
      }
      this.$emit('ok', {
        increase: incrData,
        timer: syncData
      })
    },
    resetData () {
      this.otherData = this.$options.data().otherData
      this.maxDateData = this.$options.data().maxDateData
      this.relativeDateData = this.$options.data().relativeDateData
    },
    resetSync () {
      [
        this.customSyncData,
        this.hourSyncData,
        this.crontabSyncData,
        this.minuteSyncDdata
      ] = [
        this.$options.data().customSyncData,
        this.$options.data().hourSyncData,
        this.$options.data().crontabSyncData,
        this.$options.data().minuteSyncDdata
      ]
    }
  },
  computed: {},
  watch: {
    value () {
      if (!this.value) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.init()
      }
    }
  }
}
</script>
