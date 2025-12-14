import { useState } from "react";
import { Check, MapPin, Bike, Clock, Mail, Phone, Menu as MenuIcon } from "lucide-react";

// --- Simple data you can edit quickly ---
const BRAND = {
  name: "CanvasBites",
  tagline: "Fresh, affordable meals delivered to your door.",
  phone: "(555) 123-4567",
  email: "hello@canvasbites.com",
  primary: "#16a34a", // Tailwind green-600
  accent: "#f97316", // Tailwind orange-500
  city: "Tempe, AZ",
  deliveryWindows: [
    { label: "Lunch", time: "11:30 AM – 1:30 PM" },
    { label: "Dinner", time: "5:30 PM – 7:30 PM" },
  ],
  orderLink: "https://forms.gle/your-google-form",
  instagram: "https://instagram.com/yourhandle",
};

const MENU = [
  {
    name: "Grilled Chicken Bowl",
    desc: "Brown rice, roasted veggies, lemon herb sauce",
    price: 10.0,
    kcal: 520,
    img:
      "https://images.unsplash.com/photo-1604908812239-6ec6f0d7d1b6?q=80&w=1200&auto=format&fit=crop",
    tags: ["Gluten-free", "High protein"],
  },
  {
    name: "Veggie Power Wrap",
    desc: "Whole-wheat wrap, hummus, spinach, avo, quinoa",
    price: 9.0,
    kcal: 460,
    img:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
    tags: ["Vegan", "Fiber-rich"],
  },
  {
    name: "Beef Teriyaki Bento",
    desc: "Jasmine rice, sesame broccoli, pickled carrot",
    price: 11.0,
    kcal: 610,
    img:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    tags: ["Best seller"],
  },
  {
    name: "Greek Salad + Falafel",
    desc: "Romaine, tomato, cucumber, olives, feta, tahini",
    price: 9.5,
    kcal: 390,
    img:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    tags: ["Vegetarian"],
  },
];

// -----------------------
// Lightweight smoke tests (keep these!)
// -----------------------
function runSmokeTests() {
  try {
    // Brand basics
    console.assert(typeof BRAND.name === "string" && BRAND.name.length > 0, "BRAND.name required");
    console.assert(typeof BRAND.orderLink === "string" && BRAND.orderLink.startsWith("http"), "orderLink must be a URL");
    console.assert(Array.isArray(BRAND.deliveryWindows) && BRAND.deliveryWindows.length >= 2, "Need at least two delivery windows");
    for (const w of BRAND.deliveryWindows) {
      console.assert(typeof (w as {label:string; time:string}).label === "string" && typeof (w as {label:string; time:string}).time === "string", "delivery window must have label/time strings");
    }

    // Menu integrity
    console.assert(Array.isArray(MENU) && MENU.length >= 1, "MENU should have items");
    for (const m of MENU) {
      console.assert(!!m.name, "Menu item needs a name");
      console.assert(typeof m.price === "number" && !Number.isNaN(m.price), "Menu item price must be a number");
      console.assert(Array.isArray(m.tags), "Menu item tags should be an array");
      console.assert(typeof m.img === "string" && m.img.startsWith("http"), "Menu item must have an image URL");
    }

    // Template-string content check (guards the original bug)
    const a = BRAND.deliveryWindows?.[0]?.label ?? "Lunch";
    const b = BRAND.deliveryWindows?.[1]?.label ?? "Dinner";
    const how = `Select ${a} or ${b} delivery.`;
    console.assert(how.includes(a) && how.includes(b) && how.endsWith("delivery."), "how-text template should compile correctly");
  } catch (err) {
    console.error("Smoke tests failed:", err);
  }
}

runSmokeTests();

export default function App() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Safe fallbacks for delivery window labels to prevent runtime errors
  const windowA: string = BRAND.deliveryWindows?.[0]?.label ?? "Lunch";
  const windowB: string = BRAND.deliveryWindows?.[1]?.label ?? "Dinner";
  const howText: string = `Select ${windowA} or ${windowB} delivery.`; // fixed template string

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#home" className="font-bold text-xl" style={{ color: BRAND.primary }}>
            {BRAND.name}
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a className="hover:opacity-80" href="#menu">Menu</a>
            <a className="hover:opacity-80" href="#how">How it works</a>
            <a className="hover:opacity-80" href="#delivery">Delivery</a>
            <a className="hover:opacity-80" href="#faq">FAQ</a>
            <a
              href={BRAND.orderLink}
              className="rounded-2xl px-4 py-2 font-medium text-white shadow-sm"
              style={{ background: BRAND.accent }}
            >
              Order now
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileOpen((v) => !v)}>
            <MenuIcon className="h-6 w-6" />
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-3">
              {[
                ["Menu", "#menu"],
                ["How it works", "#how"],
                ["Delivery", "#delivery"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href as string}
                  className="py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}
              <a
                href={BRAND.orderLink}
                className="rounded-xl px-4 py-3 text-center font-medium text-white"
                style={{ background: BRAND.accent }}
              >
                Order now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Healthy campus meals, <span style={{ color: BRAND.primary }}>delivered</span> fast.
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-prose">
              {BRAND.tagline} Pre-order by 10:00 AM for lunch or by 3:00 PM for dinner. Simple pricing, no surprises.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BRAND.orderLink}
                className="rounded-2xl px-6 py-3 font-semibold text-white shadow-md"
                style={{ background: BRAND.primary }}
              >
                Start your order
              </a>
              <a href="#menu" className="rounded-2xl px-6 py-3 font-semibold border">
                Browse menu
              </a>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Chef-prepped, reheats in 2–3 min</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Macros listed; vegetarian & GF options</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Free delivery on campus</li>
            </ul>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1400&auto=format&fit=crop"
              alt="Bowls of fresh meals"
              className="rounded-3xl shadow-lg object-cover w-full aspect-[4/3]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow p-4 flex items-center gap-3">
              <Bike className="h-6 w-6" />
              <span className="text-sm font-medium">Delivery in 30–45 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">This week’s menu</h2>
          <a href={BRAND.orderLink} className="text-sm underline">Full menu & ordering →</a>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MENU.map((item) => (
            <article key={item.name} className="bg-white rounded-2xl shadow-sm overflow-hidden border">
              <img src={item.img} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{item.name}</h3>
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-neutral-600">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(item.tags as string[]).map((t) => (
                    <span key={t} className="text-xs bg-neutral-100 rounded-full px-2 py-1">{t}</span>
                  ))}
                </div>
                <div className="text-xs text-neutral-500">~{item.kcal} kcal</div>
                <a
                  href={BRAND.orderLink}
                  className="mt-3 inline-block w-full text-center rounded-xl px-4 py-2 font-medium text-white"
                  style={{ background: BRAND.accent }}
                >
                  Add to order
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white border-t border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Pick your meals",
              icon: <Check className="h-6 w-6" />,
              text: "Choose from weekly rotating bowls, wraps, and salads.",
            },
            {
              title: "Choose a window",
              icon: <Clock className="h-6 w-6" />,
              text: howText,
            },
            {
              title: "We deliver fast",
              icon: <Bike className="h-6 w-6" />,
              text: "Track your driver via text and meet at the door or lobby.",
            },
          ].map((s) => (
            <div key={s.title} className="flex gap-4 bg-neutral-50 rounded-2xl p-6 border">
              <div className="shrink-0 mt-1">{s.icon}</div>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-neutral-600 text-sm mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Delivery in {BRAND.city}</h2>
        <p className="text-neutral-600 mt-2 max-w-prose">
          Free delivery on campus. Off-campus within 2 miles: $2.99 flat fee. We currently deliver during these windows:
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {BRAND.deliveryWindows.map((w) => (
            <div key={w.label} className="bg-white border rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
              <Clock className="h-4 w-4" /> <span className="font-medium">{w.label}:</span> <span className="text-neutral-600">{w.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-6 items-center">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5" /> Delivery area</h3>
            <p className="text-sm text-neutral-600 mt-2">ASU campus + 2 miles around Tempe. Enter your address at checkout to confirm.</p>
            <a href={BRAND.orderLink} className="mt-4 inline-block rounded-xl px-4 py-2 text-white font-medium" style={{ background: BRAND.primary }}>
              Check my address
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1400&auto=format&fit=crop"
            alt="Map placeholder"
            className="rounded-2xl w-full object-cover aspect-video border"
          />
        </div>
      </section>

      {/* Pricing blurb */}
      <section className="bg-gradient-to-r from-white to-neutral-100 border-t border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Simple pricing</h2>
            <p className="mt-2 text-neutral-600">Meals from $9–$11. Student bundle: 5 meals for $45. No hidden fees.</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Apple Pay • Google Pay • Credit Card</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Cancel or edit up to 2 hours before window</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Allergen info at checkout</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-semibold">Join the list for weekly menus</h3>
            <NewsletterForm />
            <p className="text-xs text-neutral-500 mt-2">We’ll email once a week. No spam.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <FAQ q="How do I order?" a="Tap ‘Start your order’—it opens our secure order form. Pick meals, delivery window, and pay in under a minute." />
          <FAQ q="Can I schedule ahead?" a="Yes. You can place orders up to 5 days in advance and choose any available window." />
          <FAQ q="What about allergens?" a="Each item lists common allergens. Tell us at checkout and we’ll label your bag and text your driver." />
          <FAQ q="Do you cater?" a="We do. Email us your headcount and timing—boxed meals start at $8/person for 20+ orders." />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold">Questions? Reach out.</h2>
            <p className="text-neutral-600 mt-2">We’re quick on text and email during delivery windows.</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {BRAND.phone}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {BRAND.email}</div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href={BRAND.instagram} className="hover:underline">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Swap action to Formspree or Beehiiv embed later
    setSent(true);
  }

  if (sent) return <div className="mt-3 text-green-700">Thanks! You’re on the list.</div>;

  return (
    <form onSubmit={submit} className="mt-4 flex gap-2">
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@asu.edu"
        className="flex-1 rounded-xl border px-3 py-2"
      />
      <button
        className="rounded-xl px-4 py-2 font-medium text-white"
        style={{ background: BRAND.primary }}
      >
        Subscribe
      </button>
    </form>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  type FormState = { name: string; email: string; message: string };
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <form onSubmit={submit} className="bg-neutral-50 border rounded-2xl p-6 space-y-3 shadow-sm">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="Alex Johnson"
          />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="you@asu.edu"
          />
        </div>
      </div>
      <div>
        <label className="text-sm">Message</label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[120px]"
          placeholder="Tell us what you need"
        />
      </div>
      <button
        className="w-full rounded-xl px-4 py-2 font-medium text-white"
        style={{ background: BRAND.accent }}
      >
        {status === "sent" ? "Sent!" : "Send message"}
      </button>
      <p className="text-xs text-neutral-500">By submitting, you agree to our Terms and Privacy Policy.</p>
    </form>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <button
        type="button"
        className="w-full text-left font-medium flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        <span className="text-xl leading-none">{open ? "–" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-sm text-neutral-600">{a}</p>}
    </div>
  );
}
