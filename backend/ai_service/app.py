from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import torch
import os
from dotenv import load_dotenv

# ============================================================
# Cargar variables de entorno (.env)
# ============================================================
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

app = FastAPI(title="ZeroAI - Servicio de IA (TinyLlama)")

# ============================================================
# Estructura de los datos de entrada
# ============================================================
class PromptRequest(BaseModel):
    prompt: str

# ============================================================
# Carga del modelo desde Hugging Face
# ============================================================
print("Cargando modelo desde Hugging Face...")

try:
    pipe = pipeline(
        "text-generation",
        model=MODEL_ID,
        token=HF_TOKEN,                     # Token de acceso
        dtype=torch.float32,          # Compatible con CPU
        device_map="auto"                   # Usa GPU si existe, CPU si no
    )
    print("✅ Modelo TinyLlama cargado correctamente.")
except Exception as e:
    print("❌ Error cargando el modelo:", e)
    pipe = None

# ============================================================
# Endpoint principal de inferencia
# ============================================================
@app.post("/inference")
async def inference(request: PromptRequest):
    """
    Recibe un prompt en formato JSON y devuelve una respuesta generada por el modelo.
    """
    if not pipe:
        return {"error": "El modelo no se cargó correctamente."}

    user_input = request.prompt.strip()
    if not user_input:
        return {"error": "Prompt vacío o inválido."}

    try:
        # 🔹 Estructurar conversación (usando el formato oficial de TinyLlama)
        messages = [
            {"role": "system", "content": "Eres ZeroAI, un asistente amigable experto en hardware de PC."},
            {"role": "user", "content": user_input}
        ]

        # Aplicar plantilla de chat
        prompt = pipe.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        # 🔹 Generar respuesta
        outputs = pipe(
            prompt,
            max_new_tokens=200,
            do_sample=True,
            temperature=0.7,
            top_k=50,
            top_p=0.95
        )

        response_text = outputs[0]["generated_text"]
        print(f"🗨️ Prompt: {user_input}\n🤖 Respuesta: {response_text}")

        # Extraer solo la parte generada después del prompt
        generated_part = response_text[len(prompt):].strip()

        return {"response": generated_part or "No se pudo generar una respuesta."}

    except Exception as e:
        print("❌ Error durante la inferencia:", e)
        return {"error": str(e)}

# ============================================================
# Arranque del servicio
# ============================================================
@app.get("/")
async def root():
    return {"message": " Servicio de IA ZeroAI activo y listo para procesar prompts."}
