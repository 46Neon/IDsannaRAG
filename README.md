# IDsannaRAG

Base Android auditable para el Mini-RAG educativo de IDsanna. El proyecto está preparado para Android 11+ (`minSdk 30`) y usa una shell WebView local con UI mobile-first. La persistencia y la IA no se simulan: se conectarán a Supabase y a Edge Functions protegidas.

## Construir
Requiere JDK 17 y Gradle 8.10.2:

```bash
gradle assembleDebug
```

El workflow **Android CI** construye el APK debug en cada push/PR a `main`. **Release APK** construye el release mediante workflow manual o tags `v*`.

## Seguridad
El cliente solo podrá usar la URL de Supabase y la clave pública/publishable. Nunca incluir `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` o `SUPABASE_SERVICE_ROLE_KEY` en Android, assets, logs o repositorio. Esos secretos deben vivir en Edge Functions.

## Alcance verificable actual
- UI local de Inicio, Suite, Chat, Perfil y Acceso.
- Selección de archivos preparada desde Android.
- Estructura Gradle y CI reproducible.
- Contratos y documentación para Supabase/Gemini.

Pendiente: Auth real, materias persistentes, Storage, ingesta, embeddings, recuperación RAG, orquestador multiagente y créditos backend. No se marcarán como terminados hasta probarlos contra Supabase.
