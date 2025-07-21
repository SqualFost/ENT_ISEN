"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Loader2 } from "lucide-react";
import ISEN_Api from "@/app/api/api.js";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  // simulation de login attendant que l'api marche et que l'ent soit pas cassé encore
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const api = new ISEN_Api();
    try {
      // Appel à l'API pour la connexion
      const response = await api.login(username, password);
      Cookies.set("token", response, {
        expires: 3600,
        secure: false, // Mettre à true en production
        sameSite: "lax",
      });
      router.push("/"); // Redirection vers la page d'accueil après connexion réussie
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-200 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ISEN Toulon</h1>
            <p className="text-sm text-gray-600">
              L'école des ingénieurs du numérique
            </p>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Se connecter</h2>
          <CardDescription className="text-gray-600">
            Veuillez entrer vos identifiants pour accéder à l'Espace Numérique
            de Travail
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ nom d'utilisateur */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Nom d'utilisateur
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre nom d'utilisateur"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Champ mot de passe */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              className="w-full bg-[var(--rouge-isen)] hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                "Se connecter"
              )}
            </Button>
            {/* Affichage des erreurs */}
            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>2025 - Projet par Sautron Mattéo et Coulais Anthony</p>
      </div>
    </div>
  );
}
