import { BookOpen, Search, Filter, PlayCircle, Clock, Star } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground">
            Explore Courses
          </h1>
          <p className="text-foreground/70 font-medium text-lg">Explore all available interactive modules.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
          <input 
            type="text" 
            placeholder="Search for a topic..."
            className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
        <button className="flex items-center space-x-2 bg-background border border-border px-6 py-4 rounded-2xl font-bold hover:bg-secondary transition-colors">
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Business Emails", level: "B1", type: "Writing", color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Casual Greetings", level: "A1", type: "Speaking", color: "text-green-500", bg: "bg-green-500/10" },
          { title: "Airport Conversations", level: "A2", type: "Speaking", color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Academic Reading", level: "C1", type: "Reading", color: "text-purple-500", bg: "bg-purple-500/10" },
          { title: "Job Interview", level: "B2", type: "Speaking", color: "text-rose-500", bg: "bg-rose-500/10" },
          { title: "Grammar Basics", level: "A1", type: "Grammar", color: "text-cyan-500", bg: "bg-cyan-500/10" },
        ].map((course, i) => (
          <div key={i} className="bg-background border border-border rounded-3xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 ${course.bg} ${course.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <BookOpen size={24} />
              </div>
              <div className="flex space-x-2">
                <span className="bg-secondary px-2.5 py-1 rounded-lg text-xs font-bold">{course.level}</span>
                <span className="bg-secondary px-2.5 py-1 rounded-lg text-xs font-bold">{course.type}</span>
              </div>
            </div>
            
            <h4 className="font-bold text-xl mb-2">{course.title}</h4>
            <p className="text-sm text-foreground/60 font-medium mb-8">Improve your {course.type.toLowerCase()} skills with interactive practice.</p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex space-x-3 text-xs font-bold text-foreground/50">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>10m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={14} />
                  <span>+50 XP</span>
                </div>
              </div>
              
              <div className="text-primary group-hover:translate-x-1 transition-transform">
                <PlayCircle size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
