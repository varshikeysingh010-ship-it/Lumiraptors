/// <reference path="../pb_data/types.d.ts" />

// Forward every contact-form submission to the LumiRaptors inbox so the
// team receives the name, email and message directly by email.
onRecordAfterCreateSuccess((e) => {
  const name = e.record.get("name") || "Someone";
  const email = e.record.get("email") || "(no email)";
  const message = e.record.get("message") || "";

  const html = `
    <h2 style="font-family:Arial,sans-serif;color:#05060a;">New spark from the contact form</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;">
      <tr><td style="padding:4px 12px 4px 0;color:#7a7a7a;">Name</td><td>${name}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#7a7a7a;">Email</td><td>${email}</td></tr>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#7a7a7a;margin-top:18px;">Message</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;white-space:pre-line;">${message}</p>
    <hr style="margin-top:24px;border:0;border-top:1px solid #eee;" />
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#9a9a9a;">Sent from the LumiRaptors contact form.</p>
  `;

  const mail = new MailerMessage({
    from: { name: "LumiRaptors" },
    to: [{ address: "Lumiraptors@gmail.com" }],
    replyTo: [{ address: String(email) }],
    subject: `New contact message from ${name}`,
    html,
  });

  try {
    $app.newMailClient().send(mail);
  } catch (err) {
    $app.logger().error("contact message email failed", "from", String(email), "err", String(err));
  }

  e.next();
}, "contact_messages");
