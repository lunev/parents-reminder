import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<string> => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 512,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedBlob);
    });
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};
