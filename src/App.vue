<script setup lang="ts">
  import { computed, ref } from 'vue';
  import fileDownload from '@/utils/fileDownload';

  const testTime = computed(() => (averageSpeed.value > 100 ? 7 : 10));
  const progress = computed(() => (timeElapsed.value * 100) / testTime.value);

  const runTest = ref(false);
  const currentTime = ref(new Date());
  const startTime = ref(new Date());
  const receivedLength = ref(0);
  const timeElapsed = computed(() => (Number(currentTime.value) - Number(startTime.value)) / 1000);
  const averageSpeed = computed(
    () => Number(((8 / 1000000) * (receivedLength.value / timeElapsed.value)).toFixed(2)) || 0,
  );
  const url = ref('https://cdn.redact.digital/speedtest-sample-files/1G-download');

  const startTest = async (): Promise<void> => {
    /**
     * Reset the received length and start time
     */
    startTime.value = new Date();
    receivedLength.value = 0;
    runTest.value = true;

    while (runTest.value) await calculateSpeed();
  };

  const calculateSpeed = async (): Promise<void> => {
    const reader = await fileDownload(url.value);
    while (runTest.value) {
      /**
       * If the test is running for more than the test time, break the loop
       * and stop the test. This needs to be done before reading the stream
       * or we will keep reading the stream even after the test is canceled
       */
      if (timeElapsed.value >= testTime.value) runTest.value = false;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { done, value } = await reader.read();

      if (done) break;

      receivedLength.value += value.length || 0;
      currentTime.value = new Date();
    }

    /**
     * If the test is canceled, cancel the reader and break the loop
     * if we don't break the loop, the reader will keep reading the stream
     */
    await reader.cancel();
  };
</script>

<template>
  <div>
    <img
      src="./assets/logo.png"
      class="w-1/3 mx-auto animate-pulse"
      style="margin-top: -60px; margin-bottom: -60px"
    />
    <h1 class="text-6xl">Speedtest</h1>
    <div class="mt-10 w-3/4 mx-auto">
      <div :class="`grid gap-4 ${progress > 0 ? '' : 'hidden'}`">
        <progress
          class="progress colored info"
          :value="progress"
          max="100"
        />
      </div>
    </div>

    <!-- Meter Container -->
    <div class="my-10 mx-auto w-80 h-80 border-2 rounded-full relative">
      <!-- Center -->
      <div class="absolute top-1/2 left-1/2">
        <!-- Scale only using 180 degrees-->
        <hr
          :class="`w-32 absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 border-2 ${
            averageSpeed > 100
              ? 'animate-pulse border-red-500'
              : averageSpeed > 50
              ? 'border-red-500'
              : averageSpeed > 25
              ? 'border-yellow-500'
              : 'border-green-500'
          } origin-right transform-gpu duration-500`"
          :style="`transform: rotate(${averageSpeed > 180 ? 180 : (averageSpeed / 100) * 180}deg);`"
        />
      </div>
      <!-- Speed -->
      <div class="absolute top-3/4 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2">
        <span class="text-2xl">{{ averageSpeed }} Mbps</span>
      </div>
      <!-- Numbers -->
      <span class="absolute left-1 top-1/2 transform-gpu -translate-y-1/2">0</span>
      <span class="absolute top-12 left-14 transform-gpu -translate-x-1/2">25</span>
      <span class="absolute left-1/2 top-1 transform-gpu -translate-x-1/2">50</span>
      <span class="absolute top-12 right-14 transform-gpu translate-x-1/2">75</span>
      <span class="absolute right-1 top-1/2 transform-gpu -translate-y-1/2">100</span>
    </div>
    <div :class="runTest ? 'cursor-wait' : ''">
      <button
        class="btn outline info md"
        @click="startTest"
        :disabled="runTest"
      >
        Run Test
      </button>
      <button
        class="btn outline warn md ml-5"
        @click="runTest = false"
      >
        Cancel Test
      </button>
      <button
        class="btn outline md ml-5"
        @click="
          runTest = false;
          receivedLength = 0;
          currentTime = new Date();
          startTime = new Date();
        "
      >
        Reset Test
      </button>
    </div>
  </div>
</template>

<style scoped></style>
