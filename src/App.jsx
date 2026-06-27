import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ApiKeyModal from "./components/ApiKeyModal";
import ChatPage from "./pages/ChatPage";
import StockPage from "./pages/StockPage";
import DealerPage from "./pages/DealerPage";
import SeasonPage from "./pages/SeasonPage";
import LeadsPage from "./pages/LeadsPage";

export const DEMO_KEY = '__demo__';

export default function App() {
  const [apiKey, setApiKey] = useState(
    () => sessionStorage.getItem("omef_api_key") || ""
  );

  const [showModal, setShowModal] = useState(!apiKey);

  function handleApiKeySubmit(key) {
    sessionStorage.setItem("omef_api_key", key);
    setApiKey(key);
    setShowModal(false);
  }

  function handleDemoMode() {
    setApiKey(DEMO_KEY);
    setShowModal(false);
  }

  return (
    <HashRouter>
      <ApiKeyModal
        isOpen={showModal}
        onSubmit={handleApiKeySubmit}
        onDemo={handleDemoMode}
      />
      {!showModal && (
        <Layout isDemo={apiKey === DEMO_KEY} onOpenModal={() => setShowModal(true)}>
          <Routes>
            <Route path="/" element={<ChatPage apiKey={apiKey} />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/dealers" element={<DealerPage />} />
            <Route path="/season" element={<SeasonPage />} />
            <Route path="/leads" element={<LeadsPage />} />
          </Routes>
        </Layout>
      )}
    </HashRouter>
  );
}
