import React from 'react';
import { Message, type ChatMessage } from '@/components/chat/message';

interface FormattedMessageProps {
  message: ChatMessage;
  assistantImage: string;
}

export function FormattedMessage({ message, assistantImage }: FormattedMessageProps) {
  if (message.isUser) {
    return <Message message={message} assistantImage={assistantImage} />;
  }

  const formatSection = (content: string) => {
    if (content.includes('|')) {
      const rows = content.split('\n')
        .filter(row => row.trim() && !row.includes('----'));

      return (
        <div className="overflow-x-auto my-2">
          <table className="min-w-full">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i === 0 ? "bg-gray-50" : "bg-white"}>
                  {row.split('|').filter(Boolean).map((cell, j) => (
                    <td key={j} className="px-3 py-1.5 text-sm border-b">
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (content.startsWith('##')) {
      return (
        <h3 className="text-base font-medium mt-4 mb-2 text-gray-800 flex items-center">
          {content.replace('##', '').trim()}
        </h3>
      );
    }

    if (content.trim().startsWith('-') || content.trim().startsWith('•')) {
      return (
        <div className="ml-2 text-sm text-gray-600">
          {content.replace(/^[-•]/, '').trim()}
        </div>
      );
    }

    return <p className="text-sm mb-1.5 text-gray-700">{content}</p>;
  };

  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
        <img src={assistantImage} alt="Assistant" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
        <div className="space-y-1">
          {message.content
            .split('\n')
            .filter(line => line.trim())
            .map((section, index) => (
              <React.Fragment key={index}>
                {formatSection(section)}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
} 