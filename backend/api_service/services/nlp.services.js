import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";

/*
    *   Aqui cargamos el modelo desde hugging face.
    *   Mantenemos una instancia del modelo en memoria para no recargarlo en cada petición.
    *   Por ultimmo, se genera texto a partir del prompt recibido.
*/

dotenv.config();

let model = null;

export class NLPService {
  static async initialize() {
    if (!model) {
      console.log("Cargando modelo Phi-3 Mini localmente...");
      model = await pipeline("text-generation", "microsoft/Phi-3-mini-4k-instruct");
      console.log("Modelo cargado correctamente");
    }
  }

  static async processPrompt(prompt) {
    if (!model) {
      await NLPService.initialize();
    }

    console.log("Prompt recibido:", prompt);
    const response = await model(prompt, {
      max_new_tokens: 200,
      temperature: 0.7,
    });

    const text = response?.[0]?.generated_text || "No se pudo generar respuesta.";
    console.log("Respuesta generada:", text);
    return text;
  }
}
