## Adding assets (such as favicons and header images)

Assets are kept in `ui/src/public`. Replace `favicon.ico` and the logo files according to your needs.

## Changing colour themes

Colour themes can be configured by changing `ui/src/css/quasar.variables.scss`. A background colour is also available in `ui/src/css/app.scss`.

## Changing fonts

Fonts can be configured in `ui/src/css/app.scss`.

## Global Styles

Style configuration of things like buttons and header logos can be done from `ui/src/config/qStyles.ts`:

```typescript
// Global button configuration
export const qBtnStyle = {
  color: "secondary",
  outline: false,
  rounded: true,
  unelevated: true,
  size: "sm",
  "no-caps": true,
};

// Header configuration
export const qHeaderStyle = {
  header: {
    elevated: true,
  },
  // Remove the logo lines to have no logo
  logo_coloured: "logo_colour.svg", // Logo for displaying on white backgrounds.
  logo_white: "logo_white.svg", // Logo for displaying on coloured backgrounds.
  title: { class: "text-subtitle1" },
};

// Global avatar configuration, for small icons or buttons used throughout the interface
export const qAvatarStyle = {
  size: "lg",
  color: "accent",
  "text-color": "primary",
};

// Global spinner configuration, used for things like loading indicators
export const qSpinnerStyle = {
  class: "text-accent",
  size: "6em",
};
```
