'use client';

interface UploadButtonProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

export default function UploadButton({ icon, title, description, onClick, color }: UploadButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} p-4 rounded-xl hover:shadow-md transition-all text-white aspect-square flex flex-col items-center justify-center space-y-2`}
    >
      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-white/80 text-xs leading-tight">{description}</p>
      </div>
    </button>
  );
}