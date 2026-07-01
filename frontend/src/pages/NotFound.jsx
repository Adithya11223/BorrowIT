// NotFound.jsx - 404 page template for BorrowIT

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import * as Icons from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md p-8 text-center flex flex-col items-center justify-center border-brand-primary/10" hoverable={false} glow>
        <div className="bg-brand-primary/10 rounded-full p-4 mb-4 border border-brand-primary/20 text-brand-primary">
          <Icons.ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-white">404 Error</h1>
        <h2 className="text-base font-bold text-slate-300 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-3.5 leading-relaxed max-w-xs">
          The link you followed may be broken or the page has been moved. Use the button below to head back home.
        </p>
        <Link to="/" className="mt-8 w-full">
          <Button variant="glow" className="w-full">
            Back to Home Page
          </Button>
        </Link>
      </Card>
    </div>
  );
}
