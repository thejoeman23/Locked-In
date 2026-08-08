# Locked In

Locked In is a prototype exam workspace built as a concept for making English exams easier to create, administer, complete, and review online.

The project was made in 3 weeks as an early proof of concept. It is not production ready. It uses in-memory server state, permissive development CORS, and prototype-level validation, so it should be treated as a demo rather than a reliable exam platform.

## Purpose

Locked In explores a simpler workflow for English exams:

- Teachers can create an exam, build sections and questions, add a roster, and start a live exam session.
- Students can join with an exam code, complete the exam in the browser, and submit their work.
- Teachers can monitor student status and review submitted responses.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui-style components, and lucide-react icons.
- Realtime backend: Node.js HTTP server with Socket.IO.
- Data/storage: In-memory exam sessions on the backend. There is no database or durable persistence in this prototype.
- Deployment: Frontend deployed on Vercel. Backend deployed on Railway, but the Railway backend is now offline.

## Domain

While the backend may be offline, the website is not. You can visit it at [locked-in-eta-eight.vercel.app/](https://locked-in-eta-eight.vercel.app/) and explore the teacher workflow for creating and hosting exams, though you will not be able to actually host an exam yourself.

## Development

Install dependencies:

```bash
npm install
```

Run the Next.js frontend:

```bash
npm run dev
```

Run the Socket.IO backend:

```bash
npm run server
```

By default, the frontend expects the backend at `http://localhost:3001`. For a deployed or remote backend, set `NEXT_PUBLIC_SOCKET_URL`.
