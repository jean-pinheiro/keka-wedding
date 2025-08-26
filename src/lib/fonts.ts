import localFont from "next/font/local";

export const ainslay = localFont({
  src: [
    {
      path: "../../public/fonts/Ainslay-Normal.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Ainslay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Ainslay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-ainslay",
});