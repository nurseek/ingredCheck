import { ref } from 'vue';

export function useImageUpload() {
    const selectedImage = ref(null);

    const processFile = (file) => {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Please select a valid image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                selectedImage.value = e.target.result;
                resolve(e.target.result);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await processFile(file);
        }
    };

    const handleDrop = async (event) => {
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await processFile(file);
        }
    };

    const clearImage = () => {
        selectedImage.value = null;
    };

    return {
        selectedImage,
        processFile,
        handleFileSelect,
        handleDrop,
        clearImage
    };
} 