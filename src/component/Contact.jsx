import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    // Demo behavior: log to console, show success state, reset form
    // Replace with your toast if you prefer (react-hot-toast).
    // eslint-disable-next-line no-console
    console.log("Contact form submitted:", form);

    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
        <h1 className="text-3xl font-semibold text-ink">Contact us</h1>
        <p className="mt-2 text-neutral-600">
          Have a question or feedback? Send us a message and we’ll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="Jane Doe"
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger">{errors.name}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
                placeholder="jane@example.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">{errors.email}</p>
              )}
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Subject</span>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
              placeholder="I have a question about…"
              required
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-danger">{errors.subject}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full rounded-xl border-neutral-300 focus:border-primary focus:ring-primary"
              placeholder="Write your message here…"
              required
            />
            {errors.message && (
              <p className="mt-1 text-xs text-danger">{errors.message}</p>
            )}
          </label>

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
              className="rounded-xl bg-ink px-5 py-3 text-white hover:bg-neutral-900"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
