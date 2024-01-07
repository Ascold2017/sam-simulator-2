import { onMounted, onUnmounted } from "vue"

export const useEventListener = (eventName: string, handler: (e: Event) => void) => {
    const keys = eventName.split('.');
    const symbolKey = keys.filter(k => !['ctrl', 'alt', 'shift'].includes(k))[0];
    function listener(e: KeyboardEvent) {
        const ctrl = keys.includes('ctrl') ?  e.ctrlKey : true;
        const alt = keys.includes('alt') ? e.altKey : true;
        const shift = keys.includes('shift') ? e.shiftKey : true;
        const key = symbolKey ? e.key === symbolKey : true;
        if (ctrl && alt && shift && key) {
            handler(e);
        } 
    }
    onMounted(() => {
        document.addEventListener('keydown',listener);
    
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', listener)
    });
}