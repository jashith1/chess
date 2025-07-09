import Auth from '@/components/Auth';
import ChessBoard from '@/components/ChessBoard';

export default function Home() {
  return (
    <main className="min-h-screen">
        <div className="container mx-auto py-8">
        <Auth />
        <ChessBoard />
      </div>
    </main>
  );
}

