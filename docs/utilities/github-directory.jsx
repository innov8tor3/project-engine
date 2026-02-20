import React, { useState } from 'react';
import { Search, FileText, ExternalLink, Github, Sparkles } from 'lucide-react';

export default function GitHubPagesConverter() {
  const [username, setUsername] = useState('');
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [error, setError] = useState('');

  const fetchRepoContents = async (path = '') => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/${path}`
      );
      
      if (!response.ok) {
        throw new Error('Repository not found or API rate limit exceeded');
      }
      
      const data = await response.json();
      let files = [];
      
      for (const item of data) {
        if (item.type === 'file' && item.name.endsWith('.html')) {
          files.push(item);
        } else if (item.type === 'dir') {
          const subFiles = await fetchRepoContents(item.path);
          files = files.concat(subFiles);
        }
      }
      
      return files;
    } catch (err) {
      throw err;
    }
  };

  const convertToGitHubPagesUrl = (githubUrl) => {
    // Extract path after /blob/main/ or /blob/master/
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/[^\/]+\/(.+)/);
    if (match) {
      const [, user, repository, path] = match;
      return `https://${user}.github.io/${repository}/${path}`;
    }
    return githubUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !repo) {
      setError('Please enter both username and repository name');
      return;
    }
    
    setLoading(true);
    setError('');
    setHtmlFiles([]);
    
    try {
      const files = await fetchRepoContents();
      if (files.length === 0) {
        setError('No HTML files found in this repository');
      } else {
        setHtmlFiles(files);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Sparkles className="w-64 h-64 text-purple-400 animate-pulse" />
          </div>
          <div className="relative">
            <Github className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              GitHub Pages URL Converter
            </h1>
            <p className="text-purple-200 text-sm max-w-2xl mx-auto">
              Convert GitHub repository HTML files to GitHub Pages URLs
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-purple-300 font-semibold mb-2">Important Notes:</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• This app works for <strong>GitHub Pages HTML only</strong></li>
                <li>• Best suited for brochure sites</li>
                <li>• Can work with more detailed apps as well</li>
                <li>• Looks for HTML files in the <code className="bg-black/30 px-1 rounded">docs/</code> directory and subdirectories</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-2">
                GitHub Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="innov8tor3"
                className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm font-medium mb-2">
                Repository Name
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="project-engine"
                className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Scanning Repository...' : 'Find HTML Files'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 backdrop-blur-sm">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {htmlFiles.length > 0 && (
          <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Found {htmlFiles.length} HTML {htmlFiles.length === 1 ? 'File' : 'Files'}
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {htmlFiles.map((file, index) => {
                const githubUrl = file.html_url;
                const pagesUrl = convertToGitHubPagesUrl(githubUrl);
                
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-5 hover:border-purple-400/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-purple-200 text-sm font-mono mb-1 truncate">
                          {file.path}
                        </p>
                        
                          href={pagesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-400 hover:text-pink-300 text-sm font-mono break-all transition-colors flex items-center gap-2 group-hover:underline"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          {pagesUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 0.5), rgba(236, 72, 153, 0.5));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(168, 85, 247, 0.7), rgba(236, 72, 153, 0.7));
        }
      `}</style>
    </div>
  );
}
