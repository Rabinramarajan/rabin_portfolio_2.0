# Media Optimization Guide

## Completed Optimizations

### Image Optimization ✅
**Status**: COMPLETE
- **Original**: 18.86 MB
- **Optimized**: 3.73 MB
- **Savings**: 80.2%

All PNG images have been converted to WebP and AVIF formats:

#### Service Images
- service_1-7.png → service_1-7.webp + .avif
- service/hero.png → hero.webp + .avif
- service/banner.png → banner.webp + .avif
- Typical savings: 90-93% for service images

#### Large Images
- experience/banner_img.png → banner_img.webp + .avif (86.6% savings)
- skills/1.png → 1.webp + .avif (90.9% savings)

#### Project Images
- fiji_external_application/image1.png → .webp
- vnpf_mobile/composite-thumb.png → .webp

#### Updated References
✅ `src/content/services.ts` - Updated all service image references
✅ `src/content/skills.ts` - Updated skill hero visual
✅ `src/content/profile.ts` - Updated hero and profile images

### Video Optimization

#### Hero Banner Video
- **File**: `/media/hero/banner_v.mp4`
- **Current Size**: 2.78 MB
- **Recommendation**: Further compression + poster image
- **Poster**: `/media/hero/banner-poster.webp` (8.31 KB) ✅ Created

#### Service Videos
- `/media/service/angular.mp4` (2.46 MB)
- `/media/service/react_application.mp4` (2.67 MB)
- `/media/service/performance.mp4` (2.44 MB)

### GIF Replacement ✅
**Status**: HANDLED

The 8.4 MB angular.gif has been replaced:
- **Old**: `/media/service/angular.gif` (GIF format, 8.4 MB)
- **New**: Media type changed to `video` with reference to `ionic-demo.mp4`
- **Note**: The `ionic-demo.mp4` file should be created from the GIF or as a replacement video

**To convert GIF to MP4 (requires ffmpeg)**:
```bash
ffmpeg -i public/media/service/angular.gif -c:v libx264 -preset slow -crf 20 -c:a aac public/media/service/ionic-demo.mp4
```

**Estimated savings**: 8+ MB (GIF → MP4 typically saves 80-90%)

## Implementation

### Update Next.js Config
The `next.config.ts` already includes optimized image format support:
```typescript
images: {
  formats: ["image/avif", "image/webp"],
},
```

### Image Component Usage
The `SmartImage` component in `src/components/SmartImage.tsx` provides:
- ✅ Lazy loading by default
- ✅ Async decoding
- ✅ Placeholder images to prevent CLS
- ✅ Automatic WebP/AVIF selection

### Video Component Usage
Videos in `src/components/pages/ServiceVisual.tsx` use:
- ✅ HTML5 video elements
- ✅ Poster images for better UX
- ✅ Muted autoplay (respects prefers-reduced-motion)
- ✅ Lazy loading attributes

## Performance Impact

### Before Optimization
- Images: ~19 MB
- Videos: ~10 MB
- Total Media: ~29 MB

### After Optimization
- Images: ~3.7 MB (80% reduction)
- Videos: ~10 MB (unchanged)
- Total Media: ~14 MB (52% reduction overall)

### Bundle Size Impact
- JS: 1.7 MB (unchanged)
- CSS: 192 KB (unchanged)
- Media: 14 MB (from 29 MB)

**Total Site Size**: ~16.5 MB (from 30.9 MB) = 47% reduction

## Remaining Optimization Opportunities

### High Priority
1. **Video Compression**: Reduce video file sizes 30-50%
   - Use H.264 codec optimization
   - Lower bitrate: 1500-2000 kbps for demo videos
   - Reduce resolution: 1280x720 instead of 1920x1080

2. **GIF Replacement**: Convert/create MP4 from angular.gif
   - Estimated 8 MB savings
   - Use MP4 instead of GIF

### Medium Priority
1. **JavaScript Bundle**: Audit for dead code (target: 10-15% reduction)
2. **CSS**: Remove unused Tailwind classes
3. **Font Optimization**: Verify only needed weights are loaded

### Low Priority
1. **Third-party Scripts**: Defer non-critical analytics
2. **Component Code Splitting**: Lazy-load below-fold sections

## Testing Checklist

- [ ] Test all pages load correctly
- [ ] Verify images display with optimized formats
- [ ] Check video playback works
- [ ] Test mobile responsiveness
- [ ] Verify no console errors
- [ ] Run production build
- [ ] Check performance metrics

## Scripts

### Image Optimization
```bash
node scripts/optimize-media.js
```
Converts PNG images to WebP/AVIF

### Video Poster Generation
```bash
node scripts/generate-video-posters.js
```
Creates poster images for videos

## Next Steps

1. Test production build
2. Compress service videos
3. Replace GIF with MP4
4. Test performance metrics
5. Audit JavaScript for dead code
6. Remove unused CSS
