// src/App.tsx
import React, { useEffect, useState } from "react";
import posterImage from "./assets/poster.jpg"; // your local poster

const SALES_OPEN_DATE = new Date(2025, 11, 3, 0, 0, 0); // Dec 3, 2025 (month is 0-based)
const DRAW_DATE = new Date(2026, 0, 4, 14, 30, 0);      // Jan 4, 2026, 2:30 PM

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

function getTimeParts(target: Date): TimeParts {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, finished: false };
}

export default function App() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const beforeSalesOpen = now < SALES_OPEN_DATE;
  const afterDraw = now > DRAW_DATE;
  const salesAreOpen = !beforeSalesOpen && !afterDraw;

  const salesCountdown = getTimeParts(SALES_OPEN_DATE);
  const drawCountdown = getTimeParts(DRAW_DATE);

  const formatCountdown = (c: TimeParts) =>
    `${c.days}d : ${String(c.hours).padStart(2, "0")}h : ${String(
      c.minutes
    ).padStart(2, "0")}m : ${String(c.seconds).padStart(2, "0")}s`;

  let statusLabel = "";
  let countdownLabel = "";
  let countdownValue = "";
  let purchaseDisabled = false;

  if (beforeSalesOpen) {
    statusLabel = "Ticket Sales Opening Soon";
    countdownLabel = "Sales open in:";
    countdownValue = formatCountdown(salesCountdown);
    purchaseDisabled = true;
  } else if (salesAreOpen) {
    statusLabel = "Tickets On Sale Now!";
    countdownLabel = "Draw happens in:";
    countdownValue = formatCountdown(drawCountdown);
    purchaseDisabled = false;
  } else {
    statusLabel = "Draw Complete";
    countdownLabel = "Draw status:";
    countdownValue = "The draw has ended. Thank you for your support!";
    purchaseDisabled = true;
  }

  const handleOpenPoster = () => {
    // Open the local poster image in a new tab
    window.open(posterImage, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      <div className="card">
        <header className="header">
          <h1>Grandson&apos;s Fundraiser</h1>
          <p className="subtitle">
            Supporting the team with a prize draw on{" "}
            <strong>January 4, 2026 at 2:30 PM</strong>.
          </p>
        </header>

        <div className="poster-wrapper">
          <img
            src={posterImage}
            alt="Fundraiser Poster"
            className="poster-image"
          />
        </div>

        <section className="info">
          <div className="status-tag">{statusLabel}</div>

          <div className="countdown-block">
            <p className="countdown-label">{countdownLabel}</p>
            <p className="countdown-value">{countdownValue}</p>
          </div>

          <p className="dates-text">
            <strong>Ticket sales open:</strong> December 3, 2025
            <br />
            <strong>Prize draw:</strong> January 4, 2026 at 2:30 PM
          </p>

          <div className="buttons-row">
            <button
              className={`primary-btn ${purchaseDisabled ? "disabled" : ""}`}
              disabled={purchaseDisabled}
              onClick={handleOpenPoster}
            >
              {beforeSalesOpen
                ? "Tickets Available Soon"
                : afterDraw
                ? "Sales Closed"
                : "View Poster & Details"}
            </button>

            <button className="ghost-btn" onClick={handleOpenPoster}>
              Open Full Poster
            </button>
          </div>
        </section>

        <footer className="footer">
          <p>Thank you for supporting our family and the team. 💙</p>
        </footer>
      </div>
    </div>
  );
}
