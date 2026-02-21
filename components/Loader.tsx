import { Loader2 } from "lucide-react";

export default function Loader({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center h-full w-full ${className}`}>
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
    );
}
