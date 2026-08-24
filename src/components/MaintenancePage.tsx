"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "@/components/motion";
import { useMotionTier } from "@/lib/motion-tier";
import "./maintenance.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function MaintenancePage() {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 2,
    hours: 14,
    minutes: 37,
    seconds: 52,
  });

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    // Set target date to 2.6 days from now
    const targetDate = new Date();
    targetDate.setTime(targetDate.getTime() + 2.6 * 24 * 60 * 60 * 1000);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubscribed(true);
    setEmail("");
    setIsLoading(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: quiet ? 0.3 : 0.6,
      },
    },
  };

  return (
    <div className="cmaintenance">
      {/* Background elements */}
      <div className="cmaintenance__bg">
        <div className="cmaintenance__bg-grid" />
        <div className="cmaintenance__bg-glow" />
      </div>

      {/* Content */}
      <div className="cmaintenance__container">
        {/* Left Content */}
        <motion.div
          className="cmaintenance__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="cmaintenance__header" variants={itemVariants}>
            <div className="cmaintenance__logo">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="28"
                  fontWeight="bold"
                  fill="#c9f24d"
                  fontFamily="Inter Tight"
                >
                  R
                </text>
              </svg>
            </div>
            <div>
              <p className="cmaintenance__tagline">RABIN R</p>
              <p className="cmaintenance__subtitle">Frontend Angular Consultant</p>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div className="cmaintenance__hero" variants={itemVariants}>
            <p className="cmaintenance__status">WE'RE MAKING THINGS BETTER</p>
            <h1 className="cmaintenance__title">
              Under
              <span className="cmaintenance__accent">Maintenance</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            className="cmaintenance__description"
            variants={itemVariants}
          >
            I'm currently working on something awesome.
            <br />
            The site will be back soon with an even better experience.
          </motion.p>

          {/* Feature Cards */}
          <motion.div className="cmaintenance__features" variants={itemVariants}>
            {[
              { icon: "⏱️", label: "Improving", value: "Performance" },
              { icon: "</> ", label: "Refining", value: "Code" },
              { icon: "✏️", label: "Enhancing", value: "Design" },
              { icon: "🚀", label: "Better Than", value: "Before" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="cmaintenance__feature-card"
                whileHover={quiet ? undefined : { y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cmaintenance__feature-icon">{feature.icon}</div>
                <div className="cmaintenance__feature-text">
                  <p className="cmaintenance__feature-label">{feature.label}</p>
                  <p className="cmaintenance__feature-value">{feature.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Email Subscription */}
          <motion.div
            className="cmaintenance__subscription"
            variants={itemVariants}
          >
            <h2 className="cmaintenance__subscription-title">
              Stay in the loop
            </h2>
            <p className="cmaintenance__subscription-text">
              Leave your email and I'll notify you once we're live again.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="cmaintenance__subscription-form"
            >
              <div className="cmaintenance__input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="cmaintenance__input"
                  required
                  disabled={isSubscribed}
                />
                <Magnetic>
                  <button
                    type="submit"
                    className="cmaintenance__btn"
                    disabled={isSubscribed || isLoading}
                  >
                    {isSubscribed ? "✓ Subscribed" : "Notify Me"}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M1 8h14M8 1l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Magnetic>
              </div>
              <p className="cmaintenance__notice">
                🛡️ No spam. Only updates about new launches and articles.
              </p>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div className="cmaintenance__social" variants={itemVariants}>
            <p className="cmaintenance__social-label">Follow for updates</p>
            <div className="cmaintenance__social-links">
              <a
                href="https://linkedin.com"
                className="cmaintenance__social-link"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a
                href="https://github.com"
                className="cmaintenance__social-link"
                aria-label="GitHub"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="cmaintenance__social-link"
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2s9 5 20 5a9.5 9.5 0 0 0-9-5.5c4.75 2.25 9 0 11-4s1-6.75 0-7.5a5.5 5.5 0 0 0-.5-.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="mailto:hello@rabinr.in"
                className="cmaintenance__social-link"
                aria-label="Email"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M2 6l10 7.5L22 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Illustration & Countdown */}
        <motion.div
          className="cmaintenance__illustration"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated 3D-like construction scene */}
          <div className="cmaintenance__scene">
            {/* Gears - animated rotation */}
            <motion.div
              className="cmaintenance__gear cmaintenance__gear-1"
              animate={quiet ? undefined : { rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ⚙️
            </motion.div>

            <motion.div
              className="cmaintenance__gear cmaintenance__gear-2"
              animate={quiet ? undefined : { rotate: -360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ⚙️
            </motion.div>

            <motion.div
              className="cmaintenance__gear cmaintenance__gear-3"
              animate={quiet ? undefined : { rotate: 360 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ⚙️
            </motion.div>

            {/* Main R Letter */}
            <motion.div
              className="cmaintenance__r-letter"
              animate={quiet ? undefined : { y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="cmaintenance__r-glow">R</div>
              <div className="cmaintenance__r-text">R</div>
            </motion.div>

            {/* Crane - animated sway */}
            <motion.div
              className="cmaintenance__crane"
              animate={quiet ? undefined : { x: [0, 8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🏗️
            </motion.div>

            {/* Barrier cones */}
            <motion.div
              className="cmaintenance__barrier"
              animate={quiet ? undefined : { y: [0, 4, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              🚧
            </motion.div>

            {/* Floating particles */}
            {!quiet &&
              [0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="cmaintenance__particle"
                  style={{ left: `${20 + i * 20}%` }}
                  animate={{
                    y: [0, -60, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  ✨
                </motion.div>
              ))}
          </div>

          {/* Progress & Status Card */}
          <motion.div
            className="cmaintenance__status-card"
            animate={
              quiet
                ? undefined
                : { opacity: [0.8, 1, 0.8], scale: [0.98, 1, 0.98] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="cmaintenance__status-header">
              <div className="cmaintenance__status-icon">⏱️</div>
              <div className="cmaintenance__status-title">
                Back Online Soon
              </div>
            </div>
            <p className="cmaintenance__status-message">
              We're working hard to bring you a seamless experience.
            </p>
            <div className="cmaintenance__progress-bar">
              <motion.div
                className="cmaintenance__progress-fill"
                animate={quiet ? undefined : { width: "75%" }}
                transition={{
                  duration: 2,
                }}
              />
            </div>
            <p className="cmaintenance__progress-text">UPGRADING EXPERIENCE 75%</p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            className="cmaintenance__countdown"
            variants={itemVariants}
          >
            <div className="cmaintenance__countdown-grid">
              <div className="cmaintenance__countdown-item">
                <div className="cmaintenance__countdown-value">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="cmaintenance__countdown-label">Days</div>
              </div>
              <div className="cmaintenance__countdown-item">
                <div className="cmaintenance__countdown-value">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="cmaintenance__countdown-label">Hours</div>
              </div>
              <div className="cmaintenance__countdown-item">
                <div className="cmaintenance__countdown-value">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="cmaintenance__countdown-label">Minutes</div>
              </div>
              <div className="cmaintenance__countdown-item">
                <div className="cmaintenance__countdown-value">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="cmaintenance__countdown-label">Seconds</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="cmaintenance__footer"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <p>© 2026 Rabin R. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
