"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import personalData from '@/data/personal.json';
import type { LanyardFace } from '@/lib/lanyard-choreography';
import { createLanyardScene, getInitials, type LanyardScene } from '@/lib/lanyard-scene';

const initials = getInitials(personalData.professionalName);

function preparePortrait(scene: LanyardScene, image: HTMLImageElement, onError: () => void) {
  try {
    scene.setPortrait(image);
  } catch (error) {
    if (!(error instanceof RangeError) && !(error instanceof DOMException)) throw error;
    console.error('Unable to prepare the lanyard profile photo:', error);
    onError();
  }
}

export function HeroLanyard({ heroElement }: { heroElement: HTMLElement | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitAreaRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const qrRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const sceneRef = useRef<LanyardScene | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasPhotoError, setHasPhotoError] = useState(false);
  const [hasQrError, setHasQrError] = useState(false);
  const [face, setFace] = useState<LanyardFace>('front');

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const hitArea = hitAreaRef.current;
    if (!heroElement || !canvas || !stage || !hitArea) return;

    let cancelled = false;
    const controller = new AbortController();
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(preference.matches);
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      sceneRef.current?.setReducedMotion(event.matches);
    };
    preference.addEventListener('change', onPreferenceChange);

    const initialize = async () => {
      try {
        // Let the hero entrance (blur-in, ~0.9s with stagger) finish before the
        // scene build (sticker-wall textures + PMREM + physics) occupies the
        // main thread. Without this the ~2s texture pass freezes the entrance.
        await new Promise<void>((resolve) => setTimeout(resolve, 900));
        const scene = await createLanyardScene(canvas, {
          name: personalData.professionalName,
          title: personalData.title,
          location: personalData.location,
        }, {
          reducedMotion: preference.matches,
          stage,
          hitArea,
          onFaceChange: setFace,
          signal: controller.signal,
          onContextLost: () => {
            console.error('The 3D lanyard lost its WebGL context.');
            if (!cancelled) setStatus('unavailable');
          },
        });
        if (cancelled) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        scene.setReducedMotion(preference.matches);
        const portrait = portraitRef.current;
        if (portrait?.complete) {
          if (portrait.naturalWidth > 0 && portrait.naturalHeight > 0) {
            preparePortrait(scene, portrait, () => {
              scene.clearPortrait();
              setHasPhotoError(true);
            });
          } else {
            console.error('The lanyard profile photo could not be loaded.');
            scene.clearPortrait();
            setHasPhotoError(true);
          }
        }
        const qr = qrRef.current;
        if (qr?.complete) {
          if (qr.naturalWidth > 0 && qr.naturalHeight > 0) scene.setQr(qr);
          else {
            console.error('The lanyard QR image could not be loaded.');
            scene.setQrUnavailable();
            setHasQrError(true);
          }
        }
        const logo = logoRef.current;
        if (logo?.complete && logo.naturalWidth > 0 && logo.naturalHeight > 0) scene.setLogo(logo);
        setStatus('ready');
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to render the 3D lanyard:', error);
          setStatus('unavailable');
        }
      }
    };

    void initialize();
    return () => {
      cancelled = true;
      controller.abort();
      preference.removeEventListener('change', onPreferenceChange);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [heroElement]);

  const flip = () => {
    if (status === 'ready' && sceneRef.current) sceneRef.current.flip();
    else setFace((current) => current === 'front' ? 'back' : 'front');
  };

  return (
    <div
      className="mx-auto w-full max-w-[552px]"
      role="group"
      aria-label={hasPhotoError ? 'Portfolio lanyard' : `Portfolio lanyard with a portrait of ${personalData.professionalName}`}
    >
      <div
        ref={stageRef}
        data-lanyard-stage
        className="relative h-[min(576px,85dvh)] w-full lg:h-[min(648px,85dvh)]"
      >
        {status === 'unavailable' && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[29%] w-9 -translate-x-1/2 border-x-2 border-lime bg-ink" />
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[27%] h-8 w-10 -translate-x-1/2 rounded-base border-2 border-ink bg-card" />
            <button
              type="button"
              data-lanyard-fallback
              aria-describedby="lanyard-hint"
              aria-label={face === 'front' ? 'Flip badge to show QR code' : 'Flip badge to show ID'}
              aria-pressed={face === 'back'}
              onClick={flip}
              className="absolute left-1/2 top-[32%] flex h-[63%] aspect-[0.64] -translate-x-1/2 -rotate-[4deg] flex-col overflow-hidden rounded-base border-2 border-ink bg-card text-left shadow-neo-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
            >
            {face === 'front' ? (
              <>
                <div className="flex items-center gap-2 px-3 py-4 font-display text-[10px] uppercase">
                  <span className="bg-violet p-1 text-white">{initials}</span>
                  <span>{personalData.professionalName}</span>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-lime">
                  <span className="font-display text-[clamp(4rem,16vw,7rem)] leading-none text-violet">{initials}</span>
                  {!hasPhotoError && (
                    <Image
                      src={personalData.profileImage}
                      alt=""
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 260px, 320px"
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="px-3 py-3">
                  <p className="font-display text-sm uppercase leading-tight">{personalData.professionalName}</p>
                  <p className="mt-1 font-mono text-[9px] font-bold uppercase">{personalData.title}</p>
                </div>
                <div className="h-3 bg-violet" />
              </>
            ) : (
              <>
                <div className="px-3 py-4 font-display text-[10px] uppercase">{personalData.professionalName}</div>
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 bg-ink px-3 py-3">
                  <span className="self-start font-display text-xs uppercase text-lime">Scan to connect</span>
                  {hasQrError ? (
                    <span className="font-mono text-xs font-bold text-white">QR unavailable</span>
                  ) : (
                    <Image src="/images/qr-links.png" alt="" width={1024} height={1024} unoptimized className="min-h-0 max-h-full w-full object-contain" />
                  )}
                </div>
                <div className="h-3 bg-violet" />
              </>
            )}
            </button>
          </>
        )}
      </div>

      <Image
        ref={portraitRef}
        src={personalData.profileImage}
        alt=""
        width={844}
        height={1500}
        unoptimized
        loading="eager"
        className="hidden"
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            if (sceneRef.current) preparePortrait(sceneRef.current, image, () => {
              sceneRef.current?.clearPortrait();
              setHasPhotoError(true);
            });
          }
          else {
            console.error('The lanyard profile photo has invalid dimensions.');
            sceneRef.current?.clearPortrait();
            setHasPhotoError(true);
          }
        }}
        onError={() => {
          console.error('Unable to load the lanyard profile photo:', personalData.profileImage);
          sceneRef.current?.clearPortrait();
          setHasPhotoError(true);
        }}
      />
      <Image
        ref={qrRef}
        src="/images/qr-links.png"
        alt=""
        width={1024}
        height={1024}
        unoptimized
        loading="eager"
        className="hidden"
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) sceneRef.current?.setQr(image);
          else {
            console.error('The lanyard QR image has invalid dimensions.');
            sceneRef.current?.setQrUnavailable();
            setHasQrError(true);
          }
        }}
        onError={() => {
          console.error('Unable to load the lanyard QR image.');
          sceneRef.current?.setQrUnavailable();
          setHasQrError(true);
        }}
      />
      <Image
        ref={logoRef}
        src="/apple-icon.png"
        alt=""
        width={64}
        height={64}
        unoptimized
        loading="eager"
        className="hidden"
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) sceneRef.current?.setLogo(image);
        }}
      />

      {heroElement && createPortal(
        <div className="pointer-events-none absolute inset-0 z-[90]" data-lanyard-overlay>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />
          <button
            ref={hitAreaRef}
            type="button"
            data-lanyard-hit-area
            aria-describedby="lanyard-hint"
            aria-label={face === 'front'
              ? 'Flip badge to show QR code and pause automatic motion'
              : 'Flip badge to show ID and resume automatic motion'}
            aria-pressed={face === 'back'}
            onClick={(event) => {
              if (event.detail === 0) flip();
            }}
            className={`absolute left-0 top-0 border-0 bg-transparent p-0 focus-visible:bg-violet/15 focus-visible:shadow-[inset_0_0_0_3px_#7f3aed] ${status === 'ready' ? 'pointer-events-auto' : 'pointer-events-none'}`}
            style={{ display: 'none', touchAction: 'pinch-zoom' }}
          />
        </div>,
        heroElement,
      )}

      <div id="lanyard-hint" data-lanyard-hint className="relative -mt-12 flex min-h-12 flex-col items-center justify-center text-center">
        {status === 'unavailable' ? (
          <p className="font-body text-sm text-ink/70">3D preview unavailable. Tap the static badge to flip it.</p>
        ) : reducedMotion ? (
          <p className="font-body text-sm text-ink/70">Motion reduced. Tap the badge to see the QR.</p>
        ) : (
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink">
            <span className="bg-[linear-gradient(180deg,transparent_45%,#c6ff34_45%)] px-[3px] pb-[3px]">
              Drag to swing · tap for QR and pause
            </span>
          </p>
        )}
        {hasPhotoError && (
          <p className="font-body text-sm text-ink/70" role="status">Profile photo unavailable. Showing initials.</p>
        )}
        {hasQrError && (
          <p className="font-body text-sm text-ink/70" role="status">QR unavailable. Use the link hub below.</p>
        )}
        <a
          href="/links"
          className={hasQrError
            ? 'font-mono text-xs font-bold uppercase underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet'
            : 'sr-only focus:not-sr-only focus:absolute focus:top-full focus:z-10 focus:bg-card focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:underline focus:outline-2 focus:outline-violet'}
        >
          Open link hub without scanning
        </a>
      </div>
    </div>
  );
}
