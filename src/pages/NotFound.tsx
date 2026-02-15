import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    const fullPath = window.location.href;

    // Aggressive check for recovery tokens in ANY part of the URL
    if (fullPath.includes('type=recovery') || fullPath.includes('access_token=')) {
      console.log("Recovery token detected on 404 page, redirecting...");
      // Fix for old links missing the hash
      navigate('/auth?recovery=true', { replace: true });
      return;
    }

    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md">
        <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-foreground font-medium">عذراً! الصفحة غير موجودة</p>
        <p className="mb-8 text-muted-foreground">
          إذا كنت تحاول استرجاع كلمة المرور وظهرت لك هذه الصفحة، فقد يكون الرابط قديماً. يرجى العودة للرئيسية وطلب رابط جديد.
        </p>
        <a href="/" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
