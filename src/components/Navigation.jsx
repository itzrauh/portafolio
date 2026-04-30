import { useState, useEffect, useMemo } from "react";
import { LuBriefcaseBusiness, LuWrench } from "react-icons/lu";
import { FaHome } from "react-icons/fa";
import { navigate } from "astro:transitions/client";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("sobre-mi");
  const [isVisible, setIsVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };
    
    updatePath();

    window.addEventListener("popstate", updatePath);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      updatePath();
    };
    
    return () => {
      window.removeEventListener("popstate", updatePath);
      history.pushState = originalPushState;
    };
  }, []);

  const HomeSections = [
    {
      id: "sobre-mi",
      name: "Sobre Mí",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "experiencias",
      name: "Experiencias",
      icon: <LuBriefcaseBusiness style={{ width: "1.4em", height: "1.4em" }} />,
    },
    {
      id: "habilidades",
      name: "Habilidades",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "contacto",
      name: "Contacto",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "tools",
      name: "Tools",
      icon: <LuWrench style={{ width: "1.4em", height: "1.4em" }} />,
    },
  ];

  const ToolsSections = [
    {
      id: "Home",
      name: "Home",
      icon: <FaHome />,
    },
    {
      id: "tools",
      name: "Tools",
      icon: <LuWrench style={{ width: "1.4em", height: "1.4em" }} />,
    },
  ];

  const sections = useMemo(() => {
    return currentPath === "/tools" || currentPath.startsWith("/tools/") 
      ? ToolsSections 
      : HomeSections;
  }, [currentPath]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
      if (currentPath === "/tools" || currentPath.startsWith("/tools/")) {
        return;
      }
      const sectionElements = sections
        .map((section) => {
          const element = document.getElementById(section.id);
          return {
            id: section.id,
            element: element,
            offset: element ? element.offsetTop - 100 : null,
          };
        })
        .filter((section) => section.element !== null && section.offset !== null);

      if (sectionElements.length === 0) return;

      sectionElements.sort((a, b) => (a.offset || 0) - (b.offset || 0));

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      let activeSection = sectionElements[0];

      for (let i = 0; i < sectionElements.length; i++) {
        const section = sectionElements[i];
        const nextSection = sectionElements[i + 1];

        if (!nextSection) {
          if (scrollY >= (section.offset || 0)) {
            activeSection = section;
          }
        } else {
          if (
            scrollY >= (section.offset || 0) &&
            scrollY < (nextSection.offset || 0)
          ) {
            activeSection = section;
          }
        }
      }
      const lastSection = sectionElements[sectionElements.length - 1];
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);

      if (distanceFromBottom < 200 && lastSection) {
        activeSection = lastSection;
      }

      if (activeSection) {
        setActiveSection(activeSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, currentPath]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-center p-4">
          <div className="flex items-center gap-1 px-2 py-2 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-md shadow-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.id === "tools") {
                    navigate("/tools");
                  } else if (section.id === "Home") {
                    navigate("/");
                  } else {
                    scrollToSection(section.id);
                  }
                }}
                className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-neutral-800 text-neutral-100 shadow-md"
                    : "text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900/50"
                }`}
              >
                <span className="text-neutral-400 group-hover:text-current">
                  {section.icon}
                </span>
                <span className="hidden sm:block">{section.name}</span>

                {activeSection === section.id && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-600/20 to-neutral-400/20" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-6 w-12 h-12 rounded-full border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm text-neutral-400 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/80 hover:text-neutral-300 hover:scale-110 z-40 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } lg:hidden`}
        title="Volver arriba"
      >
        <svg
          className="w-5 h-5 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </>
  );
}
