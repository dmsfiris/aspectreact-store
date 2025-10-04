import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setSubmitting(true);
      // Demo: pretend to send
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Contact form submitted:", form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-sm hover:shadow-card transition">
        <h1 className="text-3xl font-semibold text-ink">Contact Us</h1>
        <p className="mt-2 text-neutral-600">
          Have a question or feedback? Send us a message and we’ll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="Jane Doe"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="jane@example.com"
                required
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
              placeholder="I have a question about…"
              required
            />
            {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
              placeholder="Write your message here…"
              required
            />
            {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            {submitted ? (
              <p className="text-sm text-success">Message sent! We’ll be in touch.</p>
            ) : (
              <span className="text-xs text-neutral-500">
                We typically reply within 1–2 business days.
              </span>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-ink px-5 py-3 text-white hover:bg-neutral-900 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-xs text-neutral-500">
          Note: This is a demo form. Messages are logged in the browser console.
        </p>
      </div>
    </section>
  );
};

export default Contact;
