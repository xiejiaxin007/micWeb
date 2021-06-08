<template>
  <div class="login-contianer">
    <sub-menu-item :item="loginForm"></sub-menu-item>
    <div class="background-banner"></div>
    <div class="login-wrap">
      <div class="login-box">
        <div class="box-wrap">
          <div class="login-logo">
            <img src="../assets/images/login_logo.png"
              alt="logo">
          </div>
          <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="80px"
                   class="demo-ruleForm">
            <el-form-item label="用户名：" prop="name">
              <el-input v-model="loginForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="pass">
              <el-input type="text" v-model="loginForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Cookie} from '../assets/js/utils/utils'
import {PageFooter, SubMenuItem} from '@/components'
export default {
  name: 'login',
  components: {PageFooter, SubMenuItem},
  data () {
    return {
      loginForm: {
        name: '25',
        pass: 'Julive@888'
      },
      loginRules: {
        name: [
          // 对输入内容进行验证
          {required: true, message: '用户名不能为空！'}
        ],
        pass: [
          {required: true, message: '密码不能为空！'}
        ]
      }
    }
  },
  created() {
    this.loginout();
  },
  mounted () {
    if (this.$route.query.errorInfo === 'login') {
      // 需要重新登录
      Cookie.delCookie('userName')
    }
  },
  methods: {
    loginout() {
      this.axios.post('/backend-api/api-user/login-out').then((res) => {
      }).catch((err) => {
        console.log(err)
      })
    },
    submitForm (paraName) {
      this.$refs[paraName].validate((valid) => {
        if (valid) {
          let postData = {
            job_number: this.loginForm.name.toString().trim(),
            password: this.loginForm.pass.toString().trim()
          }
          this.axios.post('/backend-api/api-user/login', postData).then((res) => {
            if (res.status === 200) {
              if (res.data.code === 0) {
                console.log('登录成功')
              } else {
                // 登录失败
                alert(res.data.msg)
              }
            } else {
              alert('数据错误')
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .login-contianer{
    overflow: hidden;
  }
  .background-banner {
    min-width: 1000px;
    height: 380px;
    background-color: #27B3A9;
  }
  .login-wrap {
    margin-top: -307px;
  }
  .login-box {
    background: #fff;
    width: 418px;
    height: 358px;
    margin: 109px auto;
  }
  .login-box .box-wrap {
    padding: 20px 40px;
  }
  .login-logo {
    width: 100px;
    height: 100px;
    margin: 20px auto;
  }
  .login-logo img {
    width: 100%;
    height: 100%;
  }
</style>
