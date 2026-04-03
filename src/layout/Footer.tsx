import Image from "next/image";
import Link from "next/link";
import { Social } from "@/components";
import sitemap from "@/data/sitemap.json";

const Footer = () => (
  <>
    <span className="top-link">
      <Link href="#top">Back To Top</Link>
    </span>

    <footer>
      <Image
        alt=""
        className="background"
        height={500}
        src="/images/footer/background-footer.png"
        width={2400}
      />

      <div className="footer-wrapper">
        <div className="footer-left">
          <Link className="footer-logo" href={sitemap.home.path}>
            <Image alt="CRRU logo" height={150} src="/images/footer/logo-footer.jpg" width={150} />
          </Link>

          <div className="footer-left-content">
            <ul className="footer-links">
              <li>
                <Link href={sitemap.terms.path}>Terms</Link>
              </li>
              <li>
                <Link href={sitemap.credits.path}>Credits</Link>
              </li>
              <li>
                <Link href={sitemap.contact.path}>Contact</Link>
              </li>
              <li>
                <Link href={sitemap.sitemap.path}>Sitemap</Link>
              </li>
            </ul>

            <ul className="footer-contact">
              <li>
                <strong>Email:</strong> <Link href="mailto:info@crru.org.uk">info@crru.org.uk</Link>
              </li>
              <li>
                <strong>Phone:</strong> <Link href="tel:+4401261851696">01261 851696</Link>
              </li>
            </ul>

            <p className="footer-credits">
              © Cetacean Research & Rescue Unit (CRRU)
              <br />
              Charity No. SC035473
            </p>
          </div>
        </div>

        <div className="footer-right">
          <Social />

          <div className="footer-support">
            <p>With support from:</p>

            <ul>
              <li>
                <Link
                  href="https://www.johnlewispartnership.co.uk/foundation0.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt="John Lewis Partnership Foundation logo"
                    height={50}
                    src="/images/footer/logo-jlp-foundation.svg"
                    width={144}
                  />
                </Link>
              </li>
              <li>
                <Link href="https://www.bornfree.org.uk" rel="noopener noreferrer" target="_blank">
                  <Image
                    alt="Born Free UK logo"
                    height={50}
                    src="/images/footer/logo-born-free.svg"
                    width={142}
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.landrover.com/explore-land-rover/responsibility/born-free-foundation.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt="Land Rover logo"
                    height={50}
                    src="/images/footer/logo-land-rover.svg"
                    width={95}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
