<script setup lang="ts">
import { ref } from 'vue'

const dialogRef = ref<HTMLDialogElement>()

const openDialog = () => {
  dialogRef.value?.showModal()
}

const closeDialog = () => {
  dialogRef.value?.close()
}
</script>

<template>
  <div>
    <button
      class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:from-purple-400 hover:to-pink-400"
      @click="openDialog"
    >
      Open Dialog
    </button>

    <dialog
      ref="dialogRef"
      class="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl overflow-visible"
      @click.self="closeDialog"
    >
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-white">
            Dialog with Tooltips
          </h2>
          <p class="text-sm text-slate-400">
            Hover over the buttons below to see tooltips in
            action.
          </p>
        </div>

        <div class="space-y-3">
          <button
            v-tooltip="'Save your changes'"
            class="w-full rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30"
          >
            Save
          </button>
          <button
            v-tooltip="{
              text: 'Undo the last action',
              placement: 'right',
            }"
            class="w-full rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/30"
          >
            Undo
          </button>
          <button
            v-tooltip="{
              text: 'Discard changes and close',
              placement: 'bottom',
            }"
            class="w-full rounded-lg bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/30"
          >
            Cancel
          </button>
        </div>

        <div class="border-t border-slate-700 pt-4">
          <button
            class="rounded-lg bg-slate-700 px-3 py-1 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
            @click="closeDialog"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
dialog {
  margin: auto;
  inset: 0;
  overflow: visible;
  max-width: fit-content;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
