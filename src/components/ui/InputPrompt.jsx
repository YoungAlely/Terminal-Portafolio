import { useState, useRef, useEffect, useCallback } from 'react';




const InputPrompt = ({ onSubmit, commands }) => {
    const [value, setValue] = useState('');
    const ref = useRef(null);
    useEffect(() => ref.current?.focus(), []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSubmit(value);
        setValue('');
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            const currentInput = value.trim().toLowerCase();
            if (!currentInput || !commands) return;

            const match = commands.find(cmd =>
                cmd.startsWith(currentInput)
            );

            if (match) {
                setValue(match);
                setTimeout(() => {
                    if (ref.current) {
                        ref.current.setSelectionRange(match.length, match.length);
                    }
                }, 0);
            }
        }
    }, [value, commands]);


    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-green-300 whitespace-nowrap">usuario@host:~$</span>
            <input
                ref={ref}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown} // Añadir el manejador de tecla
                className="flex-grow bg-transparent text-gray-200 outline-none font-mono text-sm caret-green-300"
                autoFocus
                autoComplete="off"
                placeholder="Escribe un comando..."
            />
        </form>
    );
}
export default InputPrompt;