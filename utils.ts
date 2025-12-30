export const formatPrice = (amount: number): string => {
  return amount.toLocaleString('fr-FR') + ' FCFA';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const smoothScrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80; // Hauteur de la navbar fixe
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export const calculateTotal = (items: any[]) => {
  return items.reduce((acc, item) => acc + item.price, 0);
};