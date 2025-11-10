import { useState, useCallback, useEffect } from 'react';
import { useFirestoreData } from '../data/useFirebaseData.js';
import { autoCommands } from '../data/autoCommands.js';
import { staticData } from '../data/staticData.js'



export function useTerminalLogic(initialLines = []) {
    const { projects, conferences, loading, error } = useFirestoreData();
    const [lines, setLines] = useState(initialLines);
    const [isFunMode, setIsFunMode] = useState(false);
    const [commandQueue, setCommandQueue] = useState(null);

    const pushLine = useCallback((line, kind = 'output') => {
        setLines(prev => [...prev, { id: Date.now(), text: line, kind }]);
    }, []);
    const clear = useCallback(() => setLines([]), []);
    const updateLastLine = useCallback((text) => {
        setLines(prev => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            // Actualizar la última línea
            updated[updated.length - 1] = { ...updated[updated.length - 1], text, kind: 'updating' };
            return updated;
        });
    }, []);

    const executeCommand = useCallback((cmd) => {
        const lower = cmd.toLowerCase();

        if (lower.startsWith('/project ')) {
            const input = lower.replace('/project ', '').trim();
            const project = projects.find(
                p => p.id.toLowerCase() === input || p.name.toLowerCase() === input
            );

            if (project) {
                let output = `${project.name}:\n\n${project.details}`;
                if (project.url) output += `\n\nEnlace: ${project.url}`;
                pushLine(output);
            } else {
                pushLine(`Proyecto no encontrado. Usa /projects para ver la lista.`);
            }
            return;
        }

        switch (lower) {
            case '/fun':
                setIsFunMode(prev => {
                    const newState = !prev;
                    const message = newState
                        ? '🟢 Modo Hacker [FUN] activado. ¡Bienvenido a la Matrix!'
                        : '⚪ Modo Hacker [FUN] desactivado. Volviendo a la normalidad.';
                    pushLine(message, 'system');
                    return newState;
                });
                break;
            case '/help':
                pushLine('Comandos:\n/fun\n/help\n/aboutme\n/skills\n/stack\n/projects\n/achievements\n/conferences\n/contact\n/visual\nclear o cls\nexit');
                break;
            case '/aboutme':
                pushLine(staticData.about);
                break;
            case '/skills':
                staticData.skills.forEach(s => pushLine(`- ${s}`));
                break;
            case '/stack':
                staticData.stack.forEach(s => pushLine(`- ${s}`));
                break;

            case '/achievements':
                staticData.achievements.forEach(s => pushLine(`- ${s}`));
                break;

            case '/projects':
                if (projects.length === 0) {
                    pushLine('Aún no hay proyectos disponibles.');
                    break;
                }
                pushLine('Proyectos disponibles (usa /project <id> para ver más info):');
                projects.forEach(p => pushLine(`- ${p.name}: \n${p.details}`));
                break;

            case '/conferences':
                if (conferences.length === 0) {
                    pushLine('No hay conferencias, Talvez más tarde :)');
                    break;
                }
                pushLine('Conferencias disponibles:');
                conferences.forEach(c => pushLine(`- ${c.title}:\n${c.desc} - ${c.places}`));
                break;

            case '/contact':
                pushLine('📫 Contactos disponibles (Ctrl+click en PC o solo tap en móvil):', 'output');
                Object.entries(staticData.contactLinks).forEach(([key, url]) => {
                    pushLine(`${url}`);
                });
                break;
            case '/visual':
                pushLine('Cambiando a modo visual...');
                break;
            case 'clear':
                clear();
                break;
            case 'cls':
                clear();
                break;
            case 'exit':
                'Gracias por visitar mi Portafolio Terminal 🚀\nHecho con React, Firebase y mucho café ☕'
                break;
            default:
                pushLine(`Comando no reconocido: ${cmd}. Escribe /help para ver comandos.`);
        }
    }, [projects, pushLine, clear]);

    const handleCommand = useCallback((raw) => {
        const cmd = (raw || '').trim();
        if (!cmd) return;

        pushLine(`$ ${cmd}`, 'input');

        if (loading) {
            setCommandQueue(cmd);
            pushLine(`Descargando datos del portafolio. Ejecutando '${cmd}' en cuanto finalice...`, 'system');
            return;
        }

        executeCommand(cmd);
    }, [loading, pushLine, executeCommand]);

    useEffect(() => {
        if (!loading && commandQueue) {
            executeCommand(commandQueue);
            setCommandQueue(null);
        }
        if (!loading && error) {
            pushLine('Error al descargar los datos.', 'error');
        }
    }, [loading, error, commandQueue, executeCommand, pushLine]);

    return { lines, isFunMode, pushLine, handleCommand, clear, updateLastLine, commands: autoCommands };
}
