<script setup lang="ts">

</script>

<template>
<div class="card-subtitle text-subtitle-1">

  <p>
<!--    <img class="card-subtitle-background" src="/src/assets/card-subtitle-background.svg">-->
    <slot>
      游戏版本
    </slot>
  </p>

</div>
</template>

<style scoped>
.card-subtitle-background {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.card-subtitle {
  font-family: 'AlibabaHealth', sans-serif;
  border-top: solid 10px white;
  border-bottom: solid 10px white;
  border-left: solid 8px white;
  border-right: solid 8px white;
  border-image-source: url("/src/assets/card-subtitle-background.svg") !important;
  border-image-slice: 30% 10% 40% 10% fill;
  line-height: 8px;
  color: white !important;
  width: max-content !important;
  margin-bottom: 16px;
}

</style>
