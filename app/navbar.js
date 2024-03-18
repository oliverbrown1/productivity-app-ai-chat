import Link from 'next/link';

export default function Navbar(){
    return (
        <nav className="fixed top-0 w-full px-3 py-5 dark:bg-slate-800 text-white text-center">
            <a className="text-3xl hover:text-slate-400" href="/"> Home</a>
        </nav>

    );
  }
  