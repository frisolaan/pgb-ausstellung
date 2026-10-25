# Making × BNE – Online-Ausstellung (PgB 1b)

Ausstellungsseite mit Upload-Formular (Zugangscode) und Freigabe durch die Projektleitung.

- `/` Ausstellung
- `/einreichen` Upload-Formular für die Projektgruppen
- `/einheit/<id>` Detailseite einer Einheit (geeignet für QR-Codes)
- `/admin` Freigabe (Admin-Code)

## Umgebungsvariablen (Vercel → Settings → Environment Variables)

| Name | Zweck |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | wird automatisch gesetzt, wenn ein Vercel-Blob-Store verbunden ist |
| `UPLOAD_CODE` | Zugangscode für die Projektgruppen |
| `ADMIN_CODE` | Code für die Freigabeseite |
| `NEXT_PUBLIC_KARTEN_APP_URL` | Link zur BNE × Making-Karten-App |
