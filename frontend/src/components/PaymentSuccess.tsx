export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700 mb-6">Thank you for your payment.</p>
        <a
          href="/"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
