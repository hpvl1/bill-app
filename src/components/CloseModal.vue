<script setup>

const emit = defineEmits(['close-bill', 'close-modal']);

function closeModal() {
    emit('close-modal');
}

function closeBill() {
    emit('close-modal');
    emit('close-bill');
}

</script>

<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Are you sure you want to close modal? Your changes will not be saved.</p>
      <div class="actions flex">
        <button class="purple" @click="closeModal">Return</button>
        <button class="red" @click="closeBill">Close</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }
    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
