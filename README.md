# Chrome Extension with React and TypeScript

This is a Chrome extension built with React, TypeScript, and Tailwind CSS.

## Features

- Simple notes taking functionality
- Data persistence using Chrome's storage API
- Clean UI with Tailwind CSS
- Icons from Lucide React

## Development

1. Run `npm run dev` to start the development server
2. Make changes to the code and see them reflected in real-time

## Building for Production

1. Run `npm run build` to create a production build
2. The extension will be built in the `dist` directory

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right
3. Click "Load unpacked" and select the `dist` directory
4. The extension should now be installed and visible in your extensions list

## Structure

- `manifest.json`: Chrome extension configuration
- `src/App.tsx`: Main component with notes functionality
- `src/main.tsx`: Entry point with Chrome API polyfills for development