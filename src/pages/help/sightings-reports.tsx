/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextPage, GetServerSideProps } from "next";

import React, { useState } from "react";
import Script from "next/script";

import type { PageData } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import getPageContent from "@/helpers/getPageContent";

import CommonPage from "@/layout/CommonPage";

const UseSightingsForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);

  const resetChallenge = () => (window as any)?.turnstile?.reset();

  const currentDate = new Date();
  const defaultDate = currentDate.toISOString().substring(0, 10);
  const defaultTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);

    const data = JSON.stringify({
      name: event.target.name.value,
      email: event.target.email.value,
      date: event.target.date.value,
      "time-start": event.target["time-start"].value,
      "time-end": event.target["time-end"].value,
      location: event.target.location.value,
      species: event.target.species.value,
      longitude: event.target.longitude.value ?? undefined,
      latitude: event.target.latitude.value ?? undefined,
      amount: event.target.amount.value ?? undefined,
      "sea-state": event.target["sea-state"].value ?? undefined,
      weather: event.target.weather.value ?? undefined,
      depth: event.target.depth.value ?? undefined,
      vessel: event.target.vessel.value ?? undefined,
      notes: event.target.notes.value ?? undefined,
      "cf-turnstile-response": event.target["cf-turnstile-response"].value,
    });

    let request;

    try {
      request = await fetch("/api/report-sighting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      });
    } catch (error: any) {
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

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <form onSubmit={handleSubmit} className={loading ? "form-loading" : ""}>
        <div className="form-columns">
          <label htmlFor="name">
            <span>Name of observer: *</span>
            <input type="text" id="name" name="name" required disabled={loading} />
          </label>

          <label htmlFor="email">
            <span>Email: *</span>
            <input type="email" id="email" name="email" required disabled={loading} />
          </label>

          <label htmlFor="date">
            <span>Date of sighting: *</span>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={defaultDate}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="time-start">
            <span>Time (start): *</span>
            <input
              type="time"
              id="time-start"
              name="time-start"
              defaultValue={defaultTime}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="time-end">
            <span>Time (end): *</span>
            <input
              type="time"
              id="time-end"
              name="time-end"
              defaultValue={defaultTime}
              required
              disabled={loading}
            />
          </label>

          <label htmlFor="location">
            <span>Location / landmark: *</span>
            <input type="text" id="location" name="location" required disabled={loading} />
          </label>

          <label htmlFor="species">
            <span>Species observed: *</span>
            <select name="species" id="species" defaultValue="" disabled={loading}>
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

          <label htmlFor="longitude">
            <span>Longitude:</span>
            <input type="text" id="longitude" name="longitude" disabled={loading} />
          </label>

          <label htmlFor="latitude">
            <span>Latitude:</span>
            <input type="text" id="latitude" name="latitude" disabled={loading} />
          </label>

          <label htmlFor="amount">
            <span>Number of animals present:</span>
            <input type="number" id="amount" name="amount" disabled={loading} />
          </label>

          <label htmlFor="sea-state">
            <span>Sea state:</span>
            <select name="sea-state" id="sea-state" defaultValue="" disabled={loading}>
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

          <label htmlFor="weather">
            <span>Weather conditions:</span>
            <select name="weather" id="weather" defaultValue="" disabled={loading}>
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

          <label htmlFor="depth">
            <span>Depth (from depth sounder, in meters):</span>
            <input type="number" id="depth" name="depth" disabled={loading} />
          </label>

          <label htmlFor="vessel">
            <span>Name of Vessel:</span>
            <input type="text" id="vessel" name="vessel" disabled={loading} />
          </label>
        </div>

        <label htmlFor="notes">
          <span>
            Additional notes (e.g. behaviour observed, direction of travel, composition of group
            i.e. number of adults and calves, other):
          </span>
          <textarea id="notes" name="notes" rows={5} disabled={loading} />
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
  <CommonPage page={sitemap.sightings} breadcrumbs={[sitemap.sightings]} data={data}>
    {UseSightingsForm()}
  </CommonPage>
);

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const preview = ctx?.query.preview === "true";
  const data = await getPageContent(sitemap.sightings.path, { preview });

  return {
    props: {
      preview,
      data,
    },
  };
};

export default Page;
