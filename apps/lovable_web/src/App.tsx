import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// Import Index directly - it's the main page, should be in initial bundle
import Index from "./pages/Index";
import { AudioPlayerProvider } from "./contexts/AudioPlayerContext";
import { ContentProvider } from "./contexts/ContentContext";
import { SessionProvider } from "./contexts/SessionContext";

// Optimize QueryClient for performance - reduce unnecessary refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
    },
  },
});

// Lazy load non-critical routes and components
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));

// Lazy load toast components - not critical for initial render
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Minimal loading fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-muted-foreground text-sm">Caricamento...</span>
    </div>
  </div>
);

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SessionProvider>
          <ContentProvider>
            <AudioPlayerProvider>
              <Suspense fallback={null}>
                <Toaster />
                <Sonner />
              </Suspense>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                {/* Placeholder routes for future stories */}
                <Route
                  path="/settings"
                  element={
                    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
                      <Settings />
                    </Suspense>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
                      <About />
                    </Suspense>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NotFound />
                    </Suspense>
                  }
                />
                </Routes>
              </BrowserRouter>
            </AudioPlayerProvider>
          </ContentProvider>
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
