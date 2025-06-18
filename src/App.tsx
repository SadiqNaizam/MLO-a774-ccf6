import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import ErrorDisplayPage from "./pages/ErrorDisplayPage";
import ExportProjectModalPage from "./pages/ExportProjectModalPage";
import FullScreenPreviewModalPage from "./pages/FullScreenPreviewModalPage";
import MainDevelopmentEnvironmentPage from "./pages/MainDevelopmentEnvironmentPage";
import UIDesignStudioPage from "./pages/UIDesignStudioPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<MainDevelopmentEnvironmentPage />} />
          <Route path="/error-display" element={<ErrorDisplayPage />} />
          <Route path="/export-project-modal" element={<ExportProjectModalPage />} />
          <Route path="/full-screen-preview-modal" element={<FullScreenPreviewModalPage />} />
          <Route path="/u-i-design-studio" element={<UIDesignStudioPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
