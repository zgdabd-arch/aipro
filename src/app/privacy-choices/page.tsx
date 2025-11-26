export default function PrivacyChoicesPage() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-sm max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 font-headline">Your Privacy Choices</h1>
      <p className="text-muted-foreground">Control how your information is collected and used.</p>

      <h2 className="font-headline">Account Information</h2>
      <p>
        You have the right to access, update, or correct inaccuracies in your personal information in our custody and control, subject to certain exceptions prescribed by law. You may request access, updating, and corrections of inaccuracies in your personal information by:
      </p>
      <ul>
        <li>Logging into your account and navigating to the "Profile" or "Settings" page.</li>
        <li>Contacting us via the details provided on our Contact page.</li>
      </ul>
      <p>You may also request to delete your account. Please note that we may retain some information as required by law or for legitimate business purposes after you close your account.</p>

      <h2 className="font-headline">Promotional Communications</h2>
      <p>
        You can opt out of receiving promotional emails from us by following the unsubscribe instructions provided in those emails. Please note that even if you opt out of promotional communications, we may still send you non-promotional messages, such as those about your account or our ongoing business relations.
      </p>

      <h2 className="font-headline">Data from AI Interactions</h2>
      <p>
        We use your interactions with our AI features (like the AI Tutor and Study Plan generator) to improve our services. Currently, participation is a core part of the service. If you are not comfortable with this, you may choose to not use these specific features or to close your account. We are exploring options to provide more granular control over this data in the future.
      </p>

      <h2 className="font-headline">Contact Us</h2>
      <p>
        If you have any questions about your privacy choices, please do not hesitate to reach out to us through our Contact page.
      </p>
    </div>
  );
}
