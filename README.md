# Binary Bakery Academy - Fullstack Application

A feature-rich educational platform built using **Next.js 15+, TypeScript, Tailwind CSS, ShadCN UI, Firebase**, and **Resend**. This app allows students to explore programs, apply with rich forms, get email confirmations, and allows counselors to review and approve or deny applications.

---

## 🚀 Features

| Feature                    | UI | Email | Status                    |
| -------------------------- | -- | ----- | ------------------------- |
| View Programs              | ✅  | N/A   | ✅                         |
| Submit Application         | ✅  | ✅     | ✅ (Includes confirmation) |
| Counselor Review & Approve | ✅  | ✅     | ✅                         |
| Counselor Review & Deny    | ✅  | ✅     | ✅ (With recommendations)  |
| Payment & Confirmation     | ✅  | ✅     | ✅                         |

---

## 🧱 Stack

* **Frontend**: Next.js App Router + TypeScript
* **UI**: Tailwind CSS + ShadCN UI
* **Auth & DB**: Firebase (Auth, Firestore)
* **Email**: [Resend](https://resend.com/) with transactional HTML emails
* **Animation**: Framer Motion
* **Validation**: Zod + React Hook Form

---

## 🔧 Setup Instructions

1. **Clone the project**

```bash
git clone https://github.com/your-username/binary-bakery.git
cd binary-bakery
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env.local` file in root and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

RESEND_API_KEY=your_resend_key
EMAIL_FROM=admissions@binarybakery.dev
```

4. **Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```bash
src/
├─ app/                 # Next.js routes (App Router)
│  ├─ programs/         # Public programs list & details
│  ├─ apply/[id]/       # Application form
│  ├─ student/dashboard/    # Payment & confirmation
│  ├─ counselor/            # Counselor dashboard & details
│  └─ api/send-payment-email/route.ts  # Email API route
│
├─ components/         # UI components (forms, buttons, dialogs)
├─ hooks/              # Custom React hooks
├─ lib/                # Firebase, Resend utils, types, mock data
├─ context/            # Global context like auth
├─ ai/                 # Optional AI/genkit integrations
```

---

## ✉️ How Email Works

Emails are sent using Resend via the `/api/send-payment-email` route or directly via `sendEmail()` in `lib/send-email.ts`:

```ts
await sendEmail({
  to: data.email,
  subject: "Application Received",
  html: `<p>Thank you, ${data.fullName}</p>`
});
```

You must have:

* Resend account at [https://resend.com/](https://resend.com/)
* Verified domain or sender email (for development, use any Gmail or test inbox)

---

## 🧪 Testing Users

In Firebase Console > Authentication:

* Add 2 test student users (email + password)
* Add 1 counselor user (email + password)

Login works with:

```ts
signInWithEmailAndPassword(auth, email, password)
```

Use role condition to redirect to dashboard or counselor view.

---

## 📦 TODO

* [ ] Store applications in Firestore
* [ ] Store user roles in Firestore
* [ ] Add login/signup with role
* [ ] Add AI assistant (Genkit)

---

## 🧑‍💻 Author

Made by **Kingsman71** for Binary Bakery Academy Challenge

---

## 📜 License

MIT License
