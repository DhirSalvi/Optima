import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Optima - Smart Financial Management",
  description: "Take control of your finances with intelligent budgeting and expense tracking",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
          <Toaster />
          {children}
          
          {/* Fixed Profile Button */}
          {/* <SignedIn>
            <div style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              zIndex: 1000 // Ensures it stays above other elements
            }}>
              <UserButton />
            </div>
          </SignedIn> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
