<template>
  <router-view />
</template>

<script setup>
</script>

<style>
:root {
  --td-brand-color: #E07B39;
  --td-brand-color-hover: #F4A461;
  --td-brand-color-active: #C26025;
  --td-brand-color-disabled: #f5c9a8;
  --td-font-size-m: 17px;
  --td-font-size-l: 20px;
  --td-radius-large: 12px;
}

.t-button--theme-primary {
  background: linear-gradient(135deg, #F4A461 0%, #E07B39 100%) !important;
  border-color: transparent !important;
  box-shadow: 0 4px 16px rgba(224, 123, 57, 0.35) !important;
  border-radius: 14px !important;
}

.t-button--theme-primary:active {
  background: linear-gradient(135deg, #E07B39 0%, #C26025 100%) !important;
}

.t-button--large {
  height: 58px !important;
  font-size: 20px !important;
  letter-spacing: 1px;
}

.t-input--large .t-input__inner {
  height: 58px !important;
  font-size: 18px !important;
  border-radius: 14px !important;
  border-color: #EDD8C8 !important;
  background: #FFFAF6 !important;
  color: #2D1A0E !important;
  padding: 0 18px !important;
}

.t-input--large .t-input__inner:focus {
  border-color: #E07B39 !important;
  box-shadow: 0 0 0 3px rgba(224, 123, 57, 0.15) !important;
}

.t-select-input--large .t-input__inner {
  height: 58px !important;
  font-size: 18px !important;
  border-radius: 14px !important;
  border-color: #EDD8C8 !important;
  background: #FFFAF6 !important;
  color: #2D1A0E !important;
}

.t-textarea__inner {
  border-radius: 14px !important;
  border-color: #EDD8C8 !important;
  background: #FFFAF6 !important;
  font-size: 17px !important;
  color: #2D1A0E !important;
}

.t-textarea__inner:focus {
  border-color: #E07B39 !important;
  box-shadow: 0 0 0 3px rgba(224, 123, 57, 0.15) !important;
}
</style>
