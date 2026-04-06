import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import "./RecommendationPanel.css";

function RecommendationPanel() {
  const [recommendation, setRecommendation] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /**
   * Fetch recommendation dari API
   */
  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/recommendations/my-recommendation");

      if (response.data.success || response.data.aiRecommendation) {
        setRecommendation(response.data.aiRecommendation);
        setModules(response.data.recommendedModules || []);
      }
    } catch (err) {
      console.error("❌ Error fetching recommendation:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil rekomendasi. Coba lagi nanti.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load recommendation saat component mount
   */
  useEffect(() => {
    fetchRecommendation();
  }, []);

  const totalPages = Math.max(1, Math.ceil(modules.length / itemsPerPage));
  const pagedModules = modules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const gotoPage = (page) => {
    const p = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="recommendation-panel loading">
        <div className="spinner"></div>
        <p>Memuat rekomendasi AI...</p>
      </div>
    );
  }

  return (
    <div className="recommendation-panel">
      <div className="recommendation-header">
        <h3>🤖 AI Rekomendasi Skill</h3>
        <button
          className="refresh-btn"
          onClick={fetchRecommendation}
          title="Refresh rekomendasi"
        >
          🔄
        </button>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {recommendation && (
        <div className="recommendation-content">
          <div className="ai-recommendation">
            <p className="recommendation-label">💡 Rekomendasi Pengembangan:</p>
            <div className="recommendation-text">
              {recommendation
                .split("\n")
                .filter((line) => line.trim())
                .map((line, idx) => (
                  <div key={idx} className="recommendation-item">
                    {line}
                  </div>
                ))}
            </div>
          </div>

          {modules.length > 0 && (
            <div className="recommended-modules">
              <button
                className="modules-toggle"
                onClick={() => {
                  setExpanded((prev) => {
                    if (!prev) setCurrentPage(1);
                    return !prev;
                  });
                }}
              >
                {expanded ? "▼" : "▶"} Modul yang Tersedia ({modules.length})
              </button>

              {expanded && (
                <div className="modules-list">
                  {pagedModules.map((module) => (
                    <div key={module._id} className="module-card">
                      <h4 className="module-title">{module.judul}</h4>
                      <p className="module-desc">{module.deskripsi}</p>
                      {module.targetSkills &&
                        module.targetSkills.length > 0 && (
                          <div className="module-skills">
                            <strong>Skills:</strong>
                            <ul>
                              {module.targetSkills.map((skill, idx) => (
                                <li key={idx}>{skill.nama || skill}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <a
                        href={`/app/modul/${module._id}`}
                        className="view-module-btn"
                      >
                        Lihat Detail →
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {expanded && modules.length > itemsPerPage && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => gotoPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => gotoPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    onClick={() => gotoPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!recommendation && !error && (
        <div className="no-recommendation">
          <p>Tidak ada rekomendasi tersedia untuk saat ini.</p>
          <button onClick={fetchRecommendation} className="retry-btn">
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  );
}

export default RecommendationPanel;
