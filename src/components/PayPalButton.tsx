// components/PayPalButton.tsx
import React, { useEffect, useRef } from 'react';

// --- Definiciones de Tipos para Objetos de PayPal ---
// ... (Mantén todas tus interfaces existentes como PayPalAmount, PayPalPurchaseUnit, etc.) ...

interface PayPalCaptureDetails {
  id?: string;
  status?: string;
  payer: {
    name: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
  };
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
}

interface PayPalButtonProps {
  productPrice: string;
  onPaymentSuccess: (details: PayPalCaptureDetails) => void;
  onPaymentError: (error: Error) => void;
  paypalSdkLoaded: boolean; // <--- ¡Asegúrate de que esta línea esté presente!
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => {
        render: (container: string | HTMLElement) => Promise<void>;
      };
    };
  }
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ productPrice, onPaymentSuccess, onPaymentError, paypalSdkLoaded }) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('useEffect en PayPalButton ejecutado.');
    console.log('Valor de window.paypal:', window.paypal);
    console.log('Valor de paypalRef.current:', paypalRef.current);
    console.log('Valor de paypalSdkLoaded:', paypalSdkLoaded);

    if (paypalSdkLoaded && paypalRef.current) {
      console.log('PayPal SDK detectado Y ref disponible. Intentando renderizar botones...');

      if (paypalRef.current.hasChildNodes()) {
          paypalRef.current.innerHTML = ''; // Limpia el contenedor si ya tiene algo
      }

      window.paypal!.Buttons({
        createOrder: (data: Record<string, unknown>, actions: Record<string, unknown>) => {
          console.log('Creando orden de PayPal...');
          return (actions as any).order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: productPrice,
              },
            }],
          });
        },
        onApprove: (data: Record<string, unknown>, actions: Record<string, unknown>) => {
          console.log('Orden de PayPal aprobada. Capturando pago...');
          return (actions as any).order.capture().then((details: PayPalCaptureDetails) => {
            console.log('Pago capturado:', details);
            alert(`¡Transacción completada por ${details.payer.name.given_name}!`);
            onPaymentSuccess(details);
          }).catch((err: Error) => {
            console.error('Error al capturar el pago:', err);
            onPaymentError(new Error('Error al capturar el pago: ' + err.message));
            alert('Error al capturar el pago. Por favor, inténtalo de nuevo.');
          });
        },
        onCancel: (data: Record<string, unknown>) => {
          console.log('Pago de PayPal cancelado por el usuario.', data);
          onPaymentError(new Error('Pago cancelado por el usuario.'));
          alert('La transacción ha sido cancelada.');
        },
        onError: (err: Record<string, unknown>) => {
          console.error('Error general de PayPal:', err);
          onPaymentError(new Error('Error general en el proceso de pago de PayPal.'));
          alert('Ocurrió un error con el pago. Por favor, inténtalo de nuevo más tarde.');
        },
      }).render(paypalRef.current).catch((err: Error) => {
        console.error('Error al renderizar los botones de PayPal:', err);
        if (paypalRef.current) {
            paypalRef.current.innerHTML = '<p style="color: red;">No se pudieron cargar los botones de pago de PayPal. Por favor, intente de nuevo más tarde o contacte con soporte.</p>';
        }
        onPaymentError(new Error('Fallo al renderizar el botón de PayPal: ' + err.message));
      });
    } else {
      console.log('Condición para renderizar botones no cumplida: paypalSdkLoaded es false o ref no listo.');
    }
  }, [productPrice, onPaymentSuccess, onPaymentError, paypalSdkLoaded]);

  return (
    <div ref={paypalRef} className="paypal-button-container" style={{ minHeight: '100px', backgroundColor: 'lightgray' }}>
      {/* El mensaje de "Cargando botón de pago..." ahora lo maneja DynamicPayPalButton en index.tsx */}
    </div>
  );
};

export default PayPalButton;