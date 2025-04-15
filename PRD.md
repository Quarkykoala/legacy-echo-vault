**Product Requirements Document (PRD)**
**Project: LegacyChain**
**Version: MVP 1.0**
**Last Updated: April 15, 2025**

---

## 1. Product Vision

LegacyChain is a voice-first, emotionally resonant memory vault for families. It allows users to preserve voice messages, memories, and personal reflections in a secure, intergenerational space that can evolve into a time capsule of human experience. 

The vision is to build a platform where ancestral wisdom, family love, and personal stories can be captured and passed on — not through text or feeds, but through raw voice, timelines, and intentional memory threading. LegacyChain is where your descendants can hear not just your words, but your soul.

---

## 2. Core Use Case

**Primary User:** A family member or parent who wants to preserve and share meaningful voice memories across generations.

**User Flow (MVP):**
1. User signs up via secure Supabase Auth.
2. They create or join a Family Vault (can join multiple vaults).
3. They record/upload a voice memory (up to 5 minutes) or text entry.
4. They tag it (e.g., date, person, theme).
5. Optionally, they set it as a time capsule (unlock in 30 days to 100 years).
6. Vault owner approves new members, who can then access unlocked memories.

**Problem Solved:**
- Memories currently live in fragmented tools (notes, voice memos, WhatsApp).
- No system exists to **curate, organize, and emotionally thread** memories across generations.
- Text loses tone. LegacyChain preserves *voice*.

---

## 3. MVP Features

| Feature                          | Description                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| **Auth System**                  | Email-only invites (7-day expiry). Owner approval required.                |
| **Family Vault Dashboard**       | Multiple vaults per user. Max 20 members per vault.                        |
| **Voice/Text Memory Upload**     | Native recorder. 5-min max. Supports .mp3/.m4a/.aac up to 20MB.           |
| **Time Capsule Logic**           | 30-day default unlock. Maximum 100-year future lock.                       |
| **Basic Family Tree UI**         | Lightweight visual tree with person-linked memories.                       |
| **Responsive UI**                | Four themes: sepia, midnight, pearl, dusk. Mobile-first design.            |

---

## 4. User Types

| User Type       | Access Permissions                                              |
|-----------------|------------------------------------------------------------------|
| **Family Member** | Can upload, view, unlock, tag, and browse memories.             |
| **Vault Creator** | Must approve new members. Max 20 members/vault.                 |
| **(Future)** Admin/Archivist | (Out of scope for MVP) Advanced controls, moderation.       |

---

## 5. Emotional & Brand Tone

LegacyChain should feel **warm, timeless, intimate, and respectful** — like the digital equivalent of a handwritten letter or a grandparent's whisper.

Visual inspiration: Four fixed themes (sepia, midnight, pearl, dusk).

Copy tone: Minimal, intentional, non-markety.

---

## 6. Non-Functional Requirements

| NFR                       | Specification                                                   |
|---------------------------|------------------------------------------------------------------|
| **Mobile-first**          | Web-only MVP. Support Safari ≥15, Chrome/Edge ≥100              |
| **Performance**           | Page load < 2s. Partial offline support (record but not upload) |
| **Accessibility (WCAG)**  | Use semantic HTML, keyboard nav, ARIA roles                     |
| **Data & Privacy**        | HTTPS + Supabase RLS. 1-year inactive retention. 30-day delete window |

---

## 7. Technical Specifications

| Category                  | Specification                                                   |
|---------------------------|------------------------------------------------------------------|
| **Memory Limits**         | 5-min audio max, 20MB file size limit                          |
| **Supported Formats**     | .mp3, .m4a, .aac                                               |
| **Storage**              | Supabase + Vercel backups                                       |
| **Offline Support**      | Record offline, require connection for upload                    |
| **Beta Access**          | Invite-only, 100 user limit                                     |

---

## 8. Out-of-Scope (MVP)

- AI voice transcription or summarization
- Public vaults or external sharing
- Commenting / Reactions
- School/Institution profiles (for Digital Yearbook+)
- i18n / Multilingual support
- Tags-based memory search engine
- Nested vaults
- Custom themes
- End-to-end encryption
- Native iOS app

---

## 9. Success Criteria (for MVP)

- ✅ Voice/text memory upload works across supported browsers
- ✅ Supabase Auth enforces secure login & private vault access
- ✅ Time capsule unlock date logic functions as expected
- ✅ Family Vault dashboard displays recent + upcoming memories
- ✅ Component LOC < 300 across codebase
- ✅ Cursor agent generates code-only responses in agent mode
- ✅ Deployment on Vercel with no fatal crashes or data loss
- ✅ No unauthorized access or bypass of memory privacy rules
- ✅ All memories under 20MB and 5-minute limit
- ✅ Successful partial offline support implementation

---

## 10. Next Steps Post-MVP

- Swift refactor for native iOS
- AI transcription for searchability
- Public archives for oral history projects
- Emotion-aware vault discovery (smart timelines)
- Expansion into schools and cultural heritage institutions
- End-to-end encryption implementation
- Nested vaults support
- Custom theme builder

---

**Document Owner:** Parakh Shahal  
**Agent Support:** Januma

> This PRD will evolve. The past stays sacred, the code stays lean, and the legacy lives on. 