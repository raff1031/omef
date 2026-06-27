import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ApiKeyModal from "./components/ApiKeyModal";
import ChatPage from "./pages/ChatPage";
import StockPage from "./pages/StockPage";
import DealerPage from "./pages/DealerPage";
import SeasonPage from "./pages/SeasonPage";
import LeadsPage from "./pages/LeadsPage";

export default function App() {
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem("omef_api_key") || "";
  });

  const modalOpen = !apiKey;

  function handleApiKeySubmit(key) {
    sessionStorage.setItem("omef_api_key", key);
    setApiKey(key);
  }

  return (
    <HashRouter>
      <ApiKeyModal isOpen={modalOpen} onSubmit={handleApiKeySubmit} />
      {!modalOpen && (
        <Layout>
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
