import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type Reminder } from '@/types';
import { WEEK_DAYS } from '@/constants';
import { Camera, User, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const initialFormData = {
  id: uuidv4(),
  title: '',
  photo: '',
  enabled: true,
  earlyReminder: 0,
  schedule: WEEK_DAYS.map((day) => ({
    day: day,
    note: '',
    enabled: true,
  })),
};

export const ReminderForm = () => {
  const [formData, setFormData] = useState<Reminder>(initialFormData);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size >= 1024 * 1024) {
        alert('The photo is too big');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result;
        if (res && typeof res === 'string') {
          setFormData({ ...formData, photo: res });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className='flex flex-col gap-3'>
      {/* Photo */}
      <div className='flex'>
        <div className='relative'>
          <input
            ref={photoRef}
            type='file'
            accept='image/png, image/jpeg'
            hidden
            onChange={handlePhotoChange}
          />
          {formData.photo && (
            <button
              type='button'
              onClick={() => {
                setFormData({ ...formData, photo: '' });
                if (photoRef.current) {
                  photoRef.current.value = '';
                }
              }}
              className='absolute -top-1 -right-1 z-10 bg-destructive text-white rounded-full p-1 shadow-md hover:scale-110 active:scale-95 transition-all'
              title='Remove photo'
            >
              <X size={12} />
            </button>
          )}
          <div
            className='relative w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border hover:border-primary cursor-pointer overflow-hidden group'
            onClick={() => photoRef.current?.click()}
          >
            {formData.photo ? (
              <>
                <img
                  width={94}
                  height={94}
                  src={formData.photo}
                  alt='user'
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <Camera className='w-6 h-6 text-white' />
                </div>
              </>
            ) : (
              <div className='w-full h-full flex flex-col items-center justify-center text-muted-foreground'>
                <User className='w-8 h-8 mb-1' />
                <span className='text-[10px] font-bold uppercase'>Photo</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Title */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='title'>Name</Label>
        <Input
          type='text'
          id='title'
          placeholder='Enter child name'
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.currentTarget.value });
          }}
        />
      </div>
    </form>
  );
};
