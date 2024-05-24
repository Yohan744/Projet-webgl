import { reactive } from 'vue';

const state = reactive({
    videoReady: false,
    videoLoading: false,
    videoElement: null,
});

export const useVideoManager = () => {
    const preloadVideo = () => {
        if (state.videoLoading || state.videoReady) return;

        const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
        const videoName = import.meta.env.VITE_APP_VIDEO_NAME;

        state.videoLoading = true;
        const video = document.createElement('video');
        video.src = `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/${videoName}`;

        video.addEventListener('canplaythrough', () => {
            state.videoReady = true;
            state.videoLoading = false;
        });
        video.load();
        state.videoElement = video;
    };

    return {
        state,
        preloadVideo,
    };
};
