import React, { useRef } from 'react';

interface UploadButtonProps {
  icon: React.ReactNode;
  onSelect: (file: File | null) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  disabled?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  icon,
  onSelect,
  onChange,
  onClick,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onSelect(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onChange) onChange(event);
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 bg-transparent rounded-lg relative ${
        disabled
          ? 'bg-gray-300 cursor-not-allowed pointer-events-none'
          : 'cursor-pointer'
      } text-black/60 hover:text-black`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {icon}
    </div>
  );
};

export default UploadButton;
