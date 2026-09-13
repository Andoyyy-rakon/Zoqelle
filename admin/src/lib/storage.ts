import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/product-images/');
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];

    const { error } = await supabase.storage.from('product-images').remove([filePath]);
    if (error) {
      console.error('Delete image error:', error);
    }
  } catch (err) {
    console.error('Invalid image URL for deletion:', err);
  }
}

export function generateUniqueFileName(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${uuidv4()}.${ext}`;
}