import { useRef } from "react";
import { Camera, User, X } from "lucide-react";
import { compressImage } from "@/lib";

interface PhotoFieldProps {
  photo: string;
  onChange: (value: string) => void;
}

export const PhotoFied: React.FC<PhotoFieldProps> = ({ photo, onChange }) => {
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const base64Photo = await compressImage(file);
        if (base64Photo) {
          onChange(base64Photo);
        }
      } catch (error) {
        console.error("Compression failed:", error);
        // Show toast Error?
      } finally {
        if (photoRef.current) photoRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = () => {
    onChange("");
    if (photoRef.current) {
      photoRef.current.value = "";
    }
  };

  return (
    <div className="flex">
      <div className="relative">
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
        {photo && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute -top-1 -right-1 z-10 bg-destructive text-background rounded-full p-1 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Remove photo"
          >
            <X size={12} />
          </button>
        )}
        <div
          className="relative size-20 rounded-full bg-muted border-2 border-dashed border-border hover:border-primary cursor-pointer overflow-hidden group"
          onClick={() => photoRef.current?.click()}
        >
          {photo ? (
            <>
              <img
                width={94}
                height={94}
                src={photo}
                alt="user"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <User className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold uppercase">Photo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
