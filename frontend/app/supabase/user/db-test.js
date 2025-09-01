import { createClient } from "@supabase/supabase-js";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chargement des variables d'environnement avec chemin absolu
dotenv.config({ path: resolve(__dirname, '../../../.env.local') });

// Vérification des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Variables d\'environnement manquantes');
    console.log('Current env values:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ nom: "anthony.coulais" }])
      .select();

    if (error) throw error;
    console.log("✅ Données insérées avec succès:", data);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

test();
