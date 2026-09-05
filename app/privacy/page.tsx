import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Pharos English Lab",
  description:
    "How Pharos English Lab collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-alt px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <ShieldCheck
            className="mx-auto mb-2 h-8 w-8 text-gold-500 sm:h-9 sm:w-9"
            strokeWidth={1.2}
          />

          <h1 className="heading-lg">Privacy Policy</h1>

          <p className="mx-auto mt-2 max-w-2xl font-body text-sm leading-relaxed text-navy-600">
            Last updated: 12 July 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="section-padding">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-10 font-body text-[15px] leading-relaxed text-navy-700 sm:text-base">
            <p>
              Pharos English Lab (&quot;Pharos&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy.
              This page explains what personal information we collect when you create an
              account, submit a diagnostic, or purchase a service through this site, and how
              we use it.
            </p>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">1. Information We Collect</h2>
              <div className="space-y-3">
                <p>When you use Pharos English Lab, we may collect:</p>
                <p>
                  <strong>Account details</strong> — your name and email address, used to
                  create your account and sign you in.
                </p>
                <p>
                  <strong>Diagnostic submissions</strong> — your writing, Use of English
                  answers, listening responses, and readiness quiz answers, submitted for
                  correction or assessment.
                </p>
                <p>
                  <strong>Payment information</strong> — if you purchase a diagnostic, payment
                  is processed directly by Stripe or PayPal. Pharos does not store your card
                  or bank details.
                </p>
                <p>
                  <strong>Basic communication records</strong> — such as contact form messages
                  and order/status updates sent to your email.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">2. How We Use Your Information</h2>
              <div className="space-y-3">
                <p>We use your information to:</p>
                <p>
                  Prepare and deliver your personalised diagnostic report and feedback;
                  manage your account and orders; communicate with you about your results,
                  purchases, or enquiries; process payment for the services you purchase; and
                  improve our diagnostic methodology and teaching materials.
                </p>
                <p>
                  Every diagnostic is prepared and reviewed under the direct supervision of
                  Marcela Liporace Murga, Cambridge Exams Specialist. We may use trusted
                  software tools, including AI-assisted tools, to help format and organise
                  feedback — always under our review, never as a replacement for it.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">
                3. Anonymised Use of Student Writing for Teaching Purposes
              </h2>
              <div className="space-y-3">
                <p>
                  From time to time, Pharos English Lab may use short, anonymised extracts of
                  student writing (with all names and identifying details removed) for
                  teaching or illustrative purposes — for example, in blog posts, social media
                  content, or other educational materials.
                </p>
                <p>
                  If you would prefer that your writing not be used in this way, you may let
                  us know at any time at{" "}
                  <a href="mailto:pharosenglishlab@gmail.com" className="text-gold-600 underline">
                    pharosenglishlab@gmail.com
                  </a>
                  , and we will exclude your submissions from any such use.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">4. Third-Party Services We Use</h2>
              <div className="space-y-3">
                <p>
                  To provide our services, we rely on a small number of trusted third-party
                  providers, including database and account infrastructure, email delivery,
                  and payment processing (Stripe and PayPal). These providers only receive the
                  information necessary to perform their function and are not authorised to
                  use your data for their own purposes.
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">5. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services
                and maintain accurate records, or as required by law. You may request that
                your data be deleted at any time (see Section 6).
              </p>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">6. Your Rights</h2>
              <div className="space-y-3">
                <p>You have the right to:</p>
                <p>
                  Ask what personal information we hold about you; ask us to correct
                  inaccurate information; ask us to delete your information, except where we
                  are required to keep it for legal or accounting reasons; and opt out of
                  having your (anonymised) writing used in teaching materials, as described in
                  Section 3.
                </p>
                <p>
                  To exercise any of these rights, contact us at{" "}
                  <a href="mailto:pharosenglishlab@gmail.com" className="text-gold-600 underline">
                    pharosenglishlab@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be
                posted on this page with an updated &quot;Last updated&quot; date.
              </p>
            </div>

            <div>
              <h2 className="heading-lg mb-4 !text-2xl">8. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:pharosenglishlab@gmail.com" className="text-gold-600 underline">
                  pharosenglishlab@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
