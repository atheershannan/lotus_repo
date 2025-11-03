# 💬 Standalone Chat Widget

## 📋 Overview

This is a **clean standalone HTML page** with just the floating chat widget. No dependencies, no frameworks - pure HTML, CSS, and JavaScript.

## 🎯 What's Included

- ✅ Floating circular chat button (bottom-right corner)
- ✅ Chat widget popup with Dark Emerald design
- ✅ Smooth animations and transitions
- ✅ Fully responsive (works on mobile and desktop)
- ✅ Ready to integrate with your backend API

## 🚀 How to Use

### Option 1: Open Directly
Simply open `standalone-chat-widget.html` in your browser!

### Option 2: Serve Locally
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Then open: `http://localhost:8000/standalone-chat-widget.html`

### Option 3: Deploy to Cloud
Upload the HTML file to any static hosting service:
- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel
- Any web server

## 🎨 Features

### Chat Button
- **Position**: Fixed bottom-right (24px from edges)
- **Size**: 64px × 64px (desktop), 56px × 56px (mobile)
- **Animation**: Pulse effect
- **Hover**: Scale up + glow effect

### Chat Widget
- **Size**: 420px × 600px (desktop), full width on mobile
- **Position**: Above the button
- **Animation**: Slide in from bottom
- **Features**: 
  - Header with bot info
  - Scrollable message area
  - Input field
  - Send button

### Dark Emerald Design
- Primary colors: `#065f46`, `#047857`, `#0f766e`
- Gradient backgrounds
- Subtle shadows and glows
- Smooth transitions

## 🔧 Customization

### Change Position
Edit the CSS:
```css
.chat-button {
    bottom: 24px;  /* Adjust bottom position */
    right: 24px;   /* Adjust right position */
}
```

### Change Size
```css
.chat-button {
    width: 64px;   /* Button width */
    height: 64px;  /* Button height */
}

.chat-widget {
    width: 420px;  /* Widget width */
    height: 600px; /* Widget height */
}
```

### Change Colors
Edit the CSS variables in `:root`:
```css
:root {
    --primary-blue: #065f46;
    --primary-purple: #047857;
    /* ... */
}
```

### Connect to Backend
Update the `sendMessage()` function in the JavaScript:
```javascript
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    messageInput.value = '';

    // Add your API call here
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(response => response.json())
    .then(data => {
        addMessage(data.response, 'bot');
    });
}
```

## 📱 Responsive Behavior

### Desktop (≥600px)
- Button: 64px × 64px
- Widget: 420px × 600px
- Bottom-right position

### Mobile (<600px)
- Button: 56px × 56px
- Widget: Full width (minus 48px padding), 70vh height
- Centered horizontally

## ⌨️ Keyboard Shortcuts

- **Enter**: Send message
- **Escape**: Close widget

## 🎭 Animations

1. **Button Pulse**: Continuous gentle pulse effect
2. **Widget Entrance**: Slide in from bottom with scale
3. **Message Fade**: Messages fade in smoothly
4. **Hover Effects**: Scale and glow on interaction

## 🐛 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 📝 License

Free to use and modify.

## 🤝 Contributing

Feel free to customize this widget for your needs!

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
