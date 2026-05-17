import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <CurrencyProvider>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter basename={__BASE_PATH__}>
              <AppRoutes />
            </BrowserRouter>
          </I18nextProvider>
        </CurrencyProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;