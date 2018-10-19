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
        >
      </el-table-column>
      <el-table-column
        label="挂载文章数"
        >
        <template slot-scope="scope">
          <div v-if="false" style="text-align:center;">
              <div>共{{postCount}}篇文章</div>
          </div>
          <el-button v-else size="mini" type="primary" @click="handleShowDetail(scope.$index, scope.row )">查看</el-button>
        </template>
      </el-table-column>
     
    <el-table-column label="操作">
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
    </div>
</template>

<script>
import { getTags, deleteTag, postsBytag } from '@/api/tag'
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      postCount: '',
      posts: []
    }
  },
  watch() {

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
    handleShowDetail(index, row) {
      postsBytag(row.name).then(
        response => {
          this.postCount = response.data.count
          this.posts = response.data.rows
        }
      )
    }
  }
}
</script>

