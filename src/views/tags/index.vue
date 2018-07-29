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
        prop="count"
        label="挂载文章数"
        >
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
import { getTags, postCountBytag } from '@/api/tag'
export default {
  data() {
    return {
      list: [],
      listLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getTags().then(response => {
        let tags = response.data
        let _list = []
        for (let i = 0; i < tags.length; i++) {
          postCountBytag(tags[i].name).then(response => {
            _list.push({
              id: tags[i].id,
              name: tags[i].name,
              count: response.data
            })
          })
        }
        this.list = _list
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

