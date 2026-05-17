# 🥦 Gemüsekisterl

Eine Next.js-Webanwendung für einen Gemüsehändler — Produktübersicht, Warenkorb, Bestellungen und Admin-Bereich.

## Tech Stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** · **ESLint** · **Prettier**
- **Supabase** (Postgres-Datenbank)
- **SheetJS** (Excel-Import)
- **bcryptjs** (Passwort-Hashing)

---

## Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Supabase-Projekt erstellen

1. [supabase.com](https://supabase.com) → Neues Projekt
2. **SQL Editor** öffnen → Inhalt von `supabase/schema.sql` ausführen
3. **Project Settings → API** → URL und Keys kopieren

### 3. Umgebungsvariablen setzen

```bash
cp .env.local.example .env.local
```

`.env.local` ausfüllen:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Datenbank befüllen (Admin + Beispielkategorien)

```bash
npx tsx scripts/seed.ts
```

Erstellt den Admin-User (`admin` / `admin`) und Beispielkategorien.

### 5. Entwicklungsserver starten

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. GitHub-Repository erstellen und Code pushen
2. Vercel-Projekt aus dem Repository erstellen
3. Umgebungsvariablen in Vercel → Settings → Environment Variables eintragen
4. Deploy

---

## Projektstruktur

```
src/
├── app/                    # Seiten (Next.js App Router)
│   ├── page.tsx            # Produktübersicht (Startseite)
│   ├── login/page.tsx      # Anmeldung
│   ├── cart/page.tsx       # Warenkorb
│   ├── profile/page.tsx    # Profil / Passwort ändern
│   ├── admin/              # Admin-Bereich (geschützt)
│   │   ├── page.tsx        # Dashboard
│   │   ├── products/       # Produkte verwalten
│   │   ├── categories/     # Kategorien verwalten
│   │   └── orders/         # Bestellübersicht
│   └── api/                # API-Routes
├── components/
│   ├── ui/                 # Button, Input, Modal, …
│   ├── layout/             # Header, Footer
│   ├── products/           # ProductCard, SearchBar, …
│   ├── cart/               # CartItem, CartSummary
│   └── admin/              # ProductForm, ExcelImport, …
├── context/                # AuthContext, CartContext
├── hooks/                  # useAuth, useProducts, useCart, …
├── lib/                    # supabase.ts, auth.ts
└── types/                  # TypeScript-Interfaces
supabase/
└── schema.sql              # Datenbank-Schema
scripts/
└── seed.ts                 # Admin-User + Kategorien anlegen
```

---

## Excel-Import Format

Die Import-Datei muss folgende Spalten enthalten:

| Spalte | Pflicht | Beispiel |
|---|---|---|
| `Name` | ✅ | Bio-Karotten |
| `Preis` | ✅ | 2.50 |
| `Einheit` | ✅ | kg |
| `Kategorie` | — | Wurzelgemüse |
| `Verfügbar` | — | ja / nein |

Die bestehende `Gemüse_KW16.xlsx` kann als Vorlage genutzt werden.

---

## Admin-Zugang

| Benutzername | Passwort |
|---|---|
| `admin` | `admin` |

Das Passwort kann im Profil-Bereich jederzeit geändert werden.
