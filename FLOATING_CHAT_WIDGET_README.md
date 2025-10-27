# 🧠 Floating RAG Chatbot Agent with Dark Emerald UI

## 📋 Overview

The Learning Assistant has been refactored into a **floating chat widget** that appears on all pages of the application. The widget maintains all existing RAG functionality while providing a modern, accessible, and responsive user experience.

## ✨ Features

### Core Functionality
- ✅ **Floating circular chat button** (bottom-right corner)
- ✅ **Popup chat window** with smooth animations
- ✅ **Persistent across all pages** (Dashboard, Content, Skills, etc.)
- ✅ **Global state management** using React Context
- ✅ **Smooth open/close animations** with Framer Motion
- ✅ **Dark Emerald Design System** integration
- ✅ **Day/Night mode support** via CSS variables
- ✅ **Responsive design** for mobile and desktop
- ✅ **LocalStorage persistence** for open/closed state
- ✅ **Keyboard navigation** (Escape to close)
- ✅ **Click outside to close** functionality

### Existing Features Preserved
- ✅ Full RAG API connection
- ✅ Chat history and session management
- ✅ Message feedback system
- ✅ Confidence scoring
- ✅ Source citation
- ✅ Response time tracking
- ✅ Analytics integration

## 📁 File Structure

```
FRONTEND/src/
├── components/
│   └── chat/
│       ├── ChatAgentButton.jsx    # Floating circular button
│       ├── ChatWidget.jsx         # Popup chat window
│       └── ChatbotUI.js           # Core chat UI (existing)
├── context/
│   └── ChatContext.js             # Global chat state management
├── App.js                          # Main app with provider wrapper
└── index.css                       # Dark Emerald styles (updated)
```

## 🎨 Design System

### Dark Emerald Color Palette
- **Primary**: `#065f46`, `#047857`, `#0f766e`
- **Accent**: `#d97706`, `#f59e0b`
- **Gradients**: Emerald gradients with subtle shadows
- **Shadows**: `var(--shadow-glow)`, `var(--shadow-card)`, `var(--shadow-hover)`

### Responsive Breakpoints
- **Mobile**: < 600px (widget fills 70vh height, full width minus padding)
- **Desktop**: ≥ 600px (420px fixed width, 600px height)

## 🚀 Usage

### Basic Implementation
The chat widget is automatically included in all pages via the `App.js` wrapper:

```jsx
// App.js already includes:
<ChatContextProvider>
  <ChatAgentButton />
  <ChatWidget />
</ChatContextProvider>
```

### Programmatic Control
Access chat state in any component:

```jsx
import { useChatContext } from '../context/ChatContext';

function MyComponent() {
  const { isOpen, openChat, closeChat, toggleChat } = useChatContext();

  return (
    <button onClick={toggleChat}>
      {isOpen ? 'Close Chat' : 'Open Chat'}
    </button>
  );
}
```

## 🎯 Component Details

### ChatAgentButton.jsx
**Purpose**: Floating circular button that toggles the chat widget.

**Props**:
- `hasUnreadMessages` (boolean): Show notification badge

**Features**:
- Framer Motion spring animations
- Hover/tap interactions
- Responsive sizing (64px desktop, 56px mobile)
- Badge notification support

### ChatWidget.jsx
**Purpose**: Popup chat window with full chat functionality.

**Features**:
- Mounted/unmounted based on Context state
- Escape key to close
- Click outside to close
- Responsive sizing and positioning
- Integrated with existing ChatbotUI component

### ChatContext.js
**Purpose**: Global state management for chat visibility.

**API**:
```jsx
{
  isOpen: boolean,      // Current visibility state
  openChat: () => void, // Open the chat widget
  closeChat: () => void,// Close the chat widget
  toggleChat: () => void // Toggle open/closed
}
```

## 🎭 Animations

### Button Entrance
```javascript
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ 
  type: "spring", 
  stiffness: 260, 
  damping: 20,
  delay: 0.3
}}
```

### Widget Entrance/Exit
```javascript
hidden: { opacity: 0, scale: 0.8, y: 20 }
visible: { opacity: 1, scale: 1, y: 0 }
exit: { opacity: 0, scale: 0.8, y: 20 }
```

## 🔧 Customization

### Changing Position
Edit `ChatAgentButton.jsx`:
```jsx
style={{
  position: 'fixed',
  bottom: '24px',  // Adjust bottom position
  right: '24px',   // Adjust right position
  zIndex: 1000
}}
```

### Changing Size
Edit `ChatWidget.jsx`:
```jsx
sx={{
  width: { xs: 'calc(100vw - 48px)', sm: '420px' },
  height: { xs: '70vh', sm: '600px' }
}}
```

### Changing Colors
Update CSS variables in `index.css`:
```css
:root {
  --gradient-primary: linear-gradient(135deg, #065f46, #047857);
  --shadow-glow: 0 0 30px rgba(6, 95, 70, 0.3);
}
```

## ♿ Accessibility

- **ARIA labels**: Button has tooltip with descriptive text
- **Keyboard navigation**: Escape key closes widget
- **Focus management**: Input auto-focuses on open
- **Screen reader friendly**: Semantic HTML and proper roles
- **High contrast**: Meets WCAG AA standards

## 📱 Mobile Experience

- Widget adapts to full width on mobile
- Bottom position adjusted for mobile keyboards
- Touch-friendly tap targets (56px minimum)
- Smooth scroll behavior for long conversations

## 🐛 Troubleshooting

### Widget not appearing
1. Check that `ChatContextProvider` wraps your app
2. Verify both `ChatAgentButton` and `ChatWidget` are rendered
3. Check browser console for errors

### RAG not working
1. Verify API endpoint configuration in `chatSlice`
2. Check network tab for failed requests
3. Ensure authentication tokens are valid

### State not persisting
1. Check localStorage is enabled in browser
2. Verify no localStorage quota exceeded errors
3. Clear localStorage and retry

## 🧪 Testing

### Manual Testing Checklist
- [ ] Button appears on all pages
- [ ] Widget opens/closes smoothly
- [ ] Escape key closes widget
- [ ] Click outside closes widget
- [ ] Mobile layout renders correctly
- [ ] State persists after page refresh
- [ ] RAG messages send/receive correctly
- [ ] Animations are smooth (60fps)
- [ ] No console errors

## 📝 Future Enhancements

### Recommended Additions
- [ ] Unread message badge counter
- [ ] Sound notifications for new messages
- [ ] Minimize/maximize functionality
- [ ] Drag to reposition (desktop only)
- [ ] Multiple chat sessions support
- [ ] Theme customization panel
- [ ] Voice input integration

## 🤝 Contributing

When modifying the chat widget:
1. Maintain existing RAG API integration
2. Preserve Dark Emerald design consistency
3. Test on mobile and desktop
4. Keep animations smooth and performant
5. Update this documentation

## 📄 License

Same as the main project license.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: AI Assistant  
**Status**: ✅ Production Ready
