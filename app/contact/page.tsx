import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about Cuba's opportunities, an asset, a partnership, or press? Send the team a message.",
};

export default function ContactPage() {
  return (
    <div className="container-x py-8">
      <div className="kicker mb-2">Contact</div>
      <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
      <p className="prose-cuba mt-3 max-w-2xl text-base">
        Questions about an opportunity, a partnership, the legal framework, or the data behind the
        atlas? Send us a note and we&apos;ll get back to you. You can also email{" "}
        <a href="mailto:parsa@qvapay.com" className="link">
          parsa@qvapay.com
        </a>{" "}
        directly.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ContactForm />
        <aside className="space-y-4 text-sm text-fog">
          <div className="card p-4">
            <div className="kicker mb-2">Reach us</div>
            <p>
              Email:{" "}
              <a href="mailto:parsa@qvapay.com" className="link">
                parsa@qvapay.com
              </a>
            </p>
            <p className="mt-2 text-xs text-ghost">
              We typically reply within a couple of business days.
            </p>
          </div>
          <div className="card p-4 text-xs text-ghost">
            This is research and product design, not legal or investment advice. Nothing here is an
            offer to buy or sell a security. Never send card, bank, or ID numbers through this form.
          </div>
        </aside>
      </div>
    </div>
  );
}
