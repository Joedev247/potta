'use client';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, Control } from 'react-hook-form';
import { ProductPayload } from '../_utils/validation';
import Image from 'next/image';

// Define a type that restricts the name prop to only valid keys of ProductPayload
type ProductPayloadKey = keyof ProductPayload;

interface ImageUploaderProps {
  control: Control<ProductPayload>;
  name?: ProductPayloadKey;
}

// Create a global variable to store the selected file
let _selectedImageFile: File | null = null;

interface DropzoneContentProps {
  value: string | number | boolean | undefined;
  onChange: (value: string) => void;
}

// Separate component for the dropzone content
const DropzoneContent: React.FC<DropzoneContentProps> = ({
  value,
  onChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Create a preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Store the file reference in the global variable
        _selectedImageFile = file;

        // Store a temporary value in the form
        onChange(`__file__:${objectUrl}`);

        console.log(
          'File selected in ImageUploader:',
          file.name,
          file.type,
          file.size
        );
        console.log('_selectedImageFile after selection:', _selectedImageFile);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
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
    if (typeof value === 'string' && !value.startsWith('__file__:'))
      return value;
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
            <Image
              src={imageSrc}
              alt="Preview"
              width={200}
              height={200}
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="text-center">
              <center>
                <Image
                  src="/icons/dropzone.svg"
                  alt="Dropzone icon"
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
              </center>
              <br />
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
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  control,
  name = 'image',
}) => {
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
      render={({ field: { onChange, value } }) => (
        <DropzoneContent value={value} onChange={onChange} />
      )}
    />
  );
};

export default ImageUploader;

// Helper function to get the selected file from anywhere in the application
export const getSelectedImageFile = (): File | null => {
  console.log(
    'getSelectedImageFile called, current value:',
    _selectedImageFile
  );
  return _selectedImageFile;
};

// Helper function to clear the selected file
export const clearSelectedImageFile = (): void => {
  console.log('clearSelectedImageFile called');
  _selectedImageFile = null;
};
