import React from 'react';
import ClientLayout from '../components/ClientLayout';

const HTML = `<!DOCTYPE html>
<div data-custom-class="body">
${`<style>
  [data-custom-class='body'], [data-custom-class='body'] * {
    background: transparent !important;
  }
  [data-custom-class='title'], [data-custom-class='title'] * {
    font-family: Arial !important;
    font-size: 26px !important;
    color: #000000 !important;
  }
  [data-custom-class='subtitle'], [data-custom-class='subtitle'] * {
    font-family: Arial !important;
    color: #595959 !important;
    font-size: 14px !important;
  }
  [data-custom-class='heading_1'], [data-custom-class='heading_1'] * {
    font-family: Arial !important;
    font-size: 19px !important;
    color: #000000 !important;
  }
  [data-custom-class='heading_2'], [data-custom-class='heading_2'] * {
    font-family: Arial !important;
    font-size: 17px !important;
    color: #000000 !important;
  }
  [data-custom-class='body_text'], [data-custom-class='body_text'] * {
    color: #595959 !important;
    font-size: 14px !important;
    font-family: Arial !important;
  }
  [data-custom-class='link'], [data-custom-class='link'] * {
    color: #3030F1 !important;
    font-size: 14px !important;
    font-family: Arial !important;
    word-break: break-word !important;
  }
  ul { list-style-type: square; }
  ul > li > ul { list-style-type: circle; }
  ul > li > ul > li > ul { list-style-type: square; }
  ol li { font-family: Arial; }
</style>`}
${`<span style="display: block;margin: 0 auto 3.125rem;width: 11.125rem;height: 2.375rem;background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNzgiIGhlaWdodD0iMzgiIHZpZXdCb3g9IjAgMCAxNzggMzgiPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBmaWxsPSIjRDFEMUQxIiBkPSJNNC4yODMgMjQuMTA3Yy0uNzA1IDAtMS4yNTgtLjI1Ni0xLjY2LS43NjhoLS4wODVjLjA1Ny41MDIuMDg2Ljc5Mi4wODYuODd2Mi40MzRILjk4NXYtOC42NDhoMS4zMzJsLjIzMS43NzloLjA3NmMuMzgzLS41OTQuOTUtLjg5MiAxLjcwMi0uODkyLjcxIDAgMS4yNjQuMjc0IDEuNjY1LjgyMi40MDEuNTQ4LjYwMiAxLjMwOS42MDIgMi4yODMgMCAuNjQtLjA5NCAxLjE5OC0uMjgyIDEuNjctLjE4OC40NzMtLjQ1Ni44MzMtLjgwMyAxLjA4LS4zNDcuMjQ3LS43NTYuMzctMS4yMjUuMzd6TTMuOCAxOS4xOTMjKioqKioqKioqKioqKio=) center no-repeat;"></span>`}
<div>
<strong><span style="font-size: 26px;"><span data-custom-class="title"><h1>PRIVACY POLICY</h1></span></span></strong>
</div>
<div><span style="color: rgb(127, 127, 127);"><strong><span style="font-size: 15px;"><span data-custom-class="subtitle">Last updated May 09, 2026</span></span></strong></span></div>
<div style="margin-top:24px;"></div>
${`<div data-custom-class="body_text">This Privacy Notice for <strong>OPTIMUS SOLUTIONS</strong> ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
<ul>
  <li>Visit our website at <a target="_blank" data-custom-class="link" href="https://optimus-solutions.org">https://optimus-solutions.org</a> or any website of ours that links to this Privacy Notice</li>
  <li>Engage with us in other related ways, including any marketing or events</li>
</ul>
<strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you have any questions or concerns, please contact us at <a target="_blank" data-custom-class="link" href="mailto:info@optimus-solutions.org">info@optimus-solutions.org</a>.
</div>`}
<div style="margin-top:24px;"></div>
<div data-custom-class="heading_1"><h2>SUMMARY OF KEY POINTS</h2></div>
<div data-custom-class="body_text"><em>This summary provides key points from our Privacy Notice. For details, see the full policy below.</em></div>
<div style="margin-top:16px;"></div>
<div data-custom-class="body_text"><strong>What personal information do we process?</strong> We process personal information depending on how you interact with us and our Services. See <a class="link" href="#personalinfo">personal information you disclose to us</a>.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>Do we collect any information from third parties?</strong> We do not collect information from third parties.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>How do we process your information?</strong> We process it to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. See <a class="link" href="#infouse">how we process your information</a>.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>When and with whom do we share personal information?</strong> See <a class="link" href="#whoshare">when and with whom we share information</a>.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>How do we keep your information safe?</strong> We use organizational and technical measures, but no system is 100% secure. See <a class="link" href="#infosafe">how we keep information safe</a>.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>What are your rights?</strong> Depending on your location, you may have certain privacy rights. See <a class="link" href="#privacyrights">your privacy rights</a>.</div>
<div style="margin-top:8px;"></div>
<div data-custom-class="body_text"><strong>How do you exercise your rights?</strong> The easiest way is by visiting <a class="link" href="https://optimus-solutions.org/contact" target="_blank" rel="noopener">https://optimus-solutions.org/contact</a> or contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</div>
<div style="margin-top:24px;"></div>
<div id="toc" data-custom-class="heading_1"><h2>TABLE OF CONTENTS</h2></div>
<div><a class="link" href="#infocollect">1. WHAT INFORMATION DO WE COLLECT?</a></div>
<div><a class="link" href="#infouse">2. HOW DO WE PROCESS YOUR INFORMATION?</a></div>
<div><a class="link" href="#whoshare">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></div>
<div><a class="link" href="#cookies">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></div>
<div><a class="link" href="#inforetain">5. HOW LONG DO WE KEEP YOUR INFORMATION?</a></div>
<div><a class="link" href="#infosafe">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></div>
<div><a class="link" href="#infominors">7. DO WE COLLECT INFORMATION FROM MINORS?</a></div>
<div><a class="link" href="#privacyrights">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></div>
<div><a class="link" href="#DNT">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a></div>
<div><a class="link" href="#policyupdates">10. DO WE MAKE UPDATES TO THIS NOTICE?</a></div>
<div><a class="link" href="#contact">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></div>
<div><a class="link" href="#request">12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></div>

<div style="margin-top:24px;"></div>
<div id="infocollect" class="heading_1"><h2>1. WHAT INFORMATION DO WE COLLECT?</h2></div>
<div id="personalinfo" class="heading_2"><h3>Personal information you disclose to us</h3></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We collect personal information that you provide to us.</em></div>
<div style="margin-top:8px;" data-custom-class="body_text">
We collect personal information you voluntarily provide when you express interest in our Services, participate in activities, or otherwise contact us. This may include:
<ul>
  <li>Names</li>
  <li>Phone numbers</li>
  <li>Email addresses</li>
  <li>Job titles</li>
  <li>Any other information you choose to provide</li>
 </ul>
 All personal information must be true, complete, and accurate, and you must notify us of any changes.
</div>
<div style="margin-top:16px;" class="heading_2"><h3>Information automatically collected</h3></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>Some information — such as IP address and device characteristics — is collected automatically when you visit our Services.</em></div>
<div style="margin-top:8px;" data-custom-class="body_text">
We automatically collect device and usage information (e.g., IP address, browser, device type, operating system, language preferences, referring URLs, country, pages viewed, and actions taken) primarily to maintain security and for internal analytics.
<ul>
  <li><em>Log and Usage Data.</em> Service-related, diagnostic, usage, and performance information.</li>
  <li><em>Device Data.</em> Information about the device you use to access the Services.</li>
  <li><em>Location Data.</em> Approximate location (e.g., based on IP). You can disable location permissions on your device.</li>
</ul>
</div>
<div style="margin-top:16px;" class="heading_2"><h3>Google API</h3></div>
<div data-custom-class="body_text">
Our use of information received from Google APIs adheres to the <a class="link" target="_blank" rel="noopener" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the <a class="link" target="_blank" rel="noopener" href="https://developers.google.com/terms/api-services-user-data-policy#limited-use">Limited Use requirements</a>.
</div>

<div style="margin-top:24px;"></div>
<div id="infouse" class="heading_1"><h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</em></div>
<div style="margin-top:8px;" data-custom-class="body_text">
We process your information, for example, to:
<ul>
  <li><strong>Deliver services</strong> and facilitate requested actions.</li>
  <li><strong>Respond to inquiries</strong> and provide support.</li>
  <li><strong>Manage orders and payments</strong> (if applicable).</li>
  <li><strong>Send marketing communications</strong> consistent with your preferences (you may opt out anytime).</li>
  <li><strong>Deliver tailored content/ads</strong> (where permitted).</li>
  <li><strong>Evaluate and improve</strong> Services and campaigns.</li>
  <li><strong>Comply with legal obligations</strong> and protect our rights.</li>
 </ul>
</div>

<div style="margin-top:24px;"></div>
<div id="whoshare" class="heading_1"><h2>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We may share information in specific situations and with specific third parties.</em></div>
<div style="margin-top:8px;" data-custom-class="body_text">
We may share data with vendors, service providers, contractors, or agents who perform services for us and require access to such information. They may not use it for their own purposes and must protect it per our instructions. We may also share data in connection with a business transfer.
Examples of partners (as applicable): Google AdSense; Cloud Storage for Firebase; Facebook/LinkedIn/Instagram/Twitter/Snapchat advertising; Google Tag Manager; Firebase Crash Reporting; Google Analytics.
</div>

<div style="margin-top:24px;"></div>
<div id="cookies" class="heading_1"><h2>4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We may use cookies and other tracking technologies to collect and store your information.</em></div>
<div style="margin-top:8px;" data-custom-class="body_text">
We use cookies, pixels, and similar technologies for security, preferences, basic functionality, analytics, and advertising. See our Cookie Notice for details and choices. For Google Analytics opt-out, visit <a class="link" target="_blank" rel="noopener" href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</a>. See Google’s privacy policy: <a class="link" target="_blank" rel="noopener" href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>.
</div>

<div style="margin-top:24px;"></div>
<div id="inforetain" class="heading_1"><h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We keep your information as long as necessary for the purposes outlined in this Notice, unless otherwise required by law.</em></div>

<div style="margin-top:24px;"></div>
<div id="infosafe" class="heading_1"><h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We use organizational and technical safeguards, but no method is 100% secure.</em></div>

<div style="margin-top:24px;"></div>
<div id="infominors" class="heading_1"><h2>7. DO WE COLLECT INFORMATION FROM MINORS?</h2></div>
<div data-custom-class="body_text"><em><strong>In Short: </strong>We do not knowingly collect data from or market to children under 18.</em></div>

<div style="margin-top:24px;"></div>
<div id="privacyrights" class="heading_1"><h2>8. WHAT ARE YOUR PRIVACY RIGHTS?</h2></div>
<div data-custom-class="body_text">
You may review, change, or terminate your account at any time (subject to applicable law). <u>Withdrawing your consent:</u> If we rely on consent, you may withdraw it at any time by contacting us (see <a class="link" href="#contact">How to contact us</a>). This does not affect processing prior to withdrawal or processing on other lawful bases.
</div>

<div style="margin-top:24px;"></div>
<div id="DNT" class="heading_1"><h2>9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2></div>
<div data-custom-class="body_text">
Browsers/mobile OS may offer Do-Not-Track (DNT). No uniform standard exists yet, so we do not respond to DNT signals. If such a standard is adopted, we will update this Notice.
</div>

<div style="margin-top:24px;"></div>
<div id="policyupdates" class="heading_1"><h2>10. DO WE MAKE UPDATES TO THIS NOTICE?</h2></div>
<div data-custom-class="body_text">
Yes. We will update this Notice as necessary to remain compliant. The “Last updated” date shows the latest revision.
</div>

<div style="margin-top:24px;"></div>
<div id="contact" class="heading_1"><h2>11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2></div>
<div data-custom-class="body_text">
Email: <a class="link" href="mailto:info@optimus-solutions.org">info@optimus-solutions.org</a><br/>
Mail: OPTIMUS SOLUTIONS, الرياض حي الشهداء، طريق الامام سعود بن عبدالعزيز، قبيبان، منطقة الرياض 19599, Saudi Arabia
</div>

<div style="margin-top:24px;"></div>
<div id="request" class="heading_1"><h2>12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2></div>
<div data-custom-class="body_text">
You may request access, correction, or deletion of your personal information, or withdraw consent (where applicable) by visiting <a class="link" href="https://optimus-solutions.org/contact" target="_blank" rel="noopener">https://optimus-solutions.org/contact</a> or emailing <a class="link" href="mailto:info@optimus-solutions.org">info@optimus-solutions.org</a>.
</div>

<div style="margin-top:24px;"></div>
<div data-custom-class="body_text">
This Privacy Policy was created using Termly's <a class="link" target="_blank" rel="noopener" href="https://termly.io/products/privacy-policy-generator/">Privacy Policy Generator</a>
</div>
</div>`;

export default function PrivacyPolicyPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: HTML }}
        />
      </div>
    </ClientLayout>
  );
}
