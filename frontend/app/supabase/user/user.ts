// UserService.ts
import { supabase } from "../db";

// ——— Types de lignes (facultatif mais recommandé pour TS) ———
export type UserRow = { id: number; nom: string; created_at?: string };
export type ModuleRow = { id: number; nom: string; user_id: number; created_at?: string };
export type MatiereRow = { id: number; nom: string; coefficient: number; module_id: number; created_at?: string };
export type SousMatiereRow = { id: number; nom: string; coefficient: number; matiere_id: number; created_at?: string };
export type NoteRow = {
  id: number;
  score: number;
  coefficient: number;
  code: string;
  user_id: number;
  nom: string;
  sous_matiere_id: number;
  created_at?: string;
};

export class UserService {
  // Petit cache pour éviter des SELECT répétitifs
  private static userIdCache = new Map<string, number>();

  // =============== USERS ===============
  static async createUser(nom: string): Promise<UserRow | null> {
    // Rend l'insertion idempotente (nécessite UNIQUE sur users.nom)
    const { data, error } = await supabase
      .from("users")
      .upsert([{ nom }], { onConflict: "nom" })
      .select();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    const row = data?.[0] ?? null;
    if (row) this.userIdCache.set(nom, row.id);
    return row;
  }

  static async getUserId(userName: string): Promise<number | null> {
    const cached = this.userIdCache.get(userName);
    if (cached) return cached;

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("nom", userName)
      .single();

    // PGRST116 = no rows found
    if (error) {
      if ((error as any).code === "PGRST116") return null;
      throw new Error(`Error fetching user: ${error.message}`);
    }

    this.userIdCache.set(userName, data.id);
    return data.id;
  }

  // =============== MODULES ===============
  static async createModuleForUser(
    userName: string,
    moduleName: string
  ): Promise<ModuleRow | null> {
    const userId = await this.getUserId(userName);
    if (!userId) return null;

    // Rend l'insertion idempotente (UNIQUE sur (user_id, nom))
    const { data, error } = await supabase
      .from("Modules")
      .upsert([{ nom: moduleName, user_id: userId }], { onConflict: "user_id,nom" })
      .select();

    if (error) {
      throw new Error(`Error creating module: ${error.message}`);
    }

    return data?.[0] ?? null;
  }

  static async getAllModules(userName: string): Promise<ModuleRow[]> {
    const userId = await this.getUserId(userName);
    if (!userId) return [];

    const { data, error } = await supabase
      .from("Modules")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching module list:", error);
      return [];
    }

    return data ?? [];
  }

  // =============== MATIERES ===============
  static async createMatiereForModule(
    moduleId: number,
    matiereName: string,
    coefficient: number
  ): Promise<MatiereRow | null> {
    // Idempotent (UNIQUE sur (module_id, nom))
    const { data, error } = await supabase
      .from("Matieres")
      .upsert([{ nom: matiereName, coefficient, module_id: moduleId }], {
        onConflict: "module_id,nom",
      })
      .select();

    if (error) {
      throw new Error(`Error creating matiere: ${error.message}`);
    }

    return data?.[0] ?? null;
  }

  static async getAllMatieres(moduleId: number): Promise<MatiereRow[]> {
    const { data, error } = await supabase
      .from("Matieres")
      .select("*")
      .eq("module_id", moduleId);

    if (error) {
      throw new Error(`Error fetching matieres list: ${error.message}`);
    }
    return data ?? [];
  }

  // =============== SOUS-MATIERES ===============
  static async createSousMatiereForMatiere(
    matiereId: number,
    sousMatiereName: string,
    coefficient: number
  ): Promise<SousMatiereRow | null> {
    // Idempotent (UNIQUE sur (matiere_id, nom))
    const { data, error } = await supabase
      .from("Sous_matieres")
      .upsert([{ nom: sousMatiereName, coefficient, matiere_id: matiereId }], {
        onConflict: "matiere_id,nom",
      })
      .select();

    if (error) {
      throw new Error(`Error creating sous matiere: ${error.message}`);
    }

    return data?.[0] ?? null;
  }

  static async getAllSousMatieres(matiereId: number): Promise<SousMatiereRow[]> {
    const { data, error } = await supabase
      .from("Sous_matieres")
      .select("*")
      .eq("matiere_id", matiereId);

    if (error) {
      throw new Error(`Error fetching sous matieres list: ${error.message}`);
    }
    return data ?? [];
  }

  // =============== NOTES ===============
  static async addNoteToSousMatiere(
    sousMatiereId: number,
    noteValue: number,
    coefficient: number,
    code: string,
    user_id: number,
    name: string
  ): Promise<NoteRow | null> {
    // Idempotent: on interdit les doublons par (sous_matiere_id, code)
    const { data, error } = await supabase
      .from("Notes")
      .upsert(
        [
          {
            score: noteValue,
            coefficient,
            code,
            user_id,
            nom: name,
            sous_matiere_id: sousMatiereId,
          },
        ],
        { onConflict: "sous_matiere_id,code" }
      )
      .select();

    if (error) {
      throw new Error(`Error adding note: ${error.message}`);
    }

    return data?.[0] ?? null;
  }

  static async getAllNotes(sousMatiereId: number): Promise<NoteRow[]> {
    const { data, error } = await supabase
      .from("Notes")
      .select("*")
      .eq("sous_matiere_id", sousMatiereId);

    if (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
    return data ?? [];
  }

  // =============== OBJET AGRÉGÉ UTILISATEUR ===============
  static async getUserObject(userName: string) {
    const userId = await this.getUserId(userName);
    if (!userId) {
      console.log("User not found");
      return null;
    }

    const modules = await this.getAllModules(userName);

    const modulesWithDetails = await Promise.all(
      modules.map(async (mod) => {
        const matieres = await this.getAllMatieres(mod.id);

        const matieresWithDetails = await Promise.all(
          matieres.map(async (mat) => {
            const sousMatieres = await this.getAllSousMatieres(mat.id);

            const sousMatieresWithDetails = await Promise.all(
              sousMatieres.map(async (sm) => {
                const notes = await this.getAllNotes(sm.id);
                return { ...sm, notes };
              })
            );

            return { ...mat, sous_matieres: sousMatieresWithDetails };
          })
        );

        return { ...mod, matieres: matieresWithDetails };
      })
    );

    const data = { id: userId, nom: userName, modules: modulesWithDetails };
    console.log("User object:", data);
    return data;
  }
}
