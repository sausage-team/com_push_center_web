<template>
  <Modal
    class="modal-md group-allot-modal"
    v-model="value"
    :mask-closable="false"
    :closable="false">
    <div class="modal-header" slot="header">
      <span>选择组织机构</span>
      <Icon type="md-close" @click="close" />
    </div>
    <div class="modal-body">
      <div class="transfer-main">
        <div class="tm-left">
          <div class="tm-left-header">
            <span>单位/组</span>
          </div>
          <div class="filter-box">
            <input class="search-input"
              v-model="filterText"
              @keyup="searchTree"
              type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="tm-left-body">
            <el-tree
              ref="treeList"
              :props="props"
              :node-key="prKey"
              :indent="8"
              @node-click="choose"
              :data="sourceList"
              :expand-on-click-node="false"
              :default-expanded-keys="expandList"
              show-checkbox
              render-after-expand
              :render-content="renderContent"
              :filter-node-method="filterNode">
            </el-tree>
          </div>
        </div>
        <div class="tm-mid">
          <Button type="primary" @click="toRight($event)">
            <Icon type="ios-arrow-forward" />
          </Button>
          <Button type="default" @click="toLeft($event)">
            <Icon type="ios-arrow-back" />
          </Button>
        </div>
        <div class="tm-right">
          <div class="tm-right-header">
            <span>已添加</span>
          </div>
          <div class="filter-box">
            <input class="search-input"
              type="text" required>
            <Icon class="search-icon" type="md-search" />
          </div>
          <div class="tm-right-body">
           <el-tree
              ref="triggerTreeList"
              :props="props"
              :node-key="prKey"
              :indent="8"
              :data="triggerList"
              :expand-on-click-node="false"
              :default-expanded-keys="expandList"
              render-after-expand
              :render-content="triggerRender"
              :filter-node-method="filterNode">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" slot="footer">
      <el-button type="text" class="sure-btn" @click="ok">确定</el-button>
      <el-button type="text" class="cancel-btn"  @click="close">取消</el-button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    value: Boolean,
    prKey: String,
    showText: String,
    changeList: Array
  },
  data () {
    return {
      props: {
        label: this.showText
      },
      sourceList: [],
      expandList: [],
      filterText: '',
      triggerList: [],
      chooseTag: []
    }
  },
  methods: {
    ok () {
      const rets = this.recurseKey(this.triggerList, true)
      this.$emit('ok', [].concat(rets))
    },
    close () {
      this.$emit('close')
    },
    choose (data, node, event) {
      node.checked = !node.checked
    },
    searchTree (e) {
      if (e.keyCode === 13) {
        this.$refs.treeList.filter(this.filterText)
      }
    },
    filterNode (value, data, node) {
      if (!value) return true
      if (data.name.indexOf(value) !== -1) {
        return true
      }
      return false
    },
    toRight (e) {
      let stack = []
      const root = 'root'
      const tree = {}
      const treeData = this.$refs.treeList
      const triggerTreeData = this.$refs.triggerTreeList

      treeData.getCheckedKeys().forEach(item => {
        let node = treeData.getNode(item)

        // update trigger checked keys
        let existTriggerNode = triggerTreeData.getNode(item)
        if (existTriggerNode && !existTriggerNode.isAdded && !existTriggerNode.isChecked) {
          existTriggerNode.data.isAdded = true
          existTriggerNode.data.isChecked = true
        }

        let parentNode = node
        let triggerNode = null

        while (parentNode && parentNode.data[this.prKey]) {
          triggerNode = triggerTreeData.getNode(parentNode.data[this.prKey])

          if (triggerNode) {
            break
          }

          stack.push({
            ...parentNode.data,
            children: [],
            isAdded: parentNode.checked,
            isChecked: parentNode.checked
          })
          parentNode = parentNode.parent
        }

        // merge node
        let key = triggerNode === null ? root : triggerNode.data.id

        if (tree[key]) {
          let dict = tree[key]
          while (stack.length > 0) {
            let node = stack.pop()
            let next = false

            dict.forEach(val => {
              if (val.id === node.id) {
                dict = val.children
                key = node.id
                next = true
              }
            })
            if (!next) {
              stack.push(node)
              break
            }
          }
          if (stack.length > 0) {
            dict.push(stack
              .reduce((child, parent) => ({ ...parent, children: [child] }))
            )
          }
        } else {
          if (stack.length > 0) {
            tree[key] = [stack
              .reduce((child, parent) => ({ ...parent, children: [child] }))
            ]
          }
        }
        stack = []
      })

      Object.keys(tree).forEach(key => {
        tree[key].forEach(val => {
          if (key === root) {
            triggerTreeData.append(val)
          } else {
            triggerTreeData.append(val, key)
          }
        })
      })
    },
    toLeft (e) {
      const recurseKeys = this.recurseKey(this.triggerList, false)
      const triggerTreeData = this.$refs.triggerTreeList
      recurseKeys.forEach(ele => {
        let node = triggerTreeData.getNode(ele.id)
        if (node) triggerTreeData.remove(node)
      })
    },
    recurseKey (list, global) {
      const checks = []
      list.forEach(ele => {
        if (ele.isAdded && (global || ele.isChecked)) checks.push(ele)
        if (ele.children) checks.push(...this.recurseKey(ele.children, global))
      })
      return checks
    },
    triggerChange (val, data) {
      data.isChecked = !data.isChecked
    },
    renderContent (h, { node, data, store }) {
      const element = {
        'class': {
          'item-con': true
        }
      }
      const children = [
        h('i', {
          'class': {
            'user-icon': data.type === 3,
            'home-icon': data.type === 1,
            'group-icon': data.type === 2
          }
        }),
        h('span', {
          domProps: {
            innerHTML: data.name
          },
          attrs: {
            title: `${data.name}${(data.identity) ? ('(' + data.identity + ')') : ('')}`
          }
        })
      ]
      return h('div', element, children)
    },
    triggerRender (h, { node, data, store }) {
      const element = {
        'class': {
          'item-con': true
        }
      }
      const children = [
        h('i', {
          'class': {
            'user-icon': data.type === 3,
            'home-icon': data.type === 1,
            'group-icon': data.type === 2
          }
        }),
        h('span', {
          domProps: {
            innerHTML: data.name
          },
          attrs: {
            title: `${data.name}${(data.identity) ? ('(' + data.identity + ')') : ('')}`
          }
        })
      ]
      if (data.isAdded) {
        children.push(
          h('el-checkbox', {
            props: {
              value: data.isChecked
            },
            on: {
              change: (val) => {
                this.triggerChange(val, data)
              }
            }
          })
        )
      }
      return h('div', element, children)
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.$store.dispatch('getUserGroupList', {
          level: -1
        }).then(res => {
          this.sourceList = res
          if (this.$store.state.user.userEditData) {
            const editData = this.$store.state.user.userEditData
            this.userService.getOrgData({
              user_id: editData.id
            }).then(response => {
              if (response.status === 0 && response.data) {
                this.triggerList = [...response.data.organization_code_list.map((item, index) => {
                  return {
                    code: item,
                    name: response.data.organization_name_list[index],
                    type: 1
                  }
                })]
              }
            })
          }
        })
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
}
</script>
