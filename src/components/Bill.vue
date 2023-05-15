<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  bill: Object,
});
</script>

<template>
  <router-link class="bill flex" :to="{ name: 'Bill', params: { billId: bill.billId } }">
    <div class="left flex">
      <span class="tracking-number">#{{ bill.billId }}</span>
      <span class="due-date">{{ bill.paymentDate }}</span>
      <span class="person">{{ bill.clientName }}</span>
    </div>
    <div class="right flex">
      <span class="price">${{ bill.billTotal }}</span>
      <div
        class="status-button flex"
        :class="{ paid: bill.billPaid, draft: bill.billDraft, pending: bill.billPending }"
      >
        <span v-if="bill.billPaid">Paid</span>
        <span v-if="bill.billDraft">Draft</span>
        <span v-if="bill.billPending">Pending</span>
      </div>
    </div>
    <div class="icon">
      <img src="../assets/img/icon-arrow-right.svg" alt="" />
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.bill {
  text-decoration: none;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;
  cursor: pointer;

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;
    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
