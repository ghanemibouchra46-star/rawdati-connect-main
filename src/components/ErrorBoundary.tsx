import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-3xl shadow-soft border-2 border-primary/20">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-10 h-10 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-black text-foreground">
                            عذراً، حدث خطأ غير متوقع
                        </h1>

                        <p className="text-muted-foreground font-medium">
                            نواجه مشكلة تقنية بسيطة. يرجى محاولة إعادة تحميل الصفحة.
                        </p>

                        <div className="p-3 bg-muted/30 rounded-xl text-xs font-mono text-left overflow-auto max-h-32">
                            {this.state.error?.message}
                        </div>

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full gap-2 gradient-accent border-0 h-14 rounded-2xl text-lg font-bold shadow-soft hover:shadow-hover transition-all"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            إعادة تحميل الصفحة
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
