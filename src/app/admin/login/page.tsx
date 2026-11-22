"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: admin123 (or custom)
    if (password === "admin123" || password === "fishline2026") {
      localStorage.setItem("fishline_admin_auth", "true");
      toast.success("Connexion réussie");
      router.push("/admin");
    } else {
      setError(true);
      toast.error("Mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-ocean-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyanCustom-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-cyanCustom-500/30 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyanCustom-500 to-ocean-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyanCustom-500/30">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">
            FISHLINE <span className="text-cyanCustom-400">ADMIN</span>
          </h2>
          <p className="text-xs text-ocean-300 mt-1">
            Espace sécurisé de gestion du catalogue et des devis
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ocean-200 mb-2">
              Mot de passe Administrateur
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Entrez le mot de passe..."
                className="w-full px-4 py-3 rounded-xl bg-ocean-900 border border-ocean-700 text-white text-sm focus:outline-none focus:border-cyanCustom-400 transition-colors"
              />
              <Lock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-ocean-400" />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1.5 font-medium">
                Mot de passe incorrect (Indice par défaut : admin123)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyanCustom-500 to-ocean-600 hover:from-cyanCustom-400 hover:to-ocean-500 text-white font-bold text-sm shadow-xl shadow-cyanCustom-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Se Connecter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-ocean-800 text-center">
          <p className="text-[11px] text-ocean-400">
            Mot de passe d&apos;accès initial : <span className="text-cyanCustom-300 font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
