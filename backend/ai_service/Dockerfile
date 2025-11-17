FROM python:3.10-slim

WORKDIR /app

# Fix HTTPS (CERTIFICADOS SSL!!!)
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env /app/.env

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
