import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import type { SitemapItem } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import { Social } from "@/components";

const breakpointMobileMenu = 800;

interface SubmenuItemProps {
  active: boolean;
  data: {
    parent: string;
    items: Array<{
      title: string;
      path: SitemapItem["path"] | string;
      mobile?: boolean;
      external?: boolean;
    }>;
  };
}

const SubmenuItem = ({ active, data }: SubmenuItemProps) => (
  <ul className={`submenu ${active ? "active" : ""}`}>
    <li className="header mobile">{data.parent}</li>
    {data.items.map(({ title, path, mobile = false, external = false }) => (
      <li key={path} className={mobile ? "mobile" : ""}>
        <Link
          href={path}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
          className={external ? "external" : ""}
        >
          <span className="text">{title}</span>
        </Link>
      </li>
    ))}
  </ul>
);

const aboutSubmenu = {
  parent: "About Us",
  items: [
    { title: "Explore About Us", path: sitemap.about.path, mobile: true },
    { title: "Meet the Team", path: sitemap["meet-the-team"].path },
    { title: "Funders & Sponsors", path: sitemap.sponsors.path },
    { title: "Useful Links", path: sitemap["useful-links"].path },
    { title: "Contact Us", path: sitemap.contact.path },
  ],
};

const researchSubmenu = {
  parent: "Research",
  items: [
    { title: "Explore Research", path: sitemap.research.path, mobile: true },
    {
      title: "Bottlenose Dolphin Studies",
      path: sitemap["bottlenose-dolphin-studies"].path,
    },
    {
      title: "Minke Whale Research",
      path: sitemap["minke-whale-studies"].path,
    },
    { title: "Photo-ID Catalogues", path: sitemap.catalogues.path },
    {
      title: "Environmental Mitigation",
      path: sitemap["environmental-mitigation"].path,
    },
    { title: "Scientific Publications", path: sitemap.publications.path },
    { title: "Collaborators", path: sitemap.collaborators.path },
  ],
};

const rescueSubmenu = {
  parent: "Rescue",
  items: [
    { title: "Explore Rescue", path: sitemap.rescue.path, mobile: true },
    { title: "Report a Stranding", path: sitemap.stranded.path },
    { title: "Rescue Training", path: sitemap["rescue-training"].path },
    {
      title: "Species Identification Key",
      path: sitemap["species-identification-key"].path,
    },
  ],
};

const educationSubmenu = {
  parent: "Education",
  items: [
    { title: "Explore Education", path: sitemap.education.path, mobile: true },
    { title: "School Visits", path: sitemap["school-visits"].path },
    { title: "Events & Talks", path: sitemap["events-and-talks"].path },
    { title: "Stands & Exhibits", path: sitemap["stands-and-exhibits"].path },
    { title: "Cetacean Fact Files", path: sitemap["cetacean-fact-files"].path },
  ],
};

const trainingSubmenu = {
  parent: "Training",
  items: [
    { title: "Explore Training", path: sitemap.training.path, mobile: true },
    {
      title: "Summer Training Placements",
      path: sitemap["summer-training-placements"].path,
    },
    { title: "MMO Training Courses", path: sitemap["mmo-training"].path },
    { title: "CPD PAM Training Courses", path: sitemap["pam-training"].path },
    {
      title: "Gain University Credits",
      path: sitemap["gain-university-credits"].path,
    },
  ],
};

const helpSubmenu = {
  parent: "Help",
  items: [
    { title: "Explore Help", path: sitemap.help.path, mobile: true },
    { title: "Become a Friend", path: sitemap["become-a-friend"].path },
    { title: "Fundraise for CRRU", path: sitemap["fundraising-support"].path },
    { title: "Legacies & Bequests", path: sitemap.bequests.path },
    { title: "Make a Donation", path: sitemap.donate.path },
  ],
};

enum Submenus {
  None = "none",
  About = "about",
  Research = "research",
  Rescue = "rescue",
  Education = "education",
  Training = "training",
  Help = "help",
}

const Header = () => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [submenu, setSubmenu] = useState<Submenus>(Submenus.None);

  const toggleMenu = () => {
    setOpen(!open);
    setSubmenu(Submenus.None);
  };

  const handleSubmenuOpen = (event: React.MouseEvent, target: Submenus) => {
    if (window.innerWidth > breakpointMobileMenu) {
      return;
    }

    event.preventDefault();
    setSubmenu(target);
  };

  useEffect(() => {
    document.body.classList.toggle("menu", open);
  }, [open]);

  // Close menu on any navigation
  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      setOpen(false);
      setSubmenu(Submenus.None);
    });
  }, [router]);

  return (
    <header>
      <div className="actions">
        <Link href={sitemap.shop.path} className="shop">
          Shop
        </Link>
        <Link href={sitemap.donate.path} className="donate">
          Donate
        </Link>
        <Link href={sitemap.news.path} className="news">
          News
        </Link>
        <Link href={sitemap.sightings.path} className="sighting">
          Report A Sighting
        </Link>
        <Link href={sitemap.stranded.path} className="stranding">
          Report A <br /> Stranding
        </Link>
      </div>

      <Link href={sitemap.home.path} className="logo">
        <Image
          src="/images/header/logo-header.png"
          width={200}
          height={200}
          title="CRRU"
          alt="CRRU logo"
          priority
          quality={100}
        />
      </Link>

      <nav>
        <ul className="menu">
          <li className="dropdown">
            <Link
              href={sitemap.about.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.About)}
            >
              <span>About Us</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.About} data={aboutSubmenu} />
          </li>
          <li className="dropdown">
            <Link
              href={sitemap.research.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.Research)}
            >
              <span>Research</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.Research} data={researchSubmenu} />
          </li>
          <li className="dropdown">
            <Link
              href={sitemap.rescue.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.Rescue)}
            >
              <span>Rescue</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.Rescue} data={rescueSubmenu} />
          </li>
          <li className="dropdown">
            <Link
              href={sitemap.education.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.Education)}
            >
              <span>Education</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.Education} data={educationSubmenu} />
          </li>
          <li className="dropdown">
            <Link
              href={sitemap.training.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.Training)}
            >
              <span>Training</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.Training} data={trainingSubmenu} />
          </li>
          <li className="dropdown">
            <Link
              href={sitemap.help.path}
              onClick={(event) => handleSubmenuOpen(event, Submenus.Help)}
            >
              <span>Help</span>
            </Link>
            <SubmenuItem active={submenu === Submenus.Help} data={helpSubmenu} />
          </li>
          <li className="mobile">
            <Link href={sitemap.news.path}>
              <span>News</span>
            </Link>
          </li>
          <li className="mobile">
            <Link href={sitemap.shop.path}>
              <span>Shop</span>
            </Link>
          </li>
        </ul>
      </nav>

      <Social short />

      <button className="burger" onClick={toggleMenu} onKeyDown={toggleMenu}>
        <svg
          fill="none"
          height="48"
          viewBox="0 0 64 48"
          width="64"
          xmlns="http://www.w3.org/2000/svg"
          className="burger-icon"
        >
          <path
            d="m2 14c2.03077 2.1662 5.46923 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="m2 24c2.03077 2.1662 5.46923 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="m19.845 25.2345c7.4508 3.474 7.9963 8.1523 7.5342 11.7654l9.2795.0001c-.4296-3.3798.2163-7.7552 7.5865-11.7654 11.2513-6.1371 8.5745-18.75909 8.241-21.48225-.2813-2.32254-1.4105-2.0334-2.5397-.8754-4.0957 5.64648-14.0742.98317-17.9465 9.12305-3.871-8.13997-13.7689-3.47666-17.8562-9.12314-1.1292-1.15791-2.2584-1.44714-2.5482.8754-.3321 2.72325-3.34951 16.06554 8.2494 21.48224z"
            fill="#0060c2"
            id="whale"
          />
          <path d="m0 34h64v14h-64z" fill="#000" />
          <path
            d="m2 34c2.03077 2.1662 5.46923 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0 2.0308 2.1662 5.4692 2.1662 7.5 0 2.0308-2.1662 5.4692-2.1662 7.5 0"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      </button>

      {submenu !== Submenus.None && (
        <button
          className="back"
          onClick={() => setSubmenu(Submenus.None)}
          onKeyDown={() => setSubmenu(Submenus.None)}
        >
          <svg
            fill="none"
            height="64"
            viewBox="0 0 64 64"
            width="64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="m49.6454 1.33894c1.8061 1.78525 1.8061 4.67972 0 6.46498l-24.4797 24.19608 24.4797 24.1961c1.8061 1.7852 1.8061 4.6797 0 6.465-1.8062 1.7852-4.7346 1.7852-6.5408 0l-27.75-27.4286c-1.8061-1.7853-1.8061-4.6797 0-6.465l27.75-27.42856c1.8062-1.785253 4.7346-1.785253 6.5408 0z"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
        </button>
      )}
    </header>
  );
};

export default Header;
