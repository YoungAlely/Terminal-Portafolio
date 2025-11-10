import { useEffect, useRef } from 'react';
import TerminalWindow from '../ui/TerminalWindow';
import OutputLine from '../ui/OutputLine';
import InputPrompt from '../ui/InputPrompt';
import { useTerminalLogic } from '../../hooks/useTerminalLogic';
import { useDragLogic } from '../../hooks/useDragLogic';



const TerminalContainer = () => {
    const asciiTego = `
████████╗███████╗ ██████╗  ██████╗ 
╚══██╔══╝██╔════╝██╔════╝ ██╔═══██╗
   ██║   █████╗  ██║  ███╗██║   ██║
   ██║   ██╔══╝  ██║   ██║██║   ██║
   ██║   ███████╗╚██████╔╝╚██████╔╝
   ╚═╝   ╚══════╝ ╚═════╝  ╚═════╝ 
  `;

    const {
        lines,
        isFunMode,
        pushLine,
        handleCommand,
        updateLastLine,
        commands,
    } = useTerminalLogic([{ id: 1, text: asciiTego, kind: "output" }]);

    const {
        pos,
        onMouseDown,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        isMobile,
    } = useDragLogic({
        x: window.innerWidth / 2 - 360,
        y: window.innerHeight / 2 - 200,
    });

    const scrollRef = useRef(null);

    // --- Scroll automático al final ---
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    // --- Simulación de instalación inicial ---
    useEffect(() => {
        let progress = 0;
        const total = 24;
        const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        pushLine(`⠋ Installing Young-Tego-portfolio [------------------------]`, "updating");

        const interval = setInterval(() => {
            progress++;
            if (progress > total) return clearInterval(interval);
            const bar = "▇".repeat(progress) + "-".repeat(total - progress);
            const spinner = frames[progress % frames.length];
            updateLastLine(`${spinner} Installing Young-Tego-portfolio [${bar}]`);
        }, 100);

        const finish = setTimeout(() => {
            clearInterval(interval);
            pushLine(
                "✨ Instalación completada.\nEscribe /help para ver los comandos disponibles.\n",
                "output"
            );
        }, total * 100 + 400);

        return () => {
            clearInterval(interval);
            clearTimeout(finish);
        };
    }, [pushLine, updateLastLine]);

    const submit = (val) => {
        if (!val) return;
        handleCommand(val);
    };

    const handleClose = () => pushLine("Ventana cerrada. Recarga para reabrir.");

    // --- Estilo adaptado ---
    const style = isMobile
        ? { position: "relative", width: "100%", top: 0, left: 0 }
        : { position: "fixed", left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 50 };

    // --- Evitar que el teclado empuje todo ---
    useEffect(() => {
        if (!isMobile) return;
        const handleResize = () => {
            document.body.style.height = `${window.innerHeight}px`;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobile]);

    return (
        <div
            style={style}
            onMouseDown={!isMobile ? onMouseDown : undefined}
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
            className={`${isMobile ? "max-h-[80vh] w-full px-2 mt-2" : ""}`}
        >
            <TerminalWindow
                title="Young-Tego Terminal"
                onClose={handleClose}
                isFunMode={isFunMode}
            >
                <div className="flex flex-col gap-3 h-full">
                    <div
                        ref={scrollRef}
                        className={`flex-1 overflow-y-auto ${isMobile ? "max-h-[50vh]" : "max-h-[70vh]"
                            }`}
                    >
                        {lines.map((l) => (
                            <div key={l.id} className="mb-2">
                                <OutputLine line={l} />
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-black/40 bg-black/40 backdrop-blur-sm">
                        <InputPrompt onSubmit={submit} commands={commands} />
                        <div className="text-xs text-gray-500 mt-2 text-center">
                            Tip: /help o /visual
                        </div>
                    </div>
                </div>
            </TerminalWindow>
        </div>
    );
};

export default TerminalContainer;