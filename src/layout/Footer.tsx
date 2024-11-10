import Link from 'next/link';
import Image from 'next/image';

import sitemap from '@/data/sitemap.json';

import { Social } from '@/components';

const Footer = () => (
  <>
    <span className="top-link">
      <Link href="#top">
        Back To Top
      </Link>
    </span>

    <footer>
      <Image
        src="/images/footer/background-footer.png"
        alt=""
        width={2400}
        height={500}
        className="background"
      />

      <div className="footer-wrapper">
        <div className="footer-left">
          <Link href={sitemap.home.path} className="footer-logo">
            <Image
              src="/images/footer/logo-footer.jpg"
              alt="CRRU logo"
              width={150}
              height={150}
            />
          </Link>

          <div className="footer-left-content">
            <ul className="footer-links">
              <li><Link href={sitemap.terms.path}>Terms</Link></li>
              <li><Link href={sitemap.credits.path}>Credits</Link></li>
              <li><Link href={sitemap.contact.path}>Contact</Link></li>
              <li><Link href={sitemap.sitemap.path}>Sitemap</Link></li>
            </ul>

            <ul className="footer-contact">
              <li><strong>Email:</strong> <Link href="mailto:info@crru.org.uk">info@crru.org.uk</Link></li>
              <li><strong>Phone:</strong> <Link href="tel:+4401261851696">01261 851696</Link></li>
            </ul>

            <p className="footer-credits">
              © Cetacean Research & Rescue Unit (CRRU)<br />
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
                <Link href="https://www.johnlewispartnership.co.uk/foundation0.html" rel="noopener noreferrer" target="_blank">
                  <Image
                    src="/images/footer/logo-jlp-foundation.svg"
                    alt="John Lewis Partnership Foundation logo"
                    width={144}
                    height={50}
                  />
                </Link>
              </li>
              <li>
                <Link href="https://www.bornfree.org.uk" rel="noopener noreferrer" target="_blank">
                  <Image
                    src="/images/footer/logo-born-free.svg"
                    alt="Born Free UK logo"
                    width={142}
                    height={50}
                  />
                </Link>
              </li>
              <li>
                <Link href="https://www.landrover.com/explore-land-rover/responsibility/born-free-foundation.html" rel="noopener noreferrer" target="_blank">
                  <Image
                    src="/images/footer/logo-land-rover.svg"
                    alt="Land Rover logo"
                    width={95}
                    height={50}
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
