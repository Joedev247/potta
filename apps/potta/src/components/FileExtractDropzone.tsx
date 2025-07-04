import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from 'react';

interface FileExtractDropzoneProps {
  onExtract: (file: File) => Promise<void>;
  extracting: boolean;
  children: ReactNode;
  onDummyExtract?: () => void;
}

const FileExtractDropzone: React.FC<FileExtractDropzoneProps> = ({
  onExtract,
  extracting,
  children,
  onDummyExtract,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);
  const dragLeaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Global drag and drop handlers with drag counter and debounce
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragLeaveTimeout.current) {
      clearTimeout(dragLeaveTimeout.current);
      dragLeaveTimeout.current = null;
    }
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      // Debounce hiding the overlay to prevent flicker
      if (dragLeaveTimeout.current) clearTimeout(dragLeaveTimeout.current);
      dragLeaveTimeout.current = setTimeout(() => {
        setDragActive(false);
        dragCounter.current = 0;
      }, 100);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragActive(false);
      if (dragLeaveTimeout.current) {
        clearTimeout(dragLeaveTimeout.current);
        dragLeaveTimeout.current = null;
      }
      if (
        e.dataTransfer &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        if (onDummyExtract) onDummyExtract();
        onExtract(e.dataTransfer.files[0]);
      }
    },
    [onExtract, onDummyExtract]
  );

  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
      if (dragLeaveTimeout.current) clearTimeout(dragLeaveTimeout.current);
    };
  }, [handleDragOver, handleDragLeave, handleDrop]);

  return (
    <div className="relative">
      <div
        className={
          dragActive || extracting
            ? 'pointer-events-none filter blur-sm transition duration-200'
            : 'transition duration-200'
        }
      >
        {children}
      </div>
      {(dragActive || extracting) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-20">
          <div className="flex flex-col items-center">
            {extracting ? (
              <>
                <svg
                  className="animate-spin h-8 w-8 text-green-600 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <span className="text-green-700 text-2xl font-extrabold">
                  Extracting invoice data...
                </span>
              </>
            ) : (
              <span className="text-green-700 text-3xl font-extrabold">
                Drop your invoice file
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExtractDropzone;
