function ProjectCard({ project }) {
  return (
    <div className="group bg-[#161B22] border border-white/10 rounded-xl overflow-hidden hover:border-[#5CDBD3]/40 transition-colors duration-300">
      {project.image ? (
        <div className="overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-[#0D1117] flex items-center justify-center">
          <span className="text-[#8B949E] font-mono text-sm">no preview</span>
        </div>
      )}
 
      <div className="p-5">
        <h3
          className="text-[#E6EDF3] text-lg font-semibold mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {project.title}
        </h3>
        <p className="text-[#8B949E] text-sm mb-4 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          {project.description}
        </p>
 
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="text-xs font-mono text-[#5CDBD3] border border-[#5CDBD3]/25 bg-[#5CDBD3]/5 px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
 
        <div className="flex gap-4 pt-3 border-t border-white/5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono text-[#8B949E] hover:text-[#5CDBD3] transition"
            >
              source →
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono text-[#8B949E] hover:text-[#5CDBD3] transition"
            >
              live demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
 
export default ProjectCard;