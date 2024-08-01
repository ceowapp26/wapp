interface EmailProps {
  user: {
    email: string;
    name: string;
  };
  props?: {
    [key: string]: string;
  };
}

module.exports.WELCOMETEMPLATE = ({ user, props }: EmailProps) => ({
  to: user.email,
  subject: 'Welcome to Our Service!',
  text: `Hello ${user.name}. Welcome to our service! Enjoy your journey with us!`,
  html: `<p>Hello ${user.name},</p><p>Welcome to our service! Enjoy your journey with us!</p>`,
});

module.exports.SUBSCRIPTIONREMINDERTEMPLATE = ({ user, props }: EmailProps) => ({
  to: user.email,
  subject: 'Your Subscription is About to Renew',
  text: `Hello ${user.name}, just a friendly reminder that your subscription will renew on ${props.nextBillingDate}. Please make sure your payment information is up to date to avoid any interruptions.`,
  html: `<p>Hello ${user.name},</p><p>Just a friendly reminder that your subscription will renew on <strong>${props.nextBillingDate}</strong>. Please make sure your payment information is up to date to avoid any interruptions.</p>`,
});

module.exports.NOTIFICATIONREMINDERTEMPLATE = ({ user, props }: EmailProps) => ({
  to: user.email,
  subject: 'Upcoming Billing Notification',
  text: `Hello ${user.name}, this is a notification that your subscription will renew on ${props.nextBillingDate}. Please ensure your payment information is current.`,
  html: `<p>Hello ${user.name},</p><p>This is a notification that your subscription will renew on <strong>${props.nextBillingDate}</strong>. Please ensure your payment information is current.</p>`,
});
