module.exports = {
  // `content` is replaced instead of extended, so this line has to be added in
  // the `content` of each app' tailwind.config.js
  content: ['node_modules/@vercel/examples-ui/ui/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accents-0': 'var(--accents-0)',
        'accents-1': 'var(--accents-1)',
        'accents-2': 'var(--accents-2)',
        'accents-3': 'var(--accents-3)',
        'accents-4': 'var(--accents-4)',
        'accents-5': 'var(--accents-5)',
        'accents-6': 'var(--accents-6)',
        'accents-7': 'var(--accents-7)',
        'accents-8': 'var(--accents-8)',
        'accents-9': 'var(--accents-9)',
        'success-lighter': 'var(--geist-success-lighter)',
        'success-light': 'var(--geist-success-light)',
        success: 'var(--geist-success-lighter)',
        'success-dark': 'var(--geist-success-dark)',
        'highlight-magenta': 'var(--geist-highlight-magenta)',
        'highlight-purple': 'var(--geist-highlight-purple)',
        'highlight-pink': 'var(--geist-highlight-pink)',
        'highlight-yellow': 'var(--geist-highlight-yellow)',
        dark: {
          'accents-0': 'var(--accents-9)',
          'accents-1': 'var(--accents-8)',
          'accents-2': 'var(--accents-7)',
          'accents-3': 'var(--accents-6)',
          'accents-4': 'var(--accents-5)',
          'accents-5': 'var(--accents-4)',
          'accents-6': 'var(--accents-3)',
          'accents-7': 'var(--accents-2)',
          'accents-8': 'var(--accents-1)',
          'accents-9': 'var(--accents-0)',
        },
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%;' },
        },
      },
      animation: {
        gradient: 'gradient 1s infinite',
      },
    },
  },
}
