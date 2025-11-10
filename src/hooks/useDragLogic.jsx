import { useState, useCallback, useRef, useEffect } from 'react';

export function useDragLogic(initial = { x: 0, y: 0 }) {
    const [pos, setPos] = useState(initial);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    // ✅ Detectar móvil/PC solo para usarlo en TerminalContainer
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- LÓGICA MOUSE (PC) ---
    const onMouseDown = useCallback((e) => {
        // Si estamos en móvil, el mouse down debería ser ignorado o tratado como touch (opcional)
        if (isMobile) return;
        dragging.current = true;
        const rect = e.currentTarget.getBoundingClientRect();
        offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, [isMobile]);

    const onMouseMove = useCallback((e) => {
        if (!dragging.current || isMobile) return;
        setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    }, [isMobile]);

    const onMouseUp = useCallback(() => {
        dragging.current = false;
    }, []);

    // --- LÓGICA TÁCTIL (Móvil) ---
    // ✅ Eliminar la condición `if (isMobile) return;` para permitir el drag táctil.

    const onTouchStart = useCallback((e) => {
        dragging.current = true;
        const t = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        offset.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }, []); // Dependencias vacías, ya no depende de isMobile

    const onTouchMove = useCallback((e) => {
        if (!dragging.current) return;
        // ✅ EVITAR SCROLL DE PÁGINA: Crucial para evitar el doble scroll/comportamiento errático
        e.preventDefault();
        const t = e.touches[0];
        setPos({ x: t.clientX - offset.current.x, y: t.clientY - offset.current.y });
    }, []);

    const onTouchEnd = useCallback(() => {
        dragging.current = false;
    }, []);

    return { pos, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, isMobile };
}