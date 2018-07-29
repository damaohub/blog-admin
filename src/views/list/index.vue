<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{status2string(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{updateTime(scope.row.updatedAt)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions"  >
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handeleEditPost(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status!=1" type="success" size="mini"  @click="switchStatus(scope.row,scope.row.status)">发布</el-button>
            <el-button v-if="scope.row.status!=2" size="mini" @click="switchStatus(scope.row,scope.row.status)">草稿</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="handleDeletePost(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, updStat, deletePost } from '@/api/article'
import { formatTime } from '@/utils/index'
export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    updateTime(timer) {
      return formatTime(timer / 1000)
    },
    switchStatus(row, currentStatus) {
      var tarStatus
      if (currentStatus === 1) {
        tarStatus = 2
      } else if (currentStatus === 2) {
        tarStatus = 1
      }
      updStat(row.id, tarStatus).then(response => {
        row.status = tarStatus
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    status2string(statusCode) {
      return statusCode === 1 ? '已发布' : '草稿'
    },
    handeleEditPost(row) {
      this.$router.push({ name: 'Edit', params: { postId: row.id }})
    },
    handleDeletePost(row) {
      this.listLoading = true
      deletePost(row.id).then(response => {
        var list = this.list
        var deleteIndex
        for (var key in list) {
          if (list[key].id === row.id) {
            deleteIndex = key
          }
        }
        this.list.splice(deleteIndex, 1)
        this.listLoading = false
        this.$message({
          message: '已删除！',
          type: 'success'
        })
      })
    }
  }
}
</script>
