import { ref, watch, onUnmounted, onMounted, type Ref } from 'vue';

export function useImage(src: Ref<string>) {
  const image = ref<HTMLImageElement | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref<boolean>(true);

  let img: HTMLImageElement;

  const loadImage = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
    });
  };

  const updateImage = async (src: string) => {
    isLoading.value = true;
    try {
      image.value = await loadImage(src);
      error.value = null;
    } catch (e) {
      error.value = 'Ошибка загрузки изображения';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  


  watch(
    src,
    (v) => {
      console.log(v)
      v && updateImage(v);
    }
  );

  onUnmounted(() => {
    // Очистка ресурса изображения, если нужно
    if (img) {
      img.src = '';
    }
  });

  return { image, error, isLoading };
}