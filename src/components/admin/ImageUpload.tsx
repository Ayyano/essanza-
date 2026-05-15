'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (images.length >= maxImages) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const { data, error } = await supabaseAdmin.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (error) throw error;
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('products')
        .getPublicUrl(fileName);
      onChange([...images, publicUrl]);
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(false);
    }
  }, [images, onChange, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) uploadFile(file);
  }, [uploadFile]);

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [uploadFile]);

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group w-24 h-24 rounded-lg overflow-hidden border border-brand-200 bg-soft-beige"
          >
            <img
              src={url}
              alt={`Product ${i + 1}`}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = ''; }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
        {images.length < maxImages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors',
              uploading ? 'border-muted-gold bg-muted-gold/5' : 'border-brand-300 hover:border-muted-gold hover:bg-muted-gold/5'
            )}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 text-muted-gold animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-[10px] text-gray-400 text-center leading-tight px-1">Upload</span>
              </>
            )}
          </motion.div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleSelect}
      />
      <p className="text-xs text-gray-400">Drop images or click to upload. Max {maxImages} images (5MB each).</p>
    </div>
  );
}
