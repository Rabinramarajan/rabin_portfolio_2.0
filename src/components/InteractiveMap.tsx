"use client";

import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { profile } from "@/content/profile";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
) as any;

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
) as any;

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
) as any;

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
) as any;

/**
 * Interactive geographical map showing your location in Chennai.
 * Uses Leaflet + OpenStreetMap for lightweight, responsive mapping.
 * Only renders on the client to avoid hydration issues with Leaflet.
 */
export function InteractiveMap() {
  // Chennai, India coordinates
  const locationCoords: LatLngExpression = [13.0827, 80.2707];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={locationCoords}
        zoom={12}
        scrollWheelZoom
        className="interactive-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={locationCoords}>
          <Popup>
            <div className="map-popup">
              <p className="map-popup-title">{profile.name}</p>
              <p className="map-popup-role">{profile.role}</p>
              <div className="map-popup-details">
                <span className="map-popup-badge">📍 {profile.location}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Contact info overlay */}
      <div className="map-overlay">
        <div className="map-overlay-content">
          <div className="map-contact-item">
            <MapPin size={18} />
            <div>
              <span className="map-contact-label">Location</span>
              <p className="map-contact-value">{profile.location}</p>
            </div>
          </div>
          <div className="map-contact-item">
            <Mail size={18} />
            <div>
              <span className="map-contact-label">Email</span>
              <a href={`mailto:${profile.email}`} className="map-contact-value map-link">
                {profile.email}
              </a>
            </div>
          </div>
          <div className="map-contact-item">
            <Phone size={18} />
            <div>
              <span className="map-contact-label">Phone</span>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="map-contact-value map-link">
                {profile.phone}
              </a>
            </div>
          </div>
          <div className="map-contact-item">
            <Clock size={18} />
            <div>
              <span className="map-contact-label">Response Time</span>
              <p className="map-contact-value">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
