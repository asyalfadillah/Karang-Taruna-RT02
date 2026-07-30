import { useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "../components/site/Hero";
import { About } from "../components/site/About";
import { Documentation } from "../components/site/Documentation";
import { Kalender } from "../components/site/Kalender";
import { PhotoGallery } from "../components/site/PhotoGallery";
import { VideoGallery } from "../components/site/VideoGallery";
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
      <Hero onSearch={openSearch} />
      <About />
      <Documentation onSearch={openSearch} />
      <Kalender />
      <PhotoGallery />
      <VideoGallery />
      <Donors />
      <Comments />
      <Contact />
    </>
  );
}
