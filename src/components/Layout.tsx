// components/Layout.tsx
import React, { ReactNode } from 'react';
import Head from 'next/head'; // Opcional: para manejar metadatos comunes en todas las páginas

interface LayoutProps {
  children: ReactNode;
  // Puedes añadir más props si necesitas variar cosas en el layout, como un título de página dinámico
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Opcional: Head para metadatos comunes a todas las páginas que usen este layout */}
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {/* Puedes añadir favicons, enlaces a fuentes, etc. aquí si son globales */}
      </Head>

      {/* Aquí podrías incluir un Header global si tuvieras uno separado */}
      {/* <header className="bg-blue-800 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">RHAI</div>
          </nav>
      </header> */}

      {/* Contenido principal de la página */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Aquí podrías incluir un Footer global si tuvieras uno separado */}
      {/* <footer className="bg-blue-900 text-white py-8 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} RHAI. Todos los derechos reservados.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Layout;