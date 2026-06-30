import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import AppLayout from "./components/Layout";
import ApiKeyModal from "./components/ApiKeyModal";
import HomePage from "./pages/public/HomePage";
import CatalogoPage from "./pages/public/CatalogoPage";
import ProdottoPage from "./pages/public/ProdottoPage";
import ChiSiamoPage from "./pages/public/ChiSiamoPage";
import ContattiPage from "./pages/public/ContattiPage";
import ConcessionariPage from "./pages/public/ConcessionariPage";
import ChatPage from "./pages/ChatPage";
import StockPage from "./pages/StockPage";
import DealerPage from "./pages/DealerPage";
import SeasonPage from "./pages/SeasonPage";
import LeadsPage from "./pages/LeadsPage";

export const DEMO_KEY = '__demo__';

function DemoSection({ apiKey, onSubmit, onDemo, onOpenModal, children }) {
  if (!apiKey) {
    return <ApiKeyModal isOpen={true} onSubmit={onSubmit} onDemo={onDemo} />;
  }
  return (
    <AppLayout isDemo={apiKey === DEMO_KEY} onOpenModal={onOpenModal}>
      {children}
    </AppLayout>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem("omef_api_key") || ""
  );
  const [showModal, setShowModal] = useState(false);

  function handleApiKeySubmit(key) {
    sessionStorage.setItem("omef_api_key", key);
    setApiKey(key);
    setShowModal(false);
  }

  function handleDemoMode() {
    setApiKey(DEMO_KEY);
    setShowModal(false);
  }

  const demoProps = {
    apiKey,
    onSubmit: handleApiKeySubmit,
    onDemo: handleDemoMode,
    onOpenModal: () => setShowModal(true),
  };

  return (
    <HashRouter>
      <ApiKeyModal
        isOpen={showModal && !apiKey}
        onSubmit={handleApiKeySubmit}
        onDemo={handleDemoMode}
      />
      <Routes>
        {/* PUBLIC WEBSITE */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/catalogo" element={<PublicLayout><CatalogoPage /></PublicLayout>} />
        <Route path="/prodotti/:slug" element={<PublicLayout><ProdottoPage /></PublicLayout>} />
        <Route path="/chi-siamo" element={<PublicLayout><ChiSiamoPage /></PublicLayout>} />
        <Route path="/concessionari" element={<PublicLayout><ConcessionariPage /></PublicLayout>} />
        <Route path="/contatti" element={<PublicLayout><ContattiPage /></PublicLayout>} />

        {/* AI DEMO — needs apiKey */}
        <Route path="/demo" element={<DemoSection {...demoProps}><ChatPage apiKey={apiKey} /></DemoSection>} />
        <Route path="/demo/stock" element={<DemoSection {...demoProps}><StockPage /></DemoSection>} />
        <Route path="/demo/dealers" element={<DemoSection {...demoProps}><DealerPage /></DemoSection>} />
        <Route path="/demo/season" element={<DemoSection {...demoProps}><SeasonPage /></DemoSection>} />
        <Route path="/demo/leads" element={<DemoSection {...demoProps}><LeadsPage /></DemoSection>} />
      </Routes>
    </HashRouter>
  );
}
