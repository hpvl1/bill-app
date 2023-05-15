<script setup>
import { reactive, watch, ref, inject } from 'vue';
import { uid } from 'uid';
import db from '../firebase/index.js';
import { addDoc, collection } from 'firebase/firestore';

import Loading from './Loading.vue';

const emit = defineEmits(['closeBill', 'closeModal']);

const { toggleCloseModal } = inject('closeModal');

const form = reactive({
  billerAddress: null,
  billerCity: null,
  billerZipCode: null,
  billerCountry: null,
  clientName: null,
  clientEmail: null,
  clientAddress: null,
  clientCity: null,
  clientZipCode: null,
  clientCountry: null,
  billDateUnix: null,
  billDate: null,
  paymentTerms: null,
  paymentDateUnix: null,
  paymentDate: null,
  productDescription: null,
  billPending: null,
  billDraft: null,
  billItemList: [],
  billTotal: 0,
  dateOptions: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
});

let loading = ref(null);
let billWrap = ref(false);

form.billDateUnix = Date.now();
form.billDate = new Date(form.billDateUnix).toLocaleDateString('en-GB', form.dateOptions);

function onDeleteBillItem(id) {
  form.billItemList = form.billItemList.filter((item) => item.id !== id);
}

function closeBillModal() {
  emit('closeBill');
}

function checkClick(e) {
  if (e.target === billWrap.value) {
    toggleCloseModal();
  }
}

function addNewBillItem() {
  form.billItemList.push({
    id: uid(),
    itemName: '',
    quantity: '',
    price: 0,
    total: 0,
  });
}

function publishBill() {
  form.billPending = true;
}

function saveDraft() {
  form.billDraft = true;
}

function calcBillTotal() {
  form.billTotal = 0;
  form.billItemList.forEach((item) => {
    form.billTotal += item.total;
  });
}

async function uploadBill() {
  if (form.billItemList.length <= 0) {
    alert('No items to upload');
    return;
  }

  loading.value = true;

  calcBillTotal();

  await addDoc(collection(db, 'bills'), {
    billId: uid(6),
    billerAddress: form.billerAddress,
    billerCity: form.billerCity,
    billerZipCode: form.billerZipCode,
    billerCountry: form.billerCountry,
    clientName: form.clientName,
    clientEmail: form.clientEmail,
    clientAddress: form.clientAddress,
    clientCity: form.clientCity,
    clientZipCode: form.clientZipCode,
    clientCountry: form.clientCountry,
    billDateUnix: form.billDateUnix,
    billDate: form.billDate,
    paymentTerms: form.paymentTerms,
    paymentDateUnix: form.paymentDateUnix,
    paymentDate: form.paymentDate,
    productDescription: form.productDescription,
    billPending: form.billPending,
    billDraft: form.billDraft,
    billItemList: form.billItemList,
    billTotal: form.billTotal,
  });

  loading.value = false;

  closeBillModal();
}

function submitForm() {
  uploadBill();
}

watch(
  () => form.paymentTerms,
  () => {
    const futureDate = new Date();
    form.paymentDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(form.paymentTerms));
    form.paymentDate = new Date(form.paymentDateUnix).toLocaleDateString('en-GB', form.dateOptions);
  },
);
</script>

<template>
  <div @click="checkClick" ref="billWrap" class="bill-wrap flex flex-column">
    <form @submit.prevent="submitForm" class="bill-content">
      <Loading v-show="loading" />
      <h1>New Bill</h1>
      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerAddress">Street Address</label>
          <input v-model.trim="form.billerAddress" type="text" id="billerAddress" required />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input v-model.trim="form.billerCity" type="text" id="billerCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input v-model.trim="form.billerZipCode" type="text" id="billerZipCode" required />
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input v-model.trim="form.billerCountry" type="text" id="billerCountry" required />
          </div>
        </div>
      </div>
      <!-- Bill to -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input v-model.trim="form.clientName" type="text" id="clientName" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input v-model.trim="form.clientEmail" type="text" id="clientEmail" required />
        </div>
        <div class="input flex flex-column">
          <label for="clientAddress">Street Address</label>
          <input v-model.trim="form.clientAddress" type="text" id="clientAddress" required />
        </div>

        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input v-model.trim="form.clientCity" type="text" id="clientCity" required />
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input v-model.trim="form.clientZipCode" type="text" id="clientZipCode" required />
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input v-model.trim="form.clientCountry" type="text" id="clientCountry" required />
          </div>
        </div>
      </div>
      <!-- Bill details -->
      <div class="bill-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="BillDate">Bill Date</label>
            <input v-model="form.billDate" type="text" id="BillDate" disabled />
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due</label>
            <input v-model="form.paymentDate" type="text" id="paymentDate" disabled />
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select v-model="form.paymentTerms" id="paymentTerms" required>
            <option value="30">Net 30 Days</option>
            <option value="60">Net 60 Days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input
            v-model.trim="form.productDescription"
            type="text"
            id="productDescription"
            required
          />
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="quantity">quantity</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr class="table-items flex" v-for="item in form.billItemList" :key="item.id">
              <td class="item-name"><input type="text" v-model.trim="item.itemName" /></td>
              <td class="quantity"><input type="text" v-model.trim="item.quantity" /></td>
              <td class="price"><input type="text" v-model.trim="item.price" /></td>
              <td class="total flex">${{ (item.total = item.quantity * item.price) }}</td>
              <img @click="onDeleteBillItem(item.id)" src="../assets//img/icon-delete.svg" alt="" />
            </tr>
          </table>
          <div @click="addNewBillItem" class="flex button">
            <img src="../assets/img/icon-plus.svg" alt="" />
            Add New Item
          </div>
        </div>
      </div>
      <!-- Save/Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeBillModal" class="red">Cancel</button>
        </div>
        <div class="right flex">
          <button type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
          <button type="submit" @click="publishBill" class="purple">Create Bill</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.bill-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .bill-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }

    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bull To // Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }
    // Bill Work
    .bill-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
      .work-items {
        .item-list {
          width: 100%;
          // Item Table Style
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }
            .quantity {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }
          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 10px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
