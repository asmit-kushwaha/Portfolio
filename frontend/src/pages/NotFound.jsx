import { Link } from 'react-router-dom';
 
function NotFound() {
  return (
    <div className="bg-[#0D1117] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ cd ./this-page</p>
        <h1
          className="text-[#E6EDF3] text-6xl font-bold mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          404
        </h1>
        <p className="text-[#8B949E] font-mono text-sm mb-8">
          bash: route not found: no such file or directory
        </p>
        <Link
          to="/"
          className="inline-block bg-[#5CDBD3] text-[#0D1117] font-semibold px-6 py-3 rounded-lg hover:bg-[#4ec4bc] transition"
        >
          cd ~ (go home)
        </Link>
      </div>
    </div>
  );
}
 
export default NotFound;