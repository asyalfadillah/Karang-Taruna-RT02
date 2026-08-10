import { useState, createContext, useContext } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageProvider } from "../../i18n/i18n";

const SearchCtx = createContext<() => void>(() => {});
export const useSearch = () => useContext(SearchCtx);

export function PublicLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <LanguageProvider>
      <SearchCtx.Provider value={() => setSearchOpen(true)}>
        <div className="min-h-screen bg-white">
          <Navbar onSearch={() => setSearchOpen(true)} />
          <main>
            <Outlet />
          </main>
          <Footer />
          <BackToTop />
          <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </SearchCtx.Provider>
    </LanguageProvider>
  );
}
