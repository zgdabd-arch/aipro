export default function ProductSecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-sm max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 font-headline">Product Security</h1>
      <p>
        At ProAi, we are deeply committed to the security of our product and the protection of our users' data. We believe in a proactive approach to security, integrating it into every stage of our product development lifecycle.
      </p>

      <h2 className="font-headline">Our Security Practices</h2>
      <ul>
        <li>
          <strong>Secure Development Lifecycle:</strong> Security is a core consideration from design and architecture through to deployment and maintenance. Our developers are trained in secure coding practices to minimize vulnerabilities.
        </li>
        <li>
          <strong>Data Encryption:</strong> We encrypt your data both in transit and at rest. Communications between your client and our servers are encrypted using industry-standard TLS. Sensitive data stored in our databases is also encrypted.
        </li>
        <li>
          <strong>Authentication and Access Control:</strong> We use robust authentication mechanisms to protect your account. Our application enforces strict access controls to ensure users can only access their own data.
        </li>
        <li>
          <strong>Vulnerability Management:</strong> We regularly scan our applications and infrastructure for vulnerabilities. We have a process in place to prioritize and remediate identified security issues promptly.
        </li>
        <li>
          <strong>Incident Response:</strong> We have a dedicated incident response plan to address security events. In the event of a security breach, our team is prepared to act quickly to contain the threat, mitigate the impact, and notify affected users in accordance with our legal and ethical obligations.
        </li>
      </ul>

      <h2 className="font-headline">Responsible Disclosure</h2>
      <p>
        We value the security community and believe that responsible disclosure of security vulnerabilities helps us ensure the safety and security of our users. If you believe you have discovered a security vulnerability in our product, we encourage you to let us know right away.
      </p>
      <p>
        Please email us at <a href="mailto:support@aisolutionshub.co">support@aisolutionshub.co</a> with a detailed description of the issue. We ask that you do not publicly disclose the issue until we have had a chance to address it. We are committed to working with you to understand and resolve the issue quickly.
      </p>
      <p>We appreciate your efforts and responsible disclosure and will make every effort to acknowledge your contributions.</p>

      <h2 className="font-headline">Contact Us</h2>
      <p>
        If you have any questions about our security practices, please contact us through our Contact page.
      </p>
    </div>
  );
}
