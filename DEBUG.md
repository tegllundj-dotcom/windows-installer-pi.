# 🔧 Debugging Guide

This guide explains the debugging tools and troubleshooting steps for the Trading Dashboard application.

## 🚀 Quick Debug Access

### Development Debug Panel
In development mode, a debug panel is available in the bottom-left corner showing:
- Real-time error count
- System diagnostics
- Performance metrics
- Troubleshooting suggestions

Click the debug button to expand the panel and access:
- KV Store connection status
- Environment information  
- Performance metrics
- Automated suggestions
- Debug report generation

### Console Commands
The debug manager is available in the browser console as `window.debug`:

```javascript
// Get current debug information
window.debug.getDebugInfo()

// Print comprehensive debug report
window.debug.printDebugReport()

// Get troubleshooting suggestions
window.debug.getSuggestions()

// Clear tracked errors
window.debug.clearErrors()
```

## 🔍 Common Issues & Solutions

### KV Store Access Errors
**Symptoms:** Console shows "Failed to fetch KV key: Forbidden" or "Failed to set key: Forbidden"

**Cause:** Normal for local development - GitHub Spark KV store requires proper authentication

**Solution:** 
- ✅ Expected behavior in local development
- ✅ Application automatically falls back to mock data
- ✅ No action required for local development
- 🚀 Deploy to GitHub Spark for full KV store access

### Build Performance
**Symptoms:** Slow load times, large bundle size warnings

**Solutions:**
- Consider code splitting with dynamic imports
- Optimize asset loading
- Use build.rollupOptions.output.manualChunks
- Check network requests in debug panel

### ESLint Issues
**Fixed:** Added proper `eslint.config.js` for ESLint 9.0+

**Usage:**
```bash
npm run lint  # Check for code issues
```

## 🛠️ Development Tools

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Debug Features
- **Error Tracking:** Automatic console error interception
- **Performance Monitoring:** Load time and error count tracking
- **KV Store Status:** Real-time connection monitoring
- **Environment Detection:** Development vs production mode
- **Suggestion Engine:** Automated troubleshooting recommendations

### TypeScript Checking
```bash
npx tsc --noEmit  # Type checking without compilation
```

## 📊 Monitoring & Logging

### Console Output Categories
- **🚀 Initialization:** App and service startup
- **📡 Network:** Market data and API connections  
- **🧠 AI/ML:** Neural network and analysis logs
- **⚠️ Errors:** KV store and other errors
- **🔧 Debug:** Debug manager reports

### Performance Metrics
- Load time tracking
- Error count monitoring  
- Real-time analysis status
- Memory and resource usage

## 🚨 Troubleshooting Checklist

1. **Check Debug Panel** - Click debug button for instant diagnostics
2. **Review Console** - Look for error patterns and warnings
3. **Verify Environment** - Ensure development/production settings
4. **Test Core Features** - Trading operations, data loading, UI interactions
5. **Check Network** - Verify API connections and resource loading
6. **Build Test** - Run `npm run build` to check production readiness

## 🎯 Production Deployment

### Pre-deployment Checks
- [ ] Build completes without errors (`npm run build`)
- [ ] All TypeScript types resolve (`npx tsc --noEmit`)  
- [ ] Debug panel hidden in production builds
- [ ] KV store authentication configured
- [ ] Performance metrics acceptable

### Debug in Production
- Debug panel automatically hidden
- Console logging reduced
- Error reporting maintains essential information
- Performance monitoring continues

---

**Need Help?** 
- Check the debug panel for automated suggestions
- Use `window.debug.printDebugReport()` in console
- Review this guide for common solutions
- Check GitHub repository issues for known problems