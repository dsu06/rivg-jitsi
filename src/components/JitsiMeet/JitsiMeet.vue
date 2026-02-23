<template>
    <div ref="jitsiContainer" style="height: 100%; width: 100%;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, toRefs } from 'vue';

import type { JitsiOptions, JitsiAPI } from '../../types/jitsi.declare';

const props = defineProps<{
  conferenceProxyRoute: string
  options: JitsiOptions,
  waitAndGetURIOrGenerateRoomName?: () => Promise<string>,
  isConferenceEnded?: boolean
}>();

const emit = defineEmits<{
  ready: [api: JitsiAPI],
  error: [error: Error],
  loaded: []
}>();

const { options } = toRefs(props);

const jitsiContainer = ref<HTMLElement | null>(null);
const jitsiApi = ref<JitsiAPI | null>(null);

// Создание Jitsi виджета
const embedJitsiWidget = async () => {
    try {
    // Ждем загрузки скрипта если нужно
        if (!jitsiContainer.value) {
            throw new Error('Container element not found');
        }

        if (!window.JitsiMeetExternalAPI) {
            throw new Error('Jitsi Meet External API not loaded');
        }

        // Удаляем старый экземпляр если есть
        removeJitsiWidget();

        const roomName = props.waitAndGetURIOrGenerateRoomName ? await props.waitAndGetURIOrGenerateRoomName() : options.value.roomName;

        // Подготавливаем опции
        const jitsiOptions: JitsiOptions = {
            ...options.value,
            roomName,
            parentNode: jitsiContainer.value,
        };

        // Создаем новый экземпляр
        jitsiApi.value = new window.JitsiMeetExternalAPI(props.conferenceProxyRoute, jitsiOptions);

        // Генерируем событие готовности
        emit('ready', jitsiApi.value);

    } catch (error) {
        console.error('Failed to embed Jitsi widget:', error);
        emit('error', error instanceof Error ? error : new Error(String(error)));
    }
};

// Удаление виджета
const removeJitsiWidget = () => {
    if (jitsiApi.value) {
        try {
            jitsiApi.value.dispose();
        } catch (error) {
            console.warn('Error disposing Jitsi API:', error);
        }
        jitsiApi.value = null;
    }
};

// Методы для внешнего использования
const executeCommand = (command: string, ...args: unknown[]) => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand(command, ...args);
    }
};

const addEventListener = (event: string, handler: () => void) => {
    if (jitsiApi.value) {
    // Пробуем разные методы, так как API может отличаться
        if (typeof jitsiApi.value.on === 'function') {
            jitsiApi.value.on(event, handler);
        } else if (typeof jitsiApi.value.addEventListener === 'function') {
            jitsiApi.value.addEventListener(event, handler);
        } else if (typeof jitsiApi.value.addListener === 'function') {
            jitsiApi.value.addListener(event, handler);
        }
    }
};

const removeEventListener = (event: string, handler: () => void) => {
    if (jitsiApi.value) {
        if (typeof jitsiApi.value.off === 'function') {
            jitsiApi.value.off(event, handler);
        } else if (typeof jitsiApi.value.removeEventListener === 'function') {
            jitsiApi.value.removeEventListener(event, handler);
        } else if (typeof jitsiApi.value.removeListener === 'function') {
            jitsiApi.value.removeListener(event, handler);
        }
    }
};

// Lifecycle
onMounted(async () => {
    await embedJitsiWidget();
});

onBeforeUnmount(() => {
    removeJitsiWidget();
});

// Реинициализация при изменении опций
watch([props.conferenceProxyRoute, options], async () => {
    await embedJitsiWidget();
}, { deep: true });

// Экспорт методов для использования через ref
defineExpose({
    api: jitsiApi,
    executeCommand,
    addEventListener,
    removeEventListener,
    reload: embedJitsiWidget
});
</script>
