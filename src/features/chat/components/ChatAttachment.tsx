import { FileText, Image, FileSpreadsheet, File } from "lucide-react";

type Props = {
  attachment: {
    id: number;
    filename: string;
    fileUrl: string;
    fileType: string;
  };
};

export default function ChatAttachment({ attachment }: Props) {
  const getFileIcon = () => {
    const type = attachment.fileType.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
      return <Image className="w-5 h-5" />;
    }
    if (type === 'pdf') {
      return <FileText className="w-5 h-5" />;
    }
    if (['xlsx', 'xls', 'csv'].includes(type)) {
      return <FileSpreadsheet className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const getFilePreview = () => {
    const type = attachment.fileType.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
      return (
        <img
          src={attachment.fileUrl}
          alt={attachment.filename}
          className="max-w-sm max-h-64 rounded-lg mt-2"
        />
      );
    }
    
    return null;
  };

  return (
    <div className="inline-block max-w-md">
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors" >
        <div className="text-red-600">
          {getFileIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {attachment.filename}
          </p>
          <p className="text-xs text-gray-500">
            {attachment.fileType.toUpperCase()}
          </p>
        </div>
      </a>
      {getFilePreview()}
    </div>
  );
}