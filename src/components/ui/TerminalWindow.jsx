import React from 'react';


const TerminalWindow = ({ children, title, onModeVisual, onClose, style, isFunMode }) => {
    const windowClasses = `
        rounded-2xl shadow-xl max-w-3xl w-[90vw] md:w-[720px] 
        ${isFunMode ? 'bg-matrix border-matrix' : 'bg-[#080808] border-black/40'}
        ${isFunMode ? 'shadow-matrix-glow' : 'shadow-xl'} 
    `;
    const titleBarClasses = `flex items-center justify-between p-2 rounded-t-2xl
        ${isFunMode ? 'border-matrix' : 'border-black/40'}
    `;
    const contentClasses = `p-4 h-[60vh] overflow-y-auto font-mono text-sm 
        ${isFunMode ? 'text-matrix' : 'text-gray-200'}
    `;
    return (
        <div className={windowClasses} style={style}>
            <div className={titleBarClasses}>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className={`ml-3 text-xs font-mono ${isFunMode ? 'text-matrix' : 'text-gray-300'}`}>{title}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 text-gray-200 font-mono">Cerrar</button>
                </div>
            </div>
            <div className={contentClasses}>{children}</div>
        </div>
    );
}

export default TerminalWindow;