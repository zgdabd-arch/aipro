
export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-sm max-w-4xl">
      <h1 className="text-3xl font-bold mb-4 font-headline">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-headline">1. Acceptance of Terms</h2>
      <p>By accessing and using ProAi (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>

      <h2 className="font-headline">2. Description of Service</h2>
      <p>ProAi is an AI-powered learning platform that provides personalized study plans, AI tutoring, and progress tracking. The Service is provided "as is" and we assume no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.</p>

      <h2 className="font-headline">3. User Account, Password, and Security</h2>
      <p>You are responsible for maintaining the confidentiality of the password and account and are fully responsible for all activities that occur under your password or account. You agree to immediately notify ProAi of any unauthorized use of your password or account or any other breach of security.</p>

      <h2 className="font-headline">4. User Conduct</h2>
      <p>You understand that all information, data, text, or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated. This means that you, and not ProAi, are entirely responsible for all Content that you upload, post, email, transmit or otherwise make available via the Service.</p>
      <p>You agree not to use the Service to:</p>
        <ul>
            <li>upload, post, or transmit any Content that is unlawful, harmful, threatening, abusive, harassing, or otherwise objectionable;</li>
            <li>impersonate any person or entity;</li>
            <li>upload, post, or transmit any Content that you do not have a right to make available under any law or under contractual or fiduciary relationships.</li>
        </ul>
      
      
      <h2 className="font-headline">5. Modifications to Service</h2>
      <p>ProAi reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that ProAi shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p>

      <h2 className="font-headline">6. Disclaimer of Warranties</h2>
      <p>You expressly understand and agree that your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis. ProAi expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.</p>

      <h2 className="font-headline">7. Limitation of Liability</h2>
      <p>You expressly understand and agree that ProAi shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if ProAi has been advised of the possibility of such damages), resulting from the use or the inability to use the service.</p>

      <h2 className="font-headline">8. Governing Law</h2>
      <p>This agreement and the relationship between you and ProAi shall be governed by the laws of the jurisdiction in which the company is established without regard to its conflict of law provisions.</p>
    </div>
  );
}
