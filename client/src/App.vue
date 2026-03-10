<template>
  <router-view />
</template>

<script setup>
</script>

<style>
/* 适老化样式覆盖 */
:root {
  --td-font-size-m: 18px;
  --td-font-size-l: 20px;
  --td-radius-large: 12px;
}

.t-button--large {
  height: 56px !important;
  font-size: 20px !important;
}

.t-input--large {
  height: 56px !important;
  font-size: 18px !important;
}

.t-select--large {
  height: 56px !important;
  font-size: 18px !important;
}
</style>
