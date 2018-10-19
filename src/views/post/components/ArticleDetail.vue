<template>
  <div class="createPost-container">
    <el-form  :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status" class="bg">
        <template v-if="fetchSuccess">
          <el-button v-if=isEdit v-loading="loading" :disabled="loading" style="margin-left: 10px;" type="success"  @click="updatePostHander()"
          >更新
          </el-button>
          <el-button v-else v-loading="loading" :disabled="loading" style="margin-left: 10px;" type="success" @click="submitForm(1)">发布
          </el-button>
        
          <el-button  v-if=!isEdit v-loading="loading" :disabled="loading" type="warning" @click="submitForm(2)">草稿</el-button>

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span>
            </el-form-item>
          </el-col>
        </el-row>
      
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;">
              <el-select
                v-model="tags"
                multiple
                filterable
                allow-create
                default-first-option
                size='medium'
                placeholder="请选择文章标签">
                <el-option
                  v-for="item in defaultTags"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="editor-container" prop="content">
          <markdown-editor  id="eidtor" :height="400" ref="eidtor" v-model="postForm.content"></markdown-editor>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import MarkdownEditor from '@/components/MarkdownEditor'
import { createPost, fetchArticle, updatePost, getPostTags } from '@/api/article'
import { getTags } from '@/api/tag'

const defaultForm = {
  status: 1,
  title: '', // 文章题目
  content: '', // 文章内容
  display_time: new Date().getTime(), // 前台展示时间
  id: undefined
}
export default {
  name: 'articleDetail',
  components: { MDinput, Sticky, MarkdownEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      userLIstOptions: [],
      rules: {
        title: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      },
      defaultTags: [], // 库中原有的所有标签,用于下拉多选
      tags: [], // 选择的标签
      diffTags: []
    }
  },
  created() {
    this.getDefaultTagsHander()
    if (this.isEdit) {
      this.fetchData()
      this.getPostTagsHander()
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  computed: {
    tagsObj() {
      return this.tags.map(tag => {
        if (typeof tag === 'string') {
          return {
            value: tag,
            label: tag
          }
        } else {
          return tag
        }
      })
    }
  },
  methods: {
    getDefaultTagsHander() {
      getTags().then(response => {
        this.defaultTags = this.filterTags(response.data)
      }).catch(err => {
        console.log('获取标签失败' + err)
      })
    },
    getPostTagsHander() {
      getPostTags(this.$route.params.postId).then(response => {
        this.tags = this.filterTags(response.data)
      }).catch(err => {
        console.log('获取文章标签失败' + err)
      })
    },
    fetchData() {
      fetchArticle(this.$route.params.postId).then(response => {
        this.postForm = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log('获取文章失败' + err)
      })
    },
    submitForm(statusCode) {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.status = statusCode
          const message = statusCode === 1 ? '发布文章成功' : '草稿保存成功'
          let resultForm = this.assignTags(this.postForm, this.tagsObj, this.defaultTags)
          createPost(resultForm).then(response => { // resultForm 对象中组合进的{ diffTags: _diffTags, tags: _tags }，tags为本次文章操作后的所有标签，diffTags为与数据库中相比新增的标签，如若没有新增或者减少则为[]
            this.$notify({
              title: '成功',
              message: message,
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.loading = false
                location.reload
                this.$router.push({ path: '/list/index' })
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePostHander(statusCode) {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          let resultForm = this.assignTags(this.postForm, this.tagsObj, this.defaultTags)
          updatePost(resultForm).then(response => {
            this.$notify({
              title: '成功',
              message: '文章修改成功',
              type: 'success',
              duration: 2000
            })
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    filterTags(tags) {
      let _tags = []
      for (let i = 0; i < tags.length; i++) {
        _tags.push({
          value: tags[i].name,
          label: tags[i].name
        })
      }
      return _tags
    },
    assignTags(form, tags, defaultTags) {
      let _tags = []
      for (let elem of tags.values()) {
        _tags.push(elem.label)
      }
      let _defaultTags = []
      for (let elem of defaultTags.values()) {
        _defaultTags.push(elem.label)
      }
      let _diffTags = []
      for (let i = 0; i < _tags.length; i++) {
        if (!_defaultTags.includes(_tags[i])) {
          _diffTags.push(_tags[i])
        }
      }
      Object.assign(form, { diffTags: _diffTags, tags: _tags })
      return form
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .bg{background: transparent;}
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
    .el-select{display: block;}
    .el-tag+.el-tag{margin-left: 10px;}
  }
</style>
