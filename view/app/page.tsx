import Link from "next/link";
import { BookOpen, ShieldCheck, User } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8 p-4 bg-primary/10 rounded-3xl shadow-2xl shadow-primary/10">
          <BookOpen size={64} className="text-leaf" />
        </div>
        
        <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
          Welcome to <span className="text-leaf">LeafLMS</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mb-12">
          A premium, state-of-the-art Library Management System designed for modern institutions. 
          Experience seamless book tracking, real-time notifications, and intuitive management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/librarian/dashboard" className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Librarian Portal</h3>
            <p className="text-slate-500 text-sm">Manage inventory, students, and process lending transactions.</p>
          </Link>

          <Link href="/student/dashboard" className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all text-left">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 mb-4 group-hover:bg-leaf group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Student Portal</h3>
            <p className="text-slate-500 text-sm">Search the catalog, reserve books, and track your borrowed items.</p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; 2026 LeafLMS. Built with Leaf Green Excellence.</p>
      </footer>
    </div>
  );
}
