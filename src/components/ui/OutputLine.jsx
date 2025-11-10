import React, { useEffect, useRef, useState } from "react";

const matchAndWrapUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    const handleLinkClick = (e, url) => {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (!isMobile) {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                window.open(url, '_blank');
            }
        } else {
            e.preventDefault();
            window.open(url, '_blank');
        }
    };

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            const titleText = "PC: Ctrl/Cmd + Clic para abrir | Móvil: Clic para abrir";

            return (
                <span
                    key={index}
                    onMouseDown={(e) => handleLinkClick(e, part)}
                    className="text-blue-400 underline cursor-pointer hover:text-blue-300 transition"
                    title={titleText}
                    style={{ pointerEvents: 'auto' }}
                >
                    {part}
                </span>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

export default function OutputLine({ line }) {
    const ref = useRef(null);



    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [line.text]);




    const baseColor =
        line.kind === "input"
            ? "text-green-300"
            : '';

    const content = matchAndWrapUrls(line.text);
    return (
        <div
            ref={ref}
            className={`terminal-line font-mono text-sm whitespace-pre-wrap ${baseColor}`}
        >
            {content}
        </div>
    );
}