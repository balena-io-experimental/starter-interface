//
// Configuration file for various visual effects, headers and colours
//

// Global button configuration
export const qBtnStyle = {
  color: 'secondary',
  outline: false,
  rounded: true,
  unelevated: true,
  size: 'sm',
  'no-caps': true
}

// Header configuration
export const qHeaderStyle = {
  header: {
    elevated: true
  },
  // Remove the logo lines to have no logo
  logo_coloured: 'logo_colour.svg', // Logo for displaying on white backgrounds.
  logo_white: 'logo_white.svg', // Logo for displaying on coloured backgrounds.
  title: { class: 'text-subtitle1' }
}

// Global avatar configuration, for small icons or buttons used throughout the interface
export const qAvatarStyle = {
  size: 'lg',
  color: 'accent',
  'text-color': 'primary'
}

// Global spinner configuration, used for things like loading indicators
export const qSpinnerStyle = {
  class: 'text-accent',
  size: '6em'
}
