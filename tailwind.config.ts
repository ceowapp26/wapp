const { nextui } = require("@nextui-org/react");

function animationDelayPlugin({ matchUtilities, theme }) {
  matchUtilities(
    {
      "animation-delay": (value) => {
        return {
          "animation-delay": value,
        };
      },
    },
    {
      values: theme("transitionDelay"),
    }
  );
}

function maskEffectHoverPlugin({ addUtilities }) {
  addUtilities({
    '.mask-nature-sprite': {
      '-webkit-mask': 'url("https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png")',
      'mask': 'url("https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png")',
      '-webkit-mask-size': '2300% 100%',
      'mask-size': '2300% 100%',
    },
    '.mask-gradient-card': {
      '-webkit-mask-image': 'radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%)',
      'mask-image': 'radial-gradient(circle at 60% 5%, black 0%, black 15%, transparent 60%)',
    },
  });
}


function parentSiblingHoverPlugin({ addVariant, e }) {
  addVariant('parent-sibling-hover', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.parent-sibling:hover ~ .parent .${e(`parent-sibling-hover${separator}${className}`)}`;
    });
  });
}

module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      screens: {
        mobileS: { max: '320px' },
        mobileM: { max: '375px' },
        mobileML: { max: '475px' },
        mobileL: { max: '480px' },
        mobileXL: { max: '640px' },
        tablet: { max: '768px' },
        tabletXL: { max: '1080px' },
        laptop: { max: '1024px' },
        laptopMB: { min: '1280px' },
        laptopM: { max: '1280px' },
        laptopL: { max: '1440px' },
      },
      borderImage: {
        'conic': 'conic-gradient(from 90deg, rgba(168, 239, 255, 0.1) rgba(168, 239, 255, 1) 0.1turn, rgba(168, 239, 255, 1) 0.15turn, rgba(168, 239, 255, 0.1) 0.25turn)',
      },
      maskImage: {
        'linear-gradient': 'linear-gradient(180deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 50%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.5) 100%)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at 65% 15%, white 1px, aqua 3%, darkblue 60%, aqua 100%)',
        '404-bg': "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
      },
      spacing: {
        '400px': '400px',
      },
      fontFamily: {
        arvo: ['Arvo', 'serif'],
      },
      colors: {
        cream: '#F5F5F5',
        gravel: '#4E4E4E',
        iridium: '#3F3F3F',
        orange: '#FFA947',
        peach: '#FFE0BD',
        platinum: '#E6E6E6',
        ghost: '#CDCDCD',
        grandis: '#FFC989',
        porcelain: '#F1F1F1',
        ironside: '#636363',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'borderRotate': {
          '100%' : {
            '90deg': '420deg',
          }
        },
        'tile': {
          '0%, 12.5%, 100%': {
            opacity: '1',
          },
          '25%, 82.5%': {
            opacity: '0',
          },
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'aniMask': {
          from: {
            maskPosition: '0 0',
            WebkitMaskPosition: '0 0',
          },
          to: {
            maskPosition: '100% 0',
            WebkitMaskPosition: '100% 0',
          },
        },
        'aniMask2': {
          from: {
            maskPosition: '100% 0',
            WebkitMaskPosition: '100% 0',
          },
          to: {
            maskPosition: '0 0',
            WebkitMaskPosition: '0 0',
          },
        },
        'moveTxt': {
          '0%': { top: '0px' },
          '20%': { top: '-50px' },
          '40%': { top: '-100px' },
          '60%': { top: '-150px' },
          '80%': { top: '-200px' },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'open-full-sidebar': {
          from: { width: '60px' },
          to: { width: '100%' },
        },
        'open-sidebar': {
          from: { width: '60px' },
          to: { width: '300px' },
        },
        'close-sidebar': {
          from: { width: '300px' },
          to: { width: '60px' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'tile': 'tile 8s infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'borderRotate': 'borderRotate 2500ms linear infinite forwards',
        'aniMask': 'aniMask 0.7s steps(22) forwards',
        'aniMask2': 'aniMask2 0.7s steps(22) forwards',
        'moveTxt': 'moveTxt 5s ease infinite 1s',
        'gradient': 'gradient 5s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'open-sidebar': 'open-sidebar 0.2s ease-out',
        'open-full-sidebar': 'open-full-sidebar 0.2s ease-out',
        'close-sidebar': 'close-sidebar 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    parentSiblingHoverPlugin,
    maskEffectHoverPlugin,
    animationDelayPlugin,
    require('tailwindcss-border-image'),
    require("tailwindcss-animate"),
    require('tailwind-scrollbar-hide'),
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF", // or DEFAULT
            foreground: "#11181C", // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
            // ... rest of the colors
          },
        },
        dark: {
          colors: {
            background: "#000000", // or DEFAULT
            foreground: "#ECEDEE", // or 50 to 900 DEFAULT
            primary: {
              //... 50 to 900
              foreground: "#FFFFFF",
              DEFAULT: "#006FEE",
            },
          },
          // ... rest of the colors
        },
        mytheme: {
          // custom theme
          extend: "dark",
          colors: {
            primary: {
              DEFAULT: "#BEF264",
              foreground: "#000000",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
};



