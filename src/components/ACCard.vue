<script setup lang="ts">

import ACCardSubtitle from "@/components/ACCardSubtitle.vue";
</script>

<template>
<div class="card">
  <div class="card-title text-h4">
    <slot name="title">
      123 左侧卡片
    </slot>
  </div>
  <div class="card-body px-md-8">
    <slot>
      <ACCardSubtitle>

      </ACCardSubtitle>
      <v-select label="游戏版本" variant="outlined" :items="['1', '2']">

      </v-select>
    </slot>
  </div>
</div>
</template>

<style scoped>
.card {
  width: 100%;
  font-family: 'AlibabaHealth', sans-serif;
  padding: 16px;
}
.card-title {
  text-align: center;
  font-family: 'AlibabaHealth', sans-serif;
  background-image: url("/src/assets/card-title-background.svg") !important;
  background-size: contain;
  background-position: center;
  color: white;
  padding: 16px;
  position: relative;
  z-index: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-body {
  font-family: 'AlibabaHealth', sans-serif;
  background-color: #FEECCE;
  color: #986852;
  border-radius: 32px;
  padding-top: 48px;
  padding-right: 16px;
  padding-left: 16px;
  padding-bottom: 32px;
  margin-top: -32px;
  position: relative;

}
</style>
