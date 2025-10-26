# How to Add Images or Videos to the Hero Banner

## Quick Guide

The hero banner at the top of every page now has a placeholder for your custom image or video.

### Option 1: Add an Image

1. **Place your image** in the `frontend/public` folder (e.g., `hero-banner.jpg`)

2. **Edit** `frontend/src/components/Layout.js` around **line 254**

3. **Replace** this section:
```jsx
<div className="absolute inset-0 flex items-center justify-center">
  <div className="text-center">
    <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* SVG content */}
      </svg>
    </div>
    <p className="text-xs text-white/80">Add your video or image here</p>
  </div>
</div>
```

4. **With**:
```jsx
<img
  src="/hero-banner.jpg"
  alt="LeadStream Hero"
  className="w-full h-full object-cover"
/>
```

### Option 2: Add a Video

1. **Place your video** in the `frontend/public` folder (e.g., `hero-video.mp4`)

2. **Edit** `frontend/src/components/Layout.js` around **line 254**

3. **Replace** the same section with:
```jsx
<video
  src="/hero-video.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
/>
```

### Option 3: Use an External URL

For images or videos hosted elsewhere:

```jsx
{/* For external image */}
<img
  src="https://your-cdn.com/image.jpg"
  alt="Hero"
  className="w-full h-full object-cover"
/>

{/* For external video */}
<video
  src="https://your-cdn.com/video.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
/>
```

### Option 4: YouTube/Vimeo Embed

For YouTube videos:

```jsx
<iframe
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID"
  className="w-full h-full"
  frameBorder="0"
  allow="autoplay; encrypted-media"
  allowFullScreen
></iframe>
```

## Customization Tips

### Adjust Banner Height

In `Layout.js` line 207, change the height:
```jsx
{/* Current: h-48 (12rem / 192px) */}
<div className="relative h-48 bg-gradient-to-r...">

{/* For taller banner: */}
<div className="relative h-64 bg-gradient-to-r...">

{/* For shorter banner: */}
<div className="relative h-32 bg-gradient-to-r...">
```

### Change Media Display Size

In `Layout.js` line 253, adjust the width/height:
```jsx
{/* Current: w-64 h-32 */}
<div className="hidden lg:block relative w-64 h-32">

{/* Make it bigger: */}
<div className="hidden lg:block relative w-96 h-48">

{/* Make it smaller: */}
<div className="hidden lg:block relative w-48 h-24">
```

### Add Overlay Effect

Wrap your image/video with an overlay:
```jsx
<div className="relative w-full h-full">
  <img src="/hero-banner.jpg" alt="Hero" className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
</div>
```

## Recommended Media Specifications

### Images
- **Format**: JPG, PNG, or WebP
- **Dimensions**: 512x256px (2:1 ratio)
- **File Size**: < 500KB for best performance
- **Optimization**: Use tools like TinyPNG or ImageOptim

### Videos
- **Format**: MP4 (H.264 codec)
- **Dimensions**: 1280x640px or 512x256px
- **Duration**: 5-15 seconds (looping)
- **File Size**: < 2MB for best performance
- **Framerate**: 30fps

## Example: Adding Your Company Logo Animation

```jsx
<div className="hidden lg:block relative w-64 h-32">
  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden p-4">
    <img
      src="/company-logo-animated.gif"
      alt="Company Logo"
      className="w-full h-full object-contain"
    />
  </div>
</div>
```

---

## Need Help?

- The hero banner code is in: `frontend/src/components/Layout.js` (lines 206-271)
- Media files go in: `frontend/public/`
- After adding media, the browser will automatically refresh (hot reload)

Enjoy your customized futuristic CRM! 🚀
