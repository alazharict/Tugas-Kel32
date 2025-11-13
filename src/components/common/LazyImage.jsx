import { useEffect, useRef, useState } from 'react';
import queryCache from '../../Utils/queryCache';

function humanFileSize(bytes) {
  if (!bytes) return null;
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + ' B';
  const units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1)+' '+units[u];
}

export default function LazyImage({ src, alt, className, recipeId }) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [diskSize, setDiskSize] = useState(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    } else {
      // fallback
      setInView(true);
    }
  }, [src]);

  useEffect(() => {
    if (!recipeId) return;
    try {
      const meta = queryCache.getMetaById(recipeId);
      if (meta && meta.diskCacheSize) setDiskSize(meta.diskCacheSize);
    } catch (e) {}
  }, [recipeId]);

  const handleLoad = () => {
    setLoaded(true);
    try {
      const img = imgRef.current;
      if (!img || !img.naturalWidth || !img.naturalHeight) return;
      // approximate byte size: width * height * 4 (RGBA)
      const approx = img.naturalWidth * img.naturalHeight * 4;
      queryCache.updateMetaById(recipeId, { diskCacheSize: approx, cacheSource: 'disk' });
      setDiskSize(approx);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div ref={imgRef} className={`w-full h-full ${className || ''} relative`}>
      {inView ? (
        // use loading=lazy as progressive enhancement and onLoad to report cache info
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-100" />
      )}
      {diskSize && (
        <div className="absolute left-2 bottom-2 z-30 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {humanFileSize(diskSize)} disk cache
        </div>
      )}
    </div>
  );
}
