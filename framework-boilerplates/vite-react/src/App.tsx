import React, { useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

/**
 * Tildópolis (Demo sin audio)
 * - React + TailwindCSS + Framer Motion
 * - Enfoque: comprender reglas (agudas, graves, esdrújulas) y practicar con feedback explicativo.
 * - Personaje guía: Profesor Búho 🦉.
 *
 * Instrucciones (si exportas esto a un proyecto React):
 * 1) Crea un proyecto con Vite o CRA, pega este componente y expórtalo como default.
 * 2) Asegúrate de tener Tailwind configurado en el proyecto.
 * 3) Importa y renderiza <AppTildopolis /> en tu App.
 */

// Utilidad para quitar tildes y mostrar versión "sin ayuda" cuando convenga
const stripAccents = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "u");

// Banco de palabras con su clasificación y explicación de regla
const WORDS = [
  {
    base: "arbol",
    correcto: "árbol",
    tipo: "grave",
    termina: "l",
    regla:
      "Es una palabra grave. Las graves llevan tilde cuando terminan en consonante que no sea n ni s. Termina en 'l', por eso lleva tilde: árbol.",
  },
  {
    base: "cama",
    correcto: "cama",
    tipo: "grave",
    termina: "a",
    regla:
      "Es una palabra grave. Las graves NO llevan tilde cuando terminan en vocal, 'n' o 's'. Termina en vocal, por eso no lleva tilde: cama.",
  },
  {
    base: "camion",
    correcto: "camión",
    tipo: "aguda",
    termina: "n",
    regla:
      "Es aguda. Las agudas llevan tilde cuando terminan en vocal, 'n' o 's'. Termina en 'n', por eso lleva tilde: camión.",
  },
  {
    base: "television",
    correcto: "televisión",
    tipo: "aguda",
    termina: "n",
    regla:
      "Es aguda. Las agudas llevan tilde si terminan en vocal, 'n' o 's'. Termina en 'n', por eso: televisión.",
  },
  {
    base: "lapiz",
    correcto: "lápiz",
    tipo: "grave",
    termina: "z",
    regla:
      "Es grave y termina en consonante que no es 'n' ni 's'. Las graves así SÍ llevan tilde: lápiz.",
  },
  {
    base: "papel",
    correcto: "papel",
    tipo: "aguda",
    termina: "l",
    regla:
      "Es aguda, pero NO termina en vocal, 'n' ni 's'. Por eso no lleva tilde: papel.",
  },
  {
    base: "cafe",
    correcto: "café",
    tipo: "aguda",
    termina: "e",
    regla:
      "Es aguda y termina en vocal. Las agudas así sí llevan tilde: café.",
  },
  {
    base: "sofa",
    correcto: "sofá",
    tipo: "aguda",
    termina: "a",
    regla: "Es aguda y termina en vocal. Por eso lleva tilde: sofá.",
  },
  {
    base: "reloj",
    correcto: "reloj",
    tipo: "aguda",
    termina: "j",
    regla:
      "Es aguda, pero termina en consonante distinta de 'n' o 's'. No lleva tilde: reloj.",
  },
  {
    base: "corazon",
    correcto: "corazón",
    tipo: "aguda",
    termina: "n",
    regla: "Es aguda y termina en 'n'. Lleva tilde: corazón.",
  },
  {
    base: "cancion",
    correcto: "canción",
    tipo: "aguda",
    termina: "n",
    regla: "Es aguda y termina en 'n'. Lleva tilde: canción.",
  },
  {
    base: "paraguas",
    correcto: "paraguas",
    tipo: "grave",
    termina: "s",
    regla:
      "Es grave y termina en 's'. Las graves que terminan en vocal, 'n' o 's' NO llevan tilde: paraguas.",
  },
  {
    base: "compas",
    correcto: "compás",
    tipo: "aguda",
    termina: "s",
    regla:
      "Es aguda y termina en 's'. Las agudas que terminan en vocal, 'n' o 's' sí llevan tilde: compás.",
  },
  {
    base: "joven",
    correcto: "joven",
    tipo: "grave",
    termina: "n",
    regla:
      "Es grave y termina en 'n'. Las graves que terminan en vocal, 'n' o 's' NO llevan tilde: joven.",
  },
  {
    base: "facil",
    correcto: "fácil",
    tipo: "grave",
    termina: "l",
    regla:
      "Es grave y termina en consonante que no es 'n' ni 's'. Sí lleva tilde: fácil.",
  },
  {
    base: "limon",
    correcto: "limón",
    tipo: "aguda",
    termina: "n",
    regla: "Es aguda y termina en 'n'. Lleva tilde: limón.",
  },
  {
    base: "examen",
    correcto: "examen",
    tipo: "grave",
    termina: "n",
    regla:
      "Es grave y termina en 'n'. Las graves que terminan en vocal, 'n' o 's' NO llevan tilde: examen.",
  },
  {
    base: "dibujos",
    correcto: "dibujos",
    tipo: "grave",
    termina: "s",
    regla:
      "Es grave y termina en 's'. Las graves que terminan en vocal, 'n' o 's' NO llevan tilde: dibujos.",
  },
  {
    base: "murcielago",
    correcto: "murciélago",
    tipo: "esdrújula",
    termina: "o",
    regla:
      "Es esdrújula (la sílaba tónica es la antepenúltima). ¡Todas las esdrújulas llevan tilde!: murciélago.",
  },
  {
    base: "telefono",
    correcto: "teléfono",
    tipo: "esdrújula",
    termina: "o",
    regla:
      "Es esdrújula. Todas las esdrújulas llevan tilde: teléfono.",
  },
  {
    base: "rapido",
    correcto: "rápido",
    tipo: "esdrújula",
    termina: "o",
    regla:
      "Es esdrújula. Todas las esdrújulas llevan tilde: rápido.",
  },
  {
    base: "ingles",
    correcto: "inglés",
    tipo: "aguda",
    termina: "s",
    regla: "Es aguda y termina en 's'. Lleva tilde: inglés.",
  },
  {
    base: "torax",
    correcto: "tórax",
    tipo: "grave",
    termina: "x",
    regla:
      "Es grave y termina en consonante distinta de 'n' o 's'. Las graves así sí llevan tilde: tórax.",
  },
];

const RuleCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-white/70 backdrop-blur shadow p-5 border border-slate-200"
  >
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="text-slate-700 leading-relaxed">{children}</div>
  </motion.div>
);

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
    {children}
  </span>
);

const OwlSpeech = ({ children }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="relative max-w-xl"
  >
    <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 shadow text-yellow-900">
      {children}
    </div>
    <div className="absolute -left-2 -bottom-2 text-4xl">🦉</div>
  </motion.div>
);

function useShuffledWords() {
  return useMemo(() => {
    const w = [...WORDS];
    for (let i = w.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [w[i], w[j]] = [w[j], w[i]];
    }
    return w;
  }, []);
}

export default function AppTildopolis() {
  const [tab, setTab] = useState("learn"); // learn | practice | game
  const shuffled = useShuffledWords();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-violet-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tildópolis <span className="align-text-top">🦉</span>
            </h1>
            <p className="text-slate-600">Aprende tildes con el Profesor Búho</p>
          </div>
          <nav className="flex gap-2">
            {[
              { id: "learn", label: "Aprende las reglas" },
              { id: "practice", label: "Practica" },
              { id: "game", label: "Juego" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border shadow-sm hover:shadow transition ${
                  tab === t.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white/80 border-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <AnimatePresence mode="wait">
          {tab === "learn" && (
            <motion.section
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <OwlSpeech>
                  <p className="text-lg font-semibold">
                    ¡Hola! Soy el Profesor Búho. Hoy te enseño <em>dónde</em> va la tilde 🪄
                  </p>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    <li>
                      <strong>Agudas</strong>: la voz fuerte está en la <strong>última</strong> sílaba. <Chip>camión</Chip>
                    </li>
                    <li>
                      <strong>Graves</strong> (llanas): la voz fuerte está en la <strong>penúltima</strong>. <Chip>árbol</Chip>
                    </li>
                    <li>
                      <strong>Esdrújulas</strong>: la voz fuerte está en la <strong>antepenúltima</strong>. <Chip>rápido</Chip>
                    </li>
                  </ul>
                </OwlSpeech>
                <RuleCard title="¿Cuándo llevan tilde?">
                  <ul className="space-y-2">
                    <li>
                      <strong>Agudas</strong> ➜ llevan tilde si terminan en <Chip>vocal</Chip>, <Chip>n</Chip> o <Chip>s</Chip>.
                    </li>
                    <li>
                      <strong>Graves</strong> ➜ llevan tilde si <em>NO</em> terminan en <Chip>vocal</Chip>, <Chip>n</Chip> o <Chip>s</Chip>.
                    </li>
                    <li>
                      <strong>Esdrújulas</strong> ➜ <span className="font-bold">siempre</span> llevan tilde.
                    </li>
                  </ul>
                </RuleCard>
                <RuleCard title="Ejemplos clave">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl p-3 bg-green-50 border border-green-200">
                      <p className="font-semibold">✔️ Llevan tilde</p>
                      <p>camión, corazón, inglés, café, lápiz, árbol, rápido</p>
                    </div>
                    <div className="rounded-xl p-3 bg-red-50 border border-red-200">
                      <p className="font-semibold">✖️ No llevan tilde</p>
                      <p>cama, papel, reloj, joven, examen, paraguas</p>
                    </div>
                  </div>
                </RuleCard>
              </div>

              <LearnPlayground />
            </motion.section>
          )}

          {tab === "practice" && (
            <Practice key="practice" />
          )}

          {tab === "game" && <Game key="game" words={shuffled} />}
        </AnimatePresence>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Hecho con ❤️ para aprender jugando.
        </footer>
      </div>
    </div>
  );
}

function LearnPlayground() {
  const sample = WORDS.find((w) => w.base === "arbol");
  const [showTip, setShowTip] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white/80 border border-slate-200 shadow p-6"
    >
      <h3 className="text-xl font-bold mb-3">Ejemplo guiado</h3>
      <p className="text-slate-600 text-sm mb-4">
        ¿Por qué <strong>árbol</strong> lleva tilde y <strong>cama</strong> no?
      </p>

      <div className="grid gap-4">
        <div className="rounded-xl p-4 bg-indigo-50 border border-indigo-200">
          <p className="text-lg">
            <span className="font-bold">árbol</span> → es <Chip>grave</Chip> y termina en <Chip>l</Chip> (consonante ≠ n/s) →
            <span className="font-bold"> lleva tilde</span>
          </p>
        </div>
        <div className="rounded-xl p-4 bg-sky-50 border border-sky-200">
          <p className="text-lg">
            <span className="font-bold">cama</span> → es <Chip>grave</Chip> y termina en <Chip>vocal</Chip> →
            <span className="font-bold"> no lleva tilde</span>
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowTip((v) => !v)}
        className="mt-5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:brightness-110"
      >
        {showTip ? "Ocultar truco" : "Ver un truco"}
      </button>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm">
              <strong>Truco del búho:</strong> si la palabra es <em>grave</em> y termina en
              <em> vocal, n o s</em>, casi nunca lleva tilde. Si termina en otra consonante, casi siempre sí.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Practice() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);

  const item = WORDS[index % WORDS.length];
  const wordWithoutAccent = stripAccents(item.correcto);

  function answer(tieneTilde) {
    const correcto = item.correcto !== wordWithoutAccent; // si la forma correcta tiene tilde visual
    const acierta = tieneTilde === correcto;

    setFeedback({
      ok: acierta,
      msg: acierta
        ? `¡Muy bien! ${item.correcto} ✓`
        : `Casi. La forma correcta es ${item.correcto}.`,
      regla: item.regla,
    });

    if (acierta) {
      setScore((s) => s + 10);
      setStreak((r) => r + 1);
    } else {
      setStreak(0);
    }
  }

  function next() {
    setFeedback(null);
    setIndex((i) => i + 1);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="rounded-3xl bg-white/80 border border-slate-200 shadow p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Practica</h3>
          <div className="text-sm">Puntos: <span className="font-bold">{score}</span></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 text-sm">¿Esta palabra lleva tilde?</p>
          <div className="text-4xl md:text-5xl font-extrabold mt-2 tracking-wide">
            {stripAccents(item.correcto)}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => answer(true)}
              className="px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold hover:brightness-110"
            >
              Sí, lleva tilde
            </button>
            <button
              onClick={() => answer(false)}
              className="px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:brightness-110"
            >
              No, no lleva
            </button>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-6 w-full rounded-2xl border p-4 text-left ${
                  feedback.ok
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="font-bold">{feedback.msg}</p>
                <p className="mt-1 text-sm text-slate-700">{feedback.regla}</p>
                <button
                  onClick={next}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Siguiente
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center text-sm">
          Racha: {streak} {streak >= 3 ? "⭐" : ""}
        </div>
      </div>

      <div className="space-y-4">
        <RuleCard title="Recuerda las reglas mientras practicas">
          <ul className="list-disc list-inside text-sm">
            <li><strong>Agudas</strong> → tilde si terminan en vocal, <em>n</em> o <em>s</em>.</li>
            <li><strong>Graves</strong> → tilde si <em>NO</em> terminan en vocal, <em>n</em> o <em>s</em>.</li>
            <li><strong>Esdrújulas</strong> → siempre tilde.</li>
          </ul>
        </RuleCard>
        <RuleCard title="Consejo del Profesor Búho">
          <p className="text-sm">
            Di la palabra en voz alta y toca con la palma la sílaba que suena más fuerte. ¡Ahí vive la tilde si le toca! 🦉
          </p>
        </RuleCard>
      </div>
    </motion.section>
  );
}

function Game({ words }) {
  const [i, setI] = useState(0);
  const [points, setPoints] = useState(0);
  const [msg, setMsg] = useState("");
  const w = words[i % words.length];

  function pick(tipo) {
    const ok = w.tipo === tipo;
    setMsg(
      ok
        ? `¡Correcto! ${w.correcto} es ${w.tipo}.`
        : `Ups, ${w.correcto} no es ${tipo}. Es ${w.tipo}.`
    );
    setPoints((p) => p + (ok ? 10 : 0));
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="rounded-3xl bg-white/80 border border-slate-200 shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Clasifica la palabra</h3>
          <div className="text-sm">Puntos: <span className="font-bold">{points}</span></div>
        </div>

        <div className="text-center py-6">
          <div className="text-5xl font-extrabold tracking-wide">
            {stripAccents(w.correcto)}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["aguda", "grave", "esdrújula"].map((t) => (
              <button
                key={t}
                onClick={() => pick(t)}
                className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow hover:shadow-md font-semibold"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {msg && (
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm">
              <p className="font-bold">{msg}</p>
              <p className="mt-1 text-slate-700">{w.regla}</p>
              <button
                onClick={() => {
                  setI((x) => x + 1);
                  setMsg("");
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <RuleCard title="Pistas rápidas">
          <ul className="list-disc list-inside text-sm">
            <li>Si la fuerza está al final, piensa en <em>aguda</em> (camión).</li>
            <li>Si está en el medio, suele ser <em>grave</em> (árbol, cama).</li>
            <li>Si está muy al principio, es <em>esdrújula</em> (rápido).
            </li>
          </ul>
        </RuleCard>
        <RuleCard title="Meta del reto">
          <p className="text-sm">Clasifica 10 palabras con 80 puntos o más para ganar la medalla 🏅</p>
        </RuleCard>
      </div>
    </motion.section>
  );
}
