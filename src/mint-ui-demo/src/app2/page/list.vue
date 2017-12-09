<template>
  <div>
    <mt-header fixed title="标题过长会隐藏后面的内容啊哈哈哈哈">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>

    <mt-cell title="标题文字" is-link>
      <span style="color: green">这里是元素</span>
    </mt-cell>


    <mt-tab-container v-model="active" :swipeable="true">
      <mt-tab-container-item id="tab-container1">
        <mt-cell v-for="n in 10" title="tab-container 1"></mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-container2">
        <mt-cell v-for="n in 5" title="tab-container 2"></mt-cell>
      </mt-tab-container-item>
      <mt-tab-container-item id="tab-container3">
        <mt-cell v-for="n in 7" title="tab-container 3"></mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data: function () {
      return {
        value: '',
        active: 'tab-container1'
      }
    }
//    components: { Header }
  }
</script>
