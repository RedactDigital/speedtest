<script setup lang="ts">
  import { computed, ref } from 'vue';

  const testTime = 20;
  const currentTime = ref(new Date());
  const startTime = ref(new Date());
  const receivedLength = ref(0);
  const timeElapsed = computed(() => (Number(currentTime.value) - Number(startTime.value)) / 1000);
  const averageSpeed = computed(
    () => Number(((8 / 1000000) * (receivedLength.value / timeElapsed.value)).toFixed(2)) || 0,
  );

  const startTest = async (): Promise<void> => {
    /**
     * Reset startTime
     */
    startTime.value = new Date();

    let loop = true;
    while (loop) loop = await calculateSpeed();
  };

  const downloadFile = async (): Promise<ReadableStreamDefaultReader> => {
    const url =
      'https://dev.cdn.vpmsolutions.com/users/user-6/7543335c-006e-47a7-bf27-221a9dc198cb.mp4';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    if (response.body === null) throw new Error('Response body is null');

    return response.body.getReader();
  };

  const calculateSpeed = async (): Promise<boolean> => {
    const reader = await downloadFile();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value } = await reader.read();

    // eslint-disable-next-line no-constant-condition
    if (value && value.length) receivedLength.value += value.length;

    currentTime.value = new Date();
    // drawChart(speed);
    if (timeElapsed.value > testTime) return false;

    return true;
  };
</script>

<template>
  <div>
    <h1 class="text-6xl">Speedtest</h1>
    <!-- Add margin -->
    <div class="m-10 text-red">
      <span id="downloadSpeedLabel">Average Download Speed:</span>
      <div
        id="downloadSpeed"
        class="badge solid info square sm ml-5"
      >
        {{ averageSpeed }} Mbps
      </div>
    </div>
    <button
      class="btn outline info md"
      @click="startTest"
    >
      Run Test
    </button>
  </div>
</template>

<style scoped></style>
