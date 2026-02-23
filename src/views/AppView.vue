<template>
    <div class="app-container">
        <!-- Верхняя панель управления -->
        <div class="control-panel" v-if="!isConferenceEnded">
            <div class="room-info">
                {{ roomName }}
            </div>

            <div class="control-buttons">
                <!-- Аудио -->
                <button
                    @click="toggleAudio"
                    class="control-btn"
                    :class="{ active: !isAudioMuted, muted: isAudioMuted }"
                    :title="!isAudioMuted ? 'Выключить микрофон' : 'Включить микрофон'"
                >
                    <span v-if="!isAudioMuted">🎤</span>
                    <span v-else>🔇</span>
                </button>

                <!-- Видео -->
                <button
                    @click="toggleVideo"
                    class="control-btn"
                    :class="{ active: !isVideoMuted, muted: isVideoMuted }"
                    :title="!isVideoMuted ? 'Выключить камеру' : 'Включить камеру'"
                >
                    <span v-if="!isVideoMuted">📹</span>
                    <span v-else>🚫</span>
                </button>

                <template v-if="isInConference">
                    <button
                        @click="toggleRecording"
                        class="control-btn recording-btn"
                        :class="{ active: isRecording }"
                        :title="isRecording ? 'Остановить запись' : 'Начать запись'"
                    >
                        <span v-if="isRecording">📼</span>
                        <span v-else>🎥</span>
                    </button>

                    <!-- Демонстрация экрана -->
                    <button
                        @click="toggleScreenShare"
                        class="control-btn"
                        :class="{ active: isScreenSharing }"
                        :title="isScreenSharing ? 'Остановить демонстрацию' : 'Демонстрация экрана'"
                    >
                        🖥️
                    </button>

                    <!-- Чат -->
                    <button
                        @click="toggleChat"
                        class="control-btn"
                        :class="{ active: isChatOpen }"
                        title="Чат"
                    >
                        💬
                    </button>

                    <!-- Поднять руку -->
                    <button
                        @click="toggleRaiseHand"
                        class="control-btn"
                        :class="{ active: isHandRaised }"
                        title="Поднять руку"
                    >
                        ✋
                    </button>
                </template>

                <!-- Пригласить -->
                <button
                    @click="showInviteModal = true"
                    class="control-btn"
                    title="Пригласить участников"
                >
                    👥
                </button>

                <!-- СТАТИСТИКА -->
                <button
                    @click="toggleStats"
                    class="control-btn"
                    title="Статистика"
                    v-if="isInConference"
                >
                    📊
                </button>

                <!-- Полный экран -->
                <button
                    @click="toggleFullscreen"
                    class="control-btn"
                    :title="isFullscreen ? 'Выйти из полноэкранного режима' : 'Полный экран'"
                >
                    <span v-if="isFullscreen">🗗️</span>
                    <span v-else>🗖</span>
                </button>

                <!-- Завершить конференцию -->
                <button
                    @click="hangup"
                    class="control-btn hangup-btn"
                    title="Завершить конференцию"
                >
                    📞
                </button>
            </div>
        </div>

        <!-- Jitsi контейнер -->
        <div class="jitsi-wrapper" v-if="!isConferenceEnded">
            <JitsiMeet
                ref="jitsiRef"
                :conferenceProxyRoute="conferenceProxyRoute"
                :options="jitsiOptions"
                @ready="onJitsiReady"
                @error="onJitsiError"
                @waitAndGetURIOrGenerateRoomName="waitAndGetURIOrGenerateRoomName"
            />
        </div>

        <!-- Сообщение о завершении -->
        <div v-else class="conference-ended">
            <h2>Конференция завершена</h2>
            <p>Вы покинули конференцию "{{ roomName }}"</p>
            <button @click="rejoinConference" class="rejoin-btn">Присоединиться снова</button>
        </div>

        <!-- Модальное окно приглашения -->
        <div v-if="showInviteModal" class="modal-overlay" @click.self="showInviteModal = false">
            <div class="modal-content">
                <h3>Пригласить участников</h3>
                <p>Ссылка для приглашения:</p>
                <div class="invite-link">
                    <input
                        type="text"
                        :value="inviteLink"
                        readonly
                        ref="inviteLinkInput"
                    />
                    <button @click="copyInviteLink">Копировать</button>
                </div>
                <button @click="showInviteModal = false" class="close-btn">Закрыть</button>
            </div>
        </div>

        <!-- Кастомное окно статистики (если нужно) -->
        <div v-if="showStatsModal" class="modal-overlay" @click.self="showStatsModal = false">
            <div class="modal-content stats-modal">
                <h3>Статистика конференции</h3>
                <div class="stats-content">
                    <div class="stat-item">
                        <span class="stat-label">Комната:</span>
                        <span class="stat-value">{{ roomName }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Участников:</span>
                        <span class="stat-value">{{ participantCount }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Аудио:</span>
                        <span class="stat-value" :class="{ muted: isAudioMuted }">
                            {{ isAudioMuted ? 'Выкл' : 'Вкл' }}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Видео:</span>
                        <span class="stat-value" :class="{ muted: isVideoMuted }">
                            {{ isVideoMuted ? 'Выкл' : 'Вкл' }}
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Демонстрация:</span>
                        <span class="stat-value">{{ isScreenSharing ? 'Да' : 'Нет' }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Запись:</span>
                        <span class="stat-value">{{ isRecording ? 'Идет' : 'Нет' }}</span>
                    </div>
                </div>
                <button @click="showStatsModal = false" class="close-btn">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getRandomCustomWord } from '@/utils/constant-words-utils';

import JitsiMeet from '@/components/JitsiMeet/JitsiMeet.vue';
import type { JitsiAPI } from '@/types/jitsi.declare';

import rivgLogo from '/rivg-big-rounded-icon.png';

// Состояния
const roomName = ref('');
const jitsiRef = ref();
const jitsiApi = ref<JitsiAPI | null>(null);

// Состояния устройств
const isAudioMuted = ref(false);
const isVideoMuted = ref(false);
const isScreenSharing = ref(false);
const isRecording = ref(false);
const isChatOpen = ref(false);
const isHandRaised = ref(false);

// Новые состояния
const isStatsOpen = ref(false);
const showStatsModal = ref(false); // Для кастомной статистики
const participantCount = ref(1); // Можно получать из событий Jitsi

const isFullscreen = ref(false);
const showInviteModal = ref(false);

const isInConference = ref(false);
const isConferenceEnded = ref(false);

// Конфигурация
const conferenceProxyRoute = import.meta.env.RIVG_DOMAIN || 'meet.jit.si';

// Ссылка для приглашения
const inviteLink = computed(() => window.location.href);

// Опции Jitsi - отключаем стандартную панель
const jitsiOptions = computed(() => ({
    roomName: roomName.value,
    defaultLanguage: 'ru',
    width: '100%',
    height: '100%',
    configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        disableProfile: false,
        fileRecordingsEnabled: true,
        liveStreamingEnabled: false,
        localRecording: {
            enabled: true,
            format: 'webm'
        },
        recordingService: {
            enabled: true
        },
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
        requireDisplayName: false,
        enableEmailInStats: false,
    },
    interfaceConfigOverwrite: {
        // Логотипы
        DEFAULT_LOGO_URL: rivgLogo,
        MAIN_LOGO_URL: rivgLogo,
        TOOLBAR_LOGO_URL: rivgLogo,
        MAIN_LOGO_CLICK_URL: '/',
        MAIN_LOGO_TOOLTIP: 'RIVG Video Conference',

        // Отключаем водяные знаки
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        SHOW_BRAND_HORIZONTALLY: false,
        MOBILE_APP_PROMO: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        SHOW_DEEP_LINKING_IMAGE: false,

        // Тексты
        APP_NAME: 'RIVG',
        PROVIDER_NAME: 'RIVG Conference',
        INVITATION_POWERED_BY: false,
        HIDE_INVITE_MORE_HEADER: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,

        // ПОЛНОСТЬЮ СКРЫВАЕМ СТАНДАРТНУЮ ПАНЕЛЬ
        TOOLBAR_BUTTONS: ['settings'],
        CUSTOM_TOOLBAR_BUTTONS: [
            {
                id: 'settings',
                icon: '⚙️', // или используй URL картинки
                tooltip: 'Настройки'
            },
        ],
        INITIAL_TOOLBAR_TIMEOUT: 10000,

        // Настройки видео
        VIDEO_LAYOUT_FIT: 'both',
        DEFAULT_REMOTE_DISPLAY_NAME: 'Участник',
        LOCAL_RECORDING_ENABLED: true,
    },
}));

// Инициализация комнаты
const waitAndGetURIOrGenerateRoomName = async (): Promise<string> => {
    const path = window.location.pathname.replace('/', '');
    if (!path) {
        roomName.value = getRandomCustomWord() + getRandomCustomWord() +
                        getRandomCustomWord() + getRandomCustomWord();
        window.history.replaceState({}, '', '/' + roomName.value);
    } else {
        roomName.value = decodeURI(path);
    }
    return roomName.value;
};

const toggleRecording = () => {
    if (!jitsiApi.value) return;

    if (isRecording.value) {
        jitsiApi.value.executeCommand('stopRecording');
    } else {
        jitsiApi.value.executeCommand('startRecording', {
            mode: 'file' // или 'file', смотря как настроен сервер
        });
    }
};

// Обработчики Jitsi
const onJitsiReady = (api: JitsiAPI) => {
    console.log('Jitsi API готов');
    jitsiApi.value = api;

    // Подписываемся на события
    api.addListener('videoConferenceJoined', () => {
        console.log('Присоединились к конференции');
        isInConference.value = true;
        isConferenceEnded.value = false;
    });

    api.addListener('readyToClose', () => {
        console.log('Конференция завершена');
        isInConference.value = false;
        isConferenceEnded.value = true;
    });

    api.addListener('audioMuteStatusChanged', (data: { muted: boolean }) => {
        console.log('Audio mute changed:', data.muted);
        isAudioMuted.value = data.muted;
    });

    api.addListener('videoMuteStatusChanged', (data: { muted: boolean }) => {
        console.log('Video mute changed:', data.muted);
        isVideoMuted.value = data.muted;
    });

    api.addListener('screenSharingStatusChanged', (data: { on: boolean }) => {
        console.log('Screen sharing changed:', data.on);
        isScreenSharing.value = data.on;
    });

    api.addListener('recordingStatusChanged', (data: { on: boolean }) => {
        console.log('Recording status changed:', data.on);
        isRecording.value = data.on;
    });

    api.addListener('participantJoined', () => {
        participantCount.value++;
    });

    api.addListener('participantLeft', () => {
        participantCount.value = Math.max(1, participantCount.value - 1);
    });

    api.addListener('raiseHandUpdated', (data: unknown) => {
        console.log('Raise hand updated:', data);
    });

    api.addListener('error', (error: unknown) => {
        console.error('Jitsi error:', error);
    });
};

const onJitsiError = (error: Error) => {
    console.error('Ошибка Jitsi:', error);
};

// Методы управления
const toggleAudio = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('toggleAudio');
    }
};

const toggleVideo = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('toggleVideo');
    }
};

const toggleScreenShare = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('toggleShareScreen');
    }
};

const toggleChat = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('toggleChat');
        isChatOpen.value = !isChatOpen.value;
    }
};

const toggleRaiseHand = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('toggleRaiseHand');
        isHandRaised.value = !isHandRaised.value;
    }
};

// СТАТИСТИКА - показываем кастомную статистику
const toggleStats = () => {
    // Используем кастомное модальное окно вместо встроенного
    showStatsModal.value = !showStatsModal.value;
    isStatsOpen.value = showStatsModal.value;

    // Можно также попробовать открыть встроенную статистику
    if (jitsiApi.value && !showStatsModal.value) {
        try {
            jitsiApi.value.executeCommand('toggleStats');
        } catch (e) {
            console.error(e);
        }
    }
};

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        isFullscreen.value = true;
    } else {
        document.exitFullscreen();
        isFullscreen.value = false;
    }
};

const hangup = () => {
    if (jitsiApi.value) {
        jitsiApi.value.executeCommand('hangup');
    }
};

const rejoinConference = () => {
    isConferenceEnded.value = false;
    if (jitsiRef.value) {
        jitsiRef.value.reload();
    }
};

// Копирование ссылки
const inviteLinkInput = ref<HTMLInputElement | null>(null);

const copyInviteLink = () => {
    if (inviteLinkInput.value) {
        inviteLinkInput.value.select();
        navigator.clipboard.writeText(inviteLink.value);
        alert('Ссылка скопирована!');
    }
};

onMounted(() => {
    waitAndGetURIOrGenerateRoomName();

    document.addEventListener('fullscreenchange', () => {
        isFullscreen.value = !!document.fullscreenElement;
    });
});
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #1a1a1a;
}

.control-panel {
    background: rgba(0,0,0,.5);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #404040;
    z-index: 1000;
    color: white;
}

.room-info {
    font-size: 14px;
    color: white;
    font-weight: 600;
    background: #404040;
    border-radius: 16px;

    padding: 4px 12px;
}

.control-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

.control-btn {
    background: #404040;
    border: none;
    color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.2s;
}

.control-btn:hover {
    background: #555;
    transform: scale(1.1);
}

.control-btn.active {
    background: #4CAF50;
}

.control-btn.muted {
    background: #f44336;
}

.control-btn.recording-btn.active {
    background: #f44336;
    animation: pulse 1.5s infinite;
}

.control-btn.hangup-btn {
    background: #f44336;
}

.control-btn.hangup-btn:hover {
    background: #d32f2f;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
    100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
}

.jitsi-wrapper {
    flex: 1;
    min-height: 0;
    width: 100%;
}

.conference-ended {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

.rejoin-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 24px;
    font-size: 16px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: #2d2d2d;
    padding: 24px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    color: white;
}

.stats-modal {
    max-width: 400px;
}

.stats-content {
    margin: 20px 0;
    background: #404040;
    border-radius: 8px;
    padding: 16px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #555;
}

.stat-item:last-child {
    border-bottom: none;
}

.stat-label {
    color: #aaa;
    font-weight: 500;
}

.stat-value {
    color: #fff;
    font-weight: 600;
}

.stat-value.muted {
    color: #f44336;
}

.invite-link {
    display: flex;
    gap: 8px;
    margin: 16px 0;
}

.invite-link input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #404040;
    border-radius: 4px;
    background: #404040;
    color: white;
}

.invite-link button {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.close-btn {
    width: 100%;
    padding: 10px;
    background: #666;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 8px;
}

.close-btn:hover {
    background: #777;
}

:global(.stats-modal) {
  max-width: 100% !important;
  width: min-content !important;

  .stat-item {
    gap: 10px;
  }
}

@media (max-width: 768px) {
    .control-panel {
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }
    .control-buttons {
        gap: 5px;
    }
    .control-btn {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
}
</style>
