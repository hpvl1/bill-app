<script setup>
import { ref, inject } from 'vue';
import Bill from '../components/Bill.vue';

let filterMenu = ref(null);

const { billModal, toggleModal } = inject('billModal');

const billData  = inject('billData');

function toggleFilterMenu() {
  filterMenu.value = !filterMenu.value;
}
</script>

<template>
  <div class="home container">
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Bills</h1>
        <span>There are 4 total bill</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status</span>
          <img src="../assets/img/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li>Draft</li>
            <li>Pending</li>
            <li>Paid</li>
            <li>Clear Filter</li>
          </ul>
        </div>
        <div @click="toggleModal" class="button flex">
          <div class="inner-button flex">
            <img src="../assets/img/icon-plus.svg" alt="" />
          </div>
          <span>New Bill</span>
        </div>
      </div>
    </div>
    <!-- Bills -->
    <div>
      <Bill v-for="(bill, index) in billData" :bill="bill" :key="index" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  color: #fff;
  .header {
    margin-bottom: 65px;
    .left,
    .right {
      flex: 1;
    }
    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;
        span {
          font-size: 12px;
        }
      }
      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }
        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
