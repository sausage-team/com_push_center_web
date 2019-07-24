<template>
  <Modal class="conditon-incr-modal"
    width="560"
    :mask-closable="false"
    :closable="false"
    v-model="value">
    <div class="ci-header" slot="header">
      <span>增量设置</span>
      <Icon type="md-close" @click="close" />
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
          <input type="checkbox">
          <span class="note-text">限制最大值不超过</span>
          <Input v-model="otherData.limit" class="input-val" placeholder="请输入值" />
        </div>
        <div class="sub-row">
          <input type="checkbox">
          <span class="note-text">下次同步从指定值开始</span>
          <el-select class="select"
            v-model="otherData.op"
            placeholder="请选择">
            <el-option
              v-for="item in CONSTANT.compareType"
              :value="item.value"
              :key="item.value"
              :label="item.label">
            </el-option>
          </el-select>
          <Input v-model="otherData.next" class="input-val" placeholder="请输入值" />
        </div>
      </div>
      <div class="row" v-show="chooseType === 1">
        <div class="sub-row date-row">
          <input type="checkbox">
          <span class="note-text">限制最大值不超过</span>
          <el-radio-group v-model="maxDateData.limitType">
            <el-radio :label="0">当前日期</el-radio>
            <el-radio :label="1">
              <el-select class="select" v-model="maxDateData.limitOp" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input class="input-val" v-model="maxDateData.limitVal" placeholder="请输入值"/>天
            </el-radio>
          </el-radio-group>
        </div>
        <div class="sub-row date-row">
          <input type="checkbox">
          <span class="note-text">下次同步从指定值开始</span>
          <el-select class="select" v-model="maxDateData.nextOp" placeholder="请选择">
            <el-option
              v-for="item in CONSTANT.compareType"
              :value="item.value"
              :key="item.value"
              :label="item.label">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="maxDateData.nextVal"
            align="center"
            class="datepicker"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
      </div>
      <div class="row" v-show="chooseType === 2">
        <div class="sub-row date-row">
          <span class="prefix">同步起始点</span>
          <el-radio-group v-model="relativeDateData.limitType">
            <el-radio :label="0">当前日期</el-radio>
            <el-radio :label="1">
              <el-select class="select" :value="relativeDateData.limitOp" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input class="input-val" v-model="relativeDateData.limitVal" placeholder="请输入值"/>天
            </el-radio>
          </el-radio-group>
        </div>
        <div class="sub-row date-row">
          <span class="prefix">同步终止点</span>
          <el-radio-group v-model="relativeDateData.nextType">
            <el-radio :label="0">当前日期</el-radio>
            <el-radio :label="1">
              <el-select class="select" :value="relativeDateData.nextOp" placeholder="请选择">
                <el-option
                  v-for="item in CONSTANT.dateType"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
              <Input class="input-val" v-model.number="relativeDateData.nextVal" placeholder="请输入值" />天
            </el-radio>
            <el-radio :label="2">不限制</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div slot="footer" class="ct-footer">
      <Button @click="ok">确定</Button>
      <Button @click="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    fields: Array
  },
  data () {
    return {
      chooseFieldName: '',
      chooseFieldType: 0,
      chooseMethodValue: 0,
      chooseType: 0,
      conditions: [],
      fieldIncrMethods: [],
      otherData: {
        limit: '',
        op: '>',
        next: ''
      },
      maxDateData: {
        limitType: 0,
        limitOp: 'before',
        limitVal: '',
        nextOp: '>',
        nextVal: ''
      },
      relativeDateData: {
        limitType: 0,
        limitOp: 'before',
        limitVal: '',
        nextType: 0,
        nextOp: 'before',
        nextVal: ''
      }
    }
  },
  created () {
    this.fieldIncrMethods = this.CONSTANT.fieldIncreType
  },
  methods: {
    init () {
      // this.conditions = this.fields
      this.conditions = [
        {
          data_type: 'number',
          name: '数字类型'
        },
        {
          date_type: 'date',
          name: '日期类型'
        }
      ]
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
      this.chooseMethodValue = 0
      this.resetData()
    },
    changeMethod (val) {
      this.chooseType = this.chooseFieldType + val
      this.resetData()
    },
    close () {
      this.$emit('close')
    },
    ok () {
      // this.$emit('ok')
      let data = {}
      switch (this.chooseType) {
        case 0:
          data = this.otherData
          break
        case 1:
          data = this.maxDateData
          break
        case 2:
          data = this.relativeDateData
          break
      }
      console.log(data)
    },
    resetData () {
      this.otherData = this.$options.data().otherData
      this.maxDateData = this.$options.data().maxDateData
      this.relativeDateData = this.$options.data().relativeDateData
    }
  },
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
