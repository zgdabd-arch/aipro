export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-sm max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 font-headline">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to ProAi ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
      </p>

      <h2 className="font-headline">1. Information We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
      <ul>
        <li>
          <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information, such as your age, grade level, and country, that you voluntarily give to us when you register with the Application.
        </li>
        <li>
          <strong>Usage Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Application.
        </li>
        <li>
          <strong>Data from AI Interactions:</strong> We collect the questions you ask our AI Tutor and the inputs you provide to generate study plans to improve our services.
        </li>
      </ul>

      <h2 className="font-headline">2. How We Use Your Information</h2>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Personalize your learning experience.</li>
        <li>Email you regarding your account or order.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
        <li>Notify you of updates to the Application.</li>
        <li>Respond to customer service requests.</li>
      </ul>

      <h2 className="font-headline">3. Disclosure of Your Information</h2>
      <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
      <ul>
        <li>
          <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </li>
        <li>
          <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, and customer service.
        </li>
      </ul>

      <h2 className="font-headline">4. Security of Your Information</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
      </p>

      <h2 className="font-headline">5. Your Privacy Choices</h2>
      <p>
        You may at any time review or change the information in your account or terminate your account by logging into your account settings and updating your account. For more details, please visit our "Your Privacy Choices" page.
      </p>

      <h2 className="font-headline">6. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2 className="font-headline">7. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us through the information provided on our Contact page.
      </p>
    </div>
  );
}
