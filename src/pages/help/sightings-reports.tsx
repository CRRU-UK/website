import type { GetServerSideProps, NextPage } from "next";

import Script from "next/script";
import { useId, useState } from "react";
import sitemap from "@/data/sitemap.json";
import getPageContent from "@/helpers/getPageContent";
import { setPageCacheHeaders } from "@/helpers/setHeaders";
import type { PageData } from "@/helpers/types";

import CommonPage from "@/layout/CommonPage";

const UseSightingsForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);

  // biome-ignore lint/suspicious/noExplicitAny: Cloudflare Turnstile global has no type definitions
  const resetChallenge = () => (globalThis as any)?.turnstile?.reset();

  const currentDate = new Date();
  const defaultDate = currentDate.toISOString().substring(0, 10);
  const defaultTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);

    const form = event.target as HTMLFormElement;
    const field = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value;

    const data = JSON.stringify({
      name: field("name"),
      email: field("email"),
      date: field("date"),
      "time-start": field("time-start"),
      "time-end": field("time-end"),
      location: field("location"),
      species: field("species"),
      longitude: field("longitude") || undefined,
      latitude: field("latitude") || undefined,
      amount: field("amount") || undefined,
      "sea-state": field("sea-state") || undefined,
      weather: field("weather") || undefined,
      depth: field("depth") || undefined,
      vessel: field("vessel") || undefined,
      notes: field("notes") || undefined,
      "cf-turnstile-response": field("cf-turnstile-response"),
    });

    let request: Response | undefined;

    try {
      request = await fetch("/api/report-sighting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    } catch (error: unknown) {
      console.error("Unable to submit form:", error);

      setErrorMessages(["Unable to submit form, please try again"]);
      setLoading(false);
      return;
    }

    const result = await request.json();
    if (!result.success) {
      setErrorMessages(result.errors);

      if (result.resetChallenge) {
        resetChallenge();
      }

      setLoading(false);
      return;
    }

    setErrorMessages([]);
    setSuccess(true);
    setLoading(false);
  };

  const errorMessageElements = errorMessages.length > 0 && (
    <ul className="form-errors">
      {errorMessages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );

  const nameId = useId();
  const emailId = useId();
  const dateId = useId();
  const timeStartId = useId();
  const timeEndId = useId();
  const locationId = useId();
  const speciesId = useId();
  const longitudeId = useId();
  const latitudeId = useId();
  const amountId = useId();
  const seaStateId = useId();
  const weatherId = useId();
  const depthId = useId();
  const vesselId = useId();
  const notesId = useId();

  return (
    <>
      <Script async defer src="https://challenges.cloudflare.com/turnstile/v0/api.js" />

      <form className={loading ? "form-loading" : ""} onSubmit={handleSubmit}>
        <div className="form-columns">
          <label htmlFor={nameId}>
            <span>Name of observer: *</span>
            <input disabled={loading} id={nameId} name="name" required type="text" />
          </label>

          <label htmlFor={emailId}>
            <span>Email: *</span>
            <input disabled={loading} id={emailId} name="email" required type="email" />
          </label>

          <label htmlFor={dateId}>
            <span>Date of sighting: *</span>
            <input
              defaultValue={defaultDate}
              disabled={loading}
              id={dateId}
              name="date"
              required
              type="date"
            />
          </label>

          <label htmlFor={timeStartId}>
            <span>Time (start): *</span>
            <input
              defaultValue={defaultTime}
              disabled={loading}
              id={timeStartId}
              name="time-start"
              required
              type="time"
            />
          </label>

          <label htmlFor={timeEndId}>
            <span>Time (end): *</span>
            <input
              defaultValue={defaultTime}
              disabled={loading}
              id={timeEndId}
              name="time-end"
              required
              type="time"
            />
          </label>

          <label htmlFor={locationId}>
            <span>Location / landmark: *</span>
            <input disabled={loading} id={locationId} name="location" required type="text" />
          </label>

          <label htmlFor={speciesId}>
            <span>Species observed: *</span>
            <select defaultValue="" disabled={loading} id={speciesId} name="species">
              <option disabled value="">
                Select an option
              </option>
              <option value="Unidentified dolphin species">Unidentified dolphin species</option>
              <option value="Unidentified whale species">Unidentified whale species</option>
              <option value="Harbour porpoise">Harbour porpoise</option>
              <option value="Bottlenose dolphin">Bottlenose dolphin</option>
              <option value="Minke whale">Minke whale</option>
              <option value="Killer whale">Killer whale</option>
              <option value="Risso's dolphin">Risso&apos;s dolphin</option>
              <option value="Common dolphin">Common dolphin</option>
              <option value="Striped dolphin">Striped dolphin</option>
              <option value="Pilot whale">Pilot whale</option>
              <option value="Sperm whale">Sperm whale</option>
              <option value="White-beaked dolphin">White-beaked dolphin</option>
              <option value="Atlantic white-sided dolphin">Atlantic white-sided dolphin</option>
              <option value="Humpback whale">Humpback whale</option>
              <option value="Fin whale">Fin whale</option>
              <option value="Sei whale">Sei whale</option>
              <option value="Beaked whale species">Beaked whale species</option>
            </select>
          </label>

          <label htmlFor={longitudeId}>
            <span>Longitude:</span>
            <input disabled={loading} id={longitudeId} name="longitude" type="text" />
          </label>

          <label htmlFor={latitudeId}>
            <span>Latitude:</span>
            <input disabled={loading} id={latitudeId} name="latitude" type="text" />
          </label>

          <label htmlFor={amountId}>
            <span>Number of animals present:</span>
            <input disabled={loading} id={amountId} name="amount" type="number" />
          </label>

          <label htmlFor={seaStateId}>
            <span>Sea state:</span>
            <select defaultValue="" disabled={loading} id={seaStateId} name="sea-state">
              <option disabled value="">
                Select an option
              </option>
              <option value="calm">Calm</option>
              <option value="ripples">Ripples</option>
              <option value="wavelets">Wavelets</option>
              <option value="large-waves">Large waves</option>
              <option value="choppy">Choppy, many white caps</option>
            </select>
          </label>

          <label htmlFor={weatherId}>
            <span>Weather conditions:</span>
            <select defaultValue="" disabled={loading} id={weatherId} name="weather">
              <option disabled value="">
                Select an option
              </option>
              <option value="no-cloud">No cloud</option>
              <option value="25-cloud">25% cloud</option>
              <option value="50-cloud">50% cloud</option>
              <option value="75-cloud">75% cloud</option>
              <option value="overcast">No sky visible (overcast)</option>
            </select>
          </label>

          <label htmlFor={depthId}>
            <span>Depth (from depth sounder, in meters):</span>
            <input disabled={loading} id={depthId} name="depth" type="number" />
          </label>

          <label htmlFor={vesselId}>
            <span>Name of Vessel:</span>
            <input disabled={loading} id={vesselId} name="vessel" type="text" />
          </label>
        </div>

        <label htmlFor={notesId}>
          <span>
            Additional notes (e.g. behaviour observed, direction of travel, composition of group
            i.e. number of adults and calves, other):
          </span>
          <textarea disabled={loading} id={notesId} name="notes" rows={5} />
        </label>

        <div
          className="cf-turnstile"
          data-sitekey={String(process.env.NEXT_PUBLIC_CLOUDFLARE_CHALLENGE_SITE_KEY)}
          data-theme="light"
        />

        {errorMessageElements}

        {success && (
          <span className="form-success">Sighting successfully submitted, thank you.</span>
        )}

        <button type="submit">{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </>
  );
};

interface PageProps {
  data: PageData;
}

const Page: NextPage<PageProps> = ({ data }) => (
  <CommonPage breadcrumbs={[sitemap.sightings]} data={data} page={sitemap.sightings}>
    {UseSightingsForm()}
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap.sightings.path, { preview });

  if (!preview) {
    setPageCacheHeaders(ctx);
  }

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
