import { onUnmounted, type Ref, ref, watch } from "vue";

interface Cursor {
    azimuth: number;
    elevation: number;
}

export default function useJoystick(
    cursor: Ref<Cursor>,
    emit: (event: "moveCursor", cursor: Cursor) => void,
) {
    const isDragging = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const currentX = ref(0);
    const currentY = ref(0);
    const internalAzimuth = ref(cursor.value.azimuth);
    const internalElevation = ref(cursor.value.elevation);
    let animationFrameId: number | null = null;

    watch(cursor, (newCursor) => {
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
        internalAzimuth.value = cursor.value.azimuth;
        internalElevation.value = cursor.value.elevation;

        startAnimation();
    };

    const onMouseMove = (event: any) => {
        if (!isDragging.value) return;
        const { clientX, clientY } = getClientXY(event.evt);
        currentX.value = clientX;
        currentY.value = clientY;
        emit("moveCursor", calcNewCursor(clientX, clientY));
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

        const newAzimuth = internalAzimuth.value - azimuthChange;
        const newElevation = internalElevation.value - elevationChange;

        return {
            azimuth: newAzimuth,
            elevation: newElevation,
        };
    };

    const startAnimation = () => {
        if (animationFrameId === null) {
            const animate = () => {
                if (isDragging.value) {
                    emit(
                        "moveCursor",
                        calcNewCursor(currentX.value, currentY.value),
                    );
                    animationFrameId = requestAnimationFrame(animate);
                } else {
                    animationFrameId && cancelAnimationFrame(animationFrameId);
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

    return {
        onMouseDown,
        onMouseMove,
        onMouseUp,
    };
}
