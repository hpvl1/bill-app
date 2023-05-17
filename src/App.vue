<script setup>
import { ref, provide, reactive, computed } from 'vue';

import db from './firebase';
import { collection, getDocs } from 'firebase/firestore';

import Navigation from './components/Navigation.vue';
import BillModal from './components/BillModal.vue';
import CloseModal from './components/CloseModal.vue';

let mobile = ref(null);
let billModal = ref(false);
let closeModal = ref(false);
let billsLoaded = ref(null);

const state = reactive({
  billData: [],
});

checkScreenSize();
window.addEventListener('resize', checkScreenSize);

function checkScreenSize() {
  const windowWidth = window.innerWidth;

  if (windowWidth <= 750) {
    mobile.value = true;
    return;
  }
  mobile.value = false;
}

async function getBillData() {
  try {
    const querySnapshot = await getDocs(collection(db, 'bills'));
    querySnapshot.forEach((doc) => {
      if (!state.billData.some((bill) => bill.docId === doc.id)) {
        const data = {
          docId: doc.id,
          billId: doc.data().billId,
          billerAddress: doc.data().billerAddress,
          billerCity: doc.data().billerCity,
          billerZipCode: doc.data().billerZipCode,
          billerCountry: doc.data().billerCountry,
          clientName: doc.data().clientName,
          clientEmail: doc.data().clientEmail,
          clientAddress: doc.data().clientAddress,
          clientCity: doc.data().clientCity,
          clientZipCode: doc.data().clientZipCode,
          clientCountry: doc.data().clientCountry,
          billDateUnix: doc.data().billDateUnix,
          billDate: doc.data().billDate,
          paymentTerms: doc.data().paymentTerms,
          paymentDateUnix: doc.data().paymentDateUnix,
          paymentDate: doc.data().paymentDate,
          productDescription: doc.data().productDescription,
          billItemList: doc.data().billItemList,
          billTotal: doc.data().billTotal,
          billPending: doc.data().billPending,
          billDraft: doc.data().billDraft,
          billPaid: doc.data().billPaid,
        };
        state.billData.push(data);
      }
    });
    billsLoaded.value = true;
    return state.billData;
  } catch (e) {
    console.error(e);
  }
}

getBillData();

function toggleModal() {
  billModal.value = !billModal.value;
}

function toggleCloseModal() {
  closeModal.value = !closeModal.value;
}

provide(
  'billData',
  computed(() => state.billData),
);

provide('closeModal', {
  closeModal,
  toggleCloseModal,
});

provide('billModal', {
  billModal,
  toggleModal,
});
</script>

<template>
  <div v-if="billsLoaded">
    <div v-if="!mobile" class="app flex flex-column">
      <Navigation />
      <div class="app-content flex flex-column">
        <CloseModal @close-modal="toggleCloseModal" @close-bill="toggleModal" v-if="closeModal" />
        <Transition name="billModal">
          <BillModal @close-bill="toggleModal" v-if="billModal" />
        </Transition>
        <router-view />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry, this app is not supported on Mobile Devices</h2>
      <p>To use this app, please use a computer or Tablet</p>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.app {
  background-color: #141625;
  min-height: 100vh;
  @media (min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  p {
    margin-top: 16px;
  }
}

// anim Bill Modal
.billModal-enter-active,
.billModal-leave-active {
  transition: 0.8s ease all;
}

.billModal-enter-from,
.billModal-leave-to {
  transform: translateX(-700px);
}

button,
.button {
  cursor: pointer;
  padding: 16px 24px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}
.dark-purple {
  background-color: #252945;
}
.red {
  background-color: #ec5757;
}
.purple {
  background-color: #7c5dfa;
}
.green {
  background-color: #33d69f;
}
.orange {
  background-color: #ff8f00;
}
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;
  @media (min-width: 900px) {
    padding-top: 72px;
  }
}
.nav-link {
  text-decoration: none;
  color: initial;
}
.status-button {
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}
.paid {
  &::before {
    background-color: #33d69f;
  }
  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}
.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}
.draft {
  &::before {
    background-color: #dfe3fa;
  }
  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}
</style>
