<template>
  <div style="width: 100%; text-align: center;padding-top: 100px;">
    合约地址: <el-input v-model="fromAddress" style="width: 300px;text-align: center;" placeholder="合约地址" @change="fromAddressChange"></el-input><br/>
    <div style="padding: 10px 0px 10px 0;">账户代币: {{this.balance}}<br/></div>
    使用个数: <el-input v-model="fromCoinSize" style="width: 300px;text-align: center;"></el-input><br/>
    <el-button @click="changeToken" icon="el-icon-sort" style="margin: 20px;"></el-button><br/>
    合约地址: <el-input v-model="toAddress" style="width: 300px;text-align: center;" placeholder="合约地址"></el-input><br/>
    <el-button @click="swap" style="margin: 20px;">交换代币</el-button>
  </div>
</template>

<script>

import Vue from "vue";
import { getTokenBalance } from "@/utils/index"

export default {
  name: 'Dashboard',
  data() {
    return {
      fromAddress: '1',
      toAddress: '1',
      balance: 0,
      fromCoinSize: 0
    }
  },
  created() {
  },
  methods: {
    swap () {
      console.log(11)
    },
    changeToken () {
      const tmp = this.fromAddress
      this.fromAddress = this.toAddress
      this.toAddress = tmp
    },
    fromAddressChange(address) {
      this.getBalance(address)
    },
    async getBalance(address) {
      this.balance = await getTokenBalance(address)
    }
  }
}
</script>
<style scoped>
/deep/ .el-input__inner {
  text-align: center;
}
</style>
