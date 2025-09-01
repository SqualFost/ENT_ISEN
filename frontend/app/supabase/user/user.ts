import { constructNow } from "date-fns";
import { supabase } from "../db";

export class UserService {
  static userId: any;

  static async createUser(nom: string) {
    const rep = await this.getUserId(nom);
    if (rep != null) {
      this.userId = rep;
      console.log("User already exists with ID:", rep);
      return null;
    }
    const { data, error } = await supabase
      .from("users")
      .insert([{ nom: nom }])
      .select();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
    this.userId = data[0].id;
    return data;
  }
  static async getUserId(user: string) {
    if (this.userId) {
      return this.userId;
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("nom", user);

      if (error) {
        throw new Error(`Error creating user: ${error.message}`);
      }
      if (data.length === 0) {
        console.log("User not found");
        return null; // User not found
      }
      this.userId = data[0].id;
      return this.userId;
    }
  }
  static async getAllModules(name: string) {
    const userId = await this.getUserId(name);

    const { data, error } = await supabase
      .from("Modules")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching module list:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No modules found for user ID:", userId);
      return [];
    }
    return data;
  }
  static async getAllMatieres(moduleId: number) {
    const { data, error } = await supabase
      .from("Matieres")
      .select("*")
      .eq("module_id", moduleId);
    if (error) {
      throw new Error(`Error fetching matieres list: ${error.message}`);
    }
    if (!data || data.length === 0) {
      console.log("No matieres found for module ID:", moduleId);
      return [];
    }
    return data;
  }
  static async getAllSousMatieres(matiereId: number) {
    const { data, error } = await supabase
      .from("Sous_matieres")
      .select("*")
      .eq("matiere_id", matiereId);
    if (error) {
      throw new Error(`Error fetching sous matieres list: ${error.message}`);
    }
    if (!data || data.length === 0) {
      console.log("No sous matieres found for matiere ID:", matiereId);
      return [];
    }
    return data;
  }
  static async getAllNotes(sousMatiereId: number) {
    const { data, error } = await supabase
      .from("Notes")
      .select("*")
      .eq("sous_matiere_id", sousMatiereId);
    if (error) {
      throw new Error(`Error fetching notes: ${error.message}`);
    }
    return data;
  }
  static async getUserObject(userName: string) {
    const userId = await this.getUserId(userName);
    if (!userId) {
      console.log("User not found");
      return null;
    }
    const modules = await this.getAllModules(userName);
    const modulesWithDetails = await Promise.all(
      modules.map(async (moduleDataArr) => {
        // moduleDataArr may be an array, so get the first element if needed
        const moduleData = Array.isArray(moduleDataArr)
          ? moduleDataArr[0]
          : moduleDataArr;
        const matieres = await this.getAllMatieres(moduleData.id);
        const matieresWithDetails = await Promise.all(
          matieres.map(async (matiereDataArr) => {
            const matiereData = Array.isArray(matiereDataArr)
              ? matiereDataArr[0]
              : matiereDataArr;
            const sousMatieres = await this.getAllSousMatieres(matiereData.id);
            const sousMatieresWithDetails = await Promise.all(
              sousMatieres.map(async (sousMatiereDataArr) => {
                const sousMatiereData = Array.isArray(sousMatiereDataArr)
                  ? sousMatiereDataArr[0]
                  : sousMatiereDataArr;
                const notes = await this.getAllNotes(sousMatiereData.id);
                return { ...sousMatiereData, notes: notes || [] };
              })
            );
            return { ...matiereData, sous_matieres: sousMatieresWithDetails };
          })
        );
        return { ...moduleData, matieres: matieresWithDetails };
      })
    );
    const data = { id: userId, nom: userName, modules: modulesWithDetails };
    return data;
  }
  static async createModuleForUser(userName: string, moduleName: string) {
    const userId = await this.getUserId(userName);
    if (!userId) {
      console.log("User not found");
      return null;
    }
    // Check if module already exists for user
    const { data: existingModules, error: fetchError } = await supabase
      .from("Modules")
      .select("*")
      .eq("user_id", userId)
      .eq("nom", moduleName);
    if (fetchError) {
      throw new Error(`Error checking existing modules: ${fetchError.message}`);
    }
    if (existingModules && existingModules.length > 0) {
      console.log("Module already exists for user:", moduleName);
      return null; // Module already exists
    }
    const { data, error } = await supabase
      .from("Modules")
      .insert([{ nom: moduleName, user_id: userId }])
      .select();
    if (error) {
      throw new Error(`Error creating module: ${error.message}`);
    }
    return data;
  }
  static async createMatiereForModule(
    moduleId: number,
    matiereName: string,
    coefficient: number
  ) {
    // Check if matiere already exists for module
    const { data: existingMatieres, error: fetchError } = await supabase
      .from("Matieres")
      .select("*")
      .eq("module_id", moduleId)
      .eq("nom", matiereName);
    if (fetchError) {
      throw new Error(`Error checking existing matieres: ${fetchError.message}`);
    }
    if (existingMatieres && existingMatieres.length > 0) {
      console.log("Matiere already exists for module:", matiereName);
      return null; // Matiere already exists
    }
    const { data, error } = await supabase
      .from("Matieres")
      .insert([{ nom: matiereName, coefficient: coefficient, module_id: moduleId }])
      .select();
    if (error) {
      throw new Error(`Error creating matiere: ${error.message}`);
    }
    return data;
  }
 
  static async createSousMatiereForMatiere(
    matiereId: number,
    sousMatiereName: string,
    coefficient: number
  ) {
    // Check if sous matiere already exists for matiere
    const { data: existingSousMatieres, error: fetchError } = await supabase
      .from("Sous_matieres")
      .select("*")
      .eq("matiere_id", matiereId)
      .eq("nom", sousMatiereName);
    if (fetchError) {
      throw new Error(`Error checking existing sous matieres: ${fetchError.message}`);
    }
    if (existingSousMatieres && existingSousMatieres.length > 0) {
      console.log("Sous matiere already exists for matiere:", sousMatiereName);
      return null; // Sous matiere already exists
    }
    const { data, error } = await supabase
      .from("Sous_matieres")
      .insert([{ nom: sousMatiereName, coefficient: coefficient, matiere_id: matiereId }])
      .select();
    if (error) {
      throw new Error(`Error creating sous matiere: ${error.message}`);
    }
    return data;
  }
  static async addNoteToSousMatiere(
    sousMatiereId: number,
    noteValue: number,
    coefficient: number,
    code :string,
    user_id: number,
    name: string
  )
  {
    const date = new Date();
    const { data, error } = await supabase
      .from("Notes")
      .insert([{ valeur: noteValue, coefficient: coefficient, date: date, code: code, user_id: user_id, name: name, sous_matiere_id: sousMatiereId }])
      .select();
    if (error) {
      throw new Error(`Error adding note: ${error.message}`);
    }
    return data;
  }
}
