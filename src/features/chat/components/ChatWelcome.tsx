
import { Sparkles } from "lucide-react";

interface ChatWelcomeProps {
  onPromptClick: (prompt: string) => void;
}

export function ChatWelcome({ onPromptClick }: ChatWelcomeProps) {
  const prompts = [
    {
      title: "Strategi Bisnis",
      description: "Dapatkan bantuan untuk merencanakan strategi bisnis Anda",
      prompt: "Bantu saya membuat strategi bisnis",
    },
    {
      title: "Analisis Data",
      description: "Analisis dan wawasan dari data bisnis Anda",
      prompt: "Analisis data penjualan saya",
    },
    {
      title: "Ide Produk",
      description: "Eksplorasi ide-ide produk dan layanan baru",
      prompt: "Ide produk baru untuk bisnis saya",
    },
    {
      title: "Produktivitas Tim",
      description: "Cara meningkatkan efisiensi dan kolaborasi tim",
      prompt: "Tips meningkatkan produktivitas tim",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 max-w-4xl mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-orange-200">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        Bagaimana saya bisa membantu Anda hari ini?
      </h1>
      
      <p className="text-gray-600 text-center mb-12 max-w-lg text-lg">
        Mulai percakapan dengan mengetikkan pertanyaan atau pilih salah satu
        topik di bawah
      </p>

      {/* Suggested Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {prompts.map((item, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(item.prompt)}
            className="p-5 text-left bg-white border-2 border-gray-100 rounded-2xl hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 transition-all duration-200 group"
          >
            <div className="text-base font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
              {item.title}
            </div>
            <div className="text-sm text-gray-600">{item.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}