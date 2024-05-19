import React, { useEffect, useRef } from "react";
import "./styles.scss";
import { useTranslation } from "react-i18next";
import Navbar from "./components/navbar";
import { useLandingPageContext } from "./context/landing-page-context";
import Hero from "./components/hero";
import HowItWorks from "./components/how-it-works";
import EventsTypes from "./components/events-types";
import Faq from "./components/faq";
import { ContactUsProvider } from "./context/contact-us-context";
import ContactUsDialog from "./components/contact-us-dialog";
import Testimonials from "./components/testimonials/testimonials";
import { isHebrew } from "../../utils/language";

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const { setActiveSection, isNonMobile } = useLandingPageContext();

  const sections = {
    heroSection: { ref: useRef(null), id: "hero-section", url: "" },
    testimonials: {
      ref: useRef(null),
      id: "Chats",
      text: t("Chats"),
      url: "/chats",
    },
    howItWorks: {
      ref: useRef(null),
      id: "how-it-works",
      text: t("how-it-works"),
      url: "#how-it-works",
    },
    events: { ref: useRef(null), id: "events", text: t("events"), url: "#events" },
    // pricing: { ref: useRef(null), id: 'pricing', text: t('pricing'), url: '#pricing' },
    faq: { ref: useRef(null), id: "faq", text: t("FAQs"), url: "#faq" },
  };

  const navItems = Object.values(sections);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: isNonMobile ? 0.5 : 0.2,
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    Object.values(sections).forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContactUsProvider>
      <Navbar navItems={navItems} />
      <Hero sectionRef={sections.heroSection.ref} sectionId={sections.heroSection.id} />
      {/* TODO: Check if the language is Hebrew, until we have english testimonials */}
      {isHebrew(i18n.language) && (
        <Testimonials sectionRef={sections.testimonials.ref} sectionId={sections.testimonials.id} />
      )}
      <HowItWorks sectionRef={sections.howItWorks.ref} sectionId={sections.howItWorks.id} />
      <EventsTypes sectionRef={sections.events.ref} sectionId={sections.events.id} />
      {/* <Pricing sectionRef={sections.pricing.ref} sectionId={sections.pricing.id} /> */}
      <Faq sectionRef={sections.faq.ref} sectionId={sections.faq.id} />
      {/* <Footer /> */}
      <ContactUsDialog />
    </ContactUsProvider>
  );
};

export default LandingPage;
