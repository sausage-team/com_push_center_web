<template lang='html'>
  <Modal v-model="trigger" class="abnormal-detail">
    <p slot="header">
      <span>异常原因</span>
    </p>
    <div class="abnormal-list">
      <el-table
        :data="abnormalData"
        border
        style="width: 100%"
        height="280">
        <el-table-column
          prop="origin_data_name"
          label="名称"
          width="197">
        </el-table-column>
        <el-table-column
          prop="content"
          show-overflow-tooltip
          label="异常原因"
          width="312">
        </el-table-column>
        <el-table-column
          label="异常时间"
          width="146">
          <template slot-scope="scope">
            <span>{{utils.momentDate(scope.row.exception_time, 'date_time')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="right">
      <button class="btn" @click="closeDetail()">关闭</button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    value: Boolean,
    type: String
  },
  data () {
    return {
      trigger: false,
      pageParams: {
        type: 1
      },
      abnormalData: []
    }
  },
  methods: {
    searchData () {
      switch (this.type) {
        case 'data':
          this.pageParams.type = 1
          break
        case 'task':
          this.pageParams.type = 3
          break
        default:
          this.pageParams.type = 1
          break
      }
      this.dmService.searchAbnormalList(this.pageParams).then(res => {
        if (res.status === 0) {
          this.abnormalData = res.data.list
        }
      })
    },
    closeDetail () {
      this.trigger = false
    }
  },
  watch: {
    value () {
      this.trigger = this.value
    },
    trigger () {
      this.$emit('input', this.trigger)
      if (this.trigger) {
        this.searchData()
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}

</script>
<style lang='css'>
</style>
