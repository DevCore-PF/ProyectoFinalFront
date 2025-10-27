import React from 'react';

interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickAccessCardProps {
  items: QuickAccessItem[];
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ items }) => {
  return (
    <div className="space-y-4 font-body">
      <h2 
        className="text-4xl text-white mb-6 text-center" 
        style={{ 
          fontWeight: 400,
          letterSpacing: '0.01em',
          lineHeight: 1.2,
          fontFamily: '"Be Vietnam Pro", sans-serif'
        }}
      >
        Acceso rápido
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={item.onClick}
            className="rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
            style={{ 
              backgroundColor: '#3F4273',
              border: '0.8px solid #FBEDBC'
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <div style={{ 
                  color: '#FBEDBC',
                  width: '24px',
                  height: '32px',
                  minWidth: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '100%', height: '100%', color: '#FBEDBC' }}>
                    {item.icon}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-200 font-light">{item.description}</p>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-colors duration-200"
              style={{ 
                backgroundColor: '#FBEDBC',
                color: '#242645'
              }}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessCard;