import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { getCurrentSession } from "@/actions/auth";
import { SanityLive } from "@/sanity/lib/live";
import HeaderCategorySelector from "@/components/layout/HeaderCategorySelector";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = async({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const {user} = await getCurrentSession()
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased !bg-white`}
      >
        <Header user={user} categorySelector={<HeaderCategorySelector/>}/>
        {children}

        <SanityLive/>
      </body>
    </html>
  );
}

export default RootLayout
