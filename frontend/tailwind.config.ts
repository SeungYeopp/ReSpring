import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css", // 올바른 glob 패턴
  ],
  theme: {
    extend: {
      fontFamily: {                                        // public/fonts 에 설치한 폰트 추가
        godob: ['"GodoB"', 'sans-serif'],                  // 고도 B
        godom: ['"GodoM"', 'sans-serif'],                  // 고도 M
        godomaum: ['"GodoMaum"', 'sans-serif'],            // 고도 마음체
        nunugothic: ['"NunuGothic"', 'sans-serif'],        // 누누 기본 고딕체
        samlipbasic: ['"SamLipBasic"', 'sans-serif'],      // 삼립호빵 베이직
        samlipoutline: ['"SamLipOutline"', 'sans-serif'],  // 삼립호빵 아웃라인
        ongle: ['"OngleLeafParkDaHyun"', 'sans-serif'],    // 온글잎 박다현체

        // 새로운 폰트
        binggraetaom: ['"BinggraeTaom"', 'sans-serif'],                 // 빙그레 타옴 (기본)
        binggraetaombold: ['"BinggraeTaomBold"', 'sans-serif'],         // 빙그레 타옴 (볼드)
        mapobackpacking: ['"MapoBackpacking"', 'sans-serif'],           // 마포 백패킹 (개성 있는 디자인 폰트)
        goodneighborsbold: ['"GoodNeighborsBold"', 'sans-serif'],       // 굿네이버스 좋은이웃체 (볼드)
        goodneighborsregular: ['"GoodNeighborsRegular"', 'sans-serif'], // 굿네이버스 좋은이웃체 (레귤러)
        laundrygothicbold: ['"LaundryGothicBold"', 'sans-serif'],       // 런드리고딕 (볼드, 깔끔한 고딕체)
        laundrygothicregular: ['"LaundryGothicRegular"', 'sans-serif'], // 런드리고딕 (레귤러, 심플한 고딕체)
        handon300: ['"Handon300"', 'sans-serif'],                       // 한돈 삼겹살체 (300g, 얇은 두께)
        handon600: ['"Handon600"', 'sans-serif'],                       // 한돈 삼겹살체 (600g, 굵은 두께)
      },
      animation:{
        "spin-slow": "spin 20s linear infinite",
        "spin-slow-medium": "spin 22s linear infinite",
        "spin-slow-reverse": "spin 25s linear infinite reverse",
        'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        brand: {
          light: "#96b23c",
          DEFAULT: "#96b23c",
          dark: "#638d3e",
        },
        // ✅ 스플래시 스크린 색상 추가
        splash: {
          background: "#e8f3d6", // 연한 초록색 배경
          text: "#638d3e", // 진한 초록색 텍스트
          accent: "#4a6d2e", // 보조 초록색
        },
        chat: {
          primary: {
            DEFAULT: "#96b23c",
            foreground: "hsl(var(--primary-foreground))",
            light: "#a6c24c",
            dark: "#638d3e",
          },
          secondary: {
            DEFAULT: "#f0f4e6",
            foreground: "#4a5568",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
