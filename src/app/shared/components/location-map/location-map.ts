import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { prefersReducedMotion } from '../../../core/motion/gsap';

/** Free CARTO vector basemap: no API key, and attribution comes with the style. */
const BASEMAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
/**
 * Served from public/vendor, copied from maplibre-gl's dist folder at the pinned version.
 * The worker and its shared module must sit side by side, so both are copied.
 */
const STYLESHEET = '/vendor/maplibre-gl.css';
const WORKER = '/vendor/maplibre-gl-worker.mjs';

/**
 * A static, city-level map card. MapLibre and its stylesheet load only when the card
 * scrolls near the viewport, so the map costs nothing for readers who never reach it.
 * The map is not interactive: it is a location marker, not a page to navigate.
 */
@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.html',
  styleUrl: './location-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMap {
  /** Accessible name for the map, describing what it shows. */
  readonly label = input.required<string>();
  /** [longitude, latitude] of the marker. Use a city centre, never a home address. */
  readonly center = input.required<[number, number]>();
  readonly zoom = input(10);
  readonly caption = input.required<string>();

  private readonly canvas = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private readonly pin = viewChild.required<ElementRef<HTMLElement>>('pin');
  private readonly destroyRef = inject(DestroyRef);
  private map?: MapLibreMap;
  private destroyed = false;

  constructor() {
    afterNextRender(() => {
      // Without IntersectionObserver the map simply stays as its placeholder: no error
      if (typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          void this.init();
        },
        { rootMargin: '200px' },
      );
      observer.observe(this.canvas().nativeElement);

      this.destroyRef.onDestroy(() => {
        this.destroyed = true;
        observer.disconnect();
        this.map?.remove();
      });
    });
  }

  private async init(): Promise<void> {
    if (!document.querySelector(`link[href="${STYLESHEET}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = STYLESHEET;
      document.head.append(link);
    }

    const maplibregl = await import('maplibre-gl');
    // The component may have been destroyed while the library was loading
    if (this.destroyed) return;

    maplibregl.setWorkerUrl(WORKER);

    const map = new maplibregl.Map({
      container: this.canvas().nativeElement,
      style: BASEMAP_STYLE,
      center: this.center(),
      zoom: this.zoom(),
      interactive: false,
      attributionControl: { compact: true },
      fadeDuration: prefersReducedMotion() ? 0 : 300,
    });

    const pin = this.pin().nativeElement;
    pin.hidden = false;
    new maplibregl.Marker({ element: pin }).setLngLat(this.center()).addTo(map);

    this.map = map;
  }
}
