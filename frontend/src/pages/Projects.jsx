import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="bg-[#0D1117] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
        <p className="text-[#5CDBD3] font-mono text-sm mb-3">$ ls projects/</p>
        <h1
          className="text-[#E6EDF3] text-3xl md:text-4xl font-bold mb-10"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Things I've Built
        </h1>

        {loading && (
          <p className="text-[#8B949E] font-mono text-sm">loading projects...</p>
        )}

        {error && (
          <p className="text-red-400 font-mono text-sm">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-[#8B949E] font-mono text-sm">
            no projects yet — check back soon.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;