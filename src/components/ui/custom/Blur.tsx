import React from "react";

export function Blur({ children, enabled = true, amount = 8, className = "", preventInteraction = true }: {
    children: React.ReactNode;
    enabled?: boolean;
    amount?: number;
    className?: string;
    preventInteraction?: boolean;
}) {

    //If Disabled - Return Children
    if (!enabled) return children;

    //Return Blur Div with Children
    return (
        <div
            className={className}
            style={{
                filter: `blur(${amount}px)`,
                pointerEvents: preventInteraction ? "none" : "auto",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitUserModify: "read-only",
                MozUserModify: "read-only",
            }}
        >
            {children}
        </div>
    );
}