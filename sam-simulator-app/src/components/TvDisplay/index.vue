<template>
  <v-stage v-if="canvasSize" :config="stageConfig" @mousedown.native="onMouseDown" @mousemove.native="onMouseMove"
    @mouseup.native="onMouseUp" @mouseleave.native="onMouseUp" @touchstart.native="onMouseDown" @touchmove.native="onMouseMove"
    @touchend.native="onMouseUp">
    <TvWireframe :canvas-size="canvasSize" :cursor="cursor"/>
  </v-stage>
</template>

<script setup lang="ts">
import TvWireframe from './TvWireframe.vue'
import { computed, ref, defineProps, defineEmits, watch, onUnmounted } from 'vue';

const props = defineProps<{
  cursor: { azimuth: number; elevation: number }
}>();
const emit = defineEmits(['moveCursor']);
let canvasSize = 320;
const stageConfig = computed(() => ({
  width: canvasSize,
  height: canvasSize,
}));

const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const internalAzimuth = ref(props.cursor.azimuth);
const internalElevation = ref(props.cursor.elevation);
let animationFrameId: number | null = null;

watch(() => props.cursor, (newCursor) => {
  internalAzimuth.value = newCursor.azimuth;
  internalElevation.value = newCursor.elevation;
});

const onMouseDown = (event: any) => {
  isDragging.value = true;
  const { clientX, clientY } = getClientXY(event.evt);
  startX.value = clientX;
  startY.value = clientY;
  currentX.value = clientX;
  currentY.value = clientY;
  internalAzimuth.value = props.cursor.azimuth;
  internalElevation.value = props.cursor.elevation;

  startAnimation();
};

const onMouseMove = (event: any) => {
  if (!isDragging.value) return;
  const { clientX, clientY } = getClientXY(event.evt);
  currentX.value = clientX;
  currentY.value = clientY;
  emit('moveCursor', calcNewCursor(clientX, clientY));
};

const onMouseUp = () => {
  isDragging.value = false;
  stopAnimation();
};

const getClientXY = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    return { clientX: event.clientX, clientY: event.clientY };
  } else if (event instanceof TouchEvent) {
    const touch = event.touches[0] || event.changedTouches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return { clientX: 0, clientY: 0 };
};

const calcNewCursor = (clientX: number, clientY: number) => {
  const deltaX = clientX - startX.value;
  const deltaY = clientY - startY.value;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const sensitivity = 0.0001; // Чем меньше значение, тем медленнее изменяются параметры
  const maxDistance = 50; // Максимальная дистанция для максимального изменения

  const factor = Math.min(distance / maxDistance, 1);

  const azimuthChange = deltaX * sensitivity * factor;
  const elevationChange = deltaY * sensitivity * factor;

  const newAzimuth = internalAzimuth.value + azimuthChange;
  const newElevation = internalElevation.value - elevationChange;

  return {
    azimuth: newAzimuth,
    elevation: newElevation
  };
};

const startAnimation = () => {
  if (animationFrameId === null) {
    const animate = () => {
      if (isDragging.value) {
        emit('moveCursor', calcNewCursor(currentX.value, currentY.value));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
    animationFrameId = requestAnimationFrame(animate);
  }
};

const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onUnmounted(() => {
  stopAnimation();
});
</script>
