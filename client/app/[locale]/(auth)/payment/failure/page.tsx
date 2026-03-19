import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-10">
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle size={36} className="text-red-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Payment Failed</h1>
                    <p className="text-neutral-500 text-sm mb-8">
                        Something went wrong with your payment. Please check your card details and try again.
                    </p>
                    <div className="space-y-3">
                        <Button asChild className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold">
                            <Link href="/payment">Try Again</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full h-11 rounded-xl font-semibold">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
