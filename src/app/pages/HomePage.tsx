import { useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "../components/site/Hero";
import { About } from "../components/site/About";
import { Documentation } from "../components/site/Documentation";
import { Kalender } from "../components/site/Kalender";
import { PhotoGallery } from "../components/site/PhotoGallery";
import { PosterSection, PosterPopup } from "../components/site/Poster";
import { VideoGallery } from "../components/site/VideoGallery";
import { FinancialReports } from "../components/site/FinancialReports";
import { JakartaAnniversary } from "../components/site/JakartaAnniversary";
import { Articles } from "../components/site/Articles";
import { Donors } from "../components/site/Donors";
import { Comments } from "../components/site/Comments";
import { Contact } from "../components/site/Contact";
import { useSearch } from "../components/site/PublicLayout";

export function HomePage() {
  const openSearch = useSearch();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location]);

  return (
    <>
      <PosterPopup />
      <Hero />
      <About />
      <Documentation onSearch={openSearch} />
      <Kalender />
      <JakartaAnniversary />
      <PhotoGallery />
      <PosterSection />
      <VideoGallery />
      <FinancialReports />
      <Articles />
      <Donors />
      <Comments />
      <Contact />
    </>
  );
}
