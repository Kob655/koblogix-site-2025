
import emailjs from '@emailjs/browser';

// --- CONFIGURATION EMAILJS ---
const SERVICE_ID = 'service_koblogix_prod'; 
const TEMPLATE_ID = 'template_koblogix_notif'; 
const PUBLIC_KEY = 'pk_kob_default_access_key'; 

export const sendEmail = async (templateParams: Record<string, any>) => {
  try {
    if (PUBLIC_KEY.includes('default')) {
        // Mode silencieux pour éviter les warnings intrusifs
        return;
    }
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return response;
  } catch (err) {
    console.error('Erreur EmailJS:', err);
    throw err;
  }
};

export const formatOrderForEmail = (customer: any, items: any[], total: number) => {
    const itemsList = items.map(i => `- ${i.name} (${i.price} FCFA)`).join('\n');
    return {
        to_name: "Admin KOBLOGIX",
        from_name: customer.name,
        message: `NOUVELLE COMMANDE\nClient: ${customer.name}\nEmail: ${customer.email}\nTel: ${customer.phone}\nRef: ${customer.paymentRef}\n\nDétails:\n${itemsList}\n\nTOTAL: ${total} FCFA`,
        reply_to: customer.email
    };
};

export const formatRegistrationForEmail = (user: {name: string, email: string}) => {
    return {
        to_name: "Admin KOBLOGIX",
        from_name: user.name,
        message: `NOUVELLE INSCRIPTION\nNom: ${user.name}\nEmail: ${user.email}\nDate: ${new Date().toLocaleString()}`,
        reply_to: user.email
    };
};
