from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import torch
import os
from dotenv import load_dotenv

# ============================================================
# Cargar .env
# ============================================================
ENV_PATH = "/app/.env"
if os.path.exists(ENV_PATH):
    print(f" Cargando .env desde {ENV_PATH}")
    load_dotenv(ENV_PATH)

MODEL_ID = os.getenv("MODEL_ID")

# ============================================================
# Inicializar modelo
# ============================================================
print("Cargando modelo desde Hugging Face...")

pipe = pipeline(
    "text-generation",
    model=MODEL_ID,
    tokenizer=MODEL_ID,
    trust_remote_code=True,
    torch_dtype=torch.float32,
    device_map="auto"
)

print("✔ Modelo TinyLlama cargado correctamente.")

# ============================================================
# FastAPI
# ============================================================
app = FastAPI(title="ZeroAI - IA TinyLlama")

class PromptRequest(BaseModel):
    prompt: str

@app.post("/inference")
def inference(request: PromptRequest):
    try:
        user_input = request.prompt.strip()

        messages = [
            {"role": "system", "content": "Eres ZeroAI, un asistente experto en hardware de PC."},
            {"role": "user", "content": user_input}
        ]

        prompt = pipe.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )

        outputs = pipe(
            prompt,
            max_new_tokens=200,
            do_sample=True,
            temperature=0.7,
            top_k=50,
            top_p=0.95
        )

        full_text = outputs[0]["generated_text"]
        generated = full_text[len(prompt):].strip()

        return { "response": generated }

    except Exception as e:
        return { "error": str(e) }

@app.get("/")
def root():
    return { "message": "ZeroAI está activo" }
