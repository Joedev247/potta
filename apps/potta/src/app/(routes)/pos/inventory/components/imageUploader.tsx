'use client'
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, Control } from "react-hook-form";
import { ProductPayload } from "../_utils/validation";

// Define a type that restricts the name prop to only valid keys of ProductPayload
type ProductPayloadKey = keyof ProductPayload;

interface ImageUploaderProps {
  control: Control<ProductPayload>;
  name?: ProductPayloadKey;
}

// Create a global variable to store the selected file
// We need to use a global variable because the component may be re-rendered
let _selectedImageFile: File | null = null;

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  control, 
  name = "image"
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  // This useEffect ensures the global variable is cleared when the component unmounts
  useEffect(() => {
    return () => {
      _selectedImageFile = null;
    };
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const onDrop = useCallback((acceptedFiles: File[]) => {
          if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            
            // Create a preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            
            // Store the file reference in the global variable
            _selectedImageFile = file;
            
            // Store a temporary value in the form
            onChange(`__file__:${objectUrl}`);
            
            console.log('File selected in ImageUploader:', file.name, file.type, file.size);
            console.log('_selectedImageFile after selection:', _selectedImageFile);
          }
        }, [onChange]);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
          onDrop,
          accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
          },
          maxSize: 5242880, // 5MB
          maxFiles: 1
        });

        // Clean up preview URL when component unmounts
        useEffect(() => {
          return () => {
            if (preview) {
              URL.revokeObjectURL(preview);
            }
          };
        }, [preview]);

        // Helper function to ensure we have a valid string for the src attribute
        const getImageSrc = (): string | undefined => {
          if (preview) return preview;
          if (typeof value === 'string' && !value.startsWith('__file__:')) return value;
          if (typeof value === 'string' && value.startsWith('__file__:')) {
            return value.substring(8); // Remove the __file__: prefix to get the object URL
          }
          return undefined;
        };

        const imageSrc = getImageSrc();

        return (
          <div className="w-full mt-5 drop border-dashed border-2 h-[20vh] relative">
            <div
              className="w-full h-full flex justify-center items-center rounded cursor-pointer"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              
              {imageSrc ? (
                <div className="h-full w-full flex items-center justify-center">
                  <img 
                    src={imageSrc}
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain p-2" 
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="text-center">
                    <center><img src="/icons/dropzone.svg" className="h-16 w-16" alt="" /></center><br />
                    <p className="text-green-400 -mt-1">Max 5MB</p>
                    {isDragActive ? (
                      <p>Drop the image here ...</p>
                    ) : (
                      <p>or Drag and Drop here</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default ImageUploader;

// Helper function to get the selected file from anywhere in the application
export const getSelectedImageFile = (): File | null => {
  console.log('getSelectedImageFile called, current value:', _selectedImageFile);
  return _selectedImageFile;
};

// Helper function to clear the selected file
export const clearSelectedImageFile = (): void => {
  console.log('clearSelectedImageFile called');
  _selectedImageFile = null;
};