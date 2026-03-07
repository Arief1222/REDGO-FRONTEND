import logoImage from "/maskot.png";

interface ChatWelcomeProps {
  onPromptClick: (prompt: string) => void;
}

export function ChatWelcome({ onPromptClick }: ChatWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Logo & Title */}
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-red-100 overflow-hidden">
        <img 
          src={logoImage} 
          alt="REDGO AI" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
        Bagaimana saya bisa membantu hari ini?
      </h1>
    </div>
  );
}