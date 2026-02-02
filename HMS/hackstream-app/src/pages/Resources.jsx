import { FileText, Database, Code } from "lucide-react";

export default function Resources() {
  const resources = [
    {
      title: "Problem Statement",
      description: "Detailed description of the hackathon challenge",
      icon: <FileText size={22} />,
      link: "/assets/ps.pdf"
    },
    {
      title: "API Documentation",
      description: "Endpoints, request formats, and response samples",
      icon: <FileText size={22} />,
      link: "/assets/api.pdf"
    },
    {
      title: "Dataset",
      description: "Sample & final datasets for model training/testing",
      icon: <FileText size={22} />,
      link: "/assets/dataset.pdf"
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-purple-300">
        📚 Resources
      </h1>

      <p className="text-gray-400">
        Everything you need to build, test, and submit your project.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white/5 border border-white/10
                       hover:border-purple-500/40 hover:bg-white/10
                       transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400
                              group-hover:scale-110 transition">
                {r.icon}
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  {r.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {r.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
