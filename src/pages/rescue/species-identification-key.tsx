import type { NextPage, GetServerSideProps } from "next";

import Link from "next/link";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";

import Hero from "@/components/Hero/Hero";
import { Breadcrumbs, SEO } from "@/components";

interface PageProps {
  pageImage: PageData["image"];
}

const Page: NextPage<PageProps> = ({ pageImage }) => {
  const pageBreadcrumbs = [sitemap.rescue, sitemap["species-identification-key"]];

  return (
    <>
      <SEO
        page={sitemap["species-identification-key"]}
        images={
          pageImage
            ? [
                {
                  url: pageImage.url,
                  width: pageImage.width,
                  height: pageImage.height,
                },
              ]
            : undefined
        }
        breadcrumbs={pageBreadcrumbs}
      />

      <Hero
        title={sitemap["species-identification-key"].title}
        subtitle={sitemap.rescue.title}
        background={pageImage?.url}
      />

      <Breadcrumbs items={pageBreadcrumbs} />

      <article className="content">
        <table border={0} cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <th colSpan={2}>
                <strong id="1">1.</strong>
              </th>
            </tr>
            <tr>
              <td>Baleen present on palate. No teeth. Lower jaw very wide and arched in shape.</td>
              <td>
                <a href="#2">
                  <strong>Go to 2</strong>
                </a>
              </td>
            </tr>
            <tr>
              <td>
                No baleen. Teeth present (sometimes concealed beneath the gum). Lower jaw narrow (at
                least near the front).
              </td>
              <td>
                <strong>
                  <a href="#7">Go to 7</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="2">2. Baleen Whales</strong>
              </th>
            </tr>
            <tr>
              <td>
                No grooves on throat. No dorsal fin. Mouth and upper border of lower lip very arched
                in shape. Long baleen plates up to 6-9ft high.
              </td>
              <td>
                <Link href="/education/species/northern-right-whale">
                  <strong>Northern right whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Numerous parallel grooves on throat.</td>
              <td>
                <strong>
                  <a href="#3">Go to 3</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="3">3.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Flippers very long (nearly 1/3 of animal&apos;s length) and often white with
                scalloped lower margin.
              </td>
              <td>
                <Link href="/education/species/humpback-whale">
                  <strong>Humpback whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Flippers much less than one third of animal&apos;s length, not scalloped on lower
                margin.
              </td>
              <td>
                <strong>
                  <a href="#4">Go to 4</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="4">4. Rorquals</strong>
              </th>
            </tr>
            <tr>
              <td>Baleen yellowish white or slate coloured, or both.</td>
              <td>
                <strong>
                  <a href="#5">Go to 5</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>Baleen black or nearly black.</td>
              <td>
                <strong>
                  <a href="#6">Go to 6</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="5">5.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size up to 70ft +. Baleen yellow and slate coloured except at front of right side of
                mouth where it is white, its hairy fringes white or yellowish. Tail flukes white
                below.
              </td>
              <td>
                <Link href="/education/species/fin-whale">
                  <strong>Fin whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Size up to 30ft. Baleen and its hairy fringes all white or yellowish. White band on
                outside of flipper.
              </td>
              <td>
                <Link href="/education/species/minke-whale">
                  <strong>Minke whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="6">6.</strong>
              </th>
            </tr>
            <tr>
              <td>Size up to 85ft +. Baleen very black with coarse black hairs.</td>
              <td>
                <strong>Blue whale&nbsp;</strong>
              </td>
            </tr>
            <tr>
              <td>
                Size up to 50ft +. Baleen mostly dark with very fine, white, curling, silky hairs.
                Tail flukes not white below.
              </td>
              <td>
                <Link href="/education/species/sei-whale">
                  <strong>Sei whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="7">7. Toothed Whales, Dolphins &amp; Porpoises</strong>
              </th>
            </tr>
            <tr>
              <td>Tip of lower jaw well behind foremost limit of head.</td>
              <td>
                <strong>
                  <a href="#8">Go to 8</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>Tip of lower jaw at about same level as tip of snout.</td>
              <td>
                <strong>
                  <a href="#9">Go to 9</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="8">8.</strong>
              </th>
            </tr>
            <tr>
              <td>Size of large whale, up to 60ft +.</td>
              <td>
                <Link href="/education/species/sperm-whale">
                  <strong>Sperm whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Size of large dolphin, up to 12ft.</td>
              <td>
                <strong>Dwarf / pygmy sperm whale</strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="9">9.</strong>
              </th>
            </tr>
            <tr>
              <td>No dorsal fin.</td>
              <td>
                <strong>
                  <a href="#10">Go to 10</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>Dorsal fin present.</td>
              <td>
                <strong>
                  <a href="#11">Go to 11</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="10">10.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Head short. Prominent forehead. Colour greyish with black mottling. Either no
                visible teeth (female) or a single, spirally twisted tusk, projecting from front of
                the upper jaw (male).
              </td>
              <td>
                <strong>Narwhal</strong>
              </td>
            </tr>
            <tr>
              <td>
                Colour white all over (grey-brown in juveniles). 8 - 10 pairs of teeth in each jaw.
              </td>
              <td>
                <strong>Beluga</strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="11">11.</strong>
              </th>
            </tr>
            <tr>
              <td>Teeth confined to lower jaw or apparently absent.</td>
              <td>
                <strong>
                  <a href="#12">Go to 12</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>Teeth in upper and lower jaws.</td>
              <td>
                <strong>
                  <a href="#16">Go to 16</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="12">12.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Large dorsal fin, half way along back. No beak. 2 - 7 pairs of teeth at front end of
                lower jaw. Up to 12.5ft in length.
              </td>
              <td>
                <Link href="/education/species/rissos-dolphin">
                  <strong>Risso&apos;s dolphin</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Dorsal fin two thirds of way along back. Front end of jaws narrow. Two grooves on
                throat.
              </td>
              <td>
                <strong>
                  <a href="#13">Go to 13</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="13">13. Beaked Whales</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size large, up to 25 - 30ft. Distance from tip of snout to blowhole 1/5 to 1/7 total
                length of animal. Bulbous forehead. One to two pairs of teeth at tip of lower jaw,
                usually concealed.
              </td>
              <td>
                <Link href="/education/species/northern-bottlenose-whale">
                  <strong>Northern bottlenose whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Distance from tip of snout to blowhole less than 1/7 of total length.</td>
              <td>
                <strong>
                  <a href="#14">Go to 14</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="14">14.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size large, up to 26ft. Distance from tip of snout to blowhole 1/8 to 1/10 total
                length. Forehead not prominent. Pair of teeth at tip of lower jaw, concealed in
                females.
              </td>
              <td>
                <Link href="/education/species/cuviers-beaked-whale">
                  <strong>Cuvier&apos;s beaked whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Size smaller, not exceeding 20ft. Long beak.</td>
              <td>
                <strong>
                  <a href="#15">Go to 15</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="15">15.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size about 15ft. Colour; mostly black, usually with white scrape marks. One pair of
                teeth half way along lower jaw. Conspicuous and triangular in males, concealed in
                females.
              </td>
              <td>
                <Link href="/education/species/sowerbys-beaked-whale">
                  <strong>Sowerby&apos;s beaked whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Size about 17ft. Colour dark grey, often with white &apos;scrape&apos; marks. One
                pair of teeth at tip of lower jaw. Teeth conspicuous and flattened sideways in
                males, concealed in females.
              </td>
              <td>
                <strong>True&apos;s beaked whale</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <strong>
                  N.B. There are at least 2 other beaked whale species which may occur here -
                  Blainville&apos;s and Gervais&apos;
                </strong>
                &nbsp;<strong>beaked whale</strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="16">16. Dolphins &amp; Porpoises</strong>
              </th>
            </tr>
            <tr>
              <td>Size large, 15 - 30 ft in adults. 8 - 13 teeth in each jaw.</td>
              <td>
                <strong>
                  <a href="#17">Go to 17</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                Size seldom exceeding 12-14ft, usually less than 9ft. Teeth no more than 1/2 of an
                inch in diameter. More than 15 pairs of teeth.
              </td>
              <td>
                <strong>
                  <a href="#19">Go to 19</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="17">17.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Bulbous forehead overhanging the tip of a short beak. Long thin flippers 1/5 of body
                length. Colour black with some white on belly. 8 - 12 pairs of teeth in each jaw 3/4
                inch diameter.
              </td>
              <td>
                <Link href="/education/species/long-finned-pilot-whale">
                  <strong>Long-finned pilot whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Forehead not prominent. 10 - 13 pairs of teeth in each jaw, at least 3/4 of an inch
                in diameter.
              </td>
              <td>
                <strong>
                  <a href="#18">Go to 18</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="18">18.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Colour conspicuously black and white (or yellowish). Flippers broad, not pointed.
                Teeth about 1 inch in diameter.
              </td>
              <td>
                <Link href="/education/species/killer-whale">
                  <strong>Killer whale</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Colour black all over. Flippers narrow and pointed. Teeth as in Killer Whale.</td>
              <td>
                <strong>False killer whale</strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="19">19.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size up to 5.5ft. 21 - 24 pairs of teeth in each jaw. Teeth flattened sideways with
                spade-shaped crowns (peg-like). Beak not distinguishable.
              </td>
              <td>
                <Link href="/education/species/harbour-porpoise">
                  <strong>Harbour porpoise</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Size larger, conical teeth, crowns of teeth not spade-shaped. A distinct beak.
              </td>
              <td>
                <strong>
                  <a href="#20">Go to 20</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="20">20.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Size up to 14ft. Top of beak (from forehead to start of curve at tip of snout) about
                3 inches long. Large teeth, 20 - 25 pairs in each jaw, up to 1/2 an inch in
                diameter.
              </td>
              <td>
                <Link href="/education/species/bottlenose-dolphin">
                  <strong>Bottlenose dolphin</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>Teeth not exceeding quarter inch in diameter</td>
              <td>
                <strong>
                  <a href="#21">Go to 21</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="21">21.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Top of beak about 2 inches (from forehead to start of curve at tip of snout). Length
                9 - 10ft.
              </td>
              <td>
                <strong>
                  <a href="#22">Go to 22</a>
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                Top of beak about 6 inches (from forehead to start of curve at tip of snout). 40 -
                50 pairs of teeth in each jaw. Teeth about 1/10 of an inch in diameter. Length up to
                7ft.
              </td>
              <td>
                <strong>
                  <a href="#23">Go to 23</a>
                </strong>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="22">22.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Upper lip white. Dark colour of flippers continuous with body colour. Lower margin
                of flippers not much curved. Approx. 25 pairs of teeth in each jaw, 1/4 of an inch
                in diameter.
              </td>
              <td>
                <Link href="/education/species/white-beaked-dolphin">
                  <strong>White-beaked dolphin</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Upper lip black. Flippers with strongly curved lower margin. Flippers dark colour
                meets white body colour, with dark stripe running from flipper to snout. Conspicuous
                white patch on each flank behind dorsal fin. 30 - 40 pairs of teeth in each jaw, 1/4
                of an inch in diameter.
              </td>
              <td>
                <Link href="/education/species/atlantic-white-sided-dolphin">
                  <strong>Atlantic white-sided dolphin</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <strong id="23">23.</strong>
              </th>
            </tr>
            <tr>
              <td>
                Well marked, narrow dark band of pigment extending from eye along the flank, curving
                down to the anus. Another dark stripe running from the flipper joint towards the
                eye.
              </td>
              <td>
                <Link href="/education/species/striped-dolphin">
                  <strong>Striped dolphin</strong>
                </Link>
              </td>
            </tr>
            <tr>
              <td>
                Hourglass pattern on each side of animal. Dark along back with lighter (bluish) grey
                on tail stock. Creamy/yellow below this. Dark stripe running from front of eye to
                top of beak. Second dark stripe from flipper joint to lower jaw.
              </td>
              <td>
                <Link href="/education/species/common-dolphin">
                  <strong>Common dolphin</strong>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const pageData = await getPageContent(sitemap["species-identification-key"].path, { preview });

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      pageImage: pageData.image,
    },
  };
};

export default Page;
