<template>
    <div class="app-container">
       <el-table
      :data="list"
      border
      fit
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
        prop="name"
        label="标签"
        align="center"
        >
      </el-table-column>
      <el-table-column
        label="挂载文章"
        align="center"
        >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleShowDetail(scope.$index, scope.row )">查看</el-button>
        </template>
      </el-table-column>
     
    <el-table-column label="操作" min-width="170" align="center">
      <template slot-scope="scope">
          <el-button
          size="mini"
          type="warning"
          @click="handleEditor(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          
      </template>
    </el-table-column>

    </el-table>


      <el-dialog :title="`${dialogTableTitle}－共${postCount}篇文章`" :visible.sync="dialogTableVisible">
        <el-table :data="posts">
          <el-table-column property="title" label="标题" min-width="150" align="center"></el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{status2string(scope.row.status)}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="修改时间" width="140" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{updateTime(scope.row.updatedAt)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

    </div>
</template>

<script>
import { getTags, deleteTag, postsBytag } from '@/api/tag'
import { formatTime } from '@/utils/index'
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      postCount: '',
      posts: [],
      dialogTableVisible: false,
      dialogTableTitle: ''
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
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getTags().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDelete(index, row) {
      deleteTag(row.id).then(
        response => {
          this.getData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      )
    },
    status2string(statusCode) {
      return statusCode === 1 ? '已发布' : '草稿'
    },
    updateTime(timer) {
      let timestamp = new Date(timer).getTime()
      return formatTime(timestamp)
    },
    handleShowDetail(index, row) {
      postsBytag(row.name).then(
        response => {
          this.postCount = response.data.count
          this.posts = response.data.rows
          this.dialogTableVisible = true
          this.dialogTableTitle = row.name
        }
      )
    }
  }
}
</script>

