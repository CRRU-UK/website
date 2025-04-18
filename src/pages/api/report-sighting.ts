import type { NextApiRequest, NextApiResponse } from "next";

import joi from "joi";
import nodemailer from "nodemailer";

const schema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  date: joi.date().required(),
  "time-start": joi.string().required(),
  "time-end": joi.string().required(),
  location: joi.string().required(),
  species: joi.string().required(),
  longitude: joi.string().optional().allow(""),
  latitude: joi.string().optional().allow(""),
  amount: joi.number().optional().allow(""),
  "sea-state": joi.string().optional().allow(""),
  weather: joi.string().optional().allow(""),
  depth: joi.number().optional().allow(""),
  vessel: joi.string().optional().allow(""),
  notes: joi.string().optional().allow(""),
  "cf-turnstile-response": joi.string().required(), // Required for CloudFlare challenge
});

const mailerTransporter = nodemailer.createTransport({
  host: String(process.env.NODE_SMTP_HOST),
  port: parseInt(String(process.env.NODE_SMTP_PORT), 10),
  auth: {
    user: String(process.env.NODE_SMTP_USERNAME),
    pass: String(process.env.NODE_SMTP_PASSWORD),
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers, body } = req;

  if (!body["cf-turnstile-response"]) {
    return res.status(400).json({
      success: false,
      resetChallenge: false,
      errors: ["Please complete the challenge"],
    });
  }

  // Validate request body
  const validation = schema.validate(body, { abortEarly: false });
  if (validation?.error) {
    const errors = validation.error.details.map(({ message }) => message);
    return res.status(400).json({
      success: false,
      resetChallenge: false,
      errors,
    });
  }

  // Validate CloudFlare challenge
  const challengeRequest = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.NODE_CLOUDFLARE_CHALLENGE_SECRET_KEY,
        response: body["cf-turnstile-response"],
        ...(headers["cf-connecting-ip"] && {
          remoteip: headers["cf-connecting-ip"],
        }),
      }),
    },
  );

  const challengeResult = await challengeRequest.json();
  if (!challengeResult.success) {
    return res.status(401).json({
      success: false,
      resetChallenge: true,
      errors: ["Challenge is invalid or expired, please complete it again"],
    });
  }

  try {
    // Don't include Cloudflare Challenge response in email body
    delete body["cf-turnstile-response"];

    await mailerTransporter.sendMail({
      from: "CRRU Sighting Report Form <sightings@crru.org.uk>",
      to: process.env.NODE_SIGHTING_EMAIL,
      subject: `Website Sighting Form Submission (${body.date}, ${body.location})`,
      text: Object.entries(body)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join("\n"),
      html: Object.entries(body)
        .map(([key, value]) => `<b>${key.toUpperCase()}:</b> ${value}`)
        .join("<br />"),
    });
  } catch (error) {
    console.error("Unable to send email:", { error });

    return res.status(500).json({
      success: false,
      resetChallenge: false,
      errors: ["An issue occurred, please try submitting the form again"],
    });
  }

  return res.status(200).json({
    success: true,
    resetChallenge: false,
  });
};

export default handler;
