export async function createThumbnail(fileEntry, maxWidth = 200, maxHeight = 200) {
    try {
      // 1. Get the actual File from the file handle
      const file = await fileEntry.getFile();
  
      // 2. Create a temporary object URL for the File
      const blobURL = URL.createObjectURL(file);
  
      // 3. Create an Image object and set its source to the blob URL
      const img = new Image();
      img.src = blobURL;
  
      // 4. Wait for the image to load
      await img.decode();
  
      // 5. Create a canvas to draw the thumbnail
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // 6. Compute the new dimensions to maintain aspect ratio
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
      }
  
      canvas.width = width;
      canvas.height = height;
  
      // 7. Draw the image into the canvas at the new size
      ctx.drawImage(img, 0, 0, width, height);
  
      // 8. Convert the canvas to a Data URL (JPEG at 70% quality)
      const thumbnailDataURL = canvas.toDataURL('image/jpeg', 0.7);
  
      // 9. Clean up the temporary URL
      URL.revokeObjectURL(blobURL);
  
      return thumbnailDataURL;
    } catch (error) {
      console.error('[createThumbnail] Error creating thumbnail:', error);
      return null;
    }
  }
  