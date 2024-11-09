/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VNumberInput } from 'vuetify/labs/VNumberInput'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'ncLight',
    themes: {
      ncLight: {
        dark: false,
        colors: {
          primary: '#986852',
          secondary: '#0DB5BC',
          background: '#FEECCE',
          'surface-bright': '#FEECCE',
          'surface-light': '#FFD790',
          'surface-variant': '#986852',
          'on-surface-variant': '#EEEEEE',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      }
    }
  },
  components: {
    VNumberInput,
  }
})
