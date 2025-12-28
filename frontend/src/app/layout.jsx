"use client";

import { AuthProvider } from "./contexts/AuthContext";
import { TownProvider } from "./contexts/TownContext";
import Navigation from "./components/Navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <TownProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main>{children}</main>
              <footer className="bg-white border-t border-gray-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="text-center text-gray-500 text-sm">
                    <p>© 2025 우리동네. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
          </TownProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
