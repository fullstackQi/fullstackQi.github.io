<script src="../../main.js"></script>
<script src="../../utils/index.js"></script>
<template>
<!--  <div style="width: 100%; text-align: center;padding-top: 100px;">-->
<!--    合约地址: <el-input v-model="fromAddress" style="width: 300px;text-align: center;" placeholder="合约地址" @change="fromAddressChange"></el-input><br/>-->
<!--    <div style="padding: 10px 0px 10px 0;">账户代币: {{this.balance}}<br/></div>-->
<!--    使用个数: <el-input v-model="fromCoinSize" style="width: 300px;text-align: center;"></el-input><br/>-->
<!--    <el-button @click="changeToken" icon="el-icon-sort" style="margin: 20px;"></el-button><br/>-->
<!--    合约地址: <el-input v-model="toAddress" style="width: 300px;text-align: center;" placeholder="合约地址"></el-input><br/>-->
<!--    <el-button @click="swap" style="margin: 20px;">交换代币</el-button>-->
<!--  </div>-->
  <div class="parent">
    <el-dialog title="提示" :visible="showTokenSearchDialog" :before-close="closeDialog">
      <el-input v-model="searchAddress" placeholder="合约地址" @change="searchToken"></el-input>
      合约名称：    {{this.searchTokenName}}
      <el-button @click="confirmToken">确定</el-button>
    </el-dialog>
    <div class="container">
      <div class="item">
        <el-button class="center-left" @click="showSearchDialog('from')">{{ this.fromTokenName }}</el-button>
        <div class="left-bottom"> Balance: {{this.balance}}</div>
        <el-input v-model="fromCoinSize" type="number" class="center-right" style="width: 300px;text-align: center;"></el-input>
      </div>
      <el-button @click="changeToken" icon="el-icon-sort" style="margin: 20px;"></el-button>
      <div class="item" style="align-content: center;justify-content: space-between;" >
        <el-button @click="showSearchDialog('to')">{{ this.toTokenName }}</el-button>
      </div>
      <el-button @click="swap">swap</el-button>
    </div>
  </div>
</template>

<script>

import { getTokenBalance, generateTokenContract, tokenName, getDefaultBalance, swap } from "@/utils/index"

export default {
  name: 'Dashboard',
  data() {
    return {
      fromAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      fromTokenName: 'BNB',
      toAddress: '0x55d398326f99059ff775485246999027b3197955',
      toTokenName: 'USDT',
      balance: 0,
      fromCoinSize: 0,
      showTokenSearchDialog: false,
      currentType: '',
      searchTokenName: '',
      searchAddress: ''
    }
  },
  async created() {
    this.balance = await getDefaultBalance()
  },
  methods: {
    async swap () {
      await swap(this.fromAddress, this.toAddress, this.fromCoinSize)
    },
    async changeToken () {
      const tmp = this.fromAddress
      const tmpName = this.fromTokenName
      this.fromAddress = this.toAddress
      this.fromTokenName = this.toTokenName
      this.toAddress = tmp
      this.toTokenName = tmpName
    },
    async getBalance(address) {
      this.balance = await getTokenBalance(address)
    },
    showSearchDialog(type) {
      this.currentType = type
      this.searchTokenName = ''
      this.searchAddress = ''
      this.showTokenSearchDialog = true
    },
    async searchToken() {
      let contract = await generateTokenContract(this.searchAddress)
      this.searchTokenName = await tokenName(contract)
    },
    async confirmToken() {
      this.showTokenSearchDialog = false
      if (this.currentType === 'from') {
        this.fromTokenName = this.searchTokenName
        await this.getBalance(this.searchAddress)
      } else {
        this.toTokenName = this.searchTokenName
      }
    },
    closeDialog() {
      this.showTokenSearchDialog = false
    }
  }
}
</script>
<style scoped>
/deep/ .el-input__inner {
  text-align: center;
}
.parent {
  display: flex;
  align-items: center;
}
.container {
  display: flex;
  flex-direction: column;  /* 上下排列 */
  align-items: center;
  margin: auto;  /* 两个方向都设置为 auto */
  margin-top: 100px;
}

.item {
  width: 450px;
  height: 150px;
  background: #eeeaf4;
  border: 1px solid white;
  border-radius: 30px;
  padding: 10px;
  position: relative;
}


.parent {
  position: relative;
  height: 200px;
}

.center-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.center-right {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.left-bottom {
  position: absolute;
  left: 10px;
  bottom: 10px;
}
/deep/ .el-input__inner {
  border-radius: 20px;
  height: 80px
}

</style>
