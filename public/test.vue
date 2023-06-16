<template>
  <div v-for="item in list" @click.stop="onClick(item)" data-nani="1">{{item}}</div>
</template>


<script>
console.log('yes')
</script>


<style lang="scss" scoped>
.page-wrapper {
  padding-bottom: 106px;
  @include supports-safe-area-inset-bottom(padding-bottom, 106);
  // padding-top: 12px;
  background-color: #f5f5f5;
  min-height: 100%;
}

.bg-wrap {
  background-color: white;
  padding-top: 12px;
}

.swiper-wrap {
  display: block;
  margin: 0 auto;
  width: 351px;
  height: 131px;
  overflow: hidden;

  .img {
    border-radius: 12px;
  }
}
</style>
